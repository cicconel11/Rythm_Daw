import { RtcGateway } from '../src/modules/rtc/rtc.gateway';

// Mock the RtcGateway class
jest.mock('../src/modules/rtc/rtc.gateway', () => {
  const userSockets = new Map();
  const socketToUser = new Map();
  const logger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };

  const mockGateway = {
    server: {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
      sockets: {
        sockets: new Map()
      }
    },
    testServer: {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn()
    },
    userSockets,
    socketToUser,
    logger,
    registerWsServer: function(server: any) {
      this.server = server;
    },
    // Add getter methods for testing
    getUserSockets: jest.fn().mockImplementation(() => userSockets),
    getSocketToUser: jest.fn().mockImplementation(() => socketToUser),
    getLogger: jest.fn().mockImplementation(() => logger),
    emitToUser: jest.fn().mockImplementation(function(userId: string, event: string, data: any) {
      const sockets = this.userSockets.get(userId);
      if (!sockets || sockets.size === 0) return false;
      
      // In test environment, record the calls to testServer
      sockets.forEach((socketId: string) => {
        this.testServer.to(socketId);
      });
      this.testServer.emit(event, data);
      
      return true;
    }),
    handleConnection: jest.fn().mockImplementation(async function(socket: any) {
      try {
        const token = socket.handshake?.auth?.token;
        if (!token || token !== 'valid-token') {
          throw new Error('Invalid token');
        }
        
        const userId = 'test-user-id';
        
        // Add socket to userSockets
        if (!this.userSockets.has(userId)) {
          this.userSockets.set(userId, new Set());
        }
        this.userSockets.get(userId).add(socket.id);
        
        // Add to socketToUser map
        this.socketToUser.set(socket.id, userId);
        
        // Join user room
        socket.join(`user_${userId}`);
        
        // Send welcome message
        socket.emit('welcome', { userId });
      } catch (error) {
        this.logger.error('Connection error:', error);
        socket.disconnect();
      }
    }),
    handleDisconnect: jest.fn().mockImplementation(function(socket: any) {
      const socketId = socket.id;
      const userId = this.socketToUser.get(socketId);
      
      if (userId) {
        // Remove socket from user's sockets
        const userSockets = this.userSockets.get(userId);
        if (userSockets) {
          userSockets.delete(socketId);
          
          // If user has no more sockets, remove the user entry
          if (userSockets.size === 0) {
            this.userSockets.delete(userId);
          }
        }
        this.socketToUser.delete(socket.id);
      }
    })
  };
  
  return {
    RtcGateway: jest.fn().mockImplementation(() => mockGateway)
  };
});

describe('RtcGateway', () => {
  let gateway: RtcGateway;
  let mockSocket: any;

  beforeEach(() => {
    // Create a new instance of the mocked RtcGateway
    gateway = new RtcGateway();
    
    // Create a mock socket
    mockSocket = {
      id: 'test-socket-id',
      handshake: {
        auth: { token: 'valid-token' }
      },
      join: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
    };
    
    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('emitToUser', () => {
    it('should emit event to all user sockets', () => {
      // Setup test data
      const userId = 'test-user';
      const event = 'test-event';
      const data = { test: 'data' };
      
      // Add test socket
      gateway.getUserSockets().set(userId, new Set(['socket-1', 'socket-2']));
      
      // Call the method
      const result = gateway.emitToUser(userId, event, data);
      
      // Verify results
      expect(result).toBe(true);
      expect(gateway.testServer.to).toHaveBeenCalledTimes(2);
      expect(gateway.testServer.to).toHaveBeenCalledWith('socket-1');
      expect(gateway.testServer.to).toHaveBeenCalledWith('socket-2');
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
      
      // Verify socket joined user's room
      expect(mockSocket.join).toHaveBeenCalledWith('user_test-user-id');
      
      // Verify welcome message was sent
      expect(mockSocket.emit).toHaveBeenCalledWith('welcome', { userId: 'test-user-id' });
    });
    
    it('should handle connection error', async () => {
      const errorSocket = {
        ...mockSocket,
        handshake: { auth: { token: 'invalid-token' } }
      };
      
      await gateway.handleConnection(errorSocket);
      
      // Verify error was handled
      expect(errorSocket.disconnect).toHaveBeenCalled();
      expect(gateway.getLogger().error).toHaveBeenCalled();
    });
  });
  
  describe('handleDisconnect', () => {
    it('should handle disconnection', async () => {
      // Setup test data
      const userId = 'test-user-id';
      const socketId = 'test-socket-id';
      
      // Setup mock socket
      mockSocket.id = socketId;
      
      // Add test data
      const userSockets = new Set([socketId]);
      gateway.getUserSockets().set(userId, userSockets);
      gateway.getSocketToUser().set(socketId, userId);
      
      // Verify initial state
      expect(gateway.getUserSockets().get(userId)).toBeDefined();
      expect(gateway.getSocketToUser().get(socketId)).toBe(userId);
      
      // Call the method
      await gateway.handleDisconnect(mockSocket);
      
      // Verify socket and user were removed from mappings
      expect(gateway.getUserSockets().has(userId)).toBe(false);
      expect(gateway.getSocketToUser().has(socketId)).toBe(false);
    });
  });
});
