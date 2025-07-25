import { Test, TestingModule } from '@nestjs/testing';
import { RtcGateway } from '../../src/modules/rtc/rtc.gateway';
import { JwtWsAuthGuard } from '../../src/modules/auth/guards/jwt-ws-auth.guard';
import { WsException } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsThrottlerGuard } from '../../src/common/guards/ws-throttler.guard';
import { 
  ClientEvents, 
  ServerEvents, 
  UserInfo,
  TrackUpdate
} from '../../src/modules/rtc/types/websocket.types';
import { 
  AuthenticatedSocket,
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents
} from '../../src/modules/rtc/types/socket-events.types';
import { attachMockServer } from '../utils/gateway';

describe('RtcGateway', () => {
  let gateway: RtcGateway;
  
  // Mock user data
  const mockUser: UserInfo = {
    userId: 'test-user-1',
    email: 'test@example.com',
    name: 'Test User',
    isOnline: true,
  };
  
  // Helper to set up authenticated client
  const setupAuthenticatedClient = (client: AuthenticatedSocket) => {
    // Set up the user in the gateway's tracking maps
    gateway['socketToUser'].set(client.id, mockUser.userId);
    
    if (!gateway['userSockets'].has(mockUser.userId)) {
      gateway['userSockets'].set(mockUser.userId, new Set());
    }
    gateway['userSockets'].get(mockUser.userId)?.add(client.id);
    
    // Set up mock client data
    client.handshake.user = mockUser;
    client.data = {
      userId: mockUser.userId,
      user: mockUser,
    };
    
    return client;
  };

  // Create a properly typed mock client
  const createMockClient = (user: UserInfo): AuthenticatedSocket => {
    const client = {
      id: 'test-client-id',
      handshake: {
        user,
        headers: {},
        time: new Date().toISOString(),
        address: '127.0.0.1',
        xdomain: false,
        secure: false,
        issued: Date.now(),
        url: '/',
        query: {},
        auth: {}
      },
      data: {
        userId: user.userId,
        user,
      },
      join: jest.fn().mockImplementation(() => Promise.resolve()),
      leave: jest.fn().mockImplementation(() => Promise.resolve()),
      to: jest.fn().mockReturnThis(),
      emit: jest.fn().mockReturnValue(true),
      on: jest.fn(),
      off: jest.fn(),
      connected: true,
      disconnected: false,
      disconnect: jest.fn(),
      broadcast: {
        to: jest.fn().mockReturnThis(),
        emit: jest.fn(),
      },
    } as unknown as AuthenticatedSocket;

    return client;
  };

  let mockClient: AuthenticatedSocket;

  // Mock server with proper typing
  const mockServer = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
    sockets: {
      sockets: new Map(),
    },
  } as unknown as Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, unknown>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RtcGateway,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'JWT_SECRET':
                  return 'test-secret';
                case 'JWT_EXPIRES_IN':
                  return '15m';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    })
      .overrideGuard(JwtWsAuthGuard)
      .useValue({
        canActivate: (context: unknown) => {
          const client = (context as any).switchToWs().getClient();
          client.handshake.user = mockUser;
          client.data = { user: mockUser, userId: mockUser.userId };
          return true;
        },
      })
      .overrideGuard(WsThrottlerGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

    gateway = module.get<RtcGateway>(RtcGateway);
    attachMockServer(gateway, mockServer);
    
    // Create a fresh mock client for each test
    mockClient = createMockClient(mockUser);
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('handleConnection', () => {
    it('should store user information on connection', () => {
      // Set up the authenticated client
      const client = setupAuthenticatedClient(mockClient);
      
      // Trigger the connection handler
      gateway.handleConnection(client);
      
      // Verify the user is stored correctly
      expect(client.handshake.user).toBeDefined();
      expect(client.handshake.user.userId).toBe('test-user-1');
      
      // Verify the gateway tracks the user's socket
      const userSockets = gateway['userSockets'].get(mockUser.userId);
      expect(userSockets).toBeDefined();
      expect(userSockets?.has(client.id)).toBeTruthy();
      
      // Verify socketToUser mapping
      expect(gateway['socketToUser'].get(client.id)).toBe(mockUser.userId);
    });
  });

  describe('handleDisconnect', () => {
    it('should clean up user data on disconnect', () => {
      // The guard already sets up the user in the beforeEach hook
      
      // Simulate disconnection
      gateway.handleDisconnect(mockClient);
      
      // Verify cleanup
      expect(gateway['socketToUser'].has(mockClient.id)).toBeFalsy();
      
      // Verify user's socket is removed
      const userSockets = gateway['userSockets'].get(mockUser.userId);
      expect(userSockets?.has(mockClient.id)).toBeFalsy();
    });
  });

  describe('handleJoinRoom', () => {
    it('should allow user to join a room', async () => {
      // Set up the authenticated client
      const client = setupAuthenticatedClient(mockClient);
      const roomId = 'test-room';
      
      // Join the room
      await gateway.handleJoinRoom(client, { roomId });
      
      expect(mockClient.join).toHaveBeenCalledWith(roomId);
      expect(mockClient.emit).toHaveBeenCalledWith(
        ServerEvents.ROOM_JOINED,
        expect.objectContaining({
          room: expect.objectContaining({
            id: roomId,
          }),
          participants: expect.any(Array)
        })
      );
      
      // Verify the user is tracked in the room
      const roomUsers = gateway['roomUsers'].get(roomId);
      expect(roomUsers).toBeDefined();
      expect(roomUsers?.has(mockUser.userId)).toBeTruthy();
    });

    it('should throw error for invalid room ID', async () => {
      await expect(gateway.handleJoinRoom(mockClient, { roomId: '' }))
        .rejects
        .toThrow(WsException);
    });
  });

  describe('handleLeaveRoom', () => {
    it('should allow user to leave a room', async () => {
      // Set up the authenticated client
      const client = setupAuthenticatedClient(mockClient);
      const roomId = 'test-room';
      
      // First join the room
      await gateway.handleJoinRoom(client, { roomId });
      jest.clearAllMocks();
      
      // Then leave it
      await gateway.handleLeaveRoom(client, { roomId });
      
      expect(mockClient.leave).toHaveBeenCalledWith(roomId);
      
      // Verify the user is no longer in the room
      const roomUsers = gateway['roomUsers'].get(roomId);
      expect(roomUsers?.has(mockUser.userId)).toBeFalsy();
      
      // Verify user's room tracking is updated
      const userRooms = gateway['userRooms'].get(mockUser.userId);
      expect(userRooms?.has(roomId)).toBeFalsy();
    });
  });

  describe('handleTrackUpdate', () => {
    it('should broadcast track updates to room', async () => {
      // Set up the authenticated client
      const client = setupAuthenticatedClient(mockClient);
      const roomId = 'test-room';
      const update: TrackUpdate = {
        roomId,
        trackId: 'track-1',
        type: 'audio',
        action: 'update',
        data: { position: 0, isPlaying: true },
        version: 1
      } as TrackUpdate;
      
      // Join the room first
      await gateway.handleJoinRoom(client, { roomId });
      jest.clearAllMocks();
      
      await gateway.handleTrackUpdate(client, update);
      
      // Verify the update was broadcast to the room (excluding the sender)
      expect(mockClient.to).toHaveBeenCalledWith(roomId);
      expect(mockClient.emit).toHaveBeenCalledWith(
        ServerEvents.TRACK_UPDATE,
        expect.objectContaining({
          ...update,
          userId: mockUser.userId,
          timestamp: expect.any(Number)
        })
      );
    });
    
    it('should throw error for invalid room ID', async () => {
      // Set up the authenticated client
      const client = setupAuthenticatedClient(mockClient);
      const update: TrackUpdate = {
        roomId: '',
        trackId: 'track-1',
        type: 'audio',
        action: 'update',
        data: {},
        version: 1
      } as TrackUpdate;
      
      await expect(gateway.handleTrackUpdate(client, update))
        .rejects
        .toThrow(WsException);
    });
  });
});
