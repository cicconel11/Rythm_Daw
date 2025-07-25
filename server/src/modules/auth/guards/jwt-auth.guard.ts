import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

type AuthenticatedRequest = Request & {
  user: unknown; // You might want to replace 'unknown' with your User type
};

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext): Request {
    const ctx = context.switchToHttp();
    return ctx.getRequest<Request>();
  }

  handleRequest(err: unknown, user: unknown, info: unknown, context: ExecutionContext) {
    return super.handleRequest(err, user, info, context);
  }
}
