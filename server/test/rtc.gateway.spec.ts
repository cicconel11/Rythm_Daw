import { Test } from '@nestjs/testing';
import { RtcGateway } from '../src/modules/rtc/rtc.gateway';
import { JwtWsAuthGuard } from '../src/modules/auth/guards/jwt-ws-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Server } from 'socket.io';

// Mock JWT service
const mockJwtService = {
  verify: jest.fn().mockImplementation((token) => ({
    sub: 'test-user-id',
    email: 'test@example.com',
  })),
};

// Mock JWT Ws Auth Guard
const mockJwtWsAuthGuard = {
  canActivate: jest.fn().mockImplementation((context) => {
    const client = context.switchToWs().getClient();
    client.user = { sub: 'test-user-id' };
    return true;
  }),
};

// Simple mock server
const mockServer = {
  to: jest.fn().mockReturnThis(),
  emit: jest.fn(),
  sockets: {
    sockets: new Map(),
  },
};

// Helper to create a mock client
const createMockClient = (id: string, userId: string) => ({
  id,
  user: { sub: userId },
  join: jest.fn().mockResolvedValue(undefined),
  emit: jest.fn(),
  to: jest.fn().mockReturnThis(),
  disconnect: jest.fn(),
  on: jest.fn(),
  handshake: {
    auth: { token: 'valid-token' },
  },
});

describe('RtcGateway', () => {
  let gateway: RtcGateway;
  let mockClient1: any;
  let mockClient2: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RtcGateway,
        { provide: JwtService, useValue: mockJwtService },
      ],
    })
      .overrideGuard(JwtWsAuthGuard)
      .useValue(mockJwtWsAuthGuard)
      .compile();

    // Get gateway instance
    gateway = module.get<RtcGateway>(RtcGateway);
    
    // Initialize the maps if they don't exist
    if (!(gateway as any).userSockets) {
      (gateway as any).userSockets = new Map();
    }
    if (!(gateway as any).socketToUser) {
      (gateway as any).socketToUser = new Map();
    }
    
    // Manually set the server instance
    gateway['server'] = mockServer;
    
    // Create mock clients
    mockClient1 = createMockClient('client-1', 'user-1');
    mockClient2 = createMockClient('client-2', 'user-2');
    
    // Add clients to server's sockets map
    mockServer.sockets.sockets.set('client-1', mockClient1);
    mockServer.sockets.sockets.set('client-2', mockClient2);
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Clear the maps between tests
    if ((gateway as any).userSockets) {
      (gateway as any).userSockets.clear();
    }
    if ((gateway as any).socketToUser) {
      (gateway as any).socketToUser.clear();
    }
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should add client to connected clients', async () => {
      await gateway.handleConnection(mockClient1);
      
      // Check if client was added to userSockets map
      expect((gateway as any).userSockets.has('user-1')).toBe(true);
      expect((gateway as any).userSockets.get('user-1').has('client-1')).toBe(true);
      
      // Check if socketToUser map was updated
      expect((gateway as any).socketToUser.get('client-1')).toBe('user-1');
      
      // Verify join was called with user's room
      expect(mockClient1.join).toHaveBeenCalledWith('user-1');
    });
    
    it('should disconnect client if no user ID', async () => {
      const badClient = {
        ...mockClient1,
        user: null,
        disconnect: jest.fn(),
      };
      
      await gateway.handleConnection(badClient);
      expect(badClient.disconnect).toHaveBeenCalled();
    });

    it('should handle connection errors', async () => {
      const error = new Error('Connection error');
      mockClient1.join.mockRejectedValueOnce(error);
      
      // Mock the logger
      const originalLogger = (gateway as any).logger;
      const mockLogger = {
        error: jest.fn(),
      };
      (gateway as any).logger = mockLogger;
      
      await gateway.handleConnection(mockClient1);
      
      // Check that error was logged
      expect(mockLogger.error).toHaveBeenCalled();
      // Check that disconnect was called
      expect(mockClient1.disconnect).toHaveBeenCalled();
      
      // Restore the original logger
      (gateway as any).logger = originalLogger;
    });
  });

  describe('handleDisconnect', () => {
    it('should remove client from connected clients', async () => {
      // First connect the client
      await gateway.handleConnection(mockClient1);
      
      // Verify the client was added
      const userSockets = (gateway as any).userSockets.get('user-1');
      expect(userSockets).toBeDefined();
      expect(userSockets.has('client-1')).toBe(true);
      expect((gateway as any).socketToUser.get('client-1')).toBe('user-1');
      
      // Then disconnect
      gateway.handleDisconnect(mockClient1);
      
      // Verify the client was removed from both maps
      expect((gateway as any).userSockets.has('user-1')).toBe(false);
      expect((gateway as any).socketToUser.has('client-1')).toBe(false);
    });

    it('should handle unknown client disconnection', () => {
      // Try to disconnect a client that was never connected
      expect(() => {
        gateway.handleDisconnect(mockClient1);
      }).not.toThrow();
      
      expect((gateway as any).userSockets.has('user-1')).toBe(false);
      expect((gateway as any).socketToUser.has('client-1')).toBe(false);
    });
  });

  describe('emitToUser', () => {
    it('should emit event to all user sockets', () => {
      // Set up test data
      const userId = 'test-user';
      const event = 'test-event';
      const payload = { data: 'test' };
      
      // Create mock sockets with the required interface
      const mockSocket1 = { 
        id: 'socket-1', 
        emit: jest.fn(),
        on: jest.fn(),
        join: jest.fn(),
        to: jest.fn(),
        disconnect: jest.fn(),
      };
      
      const mockSocket2 = { 
        id: 'socket-2', 
        emit: jest.fn(),
        on: jest.fn(),
        join: jest.fn(),
        to: jest.fn(),
        disconnect: jest.fn(),
      };
      
      // Add sockets to the mock server
      if (!(gateway as any).userSockets) {
        (gateway as any).userSockets = new Map();
      }
      (gateway as any).userSockets.set(userId, new Set(['socket-1', 'socket-2']));
      
      if (!(gateway as any).socketToUser) {
        (gateway as any).socketToUser = new Map();
      }
      (gateway as any).socketToUser.set('socket-1', userId);
      (gateway as any).socketToUser.set('socket-2', userId);
      
      // Set up the mock server with the required interface
      gateway['server'] = {
        ...mockServer,
        sockets: {
          ...mockServer.sockets,
          sockets: new Map([
            ['socket-1', mockSocket1 as any],
            ['socket-2', mockSocket2 as any]
          ])
        }
      };
      
      // Call the method
      const result = (gateway as any).emitToUser(userId, event, payload);
      
      // Verify the results
      expect(result).toBe(true);
      expect(mockSocket1.emit).toHaveBeenCalledWith(event, payload);
      expect(mockSocket2.emit).toHaveBeenCalledWith(event, payload);
    });
    
    it('should return false if user has no sockets', () => {
      // Call with a non-existent user
      const result = (gateway as any).emitToUser('non-existent-user', 'test-event', {});
      
      expect(result).toBe(false);
    });
    
    it('should handle missing server', () => {
      // Save and clear the server
      const originalServer = gateway['server'];
      gateway['server'] = null as any;
      
      // Call the method
      const result = (gateway as any).emitToUser('test-user', 'test-event', {});
      
      // Restore the server
      gateway['server'] = originalServer;
      
      expect(result).toBe(false);
    });
  });
  
  describe('registerWsServer', () => {
    it('should register a WebSocket server instance', () => {
      const mockServerInstance = {} as any;
      
      gateway.registerWsServer(mockServerInstance);
      
      expect(gateway['server']).toBe(mockServerInstance);
    });
  });
});
