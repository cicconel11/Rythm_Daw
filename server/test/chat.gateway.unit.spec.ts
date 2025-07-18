import { ChatGateway } from '../src/modules/chat/chat.gateway';
import { presenceServiceMock } from './utils/presence-mock';

// Mock dependencies
const mockRtcGateway = {
  registerWsServer: jest.fn(),
};



describe('ChatGateway (Unit)', () => {
  let gateway: ChatGateway;
  let mockServer: any;

  beforeEach(() => {
    // Create a new instance of the gateway with mocked dependencies
    gateway = new ChatGateway(
      presenceServiceMock as any,
      mockRtcGateway as any,
    );

    // Create a mock WebSocket server
    mockServer = {
      emit: jest.fn(),
      to: jest.fn().mockReturnThis(),
    };

    // Assign the mock server to the gateway
    (gateway as any).server = mockServer;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should update user presence when a user connects', async () => {
      const mockSocket = {
        id: 'test-socket-id',
        data: {
          user: {
            userId: 'test-user',
          },
        },
        on: jest.fn(),
        once: jest.fn(),
        join: jest.fn(),
        leave: jest.fn(),
        emit: jest.fn(),
        to: jest.fn().mockReturnThis(),
        disconnect: jest.fn(),
        connected: true,
      };

      await gateway.handleConnection(mockSocket as any);
      
      expect(presenceServiceMock.updateUserPresence).toHaveBeenCalledWith('test-user');
      expect(mockServer.emit).toHaveBeenCalledWith('userOnline', { userId: 'test-user' });
    });
  });

  describe('handleDisconnect', () => {
    it('should notify when a user disconnects', async () => {
      const mockSocket = {
        id: 'test-socket-id',
        data: {
          user: {
            userId: 'test-user',
          },
        },
        on: jest.fn(),
        join: jest.fn(),
        leave: jest.fn(),
        emit: jest.fn(),
        to: jest.fn().mockReturnThis(),
        disconnect: jest.fn(),
        connected: false,
      };

      await gateway.handleDisconnect(mockSocket as any);
      expect(mockServer.emit).toHaveBeenCalledWith('userOffline', { userId: 'test-user' });
    });
  });

  describe('handleMessage', () => {
    it('should broadcast message to room', async () => {
      const mockSocket = {
        id: 'test-socket-id',
        data: {
          user: {
            userId: 'test-user',
          },
        },
        on: jest.fn(),
        once: jest.fn(),
        join: jest.fn(),
        leave: jest.fn(),
        emit: jest.fn(),
        to: jest.fn().mockReturnThis(),
        disconnect: jest.fn(),
        connected: true,
      };

      const messageData = {
        to: 'room:test-room',
        content: 'Hello, world!',
      };

      const result = await gateway.handleMessage(mockSocket as any, messageData);
      
      expect(result).toEqual(expect.objectContaining({
        from: 'test-user',
        to: 'room:test-room',
        content: 'Hello, world!',
        timestamp: expect.any(String),
      }));
      
      expect(mockServer.to).toHaveBeenCalledWith('room:test-room');
      expect(mockServer.emit).toHaveBeenCalledWith('message', expect.any(Object));
    });
  });

  describe('handleTyping', () => {
    it('should broadcast typing status', () => {
      const mockSocket = {
        id: 'test-socket-id',
        data: {
          user: {
            userId: 'test-user',
          },
        },
        on: jest.fn(),
        once: jest.fn(),
        join: jest.fn(),
        leave: jest.fn(),
        emit: jest.fn(),
        to: jest.fn().mockReturnThis(),
        disconnect: jest.fn(),
        connected: true,
      };

      const typingData = {
        to: 'room:test-room',
        isTyping: true,
      };

      gateway.handleTyping(mockSocket as any, typingData);
      
      expect(mockServer.to).toHaveBeenCalledWith('room:test-room');
      expect(mockServer.emit).toHaveBeenCalledWith('typing', {
        from: 'test-user',
        isTyping: true,
      });
    });
  });
});
