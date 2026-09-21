import axios from 'axios';

const TIKTOK_RESEARCH_API_BASE = 'https://open.tiktokapis.com/v2/research';

export class TikTokResearchService {
  private static getAccessToken(): string | undefined {
    return process.env.TIKTOK_RESEARCH_ACCESS_TOKEN;
  }

  /**
   * Query public TikTok videos using the official TikTok Research API.
   * Endpoint: POST /v2/research/video/query/
   * Official docs: https://developers.tiktok.com/doc/research-api-get-started/
   */
  public static async queryPublicVideos(keyword: string, maxCount: number = 20): Promise<any> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      console.warn('[TikTok Research API] TIKTOK_RESEARCH_ACCESS_TOKEN not set. Returning empty research data.');
      return { videos: [], error: 'API key not configured' };
    }

    try {
      const response = await axios.post(
        `${TIKTOK_RESEARCH_API_BASE}/video/query/`,
        {
          query: {
            and: [
              {
                field_name: 'keyword',
                operation: 'IN',
                field_values: [keyword]
              }
            ]
          },
          max_count: Math.min(maxCount, 100)
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('[TikTok Research API error]:', error.response?.data || error.message);
      throw new Error('Failed to query TikTok Research API');
    }
  }

  /**
   * Fetch video comments using official TikTok Research API if supported by user access level.
   */
  public static async queryVideoComments(videoId: string, maxCount: number = 20): Promise<any> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      return { comments: [], error: 'API key not configured' };
    }

    try {
      const response = await axios.post(
        `${TIKTOK_RESEARCH_API_BASE}/video/comment/list/`,
        {
          video_id: videoId,
          max_count: Math.min(maxCount, 50)
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('[TikTok Research API comment error]:', error.response?.data || error.message);
      throw new Error('Failed to fetch TikTok video comments');
    }
  }
}
