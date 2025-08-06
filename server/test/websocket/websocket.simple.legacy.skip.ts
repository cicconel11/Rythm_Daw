import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import { AddressInfo } from 'net';
import { io as socketIoClient } from 'socket.io-client';

// Simple Test Gateway
@WebSocketGateway()
class TestGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  
  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  // Simple echo handler
  handleEcho(client: Socket, data: unknown) {
    client.emit('echo', data);
  }
}

describe('WebSocket (Simple)', () => {
  let app: INestApplication;
  let httpServer: unknown;
  let port: number;
  
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [TestGateway],
    }).compile();

    // Create HTTP server
    httpServer = createServer();
    
    // Create NestJS app
    app = moduleFixture.createNestApplication();
    
    // Use WebSocket adapter
    const ioAdapter = new IoAdapter(httpServer);
    app.useWebSocketAdapter(ioAdapter);
    
    // Initialize app
    await app.init();
    
    // Start HTTP server
    await new Promise<void>((resolve) => {
      httpServer.listen(0, () => {
        port = (httpServer.address() as AddressInfo).port;
        console.log(`Test WebSocket server running on port ${port}`);
        resolve();
      });
    });
  }, 10000);

  afterAll(async () => {
    await app.close();
    httpServer.close();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should connect to the WebSocket server', (done) => {
    const client = socketIoClient(`http://localhost:${port}`);
    
    client.on('connect', () => {
      expect(client.connected).toBe(true);
      client.disconnect();
      done();
    });
    
    client.on('connect_error', (error: unknown) => {
      console.error('Connection error:', error);
      done(error);
    });
  });

  it('should handle disconnection', (done) => {
    const client = socketIoClient(`http://localhost:${port}`);
    
    client.on('connect', () => {
      client.on('disconnect', () => {
        expect(client.connected).toBe(false);
        done();
      });
      
      client.disconnect();
    });
  });
});
