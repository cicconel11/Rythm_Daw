import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { EventEmitter } from 'events';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, Socket } from 'socket.io';

// Mock socket.io-client
class MockSocket extends EventEmitter {
  id: string;
  connected: boolean;
  disconnected: boolean;
  
  constructor() {
    super();
    this.id = `test-socket-${Math.random().toString(36).substr(2, 9)}`;
    this.connected = true;
    this.disconnected = false;
  }

  disconnect() {
    this.connected = false;
    this.disconnected = true;
    this.emit('disconnect');
    return this;
  }

  emit(event: string, ...args: any[]): boolean {
    // For ping-pong simulation
    if (event === 'ping' && typeof args[1] === 'function') {
      const callback = args[1];
      process.nextTick(() => callback({ timestamp: args[0]?.timestamp || Date.now() }));
    }
    return super.emit(event, ...args);
  }
}

// Mock socket.io-client
const mockIo = jest.fn().mockImplementation(() => new MockSocket());

jest.mock('socket.io-client', () => ({
  io: mockIo
}));

// Test Gateway
@WebSocketGateway()
class TestGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  
  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }
}

// Mock IoAdapter
class MockIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    return {
      on: jest.fn(),
      close: jest.fn(),
      of: jest.fn().mockReturnThis(),
      use: jest.fn().mockReturnThis(),
      engine: { on: jest.fn() },
      sockets: {
        sockets: new Map<string, any>(),
        on: jest.fn()
      }
    };
  }
}

describe('WebSocket Heartbeat', () => {
  let app: INestApplication;
  let gateway: TestGateway;
  let socket: MockSocket;

  beforeAll(async () => {
    // Create a new mock socket for each test
    socket = new MockSocket();
    mockIo.mockImplementation(() => socket);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [TestGateway],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useWebSocketAdapter(new MockIoAdapter(app));
    
    await app.init();
    gateway = moduleFixture.get<TestGateway>(TestGateway);
  }, 10000);

  afterAll(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should connect to the WebSocket server', (done) => {
    const client = mockIo('http://localhost:3000');
    
    client.on('connect', () => {
      expect(client.connected).toBe(true);
      client.disconnect();
      done();
    });
    
    // Simulate connection
    client.emit('connect');
  });

  it('should handle ping-pong', (done) => {
    const client = mockIo('http://localhost:3000');
    
    client.emit('ping', { timestamp: 12345 }, (response: any) => {
      expect(response).toHaveProperty('timestamp');
      expect(response.timestamp).toBe(12345);
      client.disconnect();
      done();
    });
  });

  it('should handle disconnection', (done) => {
    const client = mockIo('http://localhost:3000');
    
    client.on('disconnect', () => {
      expect(client.connected).toBe(false);
      done();
    });
    
    client.disconnect();
  });

  it('should trigger gateway connection handlers', (done) => {
    const handleConnectionSpy = jest.spyOn(gateway, 'handleConnection');
    const handleDisconnectSpy = jest.spyOn(gateway, 'handleDisconnect');
    
    const client = mockIo('http://localhost:3000');
    
    // Simulate connection
    client.emit('connection');
    
    process.nextTick(() => {
      expect(handleConnectionSpy).toHaveBeenCalledTimes(1);
      
      // Simulate disconnection
      client.disconnect();
      
      process.nextTick(() => {
        expect(handleDisconnectSpy).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });
});
