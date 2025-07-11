import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class JwtWsAuthGuard {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const token = client.handshake.auth?.token;
    
    if (!token) {
      throw new WsException('Missing token');
    }

    try {
      const payload: any = this.jwt.verify(token);
      
      // Add user to handshake
      (client.handshake as any).user = {
        userId: payload.sub,
        email: payload.email,
        name: payload.name,
      };
      
      return true;
    } catch (error) {
      throw new WsException('Invalid token');
    }
  }
}
