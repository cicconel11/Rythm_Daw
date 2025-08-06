import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
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
  server!: Server;

  private userSockets = new Map<string, string>();
  private projectRooms = new Map<string, Set<string>>();

  constructor(private readonly presenceService: PresenceService) {}

  handleConnection(client: Socket) {
    const userId = (client as unknown as { user?: { sub: string } }).user?.sub; // Set by WsJwtAuthGuard
    if (userId) {
      this.userSockets.set(client.id, userId);
      client.join(`user:${userId}`);
      
      // Join project room if specified in handshake
      const projectId = (client.handshake.query.projectId as string) || undefined;
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

  private async joinProjectRoom(client: Socket, projectId: string) {
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
    
    // Get user presence status
    const isOnline = await this.presenceService.getUserPresence(userId);
    
    // In a real app, you would fetch the user data from your database here
    // For now, we'll just use the basic info we have
    this.server.to(`project:${projectId}`).emit('presence-joined', {
      userId,
      status: isOnline ? 'online' : 'offline',
      user: {
        id: userId,
        name: 'User', // This should be fetched from your user service
        email: 'user@example.com', // This should be fetched from your user service
      },
      projectId,
    });
    
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
  broadcastPresenceUpdate(projectId: string, data: unknown) {
    this.server.to(`project:${projectId}`).emit('presence-update', data);
  }
}
