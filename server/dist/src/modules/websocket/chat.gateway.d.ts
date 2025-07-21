import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Server as IoServer, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { PresenceService } from '../presence/presence.service';
interface CustomSocket extends Socket {
    userId?: string;
    username?: string;
    isAlive: boolean;
    lastPing: number;
    handshake: {
        query: {
            userId?: string;
            username?: string;
            [key: string]: any;
        };
        [key: string]: any;
    };
}
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit, OnModuleDestroy {
    private readonly authService;
    private readonly configService;
    private readonly presenceService;
    private io;
    get server(): IoServer;
    private readonly logger;
    private readonly rateLimiter;
    private readonly clientQueues;
    private readonly HEARTBEAT_INTERVAL;
    private readonly heartbeatIntervals;
    private readonly MAX_QUEUE_SIZE;
    private readonly connectedClients;
    private readonly messageQueues;
    private readonly rooms;
    constructor(authService: AuthService, configService: ConfigService, presenceService: PresenceService);
    afterInit(server: IoServer): void;
    onModuleInit(): void;
    handleConnection(client: CustomSocket): Promise<void>;
    handleDisconnect(client: CustomSocket): Promise<void>;
    private cleanupClientResources;
    onModuleDestroy(): Promise<void>;
    private sendToClient;
    handleAuth(client: CustomSocket, data: {
        token: string;
        projectId?: string;
    }): Promise<{
        success: boolean;
        user: {
            id: any;
            username: any;
        };
    }>;
    private clearHeartbeat;
    private setupHeartbeat;
    private handleRateLimit;
    private broadcastToRoom;
    handleMessage(client: CustomSocket, data: {
        content?: string;
        roomId?: string;
    }): Promise<void>;
    private getUserClients;
    broadcastToProject(projectId: string, message: unknown): Promise<void>;
    private findRecipientQueue;
}
export {};
