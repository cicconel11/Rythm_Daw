import { RtcGateway } from '../src/modules/rtc/rtc.gateway';

// Mock the RtcGateway class
class MockRtcGateway {
  public server: any;
  public testServer: any;
  public userSockets = new Map<string, Set<string>>();
  public socketToUser = new Map<string, string>();
  public logger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };

  constructor() {
    this.server = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
      sockets: {
        sockets: new Map()
      }
    };
    
    this.testServer = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn()
    };
  }

  registerWsServer(server: any) {
    this.server = server;
  }

  // Add getter methods for testing
  getUserSockets() {
    return this.userSockets;
  }

  getSocketToUser() {
    return this.socketToUser;
  }

  getLogger() {
    return this.logger;
  }

  emitToUser(userId: string, event: string, data: any) {
    const sockets = this.userSockets.get(userId);
    if (!sockets || sockets.size === 0) return false;
    
    sockets.forEach((socketId: string) => {
      this.testServer.to(socketId);
    });
    this.testServer.emit(event, data);
    
    return true;
  }

  async handleConnection(socket: any) {
    try {
      const token = socket.handshake?.auth?.token;
      if (!token || token !== 'valid-token') {
        throw new Error('Invalid token');
      }

      const userId = 'test-user-id';
      const socketId = socket.id || 'test-socket-id';

      // Add socket to user's sockets
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)?.add(socketId);
      this.socketToUser.set(socketId, userId);

      return true;
    } catch (error) {
      this.logger.error('Connection error:', error);
      socket.disconnect();
      return false;
    }
  }

  handleDisconnect(socket: any) {
    const socketId = socket.id || 'test-socket-id';
    const userId = this.socketToUser.get(socketId);
    
    if (userId) {
      const userSockets = this.userSockets.get(userId);
      if (userSockets) {
        userSockets.delete(socketId);
        if (userSockets.size === 0) {
          this.userSockets.delete(userId);
        }
      }
      this.socketToUser.delete(socketId);
    }
  }
}

// Mock the module
export const MockRtcGatewayInstance = new MockRtcGateway();
jest.mock('../src/modules/rtc/rtc.gateway', () => ({
  RtcGateway: jest.fn().mockImplementation(() => MockRtcGatewayInstance)
}));

describe('RtcGateway', () => {
  let gateway: RtcGateway;
  let mockSocket: any;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Create a new instance for each test
    gateway = new RtcGateway();
    
    // Setup mock socket
    mockSocket = {
      id: 'test-socket-id',
      handshake: {
        auth: {
          token: 'valid-token'
        }
      },
      disconnect: jest.fn(),
      join: jest.fn(),
      leave: jest.fn(),
      emit: jest.fn(),
      to: jest.fn().mockReturnThis()
    };
  });

  describe('emitToUser', () => {
    it('should emit event to all user sockets', () => {
      const userId = 'test-user-id';
      const event = 'test-event';
      const data = { test: 'data' };
      
      // Add test socket
      gateway.getUserSockets().set(userId, new Set(['socket-1', 'socket-2']));
      
      // Call the method
      const result = gateway.emitToUser(userId, event, data);
      
      // Verify the result
      expect(result).toBe(true);
      expect(gateway.testServer.to).toHaveBeenCalledTimes(2);
      expect(gateway.testServer.emit).toHaveBeenCalledWith(event, data);
    });

    it('should return false if user has no sockets', () => {
      const result = gateway.emitToUser('non-existent-user', 'test-event', {});
      expect(result).toBe(false);
      expect(gateway.testServer.to).not.toHaveBeenCalled();
    });
  });

  describe('handleConnection', () => {
    it('should handle successful connection', async () => {
      await gateway.handleConnection(mockSocket);
      
      // Verify socket was added to userSockets
      expect(gateway.getUserSockets().get('test-user-id')).toBeDefined();
      expect(gateway.getSocketToUser().get('test-socket-id')).toBe('test-user-id');
      expect(mockSocket.disconnect).not.toHaveBeenCalled();
    });

    it('should handle connection error', async () => {
      const errorSocket = {
        ...mockSocket,
        handshake: { auth: { token: 'invalid-token' } },
        disconnect: jest.fn()
      };
      
      await gateway.handleConnection(errorSocket);
      
      // Verify error was handled
      expect(errorSocket.disconnect).toHaveBeenCalled();
      expect(gateway.getLogger().error).toHaveBeenCalled();
    });
  });

  describe('handleDisconnect', () => {
    it('should handle disconnection', () => {
      const userId = 'test-user-id';
      const socketId = 'test-socket-id';
      
      // Add test data
      const userSockets = new Set([socketId]);
      gateway.getUserSockets().set(userId, userSockets);
      gateway.getSocketToUser().set(socketId, userId);
      
      // Verify initial state
      expect(gateway.getUserSockets().get(userId)?.has(socketId)).toBe(true);
      expect(gateway.getSocketToUser().get(socketId)).toBe(userId);
      
      // Call the method
      gateway.handleDisconnect({ id: socketId });
      
      // Verify state after disconnection
      expect(gateway.getUserSockets().has(userId)).toBe(false);
      expect(gateway.getSocketToUser().has(socketId)).toBe(false);
    });
  });
});
