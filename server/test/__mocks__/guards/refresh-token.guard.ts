import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}
