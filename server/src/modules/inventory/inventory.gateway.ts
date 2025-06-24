import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from '../auth/guards/ws-jwt-auth.guard';

@WebSocketGateway({
  namespace: 'inventory',
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL 
      : 'http://localhost:3000',
    credentials: true,
  },
})
@UseGuards(WsJwtAuthGuard)
export class InventoryGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, string>();

  handleConnection(client: Socket) {
    const userId = (client as any).user?.sub; // Set by WsJwtAuthGuard
    if (userId) {
      this.userSockets.set(client.id, userId);
      client.join(`user:${userId}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.userSockets.delete(client.id);
  }

  broadcastInventoryUpdate(userId: string, data: any) {
    this.server.to(`user:${userId}`).emit('inventory-updates', data);
  }
}
