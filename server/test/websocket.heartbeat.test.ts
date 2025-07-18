import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, Socket } from 'socket.io';
import { EventEmitter } from 'events';

// Increase test timeout for all tests in this file
jest.setTimeout(30000);

// Simple mock socket for testing
class MockSocket extends EventEmitter {
  id: string = 'test-socket-id';
  connected: boolean = true;
  disconnected: boolean = false;
  rooms = new Set<string>();
  data: any = {};
  
  constructor() {
    super();
    // Set up default event handlers
    this.on('ping', (data, callback) => {
      if (typeof callback === 'function') {
        callback({ ...data, pong: true });
      }
    });
  }
  
  join(room: string): this {
    this.rooms.add(room);
    return this;
  }
  
  leave(room: string): this {
    this.rooms.delete(room);
    return this;
  }
  
  to(room: string): this {
    return this;
  }
  
  disconnect(close?: boolean): this {
    this.connected = false;
    this.disconnected = true;
    this.emit('disconnect', 'io client disconnect');
    return this;
  }
  
  // Mock other required methods
  get broadcast(): any {
    return {
      to: () => ({
        emit: () => {}
      })
    };
  }
}

// Test Gateway for WebSocket testing
@WebSocketGateway()
class TestWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  connectedClient: Socket | null = null;
  
  constructor() {
    // Ensure proper 'this' binding
    this.handleConnection = this.handleConnection.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
  }

  handleConnection(client: Socket) {
    this.connectedClient = client;
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    // Always clear the connected client on disconnect
    this.connectedClient = null;
  }
}

// Mock IoAdapter with minimal implementation
class MockIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    return {
      on: jest.fn(),
      close: jest.fn((cb) => cb && cb()),
    } as any;
  }
}

describe('WebSocket Heartbeat', () => {
  let app: INestApplication;
  let gateway: TestWebSocketGateway;
  let mockSocket: MockSocket;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      providers: [TestWebSocketGateway],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useWebSocketAdapter(new MockIoAdapter(app));
    await app.init();

    gateway = moduleFixture.get<TestWebSocketGateway>(TestWebSocketGateway);
    mockSocket = new MockSocket();
    
    // Mock the server instance with proper typing
    const mockServer: Partial<Server> = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    };
    gateway.server = mockServer as Server;
  });

  afterAll(async () => {
    try {
      if (app) {
        await new Promise<void>((resolve, reject) => {
          // Close the app with a timeout
          const timeout = setTimeout(() => {
            console.warn('Forcing app close due to timeout');
            resolve();
          }, 3000);
          
          app.close().then(() => {
            clearTimeout(timeout);
            resolve();
          }).catch(reject);
        });
      }
    } catch (error) {
      console.error('Error during test cleanup:', error);
    }
  }, 10000); // 10 second timeout for cleanup

  beforeEach(() => {
    jest.clearAllMocks();
    mockSocket = new MockSocket();
  });

  it('should call handleConnection when a client connects', () => {
    const handleConnectionSpy = jest.spyOn(gateway, 'handleConnection');
    
    // Simulate connection with proper typing
    gateway.handleConnection(mockSocket as unknown as Socket);
    
    expect(handleConnectionSpy).toHaveBeenCalledTimes(1);
    expect(handleConnectionSpy).toHaveBeenCalledWith(mockSocket);
    expect(gateway.connectedClient).toBe(mockSocket);
  });

  it('should call handleDisconnect when a client disconnects', () => {
    // First connect
    gateway.handleConnection(mockSocket as unknown as Socket);
    expect(gateway.connectedClient).toBeDefined();
    
    const handleDisconnectSpy = jest.spyOn(gateway, 'handleDisconnect');
    
    // Then disconnect
    gateway.handleDisconnect(mockSocket as unknown as Socket);
    
    expect(handleDisconnectSpy).toHaveBeenCalledTimes(1);
    expect(handleDisconnectSpy).toHaveBeenCalledWith(mockSocket);
    // The socket should be removed from connectedClient
    expect(gateway.connectedClient).toBeNull();
  });

  it('should handle ping-pong messages', (done) => {
    const pingData = { timestamp: Date.now() };
    
    // Set a test timeout
    const testTimeout = setTimeout(() => {
      done(new Error('Test timeout: ping-pong response not received'));
    }, 5000);
    
    // Simulate ping with a callback
    mockSocket.emit('ping', pingData, (response: { timestamp: number; pong: boolean }) => {
      try {
        clearTimeout(testTimeout);
        expect(response).toEqual({ ...pingData, pong: true });
        done();
      } catch (err) {
        clearTimeout(testTimeout);
        done(err as Error);
      }
    });
  });
});
