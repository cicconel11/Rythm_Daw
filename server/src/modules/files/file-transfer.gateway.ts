import { 
  WebSocketGateway, 
  WebSocketServer, 
  OnGatewayConnection, 
  OnGatewayDisconnect, 
  SubscribeMessage, 
  MessageBody, 
  ConnectedSocket 
} from '@nestjs/websockets';
import { 
  Logger, 
  UseGuards, 
  OnModuleInit, 
  OnModuleDestroy 
} from '@nestjs/common';
import { Server as IoServer, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { JwtWsAuthGuard } from '../auth/guards/jwt-ws-auth.guard';
import { FilesService } from './files.service';
import { PrismaService } from '../../prisma/prisma.service';
// Define FileTransferStatusEnum locally since shared types are not available
enum FileTransferStatusEnum {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  UPLOADING = 'uploading',
  UPLOADED = 'uploaded',
  DOWNLOADING = 'downloading',
  DOWNLOADED = 'downloaded',
  FAILED = 'failed',
}

// Extended socket type with our custom properties
interface CustomSocket extends Socket {
  userId?: string;
  username?: string;
  isAlive: boolean;
  lastPing: number;
}

interface ConnectedClient {
  socket: CustomSocket;
  userId: string;
  username: string;
  isAlive: boolean;
  lastPing: number;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: 'file-transfer',
  pingInterval: 30000,
  pingTimeout: 10000,
})
@UseGuards(JwtWsAuthGuard)
export class FileTransferGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit, OnModuleDestroy {
  @WebSocketServer()
  private io!: IoServer;
  
  private readonly logger = new Logger(FileTransferGateway.name);
  private readonly connectedClients = new Map<string, ConnectedClient>();
  private readonly activeTransfers = new Map<string, any>();

  constructor(
    private readonly filesService: FilesService,
    private readonly prisma: PrismaService,
  ) {}

  onModuleInit() {
    this.logger.log('FileTransferGateway initialized');
  }

  onModuleDestroy() {
    this.logger.log('FileTransferGateway destroyed');
  }

  handleConnection(client: CustomSocket) {
    const userId = (client as any).user?.sub;
    const username = (client as any).user?.username || 'Unknown';
    
    if (!userId) {
      this.logger.warn(`Client ${client.id} connected without valid user`);
      client.disconnect();
      return;
    }

    this.connectedClients.set(client.id, {
      socket: client,
      userId,
      username,
      isAlive: true,
      lastPing: Date.now(),
    });

    // Join user's personal room for notifications
    client.join(`user:${userId}`);
    
    this.logger.log(`Client ${client.id} (${username}) connected`);
    client.emit('welcome', { message: 'Connected to file transfer service' });
  }

  handleDisconnect(client: CustomSocket) {
    const clientInfo = this.connectedClients.get(client.id);
    if (clientInfo) {
      this.logger.log(`Client ${client.id} (${clientInfo.username}) disconnected`);
      this.connectedClients.delete(client.id);
    }
  }

  @SubscribeMessage('init_transfer')
  async handleInitTransfer(
    @ConnectedSocket() client: CustomSocket,
    @MessageBody() data: {
      fileName: string;
      size: number;
      mimeType: string;
      toUserId: string;
      fileId?: string;
      projectId?: string;
      peerId?: string;
      transferType?: 's3' | 'webrtc';
      sha256?: string;
      chunkSize?: number;
      totalChunks?: number;
    }
  ) {
    const userId = (client as any).user?.sub;
    if (!userId) {
      client.emit('transfer-error', { message: 'Unauthorized' });
      return;
    }

    try {
      // Generate unique file ID if not provided
      const fileId = data.fileId || uuidv4();
      
      // Create file transfer record in database
      const transfer = await this.prisma.fileTransfer.create({
        data: {
          id: fileId,
          fileName: data.fileName,
          fileSize: data.size,
          mimeType: data.mimeType,
          status: FileTransferStatusEnum.PENDING,
          fromUserId: userId,
          toUserId: data.toUserId,
          progress: 0,
          projectId: data.projectId,
          peerId: data.peerId,
          transferType: data.transferType || 's3',
          sha256: data.sha256,
          chunkSize: data.chunkSize,
          totalChunks: data.totalChunks,
        },
        include: {
          fromUser: {
            select: {
              id: true,
              displayName: true,
              avatarUrl: true,
            }
          },
          toUser: {
            select: {
              id: true,
              displayName: true,
              avatarUrl: true,
            }
          }
        }
      });

      // Notify recipient
      this.io.to(`user:${data.toUserId}`).emit('transfer-initiated', {
        transferId: fileId,
        fileName: data.fileName,
        fileSize: data.size,
        mimeType: data.mimeType,
        fromUser: transfer.fromUser,
        timestamp: new Date().toISOString(),
      });

      // Confirm to sender
      client.emit('transfer-initiated', {
        transferId: fileId,
        status: 'pending',
        timestamp: new Date().toISOString(),
      });

      this.logger.log(`Transfer initiated: ${fileId} from ${userId} to ${data.toUserId}`);
    } catch (error) {
      this.logger.error('Error initiating transfer:', error);
      client.emit('transfer-error', { message: 'Failed to initiate transfer' });
    }
  }

  @SubscribeMessage('accept_transfer')
  async handleAcceptTransfer(
    @ConnectedSocket() client: CustomSocket,
    @MessageBody() data: { transferId: string }
  ) {
    const userId = (client as any).user?.sub;
    if (!userId) {
      client.emit('transfer-error', { message: 'Unauthorized' });
      return;
    }

    try {
      const transfer = await this.prisma.fileTransfer.findUnique({
        where: { id: data.transferId },
        include: { fromUser: true }
      });

      if (!transfer) {
        client.emit('transfer-error', { message: 'Transfer not found' });
        return;
      }

      if (transfer.toUserId !== userId) {
        client.emit('transfer-error', { message: 'Not authorized to accept this transfer' });
        return;
      }

      // Update transfer status
      await this.prisma.fileTransfer.update({
        where: { id: data.transferId },
        data: { 
          status: FileTransferStatusEnum.ACCEPTED,
          acceptedAt: new Date(),
        }
      });

      // Notify sender
      this.io.to(`user:${transfer.fromUserId}`).emit('transfer-status', {
        transferId: data.transferId,
        status: 'accepted',
        timestamp: new Date().toISOString(),
      });

      // Confirm to recipient
      client.emit('transfer-status', {
        transferId: data.transferId,
        status: 'accepted',
        timestamp: new Date().toISOString(),
      });

      this.logger.log(`Transfer accepted: ${data.transferId} by ${userId}`);
    } catch (error) {
      this.logger.error('Error accepting transfer:', error);
      client.emit('transfer-error', { message: 'Failed to accept transfer' });
    }
  }

  @SubscribeMessage('decline_transfer')
  async handleDeclineTransfer(
    @ConnectedSocket() client: CustomSocket,
    @MessageBody() data: { transferId: string; reason?: string }
  ) {
    const userId = (client as any).user?.sub;
    if (!userId) {
      client.emit('transfer-error', { message: 'Unauthorized' });
      return;
    }

    try {
      const transfer = await this.prisma.fileTransfer.findUnique({
        where: { id: data.transferId }
      });

      if (!transfer || transfer.toUserId !== userId) {
        client.emit('transfer-error', { message: 'Not authorized to decline this transfer' });
        return;
      }

      // Update transfer status
      await this.prisma.fileTransfer.update({
        where: { id: data.transferId },
        data: { 
          status: FileTransferStatusEnum.DECLINED,
          declinedAt: new Date(),
          declineReason: data.reason,
        }
      });

      // Notify sender
      this.io.to(`user:${transfer.fromUserId}`).emit('transfer-status', {
        transferId: data.transferId,
        status: 'declined',
        reason: data.reason,
        timestamp: new Date().toISOString(),
      });

      this.logger.log(`Transfer declined: ${data.transferId} by ${userId}`);
    } catch (error) {
      this.logger.error('Error declining transfer:', error);
      client.emit('transfer-error', { message: 'Failed to decline transfer' });
    }
  }

  @SubscribeMessage('upload_complete')
  async handleUploadComplete(
    @ConnectedSocket() client: CustomSocket,
    @MessageBody() data: { transferId: string; s3Key: string }
  ) {
    const userId = (client as any).user?.sub;
    if (!userId) {
      client.emit('transfer-error', { message: 'Unauthorized' });
      return;
    }

    try {
      const transfer = await this.prisma.fileTransfer.findUnique({
        where: { id: data.transferId }
      });

      if (!transfer || transfer.fromUserId !== userId) {
        client.emit('transfer-error', { message: 'Not authorized to update this transfer' });
        return;
      }

      // Update transfer with S3 key and mark as uploaded
      await this.prisma.fileTransfer.update({
        where: { id: data.transferId },
        data: { 
          status: FileTransferStatusEnum.UPLOADED,
          s3Key: data.s3Key,
          uploadedAt: new Date(),
          progress: 100,
        }
      });

      // Notify recipient
      this.io.to(`user:${transfer.toUserId}`).emit('transfer-status', {
        transferId: data.transferId,
        status: 'sent',
        s3Key: data.s3Key,
        timestamp: new Date().toISOString(),
      });

      this.logger.log(`Upload complete: ${data.transferId} by ${userId}`);
    } catch (error) {
      this.logger.error('Error completing upload:', error);
      client.emit('transfer-error', { message: 'Failed to complete upload' });
    }
  }

  @SubscribeMessage('download_complete')
  async handleDownloadComplete(
    @ConnectedSocket() client: CustomSocket,
    @MessageBody() data: { transferId: string }
  ) {
    const userId = (client as any).user?.sub;
    if (!userId) {
      client.emit('transfer-error', { message: 'Unauthorized' });
      return;
    }

    try {
      const transfer = await this.prisma.fileTransfer.findUnique({
        where: { id: data.transferId }
      });

      if (!transfer || transfer.toUserId !== userId) {
        client.emit('transfer-error', { message: 'Not authorized to update this transfer' });
        return;
      }

      // Update transfer status
      await this.prisma.fileTransfer.update({
        where: { id: data.transferId },
        data: { 
          status: FileTransferStatusEnum.DOWNLOADED,
          downloadedAt: new Date(),
        }
      });

      // Notify sender
      this.io.to(`user:${transfer.fromUserId}`).emit('transfer-status', {
        transferId: data.transferId,
        status: 'received',
        timestamp: new Date().toISOString(),
      });

      this.logger.log(`Download complete: ${data.transferId} by ${userId}`);
    } catch (error) {
      this.logger.error('Error completing download:', error);
      client.emit('transfer-error', { message: 'Failed to complete download' });
    }
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: CustomSocket) {
    const clientInfo = this.connectedClients.get(client.id);
    if (clientInfo) {
      clientInfo.isAlive = true;
      clientInfo.lastPing = Date.now();
    }
    client.emit('pong');
  }

  // Helper method to broadcast transfer status updates
  broadcastTransferStatus(transferId: string, status: string, data?: any) {
    this.io.emit('transfer-status', {
      transferId,
      status,
      ...data,
      timestamp: new Date().toISOString(),
    });
  }
}
