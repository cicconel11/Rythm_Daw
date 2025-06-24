import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from '../auth/guards/ws-jwt-auth.guard';
import { PresenceService } from './presence.service';

@WebSocketGateway({
  namespace: 'presence',
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL 
      : 'http://localhost:3000',
    credentials: true,
  },
})
@UseGuards(WsJwtAuthGuard)
export class PresenceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, string>();
  private projectRooms = new Map<string, Set<string>>();

  constructor(private readonly presenceService: PresenceService) {}

  handleConnection(client: Socket) {
    const userId = (client as any).user?.sub; // Set by WsJwtAuthGuard
    if (userId) {
      this.userSockets.set(client.id, userId);
      client.join(`user:${userId}`);
      
      // Join project room if specified in handshake
      const projectId = client.handshake.query.projectId as string;
      if (projectId) {
        this.joinProjectRoom(client, projectId);
      }
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.userSockets.get(client.id);
    if (userId) {
      // Leave all project rooms
      this.projectRooms.forEach((clients, projectId) => {
        if (clients.has(client.id)) {
          clients.delete(client.id);
          client.leave(`project:${projectId}`);
          
          // Notify others in the project
          if (clients.size === 0) {
            this.projectRooms.delete(projectId);
          } else {
            this.server.to(`project:${projectId}`).emit('presence-left', { userId, projectId });
          }
        }
      });
      
      this.userSockets.delete(client.id);
    }
  }

  async joinProjectRoom(client: Socket, projectId: string) {
    const userId = this.userSockets.get(client.id);
    if (!userId) return;

    // Leave previous project room if any
    this.leaveAllProjectRooms(client);
    
    // Join new project room
    client.join(`project:${projectId}`);
    
    // Track room membership
    if (!this.projectRooms.has(projectId)) {
      this.projectRooms.set(projectId, new Set());
    }
    this.projectRooms.get(projectId)?.add(client.id);
    
    // Notify others in the project
    const user = await this.presenceService.getUserPresence(userId);
    if (user) {
      this.server.to(`project:${projectId}`).emit('presence-joined', {
        userId: user.userId,
        status: user.status,
        user: {
          id: user.user.id,
          name: user.user.name,
          email: user.user.email,
        },
        projectId,
      });
    }
    
    // Send current presence in the room
    const currentPresence = await this.presenceService.getProjectPresence(projectId);
    client.emit('presence-sync', currentPresence);
  }

  private leaveAllProjectRooms(client: Socket) {
    const userId = this.userSockets.get(client.id);
    if (!userId) return;

    this.projectRooms.forEach((clients, projectId) => {
      if (clients.has(client.id)) {
        clients.delete(client.id);
        client.leave(`project:${projectId}`);
        
        // Notify others in the project
        if (clients.size === 0) {
          this.projectRooms.delete(projectId);
        } else {
          this.server.to(`project:${projectId}`).emit('presence-left', { userId, projectId });
        }
      }
    });
  }

  // Called by PresenceService to broadcast presence updates
  broadcastPresenceUpdate(projectId: string, data: any) {
    this.server.to(`project:${projectId}`).emit('presence-update', data);
  }
}
