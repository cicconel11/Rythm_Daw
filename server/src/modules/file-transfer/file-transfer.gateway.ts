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
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

interface FileTransferClient extends WebSocket {
  id: string;
  userId: string;
  isAlive: boolean;
}

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
  server: Server<FileTransferClient>;
  private readonly logger = new Logger(FileTransferGateway.name);
  private clients: Map<string, FileTransferClient> = new Map();
  private s3Client: S3Client;
  private readonly stunServers: RTCIceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ];

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
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
  @SubscribeMessage('init-transfer')
  async handleInitTransfer(
    @ConnectedSocket() client: FileTransferClient,
    @MessageBody() data: { fileName: string; fileSize: number; mimeType: string },
  ) {
    try {
      // Generate a unique file key
      const fileKey = `uploads/${Date.now()}-${data.fileName}`;
      
      // Create pre-signed URL for S3 upload
      const command = new PutObjectCommand({
        Bucket: this.configService.get('S3_BUCKET_NAME'),
        Key: fileKey,
        ContentType: data.mimeType,
        ContentLength: data.fileSize,
      });

      const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
      
      // Return the pre-signed URL and file key to the client
      return {
        event: 'transfer-initiated',
        data: {
          uploadUrl,
          fileKey,
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
}
