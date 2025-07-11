import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

// Extend the Socket.IO types to include our custom user property
declare module 'socket.io' {
  interface Handshake {
    user?: {
      userId: string;
      email: string;
      name?: string;
    };
  }

  interface Socket {
    user?: {
      userId: string;
      email: string;
      name?: string;
    };
  }
}

@Injectable()
export class JwtWsAuthGuard extends AuthGuard('ws-jwt') {
  private readonly logger = new Logger(JwtWsAuthGuard.name);

  getRequest(context: ExecutionContext) {
    const ctx = context.switchToWs();
    const client = ctx.getClient<Socket>();
    
    // For WebSocket connections, we need to attach the handshake headers to the request
    const request = {
      headers: {
        authorization: client.handshake?.auth?.token || 
                      client.handshake?.headers?.authorization ||
                      '',
      },
      // Add the socket to the request for later use
      _socket: client,
    };
    
    return request;
  }
  
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      const errorMessage = info?.message || 'Unauthorized';
      this.logger.warn(`WebSocket authentication failed: ${errorMessage}`);
      throw new WsException(errorMessage);
    }
    
    try {
      // Attach user to the socket for later use
      const client = context.switchToWs().getClient<Socket>();
      
      // Store user in the socket
      client.user = user;
      
      // Also store in handshake for backward compatibility
      if (client.handshake) {
        client.handshake.user = user;
      }
      
      return user;
    } catch (error) {
      this.logger.error('Error in WebSocket authentication:', error);
      throw new WsException('Authentication failed');
    }
  }
}
