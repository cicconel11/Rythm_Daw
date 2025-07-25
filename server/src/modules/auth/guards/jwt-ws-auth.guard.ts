import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';

@Injectable()
export class JwtWsAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    
    // For WebSocket connections, we need to extract the token from the handshake query
    const token = client.handshake?.auth?.token || 
                 client.handshake?.query?.token;
    
    if (!token) {
      throw new WsException('Missing authentication token');
    }

    // For WebSockets, we need to mock the HTTP request object
    return {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
  }

  handleRequest(err: unknown, user: unknown, info: unknown) {
    if (err || !user) {
      throw err || new WsException('Unauthorized');
    }
    return user;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }
}
