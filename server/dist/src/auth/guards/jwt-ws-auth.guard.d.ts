import { ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';
declare module 'socket.io' {
    interface Handshake {
        user?: {
            userId: string;
            email: string;
            name?: string;
        };
    }
    interface Socket {
        user?: {
            userId: string;
            email: string;
            name?: string;
        };
    }
}
declare const JwtWsAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtWsAuthGuard extends JwtWsAuthGuard_base {
    private readonly logger;
    getRequest(context: ExecutionContext): {
        headers: {
            authorization: any;
        };
        _socket: Socket<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
    };
    handleRequest(err: any, user: any, info: any, context: ExecutionContext): any;
}
export {};
