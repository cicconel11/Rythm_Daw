import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

// Custom context to handle WebSocket connections
class WsThrottlerContext {
  constructor(private readonly context: ExecutionContext) {}

  getRequest() {
    return this.context.switchToWs().getClient<Socket>();
  }

  getResponse() {
    return this.context.switchToHttp().getResponse();
  }

  getType() {
    return 'ws';
  }
}

@Injectable()
export class WsThrottlerGuard extends ThrottlerGuard {
  private readonly logger = new Logger(WsThrottlerGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Create a custom context for WebSocket
    const wsContext = new WsThrottlerContext(context);
    
    try {
      // Call parent's canActivate with our custom context
      const canActivate = await super.canActivate(wsContext as any);
      return canActivate as boolean;
    } catch (error) {
      // Handle rate limit exceeded
      if (error.getStatus?.() === 429) {
        const socket = wsContext.getRequest();
        const ip = socket.handshake.address || 'unknown';
        
        this.logger.warn(`WebSocket rate limit exceeded for IP: ${ip}`);
        throw new WsException({
          status: 'error',
          message: 'Too many requests',
          retryAfter: 60, // 1 minute cooldown
        });
      }
      
      // Re-throw other errors
      throw error;
    }
  }
  
  // Override to handle WebSocket connections
  protected getRequestResponse(context: ExecutionContext) {
    const wsContext = new WsThrottlerContext(context);
    return {
      req: wsContext.getRequest(),
      res: wsContext.getResponse(),
    };
  }

  protected generateKey(context: ExecutionContext, suffix: string): string {
    const prefix = 'ws-throttle';
    const handler = context.getHandler().name;
    const classContext = context.getClass().name;
    return `${prefix}:${classContext}:${handler}:${suffix}`;
  }
}
