import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import axios from 'axios';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Helper for AI generation via Google Gemini (using Gemini 2.5 Flash-Lite)
async function callGemini(prompt: string, systemPrompt?: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: process.env.GEMINI_MODEL || 'google/gemini-2.5-flash-lite',
        messages: [
          ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://tiger-market.local',
          'X-Title': 'Tiger Market Intelligence',
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error('Gemini API error:', error.response?.data || error.message);
    throw new Error('AI generation failed');
  }
}

// ==================== API ROUTES ====================

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Dashboard Overview Stats & Summary
app.get('/api/v1/dashboard', async (req, res) => {
  try {
    const trendsCount = await prisma.trend.count();
    const explodingTrendsCount = await prisma.trend.count({ where: { status: 'EXPLODING' } });
    const ideasCount = await prisma.contentIdea.count();
    const brandOpportunitiesCount = await prisma.brandCommentOpportunity.count();
    const competitorsCount = await prisma.competitor.count({ where: { isApproved: true } });

    const topTrendsRaw = await prisma.trend.findMany({
      orderBy: { viralityScore: 'desc' },
      take: 3,
    });
    const topTrends = topTrendsRaw.map(t => ({
      ...t,
      exampleVideos: JSON.parse(t.exampleVideos),
      sourceLinks: JSON.parse(t.sourceLinks),
    }));

    const todayIdeasRaw = await prisma.contentIdea.findMany({
      where: { status: 'NEW' },
      take: 3,
      include: { trend: true },
    });
    const todayIdeas = todayIdeasRaw.map(i => ({
      ...i,
      inspirationLinks: JSON.parse(i.inspirationLinks),
      trend: i.trend ? {
        ...i.trend,
        exampleVideos: JSON.parse(i.trend.exampleVideos),
        sourceLinks: JSON.parse(i.trend.sourceLinks),
      } : null
    }));

    const recentOpportunitiesRaw = await prisma.brandCommentOpportunity.findMany({
      orderBy: { detectedAt: 'desc' },
      take: 5,
    });
    const recentOpportunities = recentOpportunitiesRaw.map(o => ({
      ...o,
      brandAccounts: JSON.parse(o.brandAccounts),
      suggestedComments: JSON.parse(o.suggestedComments),
    }));

    res.json({
      stats: {
        trendsCount,
        explodingTrendsCount,
        ideasCount,
        brandOpportunitiesCount,
        competitorsCount,
        followers: 14250,
        viewsLast7Days: 450200,
        engagementRate: '6.8%',
      },
      topTrends,
      todayIdeas,
      recentOpportunities,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Trends Endpoints
app.get('/api/v1/trends', async (req, res) => {
  try {
    const { status, platform, search } = req.query;
    const where: any = {};
    if (status) where.status = status;
    if (platform) where.platform = platform;
    if (search) {
      where.name = { contains: String(search) };
    }

    const trendsRaw = await prisma.trend.findMany({
      where,
      orderBy: { viralityScore: 'desc' },
    });
    const trends = trendsRaw.map(t => ({
      ...t,
      exampleVideos: JSON.parse(t.exampleVideos),
      sourceLinks: JSON.parse(t.sourceLinks),
    }));
    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

// Content Ideas Endpoints
app.get('/api/v1/content/daily', async (req, res) => {
  try {
    const ideasRaw = await prisma.contentIdea.findMany({
      include: { trend: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });
    const ideas = ideasRaw.map(i => ({
      ...i,
      inspirationLinks: JSON.parse(i.inspirationLinks),
      trend: i.trend ? {
        ...i.trend,
        exampleVideos: JSON.parse(i.trend.exampleVideos),
        sourceLinks: JSON.parse(i.trend.sourceLinks),
      } : null
    }));
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch daily content ideas' });
  }
});

app.post('/api/v1/content/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await prisma.contentIdea.update({
      where: { id },
      data: { status },
    });

    await prisma.userFeedback.create({
      data: {
        type: 'IDEA',
        entityId: id,
        entityType: 'ContentIdea',
        action: status,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update idea status' });
  }
});

// Brand Comment Radar Endpoints
app.get('/api/v1/brand-comment/opportunities', async (req, res) => {
  try {
    const opportunitiesRaw = await prisma.brandCommentOpportunity.findMany({
      orderBy: { detectedAt: 'desc' },
    });
    const opportunities = opportunitiesRaw.map(o => ({
      ...o,
      brandAccounts: JSON.parse(o.brandAccounts),
      suggestedComments: JSON.parse(o.suggestedComments),
    }));
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch brand comment opportunities' });
  }
});

app.post('/api/v1/brand-comment/:id/rate', async (req, res) => {
  try {
    const { id } = req.params;
    const { commentIndex, rating } = req.body;

    const opp = await prisma.brandCommentOpportunity.findUnique({ where: { id } });
    if (!opp) return res.status(404).json({ error: 'Opportunity not found' });

    let comments: any[] = JSON.parse(opp.suggestedComments);
    if (comments[commentIndex]) {
      comments[commentIndex].rating = rating;
    }

    const updated = await prisma.brandCommentOpportunity.update({
      where: { id },
      data: { suggestedComments: JSON.stringify(comments) },
    });

    await prisma.userFeedback.create({
      data: {
        type: 'COMMENT',
        entityId: id,
        entityType: 'BrandCommentOpportunity',
        action: rating ? 'RATED_UP' : 'RATED_DOWN',
        notes: `Comment index ${commentIndex}`,
      },
    });

    res.json({
      ...updated,
      brandAccounts: JSON.parse(updated.brandAccounts),
      suggestedComments: JSON.parse(updated.suggestedComments),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to rate comment' });
  }
});

// Competitors Endpoints
app.get('/api/v1/competitors', async (req, res) => {
  try {
    const competitors = await prisma.competitor.findMany({
      orderBy: { followerCount: 'desc' },
    });
    res.json(competitors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch competitors' });
  }
});

app.post('/api/v1/competitors', async (req, res) => {
  try {
    const { username, platform, displayName, bio, followerCount } = req.body;
    const competitor = await prisma.competitor.create({
      data: {
        username,
        platform,
        displayName,
        bio,
        followerCount: followerCount ? parseInt(followerCount) : null,
        isApproved: false,
      },
    });
    res.json(competitor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add competitor' });
  }
});

app.post('/api/v1/competitors/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;
    const updated = await prisma.competitor.update({
      where: { id },
      data: { isApproved: approved },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update competitor approval' });
  }
});

// My Ideas Endpoints
app.get('/api/v1/my-ideas', async (req, res) => {
  try {
    const ideasRaw = await prisma.userIdea.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const ideas = ideasRaw.map(i => ({
      ...i,
      relatedTrends: JSON.parse(i.relatedTrends),
      variations: JSON.parse(i.variations),
    }));
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user ideas' });
  }
});

app.post('/api/v1/my-ideas', async (req, res) => {
  try {
    const { originalIdea } = req.body;
    if (!originalIdea) return res.status(400).json({ error: 'Original idea required' });

    let aiImprovements = 'AI processing pending...';
    let variations: any[] = [];

    try {
      const prompt = `Analyze this user idea for Tiger Market (a Roblox development marketplace targeting scripters, builders, GFX artists): "${originalIdea}". Provide improvements, why it works, and 2 content variations in JSON format with keys: improvements, variations (array of strings).`;
      const aiResponse = await callGemini(prompt, 'You are an expert short-form video marketing strategist for Roblox developers.');
      aiImprovements = aiResponse;
      variations = [{ title: 'Variation 1', description: originalIdea }];
    } catch (e) {
      console.error('AI enhancement error:', e);
    }

    const saved = await prisma.userIdea.create({
      data: {
        originalIdea,
        aiImprovements,
        relatedTrends: JSON.stringify([]),
        variations: JSON.stringify(variations),
        status: 'PROCESSED',
      },
    });

    res.json({
      ...saved,
      relatedTrends: JSON.parse(saved.relatedTrends),
      variations: JSON.parse(saved.variations),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process user idea' });
  }
});

// Categories Endpoints
app.get('/api/v1/categories', async (req, res) => {
  try {
    const categoriesRaw = await prisma.contentCategory.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const categories = categoriesRaw.map(c => ({
      ...c,
      examples: JSON.parse(c.examples),
    }));
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.post('/api/v1/categories/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;
    const updated = await prisma.contentCategory.update({
      where: { id },
      data: { isApproved: approved },
    });
    res.json({
      ...updated,
      examples: JSON.parse(updated.examples),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Analytics & Buffer Endpoints
app.get('/api/v1/analytics', async (req, res) => {
  try {
    const analytics = await prisma.bufferAnalytics.findMany({
      orderBy: { postedAt: 'desc' },
    });
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

app.post('/api/v1/analytics/manual', async (req, res) => {
  try {
    const { platform, postId, views, likes, comments, shares, saves, postedAt } = req.body;
    const entry = await prisma.bufferAnalytics.upsert({
      where: { postId: postId || `manual-${Date.now()}` },
      update: { views, likes, comments, shares, saves },
      create: {
        platform: platform || 'tiktok',
        postId: postId || `manual-${Date.now()}`,
        views: views ? parseInt(views) : 0,
        likes: likes ? parseInt(likes) : 0,
        comments: comments ? parseInt(comments) : 0,
        shares: shares ? parseInt(shares) : 0,
        saves: saves ? parseInt(saves) : 0,
        postedAt: postedAt ? new Date(postedAt) : new Date(),
      },
    });
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save manual analytics' });
  }
});

// What Works Insights
app.get('/api/v1/what-works', async (req, res) => {
  try {
    const insights = await prisma.whatWorksInsight.findMany({
      orderBy: { confidence: 'desc' },
    });
    res.json(insights);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

// Calendar Endpoints
app.get('/api/v1/calendar', async (req, res) => {
  try {
    const scheduled = await prisma.scheduledContent.findMany({
      include: { contentIdea: true },
      orderBy: { scheduledFor: 'asc' },
    });
    res.json(scheduled);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch calendar' });
  }
});

app.post('/api/v1/calendar', async (req, res) => {
  try {
    const { contentIdeaId, scheduledFor, platform } = req.body;
    const item = await prisma.scheduledContent.create({
      data: {
        contentIdeaId,
        scheduledFor: new Date(scheduledFor),
        platform: platform || 'tiktok',
      },
      include: { contentIdea: true },
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to schedule content' });
  }
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`Tiger Market Intelligence Backend running on port ${PORT}`);
});
