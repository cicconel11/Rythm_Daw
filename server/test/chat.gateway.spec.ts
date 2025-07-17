import { ChatGateway } from '../src/modules/chat/chat.gateway';
import { presenceServiceMock } from './utils/presence-mock';
import { createMockSocket, createMockServer } from '../test/__mocks__/socket.io';

// Mock dependencies
const mockRtcGateway = {
  registerWsServer: jest.fn(),
};

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let mockServer: any;
  let mockSocket: any;

  beforeEach(() => {
    // Create a new instance of the gateway with mocked dependencies
    gateway = new ChatGateway(
      presenceServiceMock as any,
      mockRtcGateway as any,
    );

    // Create a mock server and socket
    mockServer = createMockServer();
    mockSocket = createMockSocket('test-socket-id');
    mockSocket.data = {
      user: {
        userId: 'test-user',
        email: 'test@example.com'
      }
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
      // Mock the presence service methods
      presenceServiceMock.updateUserPresence.mockResolvedValue(undefined);
      presenceServiceMock.isOnline.mockReturnValue(true);

      await gateway.handleConnection(mockSocket);
      
      expect(presenceServiceMock.updateUserPresence).toHaveBeenCalledWith('test-user');
      expect(mockServer.emit).toHaveBeenCalledWith('userOnline', { userId: 'test-user' });
    });
  });

  describe('handleDisconnect', () => {
    it('should notify when a user disconnects', async () => {
      // Mock the presence service methods
      presenceServiceMock.removeUserPresence.mockResolvedValue(undefined);
      
      await gateway.handleDisconnect(mockSocket);
      
      expect(mockServer.emit).toHaveBeenCalledWith('userOffline', { userId: 'test-user' });
    });
  });

  describe('handleMessage', () => {
    it('should broadcast message to room', async () => {
      const messageData = {
        to: 'room:test-room',
        content: 'Hello, world!',
      };

      const result = await gateway.handleMessage(mockSocket, messageData);
      
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
      const typingData = {
        to: 'room:test-room',
        isTyping: true,
      };

      gateway.handleTyping(mockSocket, typingData);
      
      expect(mockServer.to).toHaveBeenCalledWith('room:test-room');
      expect(mockServer.emit).toHaveBeenCalledWith('typing', {
        from: 'test-user',
        isTyping: true,
      });
    });
  });
});
