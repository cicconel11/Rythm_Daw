import { Test, TestingModule } from '@nestjs/testing';
import { RtcGateway } from '../src/modules/rtc/rtc.gateway';
import { UserInfo } from '../src/modules/rtc/types/websocket.types';
import { AuthenticatedSocket } from '../src/modules/rtc/types/socket-events.types';
import { Server, Socket } from 'socket.io';
import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { JwtService } from '@nestjs/jwt';

// Mock socket implementation that matches AuthenticatedSocket
type MockSocket = AuthenticatedSocket & {
  join: jest.Mock;
  leave: jest.Mock;
  emit: jest.Mock;
  to: jest.Mock;
  disconnect: jest.Mock;
  on: jest.Mock;
  removeAllListeners: jest.Mock;
  connected: boolean;
  disconnected: boolean;
  rooms: Set<string>;
  nsp: any;
  client: any;
  data: any;
  handshake: {
    user: UserInfo;
    headers: Record<string, string>;
    query: Record<string, any>;
    time: string;
    address: string;
    xdomain: boolean;
    secure: boolean;
    issued: number;
    url: string;
    auth: Record<string, any>;
  };
};

// Mock JWT service
const mockJwtService = {
  verify: jest.fn(),
  sign: jest.fn(),
};

// Mock ThrottlerStorage
const mockThrottlerStorage = {
  getRecord: jest.fn().mockResolvedValue({ totalHits: 0, timeToExpire: 0 }),
  addRecord: jest.fn().mockResolvedValue(undefined),
};

// Mock ThrottlerModule options
const mockThrottlerOptions = {
  limit: 10,
  ttl: 60,
};

// Mock JWT guard
jest.mock('../src/auth/guards/jwt-ws-auth.guard', () => ({
  JwtWsAuthGuard: jest.fn().mockImplementation(() => ({
    canActivate: (context: any) => {
      const client = context.switchToWs().getClient();
      // If no user in handshake, simulate auth failure
      if (!client.handshake?.user) {
        return false;
      }
      return true;
    },
  })),
}));

// Mock WsThrottlerGuard
jest.mock('../src/common/guards/ws-throttler.guard', () => ({
  WsThrottlerGuard: jest.fn().mockImplementation(() => ({
    canActivate: () => true,
  })),
}));

// Mock user data
const mockUser: UserInfo = {
  userId: 'test-user-1',
  email: 'test@example.com',
  name: 'Test User',
};

describe('RtcGateway', () => {
  let gateway: RtcGateway;
  let app: INestApplication;
  let io: Server;
  
  // Test constants
  const TEST_ROOM_ID = 'test-room-1';
  const TEST_USER_ID = 'test-user-1';
  const TEST_SOCKET_ID = 'test-socket-1';
  
  // Create a properly typed mock socket
  const createMockSocket = (userId: string, socketId: string = `socket-${Date.now()}`): MockSocket => {
    const mockSocket: any = {
      id: socketId,
      handshake: {
        user: { ...mockUser, userId },
        headers: {},
        query: {},
        time: new Date().toISOString(),
        address: '127.0.0.1',
        xdomain: false,
        secure: false,
        issued: Date.now(),
        url: '/',
        auth: {},
      },
      join: jest.fn().mockImplementation(function(this: any) { return this; }),
      leave: jest.fn().mockImplementation(function(this: any) { return this; }),
      emit: jest.fn().mockReturnThis(),
      to: jest.fn().mockReturnThis(),
      disconnect: jest.fn(),
      on: jest.fn(),
      removeAllListeners: jest.fn(),
      connected: true,
      disconnected: false,
      rooms: new Set(),
      nsp: {
        name: '/',
        adapter: {
          rooms: new Map(),
          sids: new Map(),
        },
      },
      client: {},
      data: {},
    };
    
    return mockSocket as MockSocket;
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RtcGateway,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: 'THROTTLER:MODULE_OPTIONS',
          useValue: mockThrottlerOptions,
        },
        {
          provide: 'ThrottlerStorage',
          useValue: mockThrottlerStorage,
        },
        {
          provide: 'Reflector',
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard('WsThrottlerGuard')
      .useValue({ canActivate: () => true })
      .compile();

    app = module.createNestApplication();
    app.useWebSocketAdapter(new IoAdapter(app));
    
    await app.init();
    
    // Create socket.io server
    const httpServer = app.getHttpServer();
    io = new Server(httpServer);
    
    gateway = module.get<RtcGateway>(RtcGateway);
    // @ts-ignore - Access private property for testing
    gateway.server = io;
    
    // Mock JWT verification
    mockJwtService.verify.mockImplementation((token) => {
      if (token === 'valid-token') {
        return { sub: 'test-user-1', email: 'test@example.com' };
      }
      throw new Error('Invalid token');
    });
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleConnection', () => {
    it('should add user to connected clients', () => {
      const mockSocket = createMockSocket(TEST_USER_ID, TEST_SOCKET_ID);
      
      // Call the method
      gateway.handleConnection(mockSocket);
      
      // Verify the user was added
      // @ts-ignore - Access private property for testing
      const userSockets = gateway.userSockets.get(TEST_USER_ID);
      // @ts-ignore - Access private property for testing
      const socketUser = gateway.socketToUser.get(TEST_SOCKET_ID);
      
      expect(userSockets).toBeDefined();
      expect(userSockets?.has(TEST_SOCKET_ID)).toBe(true);
      expect(socketUser).toBe(TEST_USER_ID);
      
      // Verify event listeners were set up
      expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('error', expect.any(Function));
      
      // Verify user info is correctly set in handshake
      expect(mockSocket.handshake.user).toBeDefined();
      expect(mockSocket.handshake.user.userId).toBe(TEST_USER_ID);
    });

    it('should handle connection error when user is not authenticated', () => {
      const mockSocket = createMockSocket(TEST_USER_ID, TEST_SOCKET_ID);
      // @ts-ignore - Testing error case
      mockSocket.handshake.user = undefined;
      
      // Call the method
      gateway.handleConnection(mockSocket);
      
      // Verify error handling
      expect(mockSocket.disconnect).toHaveBeenCalled();
      
      // Verify no user was added to tracking
      // @ts-ignore - Access private property for testing
      const userSockets = gateway.userSockets.get(TEST_USER_ID);
      // @ts-ignore - Access private property for testing
      const socketUser = gateway.socketToUser.get(TEST_SOCKET_ID);
      
      expect(userSockets).toBeUndefined();
      expect(socketUser).toBeUndefined();
    });
    
    it('should handle multiple connections from same user', () => {
      const socket1 = createMockSocket(TEST_USER_ID, 'socket-1');
      const socket2 = createMockSocket(TEST_USER_ID, 'socket-2');
      
      // Connect first socket
      gateway.handleConnection(socket1);
      
      // Connect second socket from same user
      gateway.handleConnection(socket2);
      
      // Verify both sockets are tracked for the user
      // @ts-ignore - Access private property for testing
      const userSockets = gateway.userSockets.get(TEST_USER_ID);
      expect(userSockets?.size).toBe(2);
      expect(userSockets?.has('socket-1')).toBe(true);
      expect(userSockets?.has('socket-2')).toBe(true);
      
      // Verify socket to user mapping is correct
      // @ts-ignore - Access private property for testing
      expect(gateway.socketToUser.get('socket-1')).toBe(TEST_USER_ID);
      // @ts-ignore - Access private property for testing
      expect(gateway.socketToUser.get('socket-2')).toBe(TEST_USER_ID);
    });
  });

  describe('handleDisconnect', () => {
    it('should remove user from connected clients', () => {
      const mockSocket = createMockSocket(TEST_USER_ID, TEST_SOCKET_ID);
      
      // First connect
      gateway.handleConnection(mockSocket);
      
      // Verify user was added
      // @ts-ignore - Access private property for testing
      expect(gateway.userSockets.get(TEST_USER_ID)?.has(TEST_SOCKET_ID)).toBe(true);
      
      // Then disconnect
      gateway.handleDisconnect(mockSocket);
      
      // Verify the user was removed
      // @ts-ignore - Access private property for testing
      const userSockets = gateway.userSockets.get(TEST_USER_ID);
      // @ts-ignore - Access private property for testing
      const socketUser = gateway.socketToUser.get(TEST_SOCKET_ID);
      
      expect(userSockets?.has(TEST_SOCKET_ID)).toBe(false);
      expect(socketUser).toBeUndefined();
      
      // Verify the user's socket set was cleaned up if empty
      // @ts-ignore - Access private property for testing
      expect(gateway.userSockets.has(TEST_USER_ID)).toBe(false);
    });
    
    it('should clean up room assignments on disconnect', async () => {
      const mockSocket = createMockSocket(TEST_USER_ID, TEST_SOCKET_ID);
      
      // Connect and join a room
      gateway.handleConnection(mockSocket);
      await gateway.handleJoinRoom(mockSocket, { roomId: TEST_ROOM_ID });
      
      // Verify room assignment
      // @ts-ignore - Access private property for testing
      expect(gateway.userRooms.get(TEST_USER_ID)?.has(TEST_ROOM_ID)).toBe(true);
      // @ts-ignore - Access private property for testing
      expect(gateway.roomUsers.get(TEST_ROOM_ID)?.has(TEST_USER_ID)).toBe(true);
      
      // Disconnect
      gateway.handleDisconnect(mockSocket);
      
      // Verify room cleanup
      // @ts-ignore - Access private property for testing
      const userRooms = gateway.userRooms.get(TEST_USER_ID);
      // @ts-ignore - Access private property for testing
      const roomUsers = gateway.roomUsers.get(TEST_ROOM_ID);
      
      // User should be removed from all rooms
      expect(userRooms).toBeUndefined();
      
      // Room should be cleaned up if empty or user should be removed from it
      if (roomUsers) {
        expect(roomUsers.has(TEST_USER_ID)).toBe(false);
      }
    });
    
    it('should handle disconnect when user has multiple sockets', () => {
      // Create two sockets for the same user
      const socket1 = createMockSocket(TEST_USER_ID, 'socket-1');
      const socket2 = createMockSocket(TEST_USER_ID, 'socket-2');
      
      // Connect both sockets
      gateway.handleConnection(socket1);
      gateway.handleConnection(socket2);
      
      // Disconnect first socket
      gateway.handleDisconnect(socket1);
      
      // Verify first socket was removed but user still exists with second socket
      // @ts-ignore - Access private property for testing
      const userSockets = gateway.userSockets.get(TEST_USER_ID);
      // @ts-ignore - Access private property for testing
      const socket1User = gateway.socketToUser.get('socket-1');
      // @ts-ignore - Access private property for testing
      const socket2User = gateway.socketToUser.get('socket-2');
      
      expect(userSockets?.has('socket-1')).toBe(false);
      expect(userSockets?.has('socket-2')).toBe(true);
      expect(socket1User).toBeUndefined();
      expect(socket2User).toBe(TEST_USER_ID);
      
      // Disconnect second socket
      gateway.handleDisconnect(socket2);
      
      // Verify all user data is cleaned up
      // @ts-ignore - Access private property for testing
      expect(gateway.userSockets.has(TEST_USER_ID)).toBe(false);
      // @ts-ignore - Access private property for testing
      expect(gateway.socketToUser.has('socket-2')).toBe(false);
    });
  });

  describe('handleJoinRoom', () => {
    it('should add user to room and notify others', async () => {
      const mockSocket = createMockSocket(TEST_USER_ID, TEST_SOCKET_ID);
      
      // First connect
      gateway.handleConnection(mockSocket);
      
      // Join room
      await gateway.handleJoinRoom(mockSocket, { roomId: TEST_ROOM_ID });
      
      // Verify room joining
      expect(mockSocket.join).toHaveBeenCalledWith(TEST_ROOM_ID);
      
      // Verify room tracking
      // @ts-ignore - Access private property for testing
      const userRooms = gateway.userRooms.get(TEST_USER_ID);
      // @ts-ignore - Access private property for testing
      const roomUsers = gateway.roomUsers.get(TEST_ROOM_ID);
      
      expect(userRooms?.has(TEST_ROOM_ID)).toBe(true);
      expect(roomUsers?.has(TEST_USER_ID)).toBe(true);
      
      // Verify notifications
      expect(mockSocket.emit).toHaveBeenCalledWith(
        'room_joined', 
        expect.objectContaining({ roomId: TEST_ROOM_ID })
      );
      
      // Verify other users in the room were notified
      expect(io.to).toHaveBeenCalledWith(TEST_ROOM_ID);
      expect(io.to(TEST_ROOM_ID).emit).toHaveBeenCalledWith(
        'user_joined', 
        expect.objectContaining({ 
          userId: TEST_USER_ID,
          roomId: TEST_ROOM_ID
        })
      );
    });
    
    it('should handle join room error when not connected', async () => {
      const mockSocket = createMockSocket(TEST_USER_ID, TEST_SOCKET_ID);
      
      // Don't call handleConnection first
      await expect(
        gateway.handleJoinRoom(mockSocket, { roomId: TEST_ROOM_ID })
      ).rejects.toThrow('User not authenticated');
      
      // Verify no room was joined
      expect(mockSocket.join).not.toHaveBeenCalled();
    });
    
    it('should handle join room error when roomId is missing', async () => {
      const mockSocket = createMockSocket(TEST_USER_ID, TEST_SOCKET_ID);
      
      // Connect first
      gateway.handleConnection(mockSocket);
      
      // Try to join without roomId
      // @ts-ignore - Testing invalid input
      await expect(gateway.handleJoinRoom(mockSocket, {})).rejects.toThrow('Room ID is required');
      
      // Verify no room was joined
      expect(mockSocket.join).not.toHaveBeenCalled();
    });
    
    it('should handle joining the same room multiple times', async () => {
      const mockSocket = createMockSocket(TEST_USER_ID, TEST_SOCKET_ID);
      
      // Connect first
      gateway.handleConnection(mockSocket);
      
      // Join room first time
      await gateway.handleJoinRoom(mockSocket, { roomId: TEST_ROOM_ID });
      
      // Reset mocks to track second join
      jest.clearAllMocks();
      
      // Join same room again
      await gateway.handleJoinRoom(mockSocket, { roomId: TEST_ROOM_ID });
      
      // Should still only be in the room once
      // @ts-ignore - Access private property for testing
      const userRooms = gateway.userRooms.get(TEST_USER_ID);
      // @ts-ignore - Access private property for testing
      const roomUsers = gateway.roomUsers.get(TEST_ROOM_ID);
      
      expect(userRooms?.size).toBe(1);
      expect(roomUsers?.size).toBe(1);
      
      // Should still emit events (depends on your requirements)
      expect(mockSocket.join).toHaveBeenCalledWith(TEST_ROOM_ID);
    });
  });

  describe('handleLeaveRoom', () => {
    it('should remove user from room and notify others', async () => {
      const mockSocket = createMockSocket(TEST_USER_ID, TEST_SOCKET_ID);
      
      // Connect and join room first
      gateway.handleConnection(mockSocket);
      await gateway.handleJoinRoom(mockSocket, { roomId: TEST_ROOM_ID });
      
      // Reset mocks after join
      jest.clearAllMocks();
      
      // Leave room
      await gateway.handleLeaveRoom(mockSocket, { roomId: TEST_ROOM_ID });
      
      // Verify room leaving
      expect(mockSocket.leave).toHaveBeenCalledWith(TEST_ROOM_ID);
      
      // Verify room tracking was updated
      // @ts-ignore - Access private property for testing
      const userRooms = gateway.userRooms.get(TEST_USER_ID);
      // @ts-ignore - Access private property for testing
      const roomUsers = gateway.roomUsers.get(TEST_ROOM_ID);
      
      // User should be removed from the room
      if (userRooms) {
        expect(userRooms.has(TEST_ROOM_ID)).toBe(false);
      }
      
      // Room should be cleaned up if empty
      if (roomUsers) {
        expect(roomUsers.has(TEST_USER_ID)).toBe(false);
      }
      
      // Verify notifications
      expect(io.to).toHaveBeenCalledWith(TEST_ROOM_ID);
      expect(io.to(TEST_ROOM_ID).emit).toHaveBeenCalledWith(
        'user_left',
        expect.objectContaining({
          userId: TEST_USER_ID,
          roomId: TEST_ROOM_ID
        })
      );
    });
    
    it('should handle leave room error when not connected', async () => {
      const mockSocket = createMockSocket(TEST_USER_ID, TEST_SOCKET_ID);
      
      // Don't call handleConnection first
      await expect(
        gateway.handleLeaveRoom(mockSocket, { roomId: TEST_ROOM_ID })
      ).rejects.toThrow('User not authenticated');
      
      // Verify no room was left
      expect(mockSocket.leave).not.toHaveBeenCalled();
    });
    
    it('should handle leave room error when roomId is missing', async () => {
      const mockSocket = createMockSocket(TEST_USER_ID, TEST_SOCKET_ID);
      
      // Connect first
      gateway.handleConnection(mockSocket);
      
      // Try to leave without roomId
      // @ts-ignore - Testing invalid input
      await expect(gateway.handleLeaveRoom(mockSocket, {})).rejects.toThrow('Room ID is required');
      
      // Verify no room was left
      expect(mockSocket.leave).not.toHaveBeenCalled();
    });
    
    it('should handle leaving a room not joined', async () => {
      const mockSocket = createMockSocket(TEST_USER_ID, TEST_SOCKET_ID);
      const nonExistentRoom = 'non-existent-room';
      
      // Connect but don't join any room
      gateway.handleConnection(mockSocket);
      
      // Try to leave a room that wasn't joined
      await gateway.handleLeaveRoom(mockSocket, { roomId: nonExistentRoom });
      
      // Should not throw, but also not call leave on socket
      expect(mockSocket.leave).not.toHaveBeenCalled();
    });
    
    it('should clean up empty rooms when last user leaves', async () => {
      const mockSocket1 = createMockSocket('user-1', 'socket-1');
      const mockSocket2 = createMockSocket('user-2', 'socket-2');
      
      // Connect both users
      gateway.handleConnection(mockSocket1);
      gateway.handleConnection(mockSocket2);
      
      // Both join the same room
      await gateway.handleJoinRoom(mockSocket1, { roomId: TEST_ROOM_ID });
      await gateway.handleJoinRoom(mockSocket2, { roomId: TEST_ROOM_ID });
      
      // First user leaves
      await gateway.handleLeaveRoom(mockSocket1, { roomId: TEST_ROOM_ID });
      
      // Room should still exist with second user
      // @ts-ignore - Access private property for testing
      expect(gateway.roomUsers.has(TEST_ROOM_ID)).toBe(true);
      
      // Second user leaves
      await gateway.handleLeaveRoom(mockSocket2, { roomId: TEST_ROOM_ID });
      
      // Room should be cleaned up
      // @ts-ignore - Access private property for testing
      expect(gateway.roomUsers.has(TEST_ROOM_ID)).toBe(false);
    });
  });
});
