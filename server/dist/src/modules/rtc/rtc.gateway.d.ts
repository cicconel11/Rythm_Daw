import { OnModuleInit } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { AuthenticatedSocket } from './types/socket-events.types';
import { TrackUpdate, PresenceUpdate, SignalingMessage } from './types/websocket.types';
export declare class RtcGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
    private server;
    private readonly logger;
    private readonly userSockets;
    private readonly socketToUser;
    private readonly userRooms;
    private readonly roomUsers;
    private readonly userPresence;
    private readonly lastSeen;
    private readonly missedPings;
    private readonly MAX_MISSED_PINGS;
    private pingInterval;
    get activeConnections(): number;
    get activeRooms(): number;
    get activeUsers(): number;
    onModuleInit(): void;
    private setupPingInterval;
    handleConnection(client: AuthenticatedSocket): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): Promise<void>;
    handleJoinRoom(client: AuthenticatedSocket, payload: {
        roomId: string;
    }): Promise<void>;
    joinRoom(userId: string, roomId: string): Promise<boolean>;
    handleLeaveRoom(client: AuthenticatedSocket, payload: {
        roomId: string;
    }): Promise<void>;
    leaveRoom(userId: string, roomId: string): Promise<boolean>;
    handleTrackUpdate(client: AuthenticatedSocket, update: TrackUpdate): Promise<void>;
    handlePresenceUpdate(client: AuthenticatedSocket, update: PresenceUpdate): Promise<void>;
    handleSignal(client: AuthenticatedSocket, signal: SignalingMessage): Promise<void>;
    private findSocketByUserId;
    onModuleDestroy(): void;
}
