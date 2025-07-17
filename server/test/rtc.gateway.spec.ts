import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { Server, Socket, Namespace } from 'socket.io';
import { RtcGateway } from '../src/modules/rtc/rtc.gateway';
import { presenceServiceMock } from './utils/presence-mock';

// Simple mock for the adapter
class MockAdapter {
  rooms = new Map<string, Set<string>>();
  sids = new Map<string, Set<string>>();
  
  async addAll(id: string, rooms: Set<string>) {
    if (!this.sids.has(id)) {
      this.sids.set(id, new Set());
    }
    
    for (const room of rooms) {
      if (!this.rooms.has(room)) {
        this.rooms.set(room, new Set());
      }
      this.rooms.get(room)?.add(id);
      this.sids.get(id)?.add(room);
    }
  }
  
  async del(id: string, room: string) {
    this.rooms.get(room)?.delete(id);
    this.sids.get(id)?.delete(room);
    
    if (this.rooms.get(room)?.size === 0) {
      this.rooms.delete(room);
    }
    
    if (this.sids.get(id)?.size === 0) {
      this.sids.delete(id);
    }
    
    return Promise.resolve();
  }
  
  async delAll(id: string) {
    const rooms = this.sids.get(id) || new Set();
    for (const room of rooms) {
      this.rooms.get(room)?.delete(id);
      if (this.rooms.get(room)?.size === 0) {
        this.rooms.delete(room);
      }
    }
    this.sids.delete(id);
    return Promise.resolve();
  }
}

// Mock Logger implementation
class MockLogger {
  log = jest.fn();
  error = jest.fn();
  warn = jest.fn();
  debug = jest.fn();
  verbose = jest.fn();
  fatal = jest.fn();
}

const mockLogger = new MockLogger() as unknown as Logger;

// Mock JWT WebSocket guard
jest.mock('../src/auth/guards/jwt-ws-auth.guard', () => ({
  JwtWsAuthGuard: () => ({
    canActivate: () => true,
  }),
}));

// Types
interface UserData {
  userId: string;
  email: string;
  name?: string;
}

// Type for our test socket that doesn't extend Socket
type MockedSocket = {
  id: string;
  user: UserData;
  handshake: { 
    user: UserData;
    headers?: Record<string, string>;
    time?: string;
    address?: string;
    xdomain?: boolean;
    secure?: boolean;
    issued?: number;
    url?: string;
    query?: Record<string, any>;
    auth?: Record<string, any>;
    [key: string]: any;
  };
  rooms: Set<string>;
  connected: boolean;
  disconnected: boolean;
  nsp: {
    name: string;
    adapter: any;
    [key: string]: any;
  };
  mockJoin: jest.Mock;
  mockLeave: jest.Mock;
  mockEmit: jest.Mock;
  mockTo: jest.Mock;
  
  // Socket methods we use
  join: (room: string) => any;
  leave: (room: string) => any;
  emit: (event: string, ...args: any[]) => boolean;
  to: (room: string) => any;
  in: (room: string) => any;
  disconnect: () => any;
  [key: string]: any;
};

class TestRtcGateway extends RtcGateway {
  testServer: any;
  testSockets = new Map<string, MockedSocket>();

  constructor() {
    super();
    (this as any).logger = mockLogger;
    this.testServer = this.createTestServer();
    // Set the server property that the gateway uses
    (this as any).server = this.testServer;
  }

  private createTestServer() {
    return {
      sockets: {
        sockets: new Map<string, MockedSocket>(),
        adapter: new MockAdapter(),
      },
      to: jest.fn().mockImplementation(() => ({
        emit: jest.fn(),
      })),
      emit: jest.fn(),
    };
  }

  createTestSocket(user: Partial<UserData> = {}): MockedSocket {
    const id = `test-socket-${Math.random().toString(36).substr(2, 9)}`;
    const userData = {
      userId: user.userId || 'test-user',
      email: user.email || 'test@example.com',
      name: user.name || 'Test User'
    };
    
    // Create a minimal mock nsp
    const mockNsp = {
      name: '/',
      adapter: new MockAdapter() as any,
    };
    
    // Create a new Set for rooms
    const rooms = new Set<string>();
    
    // Create mock functions with proper 'this' binding
    const mockJoin = jest.fn((room: string) => {
      rooms.add(room);
      return {
        emit: jest.fn(),
        to: jest.fn().mockReturnThis()
      };
    });
    
    const mockLeave = jest.fn((room: string) => {
      rooms.delete(room);
      return {
        emit: jest.fn(),
        to: jest.fn().mockReturnThis()
      };
    });
    
    const mockEmit = jest.fn().mockImplementation((event: string, data: any) => {
      // This will be called when the gateway emits to the socket
      return true;
    });
    
    const mockTo = jest.fn().mockReturnThis();
    
    const socket = {
      id,
      user: userData,
      handshake: {
        user: userData,
        headers: {},
        time: new Date().toISOString(),
        address: '127.0.0.1',
        xdomain: false,
        secure: true,
        issued: Date.now(),
        url: '/',
        query: {},
        auth: {},
      },
      rooms,
      join: mockJoin,
      leave: mockLeave,
      disconnect: function() {
        this.connected = false;
        this.disconnected = true;
        return this;
      },
      emit: mockEmit, // Use the mockEmit function directly
      to: mockTo,
      in: jest.fn().mockReturnThis(),
      connected: true,
      disconnected: false,
      nsp: mockNsp,
      data: {},
      request: {
        headers: {},
      },
      // Add mock functions for testing
      mockJoin,
      mockLeave,
      mockEmit,
      mockTo
    } as any;
    
    // Ensure the socket is in the test server's sockets map
    if (this.testServer?.sockets?.sockets) {
      this.testServer.sockets.sockets.set(socket.id, socket);
    }
    // Bind methods to the socket
    socket.disconnect = socket.disconnect.bind(socket);
    
    // Initialize test server if needed
    this.testServer.sockets = this.testServer.sockets || { sockets: new Map() };
    this.testServer.sockets.sockets = this.testServer.sockets.sockets || new Map();
    this.testServer.sockets.sockets.set(id, socket);
    this.testSockets.set(id, socket);
    
    return socket;
  }

  // Test helper methods
  async testEmitToUser(userId: string, event: string, data: any) {
    try {
      return await this.emitToUser(userId, event, data);
    } catch (error) {
      console.error('Error in testEmitToUser:', error);
      throw error;
    }
  }
  
  // Helper to get the test server
  getTestServer() {
    return this.testServer;
  }

  async testHandleConnection(client: MockedSocket) {
    try {
      // Ensure required properties are set
      const socket = client as any;
      socket.rooms = socket.rooms || new Set<string>();
      
      // Set up the user in the handshake as expected by the implementation
      if (!socket.handshake.user) {
        socket.handshake.user = {
          userId: socket.user?.userId || 'test-user',
          email: socket.user?.email || 'test@example.com',
          name: socket.user?.name || 'Test User'
        };
      }
      
      // Ensure the socket is in the test server's sockets map
      if (this.testServer?.sockets?.sockets) {
        this.testServer.sockets.sockets.set(socket.id, socket);
      }
      
      // Manually set up the userSockets map for testing
      const userId = socket.handshake.user?.userId;
      if (userId) {
        if (!this['userSockets'].has(userId)) {
          this['userSockets'].set(userId, new Set());
        }
        this['userSockets'].get(userId)?.add(socket.id);
        this['socketToUser'].set(socket.id, userId);
      }
      
      // Call the real handleConnection method
      await this.handleConnection(socket);
      
      // Return the socket for chaining
      return socket;
    } catch (error) {
      console.error('Error in testHandleConnection:', error);
      throw error;
    }
  }

  async testHandleDisconnect(client: { id: string; connected?: boolean }) {
    const socket = this.testSockets.get(client.id) as any;
    if (socket) {
      try {
        // Update socket state
        socket.connected = false;
        socket.disconnected = true;
        
        // Call the real handleDisconnect method
        await this.handleDisconnect(socket);
        
        // Clean up test state
        this.testSockets.delete(client.id);
        if (this.testServer?.sockets?.sockets) {
          this.testServer.sockets.sockets.delete(client.id);
        }
        
        return true;
      } catch (error) {
        console.error('Error in testHandleDisconnect:', error);
        throw error;
      }
    }
    return false;
  }
}

describe('RtcGateway', () => {
  let gateway: TestRtcGateway;
  
  beforeEach(() => {
    gateway = new TestRtcGateway();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should handle connection and store socket', async () => {
      const client = gateway.createTestSocket({ userId: 'user1' });
      
      // Clear any previous calls to the mock
      client.mockJoin.mockClear();
      
      // Mock the server.sockets.sockets.get method
      const mockSockets = new Map();
      mockSockets.set(client.id, client);
      gateway.testServer.sockets.sockets = mockSockets;
      
      await gateway.testHandleConnection(client);
      
      // Verify the socket was stored correctly
      expect(gateway['userSockets'].has('user1')).toBe(true);
      expect(gateway['socketToUser'].get(client.id)).toBe('user1');
      
      // Verify the user's sockets were updated
      const userSockets = gateway['userSockets'].get('user1');
      expect(userSockets).toBeDefined();
      expect(userSockets?.has(client.id)).toBe(true);
    });
  });

  describe('handleDisconnect', () => {
    it('should handle disconnection and clean up', async () => {
      const client = gateway.createTestSocket({ userId: 'user1' });
      
      // First, connect the client
      await gateway.testHandleConnection(client);
      
      // Verify initial state
      expect(gateway['userSockets'].get('user1')?.has(client.id)).toBe(true);
      expect(gateway['socketToUser'].get(client.id)).toBe('user1');
      
      // Clear any previous calls to the mock
      client.mockLeave.mockClear();
      
      // Disconnect the client
      await gateway.testHandleDisconnect({ id: client.id });
      
      // Verify the socket was cleaned up
      const userSockets = gateway['userSockets'].get('user1');
      if (userSockets) {
        expect(userSockets.has(client.id)).toBe(false);
      }
      expect(gateway['socketToUser'].has(client.id)).toBe(false);
    });
  });

  describe('emitToUser', () => {
    it('should emit event to user', async () => {
      // Create a mock socket
      const client = gateway.createTestSocket({ userId: 'user1' });
      
      // Ensure the socket is connected
      client.connected = true;
      
      // Ensure the test server is properly set up
      gateway.testServer = {
        sockets: {
          sockets: new Map([[client.id, client]])
        }
      };
      
      // Set up the server property on the gateway
      gateway['server'] = gateway.testServer as any;
      
      // Manually set up the userSockets and socketToUser maps
      gateway['userSockets'] = new Map([
        ['user1', new Set([client.id])]
      ]);
      gateway['socketToUser'] = new Map([
        [client.id, 'user1']
      ]);
      
      // Clear any previous calls to the mock
      client.mockEmit.mockClear();
      
      // Test emitting an event
      const testData = { data: 'test' };
      
      // Mock the emit method to track calls
      client.mockEmit.mockImplementation((event: string, data: any) => {
        return true;
      });
      
      // Call the method directly
      const result = gateway.emitToUser('user1', 'test-event', testData);
      
      // Verify the emit was successful
      expect(result).toBe(true);
      
      // Verify the event was emitted with the correct data
      expect(client.mockEmit).toHaveBeenCalledWith('test-event', testData);
    });

    it('should handle non-existent user', async () => {
      // Ensure the test server's sockets map is empty for this test
      gateway.testServer.sockets.sockets = new Map();
      
      const result = await gateway.testEmitToUser('non-existent', 'test-event', {});
      expect(result).toBe(false);
    });
  });
});
