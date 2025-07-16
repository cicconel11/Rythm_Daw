import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class WsThrottlerGuard implements CanActivate {
    private readonly rateLimiter;
    private readonly logger;
    constructor();
    canActivate(context: ExecutionContext): Promise<boolean>;
    private getClientIp;
}
