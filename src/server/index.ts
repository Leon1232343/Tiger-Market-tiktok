import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import axios from 'axios';
import { TikTokResearchService } from './tiktokService.js';
import { AIResearchService } from './aiService.js';
import { healthRoutes } from './health.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize AI Research Service
const aiService = new AIResearchService();

// Setup Health Check Routes - INLINE CALL TO ENSURE COMPILATION
healthRoutes(app);

// ==================== DASHBOARD DATA ====================

// Dashboard Overview Stats & Summary
app.get('/api/v1/dashboard', async (req, res) => {
  try {
    const [
      trendsCount,
      explodingTrendsCount,
      ideasCount,
      brandOpportunitiesCount,
      competitorsCount,
      todayIdeasRaw,
      topTrendsRaw
    ] = await Promise.all([
      prisma.trend.count(),
      prisma.trend.count({ where: { status: 'EXPLODING' } }),
      prisma.contentIdea.count(),
      prisma.brandCommentOpportunity.count(),
      prisma.competitor.count({ where: { isApproved: true } }),
      prisma.contentIdea.findMany({
        where: { status: 'NEW' },
        take: 3,
        include: { trend: true },
        orderBy: { trendScore: 'desc' }
      }),
      prisma.trend.findMany({
        orderBy: { viralityScore: 'desc' },
        take: 10
      })
    ]);

    const todayIdeas = todayIdeasRaw.map(i => ({
      ...i,
      trend: i.trend || null,
      trendName: i.trend?.name || 'Unknown',
      trendType: i.trend?.type || 'Unknown',
      trendStatus: i.trend?.status || 'Unknown',
      trendScore: i.trendScore || 0,
      virality: i.virality || 0,
      tigerRelevance: i.tigerRelevance || 0
    }));

    const topTrends = topTrendsRaw.map(t => ({
      ...t,
      exampleVideos: JSON.parse(t.exampleVideos || '[]'),
      sourceLinks: JSON.parse(t.sourceLinks || '[]')
    }));

    res.json({
      stats: {
        followers: 14250,
        viewsLast7Days: 450200,
        engagementRate: 6.8,
        trendsCount,
        explodingTrendsCount,
        competitorsCount
      },
      todayIdeas,
      topTrends,
      systemStatus: {
        aiProvider: 'Z.ai GLM-4.7-Flash',
        researchSources: 8,
        activeTrends: trendsCount,
        lastResearchRun: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// ==================== TRENDS ROUTES ====================

// Get all trends
app.get('/api/v1/trends', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      platform,
      type,
      status
    } = req.query;

    const where: any = {};
    if (platform) where.platform = platform;
    if (type) where.type = type;
    if (status) where.status = status;

    const trends = await prisma.trend.findMany({
      where,
      orderBy: { viralityScore: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    });

    const total = await prisma.trend.count({ where });

    res.json({
      trends: trends.map(t => ({
        ...t,
        exampleVideos: JSON.parse(t.exampleVideos || '[]'),
        sourceLinks: JSON.parse(t.sourceLinks || '[]')
      })),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Trends error:', error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

// Get top 10 trends
app.get('/api/v1/trends/top10', async (req, res) => {
  try {
    const trends = await prisma.trend.findMany({
      orderBy: { viralityScore: 'desc' },
      take: 10
    });

    res.json({
      trends: trends.map(t => ({
        ...t,
        exampleVideos: JSON.parse(t.exampleVideos || '[]'),
        sourceLinks: JSON.parse(t.sourceLinks || '[]')
      }))
    });
  } catch (error) {
    console.error('Top trends error:', error);
    res.status(500).json({ error: 'Failed to fetch top trends' });
  }
});

// Get trend by ID
app.get('/api/v1/trends/:id', async (req, res) => {
  try {
    const trend = await prisma.trend.findUnique({
      where: { id: req.params.id }
    });

    if (!trend) {
      return res.status(404).json({ error: 'Trend not found' });
    }

    res.json({
      ...trend,
      exampleVideos: JSON.parse(trend.exampleVideos || '[]'),
      sourceLinks: JSON.parse(trend.sourceLinks || '[]')
    });
  } catch (error) {
    console.error('Trend detail error:', error);
    res.status(500).json({ error: 'Failed to fetch trend' });
  }
});

// Create trend (admin only - for demo)
app.post('/api/v1/trends', async (req, res) => {
  try {
    const trend = await prisma.trend.create({
      data: {
        ...req.body,
        exampleVideos: JSON.stringify(req.body.exampleVideos || []),
        sourceLinks: JSON.stringify(req.body.sourceLinks || [])
      }
    });

    res.json(trend);
  } catch (error) {
    console.error('Create trend error:', error);
    res.status(500).json({ error: 'Failed to create trend' });
  }
});

// Update trend status
app.patch('/api/v1/trends/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const trend = await prisma.trend.update({
      where: { id: req.params.id },
      data: { status }
    });

    res.json(trend);
  } catch (error) {
    console.error('Update trend error:', error);
    res.status(500).json({ error: 'Failed to update trend' });
  }
});

// ==================== CONTENT IDEAS ROUTES ====================

// Get all content ideas
app.get('/api/v1/content/daily', async (req, res) => {
  try {
    const ideas = await prisma.contentIdea.findMany({
      where: { status: 'NEW' },
      take: 100,
      orderBy: { trendScore: 'desc' }
    });

    res.json(ideas);
  } catch (error) {
    console.error('Daily ideas error:', error);
    res.status(500).json({ error: 'Failed to fetch daily ideas' });
  }
});

// Get content idea by ID
app.get('/api/v1/content/:id', async (req, res) => {
  try {
    const idea = await prisma.contentIdea.findUnique({
      where: { id: req.params.id },
      include: { trend: true }
    });

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    res.json({
      ...idea,
      trend: idea.trend || null,
      trendName: idea.trend?.name || 'Unknown',
      trendType: idea.trend?.type || 'Unknown'
    });
  } catch (error) {
    console.error('Content idea error:', error);
    res.status(500).json({ error: 'Failed to fetch idea' });
  }
});

// Update content idea status
app.post('/api/v1/content/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const idea = await prisma.contentIdea.update({
      where: { id: req.params.id },
      data: { status }
    });

    // Log feedback
    await prisma.userFeedback.create({
      data: {
        type: 'IDEA',
        entityId: idea.id,
        entityType: 'ContentIdea',
        action: status === 'APPROVED' ? 'APPROVED' : 'REJECTED',
        notes: status === 'APPROVED' ? 'Approved for calendar' : 'Rejected'
      }
    });

    res.json(idea);
  } catch (error) {
    console.error('Update idea status error:', error);
    res.status(500).json({ error: 'Failed to update idea' });
  }
});

// ==================== BRAND COMMENT RADAR ROUTES ====================

// Get all brand comment opportunities
app.get('/api/v1/brand-comment/opportunities', async (req, res) => {
  try {
    const opportunities = await prisma.brandCommentOpportunity.findMany({
      orderBy: { viewCount: 'desc' },
      take: 50
    });

    res.json(opportunities.map(o => ({
      ...o,
      brandAccounts: JSON.parse(o.brandAccounts || '[]'),
      suggestedComments: JSON.parse(o.suggestedComments || '[]')
    })));
  } catch (error) {
    console.error('Brand comment opportunities error:', error);
    res.status(500).json({ error: 'Failed to fetch opportunities' });
  }
});

// Get opportunity by ID
app.get('/api/v1/brand-comment/:id', async (req, res) => {
  try {
    const opportunity = await prisma.brandCommentOpportunity.findUnique({
      where: { id: req.params.id }
    });

    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    res.json({
      ...opportunity,
      brandAccounts: JSON.parse(opportunity.brandAccounts || '[]'),
      suggestedComments: JSON.parse(opportunity.suggestedComments || '[]')
    });
  } catch (error) {
    console.error('Brand comment error:', error);
    res.status(500).json({ error: 'Failed to fetch opportunity' });
  }
});

// Rate comment suggestion
app.post('/api/v1/brand-comment/:id/rate', async (req, res) => {
  try {
    const { commentIndex, rating } = req.body;
    const opportunity = await prisma.brandCommentOpportunity.findUnique({
      where: { id: req.params.id }
    });

    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    const comments = JSON.parse(opportunity.suggestedComments || '[]');
    comments[commentIndex].rating = rating;

    const updated = await prisma.brandCommentOpportunity.update({
      where: { id: req.params.id },
      data: { suggestedComments: JSON.stringify(comments) }
    });

    // Log feedback
    await prisma.userFeedback.create({
      data: {
        type: 'COMMENT',
        entityId: opportunity.id,
        entityType: 'BrandCommentOpportunity',
        action: rating ? 'RATED_UP' : 'RATED_DOWN',
        notes: `Comment index ${commentIndex}`
      }
    });

    res.json({
      ...updated,
      brandAccounts: JSON.parse(updated.brandAccounts),
      suggestedComments: JSON.parse(updated.suggestedComments)
    });
  } catch (error) {
    console.error('Rate comment error:', error);
    res.status(500).json({ error: 'Failed to rate comment' });
  }
});

// ==================== COMPETITORS ROUTES ====================

// Get all competitors
app.get('/api/v1/competitors', async (req, res) => {
  try {
    const competitors = await prisma.competitor.findMany({
      orderBy: { followerCount: 'desc' }
    });

    res.json(competitors);
  } catch (error) {
    console.error('Competitors error:', error);
    res.status(500).json({ error: 'Failed to fetch competitors' });
  }
});

// Add competitor
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
        isApproved: false
      }
    });

    res.json(competitor);
  } catch (error) {
    console.error('Add competitor error:', error);
    res.status(500).json({ error: 'Failed to add competitor' });
  }
});

// Approve competitor
app.post('/api/v1/competitors/:id/approve', async (req, res) => {
  try {
    const competitor = await prisma.competitor.update({
      where: { id: req.params.id },
      data: { isApproved: true }
    });

    res.json(competitor);
  } catch (error) {
    console.error('Approve competitor error:', error);
    res.status(500).json({ error: 'Failed to approve competitor' });
  }
});

// ==================== MY IDEAS ROUTES ====================

// Get all user ideas
app.get('/api/v1/my-ideas', async (req, res) => {
  try {
    const ideas = await prisma.userIdea.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json(ideas);
  } catch (error) {
    console.error('My ideas error:', error);
    res.status(500).json({ error: 'Failed to fetch ideas' });
  }
});

// Add user idea
app.post('/api/v1/my-ideas', async (req, res) => {
  try {
    const { originalIdea } = req.body;
    const idea = await prisma.userIdea.create({
      data: {
        originalIdea,
        status: 'NEW',
        relatedTrends: JSON.stringify([]),
        variations: JSON.stringify([])
      }
    });

    res.json(idea);
  } catch (error) {
    console.error('Add user idea error:', error);
    res.status(500).json({ error: 'Failed to add idea' });
  }
});

// ==================== CALENDAR ROUTES ====================

// Get scheduled content
app.get('/api/v1/calendar', async (req, res) => {
  try {
    const scheduled = await prisma.scheduledContent.findMany({
      include: { contentIdea: true },
      orderBy: { scheduledFor: 'asc' }
    });

    res.json(scheduled);
  } catch (error) {
    console.error('Calendar error:', error);
    res.status(500).json({ error: 'Failed to fetch calendar' });
  }
});

// Schedule content
app.post('/api/v1/calendar', async (req, res) => {
  try {
    const { contentIdeaId, scheduledFor, platform } = req.body;
    const item = await prisma.scheduledContent.create({
      data: {
        contentIdeaId,
        scheduledFor: new Date(scheduledFor),
        platform: platform || 'tiktok',
        status: 'PLANNED'
      },
      include: { contentIdea: true }
    });

    res.json(item);
  } catch (error) {
    console.error('Schedule content error:', error);
    res.status(500).json({ error: 'Failed to schedule content' });
  }
});

// ==================== ANALYTICS ROUTES ====================

// Get all analytics
app.get('/api/v1/analytics', async (req, res) => {
  try {
    const analytics = await prisma.bufferAnalytics.findMany({
      orderBy: { postedAt: 'desc' }
    });

    res.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Add manual analytics
app.post('/api/v1/analytics/manual', async (req, res) => {
  try {
    const { platform, views, likes, comments, shares } = req.body;
    const analytics = await prisma.bufferAnalytics.create({
      data: {
        platform: platform || 'tiktok',
        postId: `manual_${Date.now()}`,
        views: views ? parseInt(views) : null,
        likes: likes ? parseInt(likes) : null,
        comments: comments ? parseInt(comments) : null,
        shares: shares ? parseInt(shares) : null,
        postedAt: new Date()
      }
    });

    res.json(analytics);
  } catch (error) {
    console.error('Add analytics error:', error);
    res.status(500).json({ error: 'Failed to add analytics' });
  }
});

// ==================== WHAT WORKS ROUTES ====================

// Get all insights
app.get('/api/v1/what-works', async (req, res) => {
  try {
    const insights = await prisma.whatWorksInsight.findMany({
      orderBy: { confidence: 'desc' }
    });

    res.json(insights);
  } catch (error) {
    console.error('What works error:', error);
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

// ==================== CATEGORIES ROUTES ====================

// Get all categories
app.get('/api/v1/categories', async (req, res) => {
  try {
    const categories = await prisma.contentCategory.findMany({
      orderBy: { discoveredAt: 'desc' }
    });

    res.json(categories);
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Approve category
app.post('/api/v1/categories/:id/approve', async (req, res) => {
  try {
    const category = await prisma.contentCategory.update({
      where: { id: req.params.id },
      data: { isApproved: true }
    });

    res.json(category);
  } catch (error) {
    console.error('Approve category error:', error);
    res.status(500).json({ error: 'Failed to approve category' });
  }
});

// ==================== TIKTOK RESEARCH API ENDPOINTS ====================

// Query public TikTok videos
app.get('/api/v1/tiktok/research/videos', async (req, res) => {
  try {
    const keyword = String(req.query.keyword || 'roblox dev');
    const maxCount = req.query.maxCount ? parseInt(String(req.query.maxCount)) : 20;

    // TODO: Implement TikTokResearchService.queryPublicVideos when API access is available
    res.json({
      keyword,
      count: 0,
      videos: [],
      warning: 'TikTok API not configured. Please add TIKTOK_ACCESS_TOKEN to .env.'
    });
  } catch (error: any) {
    console.error('TikTok research error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch TikTok research videos' });
  }
});

// Query TikTok video comments
app.get('/api/v1/tiktok/research/comments', async (req, res) => {
  try {
    const videoId = String(req.query.videoId || '');
    if (!videoId) {
      return res.status(400).json({ error: 'videoId query parameter required' });
    }
    const maxCount = req.query.maxCount ? parseInt(String(req.query.maxCount)) : 20;

    // TODO: Implement TikTokResearchService.queryVideoComments when API access is available
    res.json({
      videoId,
      count: 0,
      comments: [],
      warning: 'TikTok API not configured. Please add TIKTOK_ACCESS_TOKEN to .env.'
    });
  } catch (error: any) {
    console.error('TikTok comments error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch TikTok video comments' });
  }
});

// ==================== STATIC FRONTEND SERVING ====================

const clientDistPath = path.join(process.cwd(), 'src/client/dist');

app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath);
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                          ║
║     🤖 TIGER MARKET JARVIS INTELLIGENCE COMMAND CENTER    ║
║                                                          ║
║     ✅ Server running on port ${PORT}                        ║
║     ✅ AI Provider: Z.ai GLM-4.7-Flash                    ║
║     ✅ Database: PostgreSQL                              ║
║     ✅ Research Sources: 8                                ║
║                                                          ║
╚════════════════════════════════════════════════════════════╝
  `);
});
