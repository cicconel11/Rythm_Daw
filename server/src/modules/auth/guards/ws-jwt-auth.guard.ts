import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const token = this.extractTokenFromSocket(client);
    
    if (!token) {
      throw new WsException('Unauthorized: No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      
      // Attach the user payload to the client for later use
      client['user'] = payload;
      return true;
    } catch (error) {
      throw new WsException('Unauthorized: Invalid token');
    }
  }

  private extractTokenFromSocket(socket: Socket): string | null {
    // Try to get token from handshake auth
    if (socket.handshake.auth?.token) {
      return socket.handshake.auth.token;
    }
    
    // Try to get token from query params
    const token = socket.handshake.query?.token;
    if (token && typeof token === 'string') {
      return token;
    }
    
    return null;
  }
}
