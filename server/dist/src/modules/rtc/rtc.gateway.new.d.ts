import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { UserInfo, TrackUpdate, PresenceUpdate, SignalingMessage } from './types/websocket.types';
declare module 'socket.io' {
    interface Handshake {
        user: UserInfo;
    }
}
export declare class RtcGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
    server: Server;
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
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleJoinRoom(client: Socket, data: {
        roomId: string;
    }): Promise<void>;
    handleLeaveRoom(client: Socket, data: {
        roomId: string;
    }): Promise<void>;
    private leaveRoom;
    handleTrackUpdate(client: Socket, update: TrackUpdate): Promise<void>;
    handlePresenceUpdate(client: Socket, update: PresenceUpdate): Promise<void>;
    handleSignal(client: Socket, signal: SignalingMessage): Promise<void>;
    handlePing(client: Socket): void;
    onModuleDestroy(): void;
}
