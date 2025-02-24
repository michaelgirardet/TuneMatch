import Redis from 'ioredis';
import { logger } from '../utils/logger';

class CacheService {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number.parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
    });

    this.client.on('error', (err) => logger.error('Redis Error:', err));
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: undefined, expireInSeconds?: number): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      if (expireInSeconds) {
        await this.client.setex(key, expireInSeconds, stringValue);
      } else {
        await this.client.set(key, stringValue);
      }
    } catch (error) {
      logger.error('Cache set error:', error);
    }
  }
}

export const cacheService = new CacheService();
