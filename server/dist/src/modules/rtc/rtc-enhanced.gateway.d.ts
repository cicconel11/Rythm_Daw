import { OnModuleInit } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { TrackUpdate, SignalingMessage } from './types/websocket.types';
export declare class RtcEnhancedGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
    private server;
    private readonly logger;
    private readonly activeUsers;
    private readonly userSockets;
    private readonly roomUsers;
    onModuleInit(): void;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleJoinRoom(client: Socket, data: {
        roomId: string;
    }): Promise<{
        success: boolean;
        roomId: string;
    }>;
    handleLeaveRoom(client: Socket, data: {
        roomId: string;
    }): Promise<{
        success: boolean;
        roomId: string;
    }>;
    handleTrackUpdate(client: Socket, update: TrackUpdate): Promise<{
        success: boolean;
    }>;
    handleSignal(client: Socket, signal: SignalingMessage): Promise<{
        success: boolean;
    }>;
    handlePing(client: Socket, data: {
        timestamp: number;
    }): Promise<{
        event: "pong";
        originalTimestamp: number;
        serverTimestamp: number;
    }>;
    private findSocketIdByUserId;
}
