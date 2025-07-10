import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export interface AuthenticatedSocket extends Socket {
    user: {
        sub: string;
        [key: string]: any;
    };
}
export declare class RtcGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    registerWsServer(server: Server): void;
    private readonly logger;
    private userSockets;
    private socketToUser;
    handleConnection(client: AuthenticatedSocket): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): void;
    emitToUser(userId: string, event: string, payload: any): boolean;
}
