import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class WsThrottlerGuard implements CanActivate {
  private readonly rateLimiter: RateLimiterMemory;
  private readonly logger = console;

  constructor() {
    // 100 messages per second per connection
    this.rateLimiter = new RateLimiterMemory({
      points: 100,
      duration: 1,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const ip = this.getClientIp(client);
    
    try {
      await this.rateLimiter.consume(`ws:${ip}`);
      return true;
    } catch (error) {
      this.logger.warn(`Rate limit exceeded for IP: ${ip}`);
      throw new WsException('Rate limit exceeded');
    }
  }

  private getClientIp(client: unknown): string {
    // Try to get IP from WebSocket connection
    if (client && (client as any)._socket && (client as any)._socket.remoteAddress) {
      return (client as any)._socket.remoteAddress;
    }
    // Fallback to connection ID if IP is not available
    return (client as any).id || 'unknown';
  }
}
