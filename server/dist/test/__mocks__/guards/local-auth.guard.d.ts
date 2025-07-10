import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class LocalAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
