import { Test } from '@nestjs/testing';
import { RtcGateway } from '../src/modules/rtc/rtc.gateway';
import { JwtWsAuthGuard } from '../src/modules/auth/guards/jwt-ws-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Server } from 'socket.io';
import { createMockSocket, createMockServer } from './__utils__/socket-mock';
// Helper function to generate UUIDs
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

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

// Initialize socket mocks
let mockServer: Server;
let mockClient1: any;
let mockClient2: any;
let mockClient3: any;

describe('RtcGateway', () => {
  let gateway: RtcGateway;
  let mockClient1: any;
  let mockClient2: any;
  let mockClient3: any;

  // Create mock server once before all tests
  beforeAll(() => {
    // Don't mock the ws package - let Engine.IO decide which engine to use
    jest.unmock('ws');
    mockServer = createMockServer();
  });

  // Reset mocks and create new gateway instance before each test
  beforeEach(async () => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create mock clients first
    mockClient1 = createMockSocket(generateUUID());
    mockClient2 = createMockSocket(generateUUID());
    mockClient3 = createMockSocket(generateUUID());
    
    // Add user info to clients
    mockClient1.user = { sub: 'user-1' };
    mockClient2.user = { sub: 'user-2' };
    mockClient3.user = { sub: 'user-3' };
    
    // Add clients to server's sockets map
    mockServer.sockets.sockets.set(mockClient1.id, mockClient1);
    mockServer.sockets.sockets.set(mockClient2.id, mockClient2);
    mockServer.sockets.sockets.set(mockClient3.id, mockClient3);

    // Create new gateway instance
    const module = await Test.createTestingModule({
      providers: [
        RtcGateway,
        { provide: JwtService, useValue: mockJwtService },
      ],
    })
      .overrideGuard(JwtWsAuthGuard)
      .useValue(mockJwtWsAuthGuard)
      .compile();

    gateway = module.get<RtcGateway>(RtcGateway);
    
    // Initialize the maps
    gateway.userSockets = new Map();
    gateway.socketToUser = new Map();
    
    // Set the server instance
    gateway['server'] = mockServer;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should add client to connected clients', async () => {
      // Create spies for socket methods
      const joinSpy = jest.spyOn(mockClient1, 'join');
      const emitSpy = jest.spyOn(mockClient1, 'emit');
      
      await gateway.handleConnection(mockClient1);
      
      // Verify join was called with user ID
      expect(joinSpy).toHaveBeenCalledWith('user-1');
      
      // Check if client was added to userSockets map
      expect((gateway as any).userSockets.has('user-1')).toBe(true);
      expect((gateway as any).userSockets.get('user-1').has(mockClient1.id)).toBe(true);
      
      // Check if socketToUser map was updated
      expect((gateway as any).socketToUser.get(mockClient1.id)).toBe('user-1');
      
      // Verify emit was called with correct event and data
      expect(emitSpy).toHaveBeenCalledWith('connection-success', { userId: 'user-1'});
    });
    
    it('should disconnect client if no user ID', async () => {
      const badClient = {
        ...mockClient1,
        user: null,
        disconnect: jest.fn(),
      };
      
      // Create spy for disconnect
      const disconnectSpy = jest.spyOn(badClient, 'disconnect');
      
      await gateway.handleConnection(badClient);
      expect(disconnectSpy).toHaveBeenCalled();
    });

    it('should handle connection errors', async () => {
      const error = new Error('Connection error');
      
      // Create spies
      const joinSpy = jest.spyOn(mockClient1, 'join').mockRejectedValueOnce(error);
      const disconnectSpy = jest.spyOn(mockClient1, 'disconnect');
      
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
      expect(disconnectSpy).toHaveBeenCalled();
      
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
      expect(userSockets.has(mockClient1.id)).toBe(true);
      expect((gateway as any).socketToUser.get(mockClient1.id)).toBe('user-1');
      
      // Then disconnect
      await gateway.handleDisconnect(mockClient1);
      
      // Verify the client was removed
      const updatedUserSockets = (gateway as any).userSockets.get('user-1');
      expect(updatedUserSockets).toBeUndefined();
      expect((gateway as any).socketToUser.has(mockClient1.id)).toBe(false);
    });

    it('should handle unknown client disconnection', () => {
      // Try to disconnect a client that was never connected
      expect(() => {
        gateway.handleDisconnect(mockClient1);
      }).not.toThrow();
      
      expect((gateway as any).userSockets.has('user-1')).toBe(false);
      expect((gateway as any).socketToUser.has(mockClient1.id)).toBe(false);
    });
  });

  describe('emitToUser', () => {
    it('should emit event to all user sockets', () => {
      // Set up test data
      const userId = generateUUID();
      const event = 'test-event';
      const payload = { data: 'test' };
      
      // Create mock sockets with the required interface
      const mockSocket1 = createMockSocket(generateUUID());
      const mockSocket2 = createMockSocket(generateUUID());
      
      // Add user info
      mockSocket1.user = { sub: userId };
      mockSocket2.user = { sub: userId };
      
      // Add handshake data
      mockSocket1.handshake = { auth: { token: 'valid-token' } };
      mockSocket2.handshake = { auth: { token: 'valid-token' } };
      
      // Add sockets to userSockets map
      (gateway as any).userSockets.set(userId, new Set([mockSocket1.id, mockSocket2.id]));
      
      // Add sockets to socketToUser map
      (gateway as any).socketToUser.set(mockSocket1.id, userId);
      (gateway as any).socketToUser.set(mockSocket2.id, userId);
      
      // Create spies for emit
      const emitSpy1 = jest.spyOn(mockSocket1, 'emit');
      const emitSpy2 = jest.spyOn(mockSocket2, 'emit');
      
      // Add sockets to server's map
      mockServer.sockets.sockets.set(mockSocket1.id, mockSocket1);
      mockServer.sockets.sockets.set(mockSocket2.id, mockSocket2);
      
      // Call the method
      gateway.emitToUser(userId, event, payload);
      
      // Verify emit was called on both sockets
      expect(emitSpy1).toHaveBeenCalledWith(event, payload);
      expect(emitSpy2).toHaveBeenCalledWith(event, payload);
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
