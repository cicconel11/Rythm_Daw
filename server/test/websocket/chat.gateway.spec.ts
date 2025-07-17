import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { WebSocketServer } from 'ws';
import { ChatGateway } from '../../src/modules/websocket/chat.gateway';
import { AuthService } from '../../src/modules/auth/auth.service';
import { PresenceService } from '../../src/modules/presence/presence.service';
import { ConfigService } from '@nestjs/config';

// Mock WebSocket server and client
class MockWebSocket {
  id: string;
  userId?: string;
  projectId?: string;
  isAlive: boolean;
  readyState: number;
  send = jest.fn().mockImplementation((data, cb) => {
    if (typeof cb === 'function') cb();
    return Promise.resolve();
  });
  ping = jest.fn();
  terminate = jest.fn();
  close = jest.fn();
  
  constructor(id: string) {
    this.id = id;
    this.isAlive = true;
    this.readyState = 1; // OPEN
  }
}

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let mockServer: any;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockPresenceService: jest.Mocked<PresenceService>;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(async () => {
    // Create mock services
    mockAuthService = {
      verifyToken: jest.fn(),
    } as any;

    mockPresenceService = {
      updateUserPresence: jest.fn().mockResolvedValue(undefined),
      isOnline: jest.fn().mockReturnValue(true),
      removeUserPresence: jest.fn().mockResolvedValue(undefined),
    } as any;

    mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'WS_RATE_LIMIT') return 100;
        if (key === 'WS_RATE_DURATION') return 60;
        return null;
      }),
    } as any;

    // Mock logger
    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        { provide: AuthService, useValue: mockAuthService },
        { provide: PresenceService, useValue: mockPresenceService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    
    // Create a mock WebSocket server
    mockServer = {
      clients: new Set(),
      on: jest.fn((event, callback) => {
        if (event === 'connection') {
          mockServer.connectionCallback = callback;
        }
      }),
      close: jest.fn(),
    };
    
    // Set the server instance
    (gateway as any).server = mockServer;
    
    // No need to call afterInit() as it's not part of the WebSocketGateway lifecycle
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should accept connection with valid token', async () => {
      const mockClient = new MockWebSocket('test-client-1') as any;
      const mockRequest = {
        url: '/ws/chat?token=valid-token',
        headers: {},
      };
      
      // Mock token verification with required 'sub' field
      mockAuthService.verifyToken.mockResolvedValue({
        sub: 'user-123',
        userId: 'user-123',
        email: 'test@example.com',
      });
      
      // Simulate connection
      await (gateway as any).handleConnection(mockClient, mockRequest);
      
      expect(mockClient.userId).toBe('user-123');
      expect(mockPresenceService.updateUserPresence).toHaveBeenCalledWith(
        'user-123',
        true
      );
      expect(mockLogger.log).toHaveBeenCalledWith(
        'Client connected: test-client-1 (user-123)'
      );
    });

    it('should reject connection with invalid token', async () => {
      const mockClient = new MockWebSocket('test-client-2') as any;
      const mockRequest = {
        url: '/ws/chat?token=invalid-token',
        headers: {},
      };
      
      // Mock token verification to throw
      mockAuthService.verifyToken.mockRejectedValue(new Error('Invalid token'));
      
      // Simulate connection
      await (gateway as any).handleConnection(mockClient, mockRequest);
      
      expect(mockClient.terminate).toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Authentication failed for client test-client-2: Invalid token'
      );
    });
  });

  describe('handleDisconnect', () => {
    it('should clean up resources when client disconnects', async () => {
      const mockClient = new MockWebSocket('test-client-3') as any;
      mockClient.userId = 'user-123';
      
      // Add client to the connected clients
      (gateway as any).clients.set(mockClient, mockClient);
      
      // Simulate disconnection
      await gateway.handleDisconnect(mockClient);
      
      expect(mockPresenceService.removeUserPresence).toHaveBeenCalledWith('user-123');
      expect((gateway as any).clients.has(mockClient)).toBe(false);
      expect(mockLogger.log).toHaveBeenCalledWith(
        'Client disconnected: test-client-3 (user-123)'
      );
    });
  });

  describe('handleMessage', () => {
    it('should process valid message', async () => {
      const mockClient = new MockWebSocket('test-client-4') as any;
      mockClient.userId = 'user-123';
      mockClient.projectId = 'project-456';
      
      const testMessage = {
        type: 'chat',
        content: 'Hello, world!',
        timestamp: new Date().toISOString(),
      };
      
      // Mock the broadcast method
      const broadcastSpy = jest.spyOn(gateway as any, 'broadcastToRoom');
      
      // Simulate message
      await (gateway as any).handleMessage(mockClient, JSON.stringify(testMessage));
      
      expect(broadcastSpy).toHaveBeenCalledWith(
        'project-456',
        'message',
        expect.objectContaining({
          type: 'chat',
          content: 'Hello, world!',
          sender: 'user-123',
        })
      );
    });

    it('should handle invalid message format', async () => {
      const mockClient = new MockWebSocket('test-client-5') as any;
      mockClient.userId = 'user-123';
      
      // Simulate invalid message (not a string)
      await (gateway as any).handleMessage(mockClient, { invalid: 'message' });
      
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Error processing message from test-client-5: Message must be a string'
      );
    });
    
    it('should handle invalid JSON message', async () => {
      const mockClient = new MockWebSocket('test-client-6') as any;
      mockClient.userId = 'user-123';
      
      // Simulate invalid JSON
      await (gateway as any).handleMessage(mockClient, 'invalid-json');
      
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Error parsing message from test-client-6: Invalid JSON'
      );
    });
  });

  describe('heartbeat', () => {
    it('should terminate inactive connections', () => {
      jest.useFakeTimers();
      
      const activeClient = new MockWebSocket('active-client') as any;
      activeClient.userId = 'user-123';
      activeClient.isAlive = true;
      
      const inactiveClient = new MockWebSocket('inactive-client') as any;
      inactiveClient.userId = 'user-456';
      inactiveClient.isAlive = false;
      
      // Add clients
      (gateway as any).clients.set(activeClient, activeClient);
      (gateway as any).clients.set(inactiveClient, inactiveClient);
      
      // Trigger heartbeat
      jest.advanceTimersByTime(30000);
      
      expect(activeClient.terminate).not.toHaveBeenCalled();
      expect(inactiveClient.terminate).toHaveBeenCalled();
      
      // Clean up
      jest.useRealTimers();
    });
  });
});
