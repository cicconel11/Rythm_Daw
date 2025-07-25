import { Server, Socket } from 'socket.io';
import { ChatGateway } from '../src/modules/chat/chat.gateway';
import { PresenceService } from '../src/modules/presence/presence.service';
import { RtcGateway } from '../src/modules/rtc/rtc.gateway';
import { attachMockServer } from './utils/gateway';

// Mock the dependencies
const mockPresenceService: jest.Mocked<PresenceService> = {
  updateUserPresence: jest.fn(),
  removeUserPresence: jest.fn(),
  isOnline: jest.fn(() => true),
} as any;

const mockRtcGateway: jest.Mocked<RtcGateway> = {
  registerWsServer: jest.fn(),
} as any;

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let mockServer: unknown;
  
  beforeEach(() => {
    mockServer = {
      emit : jest.fn(),
      to   : jest.fn().mockReturnThis(),
      sockets: { sockets: new Map() },
    };
    gateway = new ChatGateway(mockPresenceService, mockRtcGateway);
    Object.defineProperty(gateway, 'server', { get: () => mockServer });
    (gateway as any).userSockets  = new Map();
    (gateway as any).socketToUser = new Map();
    mockPresenceService.updateUserPresence = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should update user presence when a user connects', () => {
      const client = {
        id: 'test-client-id',
        data: { user: { userId: 'test-user-id' } },
        join: jest.fn(),
      } as unknown as Socket;

      gateway.handleConnection(client);

      expect(mockPresenceService.updateUserPresence).toHaveBeenCalledWith('test-user-id');
      expect((mockServer as any).emit).toHaveBeenCalledWith('userOnline', { userId: 'test-user-id' });
    });
  });

  describe('handleDisconnect', () => {
    it('should notify when a user disconnects', () => {
      const client = {
        id: 'test-client-id',
        data: { user: { userId: 'test-user-id' } },
        rooms: new Set(['room1', 'room2']),
      } as unknown as Socket;

      gateway.handleDisconnect(client);

      expect((mockServer as any).emit).toHaveBeenCalledWith('userOffline', { userId: 'test-user-id' });
    });
  });

  describe('handleMessage', () => {
    it('should broadcast message to room', () => {
      const client = {
        id: 'test-client-id',
        data: { user: { userId: 'test-user-id', username: 'test-user' } },
        join: jest.fn(),
      } as unknown as Socket;

      const message = {
        to: 'test-room',
        content: 'Hello, world!',
      };

      gateway.handleMessage(client, message);

      expect((mockServer as any).to).toHaveBeenCalledWith('test-room');
      expect((mockServer as any).emit).toHaveBeenCalledWith('message', {
        from: 'test-user-id',
        to: 'test-room',
        content: 'Hello, world!',
        timestamp: expect.any(String),
      });
    });
  });

  describe('handleTyping', () => {
    it('should broadcast typing status', () => {
      const client = {
        id: 'test-client-id',
        data: { user: { userId: 'test-user-id', username: 'test-user' } },
      } as unknown as Socket;

      const typingData = {
        to: 'test-room',
        isTyping: true,
      };

      gateway.handleTyping(client, typingData);

      expect((mockServer as any).to).toHaveBeenCalledWith('test-room');
      expect((mockServer as any).emit).toHaveBeenCalledWith('typing', {
        from: 'test-user-id',
        isTyping: true,
      });
    });
  });
});
