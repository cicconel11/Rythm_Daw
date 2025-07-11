import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

// Extend the Express Request type to include the user property
declare global {
  namespace Express {
    interface User {
      userId: string;
      email: string;
      name?: string;
    }
    
    interface Request {
      user?: User;
    }
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication failed');
    }
    const request = context.switchToHttp().getRequest<Request>();
    request.user = user;
    return user;
  }
}
