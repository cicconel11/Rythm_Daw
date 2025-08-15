import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: ['http://localhost:3000'], credentials: true },
  namespace: '/ws',
})
export class ActivityGateway {
  @WebSocketServer() io: Server;
  
  broadcastNew(activity: any) {
    // optionally scope by rooms (userId/projectId)
    this.io.emit('activity:new', activity);
  }
}
