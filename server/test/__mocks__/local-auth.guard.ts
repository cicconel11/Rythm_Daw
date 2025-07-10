import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class LocalAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

export const mockLocalAuthGuard = {
  canActivate: jest.fn().mockReturnValue(true),
};
