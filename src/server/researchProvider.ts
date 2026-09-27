import axios from 'axios';

/**
 * Base interface for all research providers
 * Each provider implements a specific research method
 */
export interface ResearchProvider {
  /**
   * Research a specific topic/keyword
   */
  research(keyword: string, options?: any): Promise<any[]>;

  /**
   * Get available platforms
   */
  getPlatforms(): string[];

  /**
   * Check if provider is available/configured
   */
  isAvailable(): boolean;
}

/**
 * Base abstract class for research providers
 * Provides common utility methods
 */
export abstract class BaseResearchProvider implements ResearchProvider {
  abstract getPlatforms(): string[];
  abstract research(keyword: string, options?: any): Promise<any[]>;
  abstract isAvailable(): boolean;

  /**
   * Generic search with web requests
   */
  protected async webSearch(query: string, maxResults: number = 20) {
    try {
      const response = await axios.get(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`,
        { timeout: 10000 }
      );

      return response.data.Abstract || [];
    } catch (error) {
      console.error('Web search error:', error);
      return [];
    }
  }

  /**
   * Calculate engagement score
   */
  protected calculateEngagement(stats: any): number {
    if (!stats) return 0;
    const total = (stats.views || 0) + (stats.likes || 0) + (stats.comments || 0);
    return total > 0 ? total / 100 : 0;
  }

  /**
   * Validate platform parameter
   */
  protected validatePlatform(platform: string, availablePlatforms: string[]): boolean {
    return availablePlatforms.includes(platform.toLowerCase());
  }
}
