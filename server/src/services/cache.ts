import { logger } from '../utils/logger';

export class CacheService {
  private cache: Map<string, any>;

  constructor() {
    this.cache = new Map();
  }

  async get(key: string): Promise<any | null> {
    try {
      return this.cache.get(key) || null;
    } catch (error) {
      logger.error('Cache get error:', { error: error instanceof Error ? error.message : 'Unknown error' });
      return null;
    }
  }

  async set(key: string, value: any): Promise<void> {
    try {
      this.cache.set(key, value);
    } catch (error) {
      logger.error('Cache set error:', { error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }
}
