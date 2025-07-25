import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WsJwtGuard extends AuthGuard('ws-jwt') {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const token = this.extractTokenFromHeader(client);
    
    if (!token) {
      throw new WsException('Unauthorized');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      
      // Attach user to the client for later use
      client.data = { user: payload };
      return client;
    } catch {
      throw new WsException('Invalid token');
    }
  }

  private extractTokenFromHeader(client: unknown): string | undefined {
    const [type, token] = (client as any).handshake?.auth?.token?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
