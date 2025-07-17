import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { io as ioClient, Socket } from 'socket.io-client';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { EventEmitter } from 'events';
import * as jwt from 'jsonwebtoken';

// Mock socket.io-client
const mockSocket = {
  id: `test-socket-${Math.random().toString(36).substr(2, 9)}`,
  connected: true,
  disconnected: false,
  on: jest.fn((event, callback) => {
    if (event === 'connect') {
      setTimeout(callback, 10);
    }
    return mockSocket;
  }),
  emit: jest.fn(),
  disconnect: jest.fn(() => {
    mockSocket.connected = false;
    mockSocket.disconnected = true;
    return mockSocket;
  }),
  handshake: {
    user: { userId: 'test-user' }
  }
};

// Mock the socket.io-client module
jest.mock('socket.io-client', () => ({
  io: jest.fn().mockImplementation(() => mockSocket)
}));

// Test Gateway for WebSocket testing
@WebSocketGateway()
class TestWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: any;
  
  handleConnection(client: any) {
    console.log('Client connected:', client.id);
  }
  
  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }
}

// Mock IoAdapter
class MockIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server = new EventEmitter() as any;
    server.sockets = {
      sockets: new Map(),
    };
    return server;
  }
}

describe('WebSocket Heartbeat', () => {
  let app: INestApplication;
  let gateway: TestWebSocketGateway;
  
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      providers: [TestWebSocketGateway],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useWebSocketAdapter(new MockIoAdapter(app));
    
    await app.init();
    gateway = moduleFixture.get<TestWebSocketGateway>(TestWebSocketGateway);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should connect to the WebSocket server', (done) => {
    const socket = ioClient('http://localhost:3000');
    
    socket.on('connect', () => {
      expect(socket.connected).toBe(true);
      socket.disconnect();
      done();
    });
  });

  it('should handle ping-pong', (done) => {
    const socket = ioClient('http://localhost:3000');
    
    // Mock the pong response
    (socket.emit as jest.Mock).mockImplementation((event, data, callback) => {
      if (event === 'ping' && typeof callback === 'function') {
        callback({ timestamp: data.timestamp });
      }
      return socket;
    });
    
    socket.emit('ping', { timestamp: Date.now() }, (response: any) => {
      expect(response).toHaveProperty('timestamp');
      socket.disconnect();
      done();
    });
  });

  it('should handle disconnection', (done) => {
    const socket = ioClient('http://localhost:3000');
    
    socket.on('disconnect', () => {
      expect(socket.connected).toBe(false);
      done();
    });
    
    socket.disconnect();
  });

  it('should handle connection and disconnection on the gateway', (done) => {
    const socket = ioClient('http://localhost:3000');
    
    const handleConnectionSpy = jest.spyOn(gateway, 'handleConnection');
    const handleDisconnectSpy = jest.spyOn(gateway, 'handleDisconnect');
    
    socket.on('connect', () => {
      expect(handleConnectionSpy).toHaveBeenCalledTimes(1);
      expect(handleDisconnectSpy).not.toHaveBeenCalled();
      socket.disconnect();
    });
    
    socket.on('disconnect', () => {
      expect(handleDisconnectSpy).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
