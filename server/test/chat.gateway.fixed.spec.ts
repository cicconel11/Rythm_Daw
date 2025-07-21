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
  
  beforeEach(() => {
    // Create a new instance of the gateway with mocked dependencies
    gateway = new ChatGateway(
      mockPresenceService,
      mockRtcGateway
    );
    
    // Mock the WebSocket server
    attachMockServer(gateway, {
      emit: jest.fn(),
      to: jest.fn().mockReturnThis(),
    });
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
      } as any;

      gateway.handleConnection(client);

      expect(mockPresenceService.updateUserPresence).toHaveBeenCalledWith('test-user-id');
      expect(gateway['server'].emit).toHaveBeenCalledWith('userOnline', { userId: 'test-user-id' });
    });
  });

  describe('handleDisconnect', () => {
    it('should notify when a user disconnects', () => {
      const client = {
        id: 'test-client-id',
        data: { user: { userId: 'test-user-id' } },
        rooms: new Set(['room1', 'room2']),
      } as any;

      gateway.handleDisconnect(client);

      expect(gateway['server'].emit).toHaveBeenCalledWith('userOffline', { userId: 'test-user-id' });
    });
  });

  describe('handleMessage', () => {
    it('should broadcast message to room', () => {
      const client = {
        id: 'test-client-id',
        data: { user: { userId: 'test-user-id', username: 'test-user' } },
        join: jest.fn(),
      } as any;

      const message = {
        to: 'test-room',
        content: 'Hello, world!',
      };

      gateway.handleMessage(client, message);

      expect(gateway['server'].to).toHaveBeenCalledWith('test-room');
      expect(gateway['server'].emit).toHaveBeenCalledWith('message', {
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
      } as any;

      const typingData = {
        to: 'test-room',
        isTyping: true,
      };

      gateway.handleTyping(client, typingData);

      expect(gateway['server'].to).toHaveBeenCalledWith('test-room');
      expect(gateway['server'].emit).toHaveBeenCalledWith('typing', {
        from: 'test-user-id',
        isTyping: true,
      });
    });
  });
});
