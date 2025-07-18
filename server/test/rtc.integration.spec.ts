import { RtcGateway } from '../src/modules/rtc/rtc.gateway';
import { UserInfo } from '../../../src/modules/rtc/types/websocket.types';

// Mock user data
const mockUser: UserInfo = {
  userId: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  isOnline: true,
};

// Mock the RtcGateway class
class MockRtcGateway {
  public server: any = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn()
  };
  public userSockets = new Map<string, Set<string>>();
  public socketToUser = new Map<string, string>();
  public userRooms = new Map<string, Set<string>>();
  public roomUsers = new Map<string, Set<string>>();
  public userPresence = new Map<string, boolean>();
  private readonly logger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  };
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
describe('RtcGateway', () => {
  let gateway: RtcGateway;
  let app: INestApplication;
  let io: Server;
  
  // Mock socket client
  const createMockSocket = (userId: string, socketId: string = `socket-${Date.now()}`) => ({
    id: socketId,
    handshake: {
      user: { ...mockUser, userId },
      headers: {},
      query: {},
    },
    join: jest.fn(),
    leave: jest.fn(),
    emit: jest.fn(),
    to: jest.fn().mockReturnThis(),
    disconnect: jest.fn(),
    on: jest.fn(),
    removeAllListeners: jest.fn(),
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RtcGateway],
    }).compile();

    app = module.createNestApplication();
    app.useWebSocketAdapter(new IoAdapter(app));
    
    await app.init();
    
    // Create socket.io server
    const httpServer = app.getHttpServer();
    io = new Server(httpServer);
    
    gateway = module.get<RtcGateway>(RtcGateway);
    // @ts-ignore - Access private property for testing
    gateway.server = io;
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleConnection', () => {
    it('should add user to connected clients', () => {
      const mockSocket = createMockSocket('user-1', 'socket-1');
      
      // Call the method
      gateway.handleConnection(mockSocket);
      
      // Verify the user was added
      // @ts-ignore - Access private property for testing
      const userSockets = gateway.userSockets.get('user-1');
      // @ts-ignore - Access private property for testing
      const socketUser = gateway.socketToUser.get('socket-1');
      
      expect(userSockets).toBeDefined();
      expect(userSockets?.has('socket-1')).toBe(true);
      expect(socketUser).toBe('user-1');
      expect(mockSocket.on).toHaveBeenCalled();
    });

    it('should handle connection error when user is not authenticated', () => {
      const mockSocket = {
        ...createMockSocket('user-1'),
        handshake: { user: undefined }
      };
      
      // Call the method
      gateway.handleConnection(mockSocket);
      
      // Verify error handling
      expect(mockSocket.disconnect).toHaveBeenCalled();
    });
  });

  describe('handleDisconnect', () => {
    it('should remove user from connected clients', () => {
      const mockSocket = createMockSocket('user-1', 'socket-1');
      
      // First connect
      gateway.handleConnection(mockSocket);
      
      // Then disconnect
      gateway.handleDisconnect(mockSocket);
      
      // Verify the user was removed
      // @ts-ignore - Access private property for testing
      const userSockets = gateway.userSockets.get('user-1');
      // @ts-ignore - Access private property for testing
      const socketUser = gateway.socketToUser.get('socket-1');
      
      expect(userSockets?.has('socket-1')).toBe(false);
      expect(socketUser).toBeUndefined();
    });
  });

  describe('handleJoinRoom', () => {
    it('should add user to room and notify others', async () => {
      const mockSocket = createMockSocket('user-1', 'socket-1');
      const roomId = 'test-room';
      
      // First connect
      gateway.handleConnection(mockSocket);
      
      // Join room
      await gateway.handleJoinRoom(mockSocket, { roomId });
      
      // Verify room joining
      expect(mockSocket.join).toHaveBeenCalledWith(roomId);
      
      // @ts-ignore - Access private property for testing
      const userRooms = gateway.userRooms.get('user-1');
      // @ts-ignore - Access private property for testing
      const roomUsers = gateway.roomUsers.get(roomId);
      
      expect(userRooms?.has(roomId)).toBe(true);
      expect(roomUsers?.has('user-1')).toBe(true);
      
      // Verify notifications
      expect(mockSocket.emit).toHaveBeenCalledWith('room_joined', expect.any(Object));
      expect(io.to).toHaveBeenCalledWith(roomId);
    });
  });

  describe('handleLeaveRoom', () => {
    it('should remove user from room and notify others', async () => {
      const mockSocket = createMockSocket('user-1', 'socket-1');
      const roomId = 'test-room';
      
      // Connect and join room first
      gateway.handleConnection(mockSocket);
      await gateway.handleJoinRoom(mockSocket, { roomId });
      
      // Reset mocks after join
      jest.clearAllMocks();
      
      // Leave room
      await gateway.handleLeaveRoom(mockSocket, { roomId });
      
      // Verify room leaving
      expect(mockSocket.leave).toHaveBeenCalledWith(roomId);
      
      // @ts-ignore - Access private property for testing
      const userRooms = gateway.userRooms.get('user-1');
      // @ts-ignore - Access private property for testing
      const roomUsers = gateway.roomUsers.get(roomId);
      
      expect(userRooms?.has(roomId)).toBe(false);
      expect(roomUsers?.has('user-1')).toBe(false);
      
      // Verify notifications
      expect(io.to).toHaveBeenCalledWith(roomId);
    });
  });
});
