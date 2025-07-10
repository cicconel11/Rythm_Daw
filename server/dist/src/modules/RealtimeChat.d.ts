import { Server } from 'http';
export declare class RealtimeChat {
    private jwtSecret;
    private wss;
    private clients;
    private rooms;
    private readonly HEARTBEAT_INTERVAL;
    constructor(server: Server, jwtSecret: string);
    private setupWebSocketHandlers;
    private setupUpgradeHandler;
    private setupHeartbeat;
    private handleMessage;
    private handleChatMessage;
    private broadcastPresence;
    private broadcastInventoryUpdate;
    private joinRoom;
    private leaveRoom;
    private sendToClient;
    private broadcastToRoom;
    private broadcastToAll;
    private handleDisconnect;
    getClientCount(): number;
    getRoomCount(): number;
}
