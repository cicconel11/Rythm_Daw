import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsThrottlerGuard extends ThrottlerGuard {
  private readonly logger = new Logger(WsThrottlerGuard.name);

  async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
  ): Promise<boolean> {
    try {
      const client = context.switchToWs().getClient<Socket>();
      const ip = client.handshake?.address || 'unknown';
      const key = this.generateKey(context, ip);
      
      // Get the storage service through the storage getter
      const storage = this.storageService;
      
      // Increment the request count
      const { totalHits } = await storage.increment(key, ttl);

      if (totalHits > limit) {
        this.logger.warn(`Rate limit exceeded for IP: ${ip}`);
        throw new WsException('Too many requests');
      }

      return true;
    } catch (error) {
      this.logger.error('Error in WsThrottlerGuard:', error);
      throw new WsException('Rate limiting error');
    }
  }

  protected generateKey(context: ExecutionContext, suffix: string): string {
    const prefix = 'ws-throttle';
    const handler = context.getHandler().name;
    const classContext = context.getClass().name;
    return `${prefix}:${classContext}:${handler}:${suffix}`;
  }
}
