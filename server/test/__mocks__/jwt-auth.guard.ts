import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

export const mockJwtAuthGuard = {
  canActivate: jest.fn().mockImplementation((context) => {
    const request = context.switchToHttp().getRequest();
    request.user = { id: 'test-user-id', email: 'test@example.com' };
    return true;
  }),
};
