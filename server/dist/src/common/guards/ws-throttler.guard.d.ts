import { ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
export declare class WsThrottlerGuard extends ThrottlerGuard {
    private readonly logger;
    handleRequest(context: ExecutionContext, limit: number, ttl: number): Promise<boolean>;
    protected generateKey(context: ExecutionContext, suffix: string): string;
}
