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

@WebSocketGateway({ namespace: '/rtc', cors: { origin: '*' } })
@UseGuards(JwtWsAuthGuard)
export class RtcGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(RtcGateway.name);

  private _server!: Server;

  get server(): Server {
    return this._server;
  }

  async afterInit() {
    // Redis adapter for horizontal scaling
    const pubClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
    const subClient = pubClient.duplicate();
    await pubClient.connect();
    await subClient.connect();
    (this.server as unknown as any).adapter(createAdapter(pubClient, subClient));
    this.logger.log('RtcGateway initialized with Redis adapter');
  }

  handleConnection(client: Socket) {
    this.logger.log(`RTC client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`RTC client disconnected: ${client.id}`);
  }

  // Example signaling handler
  async handleSignal(client: Socket, payload: unknown) {
    this.logger.log(`Received signal from ${client.id}: ${JSON.stringify(payload)}`);
    this.server.emit('signal', payload);
  }
}
