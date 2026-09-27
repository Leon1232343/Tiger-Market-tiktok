import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export class TikTokResearchService {
  private apiKey: string;
  private apiSecret: string;
  private accessToken: string;

  constructor() {
    this.apiKey = process.env.TIKTOK_API_KEY || '';
    this.apiSecret = process.env.TIKTOK_API_SECRET || '';
    this.accessToken = process.env.TIKTOK_ACCESS_TOKEN || '';
  }

  /**
   * Query public TikTok videos by keyword
   * Note: This uses TikTok Research API if configured
   * Falls back to scraping if API not available
   */
  async queryPublicVideos(keyword: string, maxCount: number = 20) {
    console.log(`🔍 Searching TikTok for: ${keyword}`);

    if (this.accessToken) {
      return await this.searchWithOfficialAPI(keyword, maxCount);
    }

    // Fallback to web scraping (educational/demo purposes)
    console.log('⚠️  Official API not configured, using fallback scraping');
    return await this.searchWithScraping(keyword, maxCount);
  }

  /**
   * Use official TikTok Research API
   * Requires TikTok for Developers access
   */
  async searchWithOfficialAPI(keyword: string, maxCount: number = 20) {
    try {
      const response = await axios.get(
        `https://open.tiktokapis.com/v2/research/video/query/?sub_type=1&query=${encodeURIComponent(keyword)}&max_count=${maxCount}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const videos = response.data.data?.videos || [];

      return {
        keyword,
        count: videos.length,
        videos: videos.map((video: any) => ({
          id: video.video_id,
          title: video.title,
          description: video.description,
          author: video.author?.username,
          authorAvatar: video.author?.avatar_url,
          coverImage: video.cover_image_url,
          create_time: video.create_time,
          stats: video.stats,
          music: video.music?.title,
          musicAuthor: video.music?.author_name
        }))
      };
    } catch (error: any) {
      console.error('TikTok Research API error:', error.response?.data || error.message);
      throw new Error(`TikTok API search failed: ${error.message}`);
    }
  }

  /**
   * Fallback web scraping for educational purposes
   * Note: This uses TikTok's public API endpoints and is for demo only
   */
  async searchWithScraping(keyword: string, maxCount: number = 20) {
    try {
      // Note: In production, use proper web scraping services or
      // register for official TikTok Developer access
      const response = await axios.get(
        `https://www.tiktok.com/api/search/query/?type=video&keyword=${encodeURIComponent(keyword)}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 10000
        }
      );

      // Parse response (mock data for demo)
      const videos = response.data?.video_list?.data || [];

      return {
        keyword,
        count: Math.min(videos.length, maxCount),
        videos: videos.slice(0, maxCount).map((video: any) => ({
          id: video.video_id,
          title: video.title || '',
          description: video.description || '',
          author: video.author?.nickname || 'Unknown',
          authorAvatar: video.author?.avatar,
          coverImage: video.cover_image_url || '',
          create_time: video.create_time,
          stats: {
            digg_count: video.digg_count || 0,
            comment_count: video.comment_count || 0,
            share_count: video.share_count || 0
          },
          music: video.music?.title || '',
          musicAuthor: video.music?.author_name || ''
        }))
      };
    } catch (error: any) {
      console.error('Scraping error:', error.message);
      // Return mock data for demo purposes
      return {
        keyword,
        count: 0,
        videos: [],
        warning: 'Scraping not available in demo mode. Configure TikTok API access for real data.'
      };
    }
  }

  /**
   * Query comments for a specific TikTok video
   */
  async queryVideoComments(videoId: string, maxCount: number = 20) {
    console.log(`💬 Fetching comments for video: ${videoId}`);

    if (this.accessToken) {
      return await this.getCommentsWithAPI(videoId, maxCount);
    }

    return await this.getCommentsWithScraping(videoId, maxCount);
  }

  /**
   * Get comments using official API
   */
  async getCommentsWithAPI(videoId: string, maxCount: number = 20) {
    try {
      const response = await axios.get(
        `https://open.tiktokapis.com/v2/research/comment/list/?video_id=${videoId}&max_count=${maxCount}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const comments = response.data.data?.comments || [];

      return {
        videoId,
        count: comments.length,
        comments: comments.map((comment: any) => ({
          id: comment.comment_id,
          text: comment.text,
          createTime: comment.create_time,
          diggCount: comment.digg_count || 0,
          replyCount: comment.reply_count || 0,
          author: {
            username: comment.user?.username,
            avatar: comment.user?.avatar
          }
        }))
      };
    } catch (error: any) {
      console.error('TikTok Comments API error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch comments: ${error.message}`);
    }
  }

  /**
   * Get comments using scraping
   */
  async getCommentsWithScraping(videoId: string, maxCount: number = 20) {
    try {
      const response = await axios.get(
        `https://www.tiktok.com/@tiktok/api/comment/list/?id=${videoId}&cursor=0`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 10000
        }
      );

      const comments = response.data?.comments || [];

      return {
        videoId,
        count: Math.min(comments.length, maxCount),
        comments: comments.slice(0, maxCount).map((comment: any) => ({
          id: comment.comment_id,
          text: comment.text,
          createTime: comment.create_time,
          diggCount: comment.digg_count || 0,
          replyCount: comment.reply_count || 0,
          author: {
            username: comment.user?.nickname,
            avatar: comment.user?.avatar
          }
        }))
      };
    } catch (error: any) {
      console.error('Comment scraping error:', error.message);
      return {
        videoId,
        count: 0,
        comments: [],
        warning: 'Comment scraping not available. Configure TikTok API access for real data.'
      };
    }
  }

  /**
   * Analyze video for brand commenting opportunities
   * Detects videos with many brand comments (competition)
   * and videos with few/no brand participation (opportunity)
   */
  async analyzeForBrandOpportunities(videoId: string) {
    try {
      const videoData = await this.queryPublicVideos('', 1);
      const comments = await this.queryVideoComments(videoId, 100);

      // Analyze comments for brand accounts
      const brandAccounts = this.detectBrandAccounts(comments.comments);

      // Categorize opportunity type
      let opportunityType = 'opportunity';
      if (brandAccounts.length > 10) {
        opportunityType = 'competition';
      } else if (brandAccounts.length > 5) {
        opportunityType = 'mild';
      }

      return {
        videoId,
        opportunityType,
        totalComments: comments.count,
        brandAccounts,
        suggestion: opportunityType === 'competition' ? 'Competitors are already here' : 'Fresh opportunity to engage',
        brandEngagementRate: brandAccounts.length > 0
          ? (brandAccounts.length / comments.count * 100).toFixed(2)
          : '0.00'
      };
    } catch (error: any) {
      console.error('Brand opportunity analysis error:', error);
      throw new Error('Failed to analyze brand opportunities');
    }
  }

  /**
   * Detect potential brand accounts in comments
   * Uses keyword matching and heuristic analysis
   */
  private detectBrandAccounts(comments: any[]): any[] {
    const brandKeywords = [
      'official',
      'store',
      'shop',
      'brand',
      'team',
      'company',
      'inc',
      'corp',
      'agency',
      'business',
      'studio',
      'network',
      'service'
    ];

    const detectedBrands: any[] = [];

    comments.forEach((comment: any) => {
      const text = comment.text.toLowerCase();

      // Check for brand keywords
      const hasBrandKeyword = brandKeywords.some(keyword => text.includes(keyword));

      // Check for official account patterns
      const isOfficialAccount = text.includes('@') && (
        text.includes('official') ||
        text.includes('team') ||
        text.includes('official') ||
        text.includes('official account')
      );

      if (hasBrandKeyword || isOfficialAccount) {
        detectedBrands.push({
          username: comment.author?.username || 'unknown',
          comment: comment.text,
          likes: comment.diggCount || 0
        });
      }
    });

    return detectedBrands;
  }

  /**
   * Generate TikTok trend recommendations
   */
  async generateTrendRecommendations(): Promise<any[]> {
    console.log('📈 Generating trend recommendations...');

    // Search for trending topics
    const trendingTopics = [
      'roblox dev',
      'tiktok trends',
      'gaming meme',
      'developer life',
      'tech tutorial'
    ];

    const recommendations: any[] = [];

    for (const topic of trendingTopics) {
      try {
        const result = await this.queryPublicVideos(topic, 5);

        result.videos.forEach((video: any) => {
          recommendations.push({
            videoId: video.id,
            title: video.title,
            platform: 'tiktok',
            type: 'trend',
            status: 'ACTIVE',
            author: video.author,
            views: video.stats?.digg_count || 0,
            engagement: this.calculateEngagement(video.stats),
            detectedAt: new Date().toISOString(),
            whyTrending: `${video.title} is gaining attention in ${topic}`
          });
        });
      } catch (error) {
        console.warn(`Failed to fetch ${topic}:`, error);
      }
    }

    return recommendations.slice(0, 20);
  }

  /**
   * Calculate engagement rate
   */
  private calculateEngagement(stats: any): number {
    if (!stats) return 0;

    const total = (stats.digg_count || 0) +
                 (stats.comment_count || 0) +
                 (stats.share_count || 0);

    if (total === 0) return 0;

    return (total / 1000) * 100; // Per 1000 views
  }
}
