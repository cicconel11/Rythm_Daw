import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private redis: Redis | null = null;

  constructor() {
    this.initializeRedis();
  }

  private initializeRedis() {
    try {
      // Check for Upstash Redis configuration
      const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
      const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
      
      // Default Upstash configuration from MCP
      // Note: The actual URL and token should be obtained from Upstash MCP
      // For now, we'll use environment variables or fallback to no Redis
      const defaultUpstashUrl = process.env.UPSTASH_REDIS_URL;
      const defaultUpstashToken = process.env.UPSTASH_REDIS_TOKEN;
      
      if (upstashUrl && upstashToken) {
        // Use environment variables if provided
        this.redis = new Redis({
          host: new URL(upstashUrl).hostname,
          port: parseInt(new URL(upstashUrl).port) || 443,
          password: upstashToken,
          tls: {
            rejectUnauthorized: false
          },
          lazyConnect: true,
        });
        console.log('Using Upstash Redis (from env)');
      } else if (defaultUpstashUrl && defaultUpstashToken) {
        // Use default Upstash configuration from MCP
        this.redis = new Redis({
          host: new URL(defaultUpstashUrl).hostname,
          port: parseInt(new URL(defaultUpstashUrl).port) || 443,
          password: defaultUpstashToken,
          tls: {
            rejectUnauthorized: false
          },
          lazyConnect: true,
        });
        console.log('Using Upstash Redis (from MCP config)');
      } else {
        // Fallback to local Redis or skip Redis for development
        const redisUrl = process.env.REDIS_URL;
        if (redisUrl) {
          this.redis = new Redis(redisUrl, {
            lazyConnect: true,
          });
          console.log('Using local Redis');
        } else {
          console.log('No Redis configuration found, Redis operations will be skipped');
        }
      }
    } catch (error) {
      console.warn('Failed to initialize Redis:', error.message);
      this.redis = null;
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.redis) {
      console.warn('Redis not available, returning null for key:', key);
      return null;
    }
    
    try {
      return await this.redis.get(key);
    } catch (error) {
      console.warn('Redis get error:', error.message);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!this.redis) {
      console.warn('Redis not available, skipping set for key:', key);
      return;
    }
    
    try {
      if (ttl) {
        await this.redis.setex(key, ttl, value);
      } else {
        await this.redis.set(key, value);
      }
    } catch (error) {
      console.warn('Redis set error:', error.message);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.redis) {
      console.warn('Redis not available, skipping delete for key:', key);
      return;
    }
    
    try {
      await this.redis.del(key);
    } catch (error) {
      console.warn('Redis delete error:', error.message);
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.redis) {
      return false;
    }
    
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.warn('Redis exists error:', error.message);
      return false;
    }
  }

  async onModuleDestroy() {
    if (this.redis) {
      await this.redis.quit();
    }
  }

  getClient(): Redis | null {
    return this.redis;
  }
}
