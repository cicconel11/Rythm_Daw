import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UseGuards, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { JwtWsAuthGuard } from '../auth/guards/jwt-ws-auth.guard';

@WebSocketGateway({ namespace: '/chat', cors: { origin: '*' } })
@UseGuards(JwtWsAuthGuard)
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  private _server: Server;

  get server(): Server {
    return this._server;
  }

  async afterInit() {
    // Redis adapter for horizontal scaling
    const pubClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
    const subClient = pubClient.duplicate();
    await pubClient.connect();
    await subClient.connect();
    this.server.adapter(createAdapter(pubClient, subClient));
    this.logger.log('ChatGateway initialized with Redis adapter');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('welcome', { message: 'Welcome to the chat!' });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Example message handler
  async handleMessage(client: Socket, payload: any) {
    this.logger.log(`Received message from ${client.id}: ${JSON.stringify(payload)}`);
    this.server.emit('message', payload);
  }
}
