import { ChatGateway } from '../src/modules/chat/chat.gateway';
import { presenceServiceMock } from './utils/presence-mock';
import { MockIoServer } from './__mocks__/socket-io';
import { attachMockServer } from './utils/gateway';

// Mock dependencies
const mockRtcGateway = {
  registerWsServer: jest.fn(),
};



describe('ChatGateway (Unit)', () => {
  let gateway: ChatGateway;
  let mockServer: any;

  beforeEach(() => {
    // Create a new instance of the gateway with mocked dependencies
    gateway = new ChatGateway(presenceServiceMock, mockRtcGateway);

    // Create a mock WebSocket server
    mockServer = new MockIoServer();

    // Only define the property if it hasn't been defined yet
    if (!Object.getOwnPropertyDescriptor(gateway, 'server')) {
      Object.defineProperty(gateway, 'server', { get: () => mockServer });
    }
    // Initialize required maps (use type assertion if needed)
    (gateway as any).userSockets = new Map();
    (gateway as any).socketToUser = new Map();
    // Ensure mocks are Jest mocks
    mockServer.emit = jest.fn();
    mockServer.to = jest.fn().mockReturnThis();
    presenceServiceMock.updateUserPresence = jest.fn();
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
      
      expect(result).toBeUndefined();
      
      expect(mockServer.to).toHaveBeenCalledWith('room:test-room');
      expect(mockServer.emit).toHaveBeenCalledWith('message', expect.any(Object));
    });
  });
});
