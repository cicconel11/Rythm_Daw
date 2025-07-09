import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

type AuthenticatedRequest = Request & {
  user: any; // You might want to replace 'any' with your User type
};

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext): Request {
    const ctx = context.switchToHttp();
    return ctx.getRequest<Request>();
  }
}
