import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class LocalAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}
