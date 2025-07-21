import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';

export class TestIoAdapter extends IoAdapter {
  constructor(app, private ioServer: Server) { super(app); }
  createIOServer(port: number, opts?: any) {
    return this.ioServer;
  }
} 