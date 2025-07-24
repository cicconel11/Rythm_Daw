import { ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Socket } from 'socket.io';
export declare class WsThrottlerGuard extends ThrottlerGuard {
    private readonly logger;
    canActivate(context: ExecutionContext): Promise<boolean>;
    protected getRequestResponse(context: ExecutionContext): {
        req: Socket;
        res: any;
    };
    protected generateKey(context: ExecutionContext, suffix: string): string;
}
