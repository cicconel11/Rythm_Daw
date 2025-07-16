import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PresenceService } from './presence.service';
export declare class PresenceGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly presenceService;
    server: Server;
    private userSockets;
    private projectRooms;
    constructor(presenceService: PresenceService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    private joinProjectRoom;
    private leaveAllProjectRooms;
    broadcastPresenceUpdate(projectId: string, data: any): void;
}
