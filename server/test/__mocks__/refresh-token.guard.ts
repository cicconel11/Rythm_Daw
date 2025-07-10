import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

export const mockRefreshTokenGuard = {
  canActivate: jest.fn().mockImplementation((context) => {
    const request = context.switchToHttp().getRequest();
    request.user = { 
      id: 'test-user-id', 
      email: 'test@example.com',
      refreshToken: 'test-refresh-token'
    };
    return true;
  }),
};
