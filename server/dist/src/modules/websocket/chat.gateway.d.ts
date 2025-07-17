import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { PresenceService } from '../presence/presence.service';
import { MessageQueue } from './message-queue';
export interface WebSocketClient extends Socket {
    id: string;
    userId: string;
    projectId?: string;
    isAlive: boolean;
    lastPing?: number;
    emit: (event: string, ...args: any[]) => boolean;
    queue?: MessageQueue;
}
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
    private readonly authService;
    private readonly configService;
    private readonly presenceService;
    server: Server;
    private readonly logger;
    private readonly rateLimiter;
    private readonly clientQueues;
    private readonly HEARTBEAT_INTERVAL;
    private readonly heartbeatIntervals;
    private readonly MAX_QUEUE_SIZE;
    constructor(authService: AuthService, configService: ConfigService, presenceService: PresenceService);
    onModuleInit(): void;
    handleConnection(client: WebSocketClient): Promise<void>;
    handleDisconnect(client: WebSocketClient): Promise<void>;
    handleAuth(client: WebSocketClient, data: {
        token: string;
        projectId?: string;
    }): Promise<void>;
    handleMessage(client: WebSocketClient, data: {
        to: string;
        content: string;
        metadata?: Record<string, unknown>;
    }): Promise<{
        from: string;
        to: string;
        content: string;
        timestamp: string;
    }>;
    handleTyping(client: WebSocketClient, data: {
        isTyping: boolean;
    }): Promise<void>;
    private emitToClient;
    private getUserClients;
    broadcastToProject(projectId: string, message: any): Promise<void>;
    private cleanupHeartbeat;
    private findRecipientQueue;
    onModuleDestroy(): void;
}
