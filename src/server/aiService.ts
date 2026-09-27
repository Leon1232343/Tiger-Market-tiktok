import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export class AIResearchService {
  private apiKey: string;
  private apiUrl: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.ZAI_API_KEY || '';
    this.apiUrl = process.env.ZAI_API_URL || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
    this.model = 'glm-4-flash'; // Z.ai's GLM-4 Flash for fast research
  }

  /**
   * Research TikTok trends and create content ideas
   */
  async researchTikTokTrends(keywords: string[]): Promise<{
    trends: any[];
    top3Ideas: any[];
  }> {
    if (!this.apiKey) {
      throw new Error('Z.ai API key not configured');
    }

    const systemPrompt = `You are JARVIS, an AI intelligence system for Tiger Market. Analyze TikTok trends and create content ideas.

Your task is to:
1. Identify trending topics, sounds, memes, formats
2. Analyze viral videos and detect patterns
3. Create actionable content ideas for Tiger Market
4. Evaluate each idea's virality potential and relevance

IMPORTANT: NEVER fabricate data. Use available information from the research data provided.

Format your response as JSON with this structure:
{
  "trends": [
    {
      "name": "trend name",
      "type": "sound|meme|format|challenge|topic",
      "status": "EXPLODING|RISING|ACTIVE|ESTABLISHED",
      "whyTrending": "brief explanation",
      "viralityScore": 0-100,
      "tigerRelevance": 0-100,
      "expectedDuration": "hours"
    }
  ],
  "top3Ideas": [
    {
      "title": "content idea title",
      "contentType": "Meme|Promotion|Trend|Comparison|POV|Ragebait|Community",
      "advertising": "Low|Medium|High",
      "trendScore": 0-100,
      "virality": 0-100,
      "tigerRelevance": 0-100,
      "difficulty": "Easy|Medium|Hard",
      "duration": "seconds",
      "descriptionDe": "German description",
      "whyNowDe": "German explanation why it works now",
      "howToMakeDe": "German instructions",
      "onScreenConcept": "English on-screen text/concept",
      "captionEn": "English caption",
      "hashtagsEn": "English hashtags",
      "inspirationLinks": ["source links"]
    }
  ]
}

Return ONLY valid JSON, no other text.`;

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: `Research TikTok trends for keywords: ${keywords.join(', ')}\n\nProvide current trends and top 3 content ideas for Tiger Market.`
            }
          ],
          temperature: 0.7,
          max_tokens: 4000
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      const content = response.data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const data = JSON.parse(jsonMatch[0]);

      // Validate and normalize the data
      const trends = (data.trends || []).map((trend: any) => ({
        id: `trend_${Date.now()}_${Math.random()}`,
        name: trend.name || 'Unknown Trend',
        type: trend.type || 'topic',
        status: trend.status || 'ACTIVE',
        platform: 'tiktok',
        growthSignal: trend.viralityScore / 100 || 0.5,
        viralityScore: trend.viralityScore || 50,
        tigerRelevance: trend.tigerRelevance || 50,
        competitionLevel: 0.5,
        estimatedAge: 24,
        expectedLifespan: trend.expectedDuration ? parseInt(trend.expectedDuration) : 72,
        whyTrending: trend.whyTrending || 'Unknown',
        currentUsage: 'Trending on TikTok',
        exampleVideos: [],
        sourceLinks: []
      }));

      const top3Ideas = (data.top3Ideas || []).map((idea: any, idx: number) => ({
        id: `idea_${Date.now()}_${idx}`,
        title: idea.title || 'Untitled Idea',
        contentType: idea.contentType || 'Trend',
        advertising: idea.advertising || 'Low',
        trendScore: idea.trendScore || 50,
        virality: idea.virality || 50,
        tigerRelevance: idea.tigerRelevance || 50,
        difficulty: idea.difficulty || 'Medium',
        duration: idea.duration || '15s',
        descriptionDe: idea.descriptionDe || '',
        whyNowDe: idea.whyNowDe || '',
        howToMakeDe: idea.howToMakeDe || '',
        onScreenConcept: idea.onScreenConcept || '',
        captionEn: idea.captionEn || '',
        hashtagsEn: idea.hashtagsEn || '',
        soundLink: '',
        inspirationLinks: idea.inspirationLinks || [],
        status: 'NEW',
        trendId: trends[idx]?.id || null
      }));

      return { trends, top3Ideas };
    } catch (error: any) {
      console.error('Z.ai API error:', error.response?.data || error.message);
      throw new Error('AI research failed');
    }
  }

  /**
   * Generate brand comment suggestions based on video context
   */
  async generateBrandComments(
    videoTitle: string,
    creatorUsername: string,
    videoDescription: string,
    brandContext: string[]
  ): Promise<{
    suggestedComments: Array<{
      style: string;
      text: string;
    }>;
  }> {
    if (!this.apiKey) {
      throw new Error('Z.ai API key not configured');
    }

    const systemPrompt = `You are JARVIS, an AI intelligence system for Tiger Market. Generate brand comment suggestions.

Given a viral video, create 3 specific, relevant comment suggestions for Tiger Market that would:
1. Match the video's tone and style
2. Be naturally integrated (not spammy)
3. Potentially drive engagement and brand awareness

Create comments in German (since this is for German-speaking market) with different styles:
- Professional/Corporate
- Casual/Friendly
- Witty/Funny

Format as JSON:
{
  "suggestedComments": [
    {
      "style": "Professional|Casual|Witty",
      "text": "comment in German"
    }
  ]
}

Return ONLY valid JSON.`;

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: `Video: "${videoTitle}" by @${creatorUsername}
Description: ${videoDescription}
Relevant context: ${brandContext.join(', ')}

Generate 3 German brand comment suggestions with different styles.`
            }
          ],
          temperature: 0.8,
          max_tokens: 500
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      const content = response.data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const data = JSON.parse(jsonMatch[0]);

      return {
        suggestedComments: (data.suggestedComments || []).map((comment: any) => ({
          style: comment.style || 'Casual',
          text: comment.text || ''
        }))
      };
    } catch (error: any) {
      console.error('Z.ai API error:', error.response?.data || error.message);
      throw new Error('Brand comment generation failed');
    }
  }

  /**
   * Analyze competitors and suggest improvement patterns
   */
  async analyzeCompetitors(
    competitors: Array<{
      username: string;
      platform: string;
      recentContent: any[];
    }>
  ): Promise<{
    insights: Array<{
      pattern: string;
      suggestion: string;
      relevance: number;
    }>;
  }> {
    if (!this.apiKey) {
      throw new Error('Z.ai API key not configured');
    }

    const systemPrompt = `You are JARVIS, an AI intelligence system for Tiger Market. Analyze competitor patterns and suggest improvements.

Analyze competitor posts and identify:
1. What works (hooks, formats, engagement)
2. What could be improved
3. How to adapt these patterns for Tiger Market
4. Relevance score for Tiger Market

Format as JSON:
{
  "insights": [
    {
      "pattern": "what competitor does",
      "suggestion": "how to adapt for Tiger Market",
      "relevance": 0-100
    }
  ]
}

Return ONLY valid JSON.`;

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: `Analyze these competitor accounts:
${JSON.stringify(competitors, null, 2)}

Provide insights for Tiger Market adaptation.`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      const content = response.data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const data = JSON.parse(jsonMatch[0]);

      return {
        insights: (data.insights || []).map((insight: any) => ({
          pattern: insight.pattern || 'Unknown',
          suggestion: insight.suggestion || '',
          relevance: insight.relevance || 50
        }))
      };
    } catch (error: any) {
      console.error('Z.ai API error:', error.response?.data || error.message);
      throw new Error('Competitor analysis failed');
    }
  }

  /**
   * Generate what works insights based on user feedback
   */
  async generateWhatWorksInsights(
    userFeedback: Array<{
      type: string;
      action: string;
      notes: string;
    }>,
    category: string
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Z.ai API key not configured');
    }

    const systemPrompt = `You are JARVIS, an AI intelligence system for Tiger Market. Generate actionable insights.

Based on user feedback, identify patterns of what works and what doesn't for Tiger Market.

Format your response as plain text with actionable insights.`;

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: `Generate "${category}" insights based on this feedback:\n\n${JSON.stringify(userFeedback, null, 2)}\n\nProvide 3-5 actionable insights.`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error: any) {
      console.error('Z.ai API error:', error.response?.data || error.message);
      throw new Error('What works generation failed');
    }
  }
}
