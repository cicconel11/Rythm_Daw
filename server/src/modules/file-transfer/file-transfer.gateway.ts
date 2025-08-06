import { 
  WebSocketGateway, 
  WebSocketServer, 
  OnGatewayConnection, 
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtWsAuthGuard } from '../auth/guards/jwt-ws-auth.guard';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { FileTransferService } from './file-transfer.service';

// Extend the WebSocket type from 'ws' with our custom properties
type FileTransferClient = WebSocket & {
  id: string;
  userId: string;
  isAlive: boolean;
};

@WebSocketGateway({
  path: '/ws/file-transfer',
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-production-domain.com']
      : ['http://localhost:3000'],
    credentials: true,
  },
})
export class FileTransferGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;
  private readonly logger = new Logger(FileTransferGateway.name);
  private clients: Map<string, FileTransferClient> = new Map();
  private s3Client: S3Client;
  private readonly stunServers: RTCIceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ];

  constructor(private configService: ConfigService, private service: FileTransferService) {
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

    if (!region || !accessKeyId || !secretAccessKey) {
      throw new Error('Missing required AWS configuration');
    }

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async handleConnection(client: FileTransferClient) {
    client.id = Math.random().toString(36).substring(2, 15);
    client.isAlive = true;
    this.clients.set(client.id, client);
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: FileTransferClient) {
    this.clients.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(JwtWsAuthGuard)
  @SubscribeMessage('init_transfer')
  async handleInitTransfer(
    @ConnectedSocket() client: FileTransferClient,
    @MessageBody() data: { fileName: string; fileSize: number; mimeType: string; toUserId: string },
  ) {
    try {
      // Use service to create transfer and get presign
      const { uploadUrl, transferId } = await this.service.presign({
        fileName: data.fileName,
        mimeType: data.mimeType,
        size: data.fileSize,
        toUserId: data.toUserId,
      }, client.userId); // assume userId set in guard

      return {
        event: 'transfer-initiated',
        data: {
          uploadUrl,
          transferId,
          stunServers: this.stunServers,
        },
      };
    } catch (error) {
      this.logger.error('Error initializing file transfer:', error);
      return {
        event: 'transfer-error',
        data: { message: 'Failed to initialize file transfer' },
      };
    }
  }

  @UseGuards(JwtWsAuthGuard)
  @SubscribeMessage('offer')
  async handleOffer(
    @ConnectedSocket() client: FileTransferClient,
    @MessageBody() data: { to: string; offer: RTCSessionDescriptionInit },
  ) {
    const targetClient = Array.from(this.clients.values()).find(c => c.userId === data.to);
    if (targetClient) {
      targetClient.send(JSON.stringify({
        event: 'offer',
        data: {
          from: client.userId,
          offer: data.offer,
        },
      }));
    }
  }

  @UseGuards(JwtWsAuthGuard)
  @SubscribeMessage('answer')
  async handleAnswer(
    @ConnectedSocket() client: FileTransferClient,
    @MessageBody() data: { to: string; answer: RTCSessionDescriptionInit },
  ) {
    const targetClient = Array.from(this.clients.values()).find(c => c.userId === data.to);
    if (targetClient) {
      targetClient.send(JSON.stringify({
        event: 'answer',
        data: {
          from: client.userId,
          answer: data.answer,
        },
      }));
    }
  }

  @UseGuards(JwtWsAuthGuard)
  @SubscribeMessage('ice-candidate')
  async handleIceCandidate(
    @ConnectedSocket() client: FileTransferClient,
    @MessageBody() data: { to: string; candidate: RTCIceCandidate },
  ) {
    const targetClient = Array.from(this.clients.values()).find(c => c.userId === data.to);
    if (targetClient) {
      targetClient.send(JSON.stringify({
        event: 'ice-candidate',
        data: {
          from: client.userId,
          candidate: data.candidate,
        },
      }));
    }
  }

  emitTransferStatus(toUserId: string, data: { transferId: string; status: string; progress?: number }) {
    const targetClient = Array.from(this.clients.values()).find(c => c.userId === toUserId);
    if (targetClient) {
      targetClient.send(JSON.stringify({
        event: 'transfer_status',
        data,
      }));
    }
  }
}
