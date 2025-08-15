import { Injectable, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class UpstashRedisService implements OnModuleDestroy {
  private baseUrl: string | null = null;
  private token: string | null = null;

  constructor() {
    this.initializeUpstash();
  }

  private initializeUpstash() {
    // Get Upstash configuration from environment or MCP
    this.baseUrl = process.env.UPSTASH_REDIS_REST_URL || 
                   process.env.UPSTASH_REDIS_URL ||
                   'https://holy-cod-22174.upstash.io';
    
    this.token = process.env.UPSTASH_REDIS_REST_TOKEN || 
                 process.env.UPSTASH_REDIS_TOKEN ||
                 'AVaeAAIjcDE4NTEyYWI0MDMxZjA0ZTE0YTRjNTk1MTAyOTM0NTdmOHAxMA';
    
    if (this.baseUrl && this.token && !this.baseUrl.includes('your-upstash')) {
      console.log('Using Upstash Redis REST API');
    } else {
      console.log('No valid Upstash Redis configuration found, Redis operations will be skipped');
      this.baseUrl = null;
      this.token = null;
    }
  }

  private async makeRequest(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
    if (!this.baseUrl || !this.token) {
      console.warn('Upstash Redis not configured');
      return null;
    }

    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Upstash Redis request failed:', error.message);
      return null;
    }
  }

  async get(key: string): Promise<string | null> {
    const result = await this.makeRequest(`/get/${encodeURIComponent(key)}`);
    return result?.result || null;
  }

  async set(key: string, value: string, ttl?: number): Promise<boolean> {
    const body: any = { key, value };
    if (ttl) body.ttl = ttl;
    
    const result = await this.makeRequest('/set', 'POST', body);
    return result?.result === 'OK';
  }

  async del(key: string): Promise<boolean> {
    const result = await this.makeRequest(`/del/${encodeURIComponent(key)}`);
    return result?.result === 1;
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.makeRequest(`/exists/${encodeURIComponent(key)}`);
    return result?.result === 1;
  }

  async ping(): Promise<boolean> {
    const result = await this.makeRequest('/ping');
    return result?.result === 'PONG';
  }

  async onModuleDestroy() {
    // No connection to close for REST API
  }

  isConfigured(): boolean {
    return this.baseUrl !== null && this.token !== null;
  }
}
