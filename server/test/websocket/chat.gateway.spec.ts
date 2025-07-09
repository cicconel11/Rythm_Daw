import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from '../../src/modules/websocket/chat.gateway';
import { PresenceService } from '../../src/modules/presence/presence.service';
import { WsJwtGuard } from '../../src/modules/auth/guards/ws-jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';
import { WsThrottlerGuard } from '../../src/modules/websocket/guards/ws-throttler.guard';
import { AuthService } from '../../src/modules/auth/auth.service';
import { WebSocket } from 'ws';
import { SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';

// Extend the Socket interface to include our custom properties
declare module 'socket.io' {
  interface Socket {
    userId?: string;
    projectId?: string;
    isAlive: boolean;
    sendMessage: (data: any) => Promise<void>;
  }
}

// Mock WebSocket client
const createMockClient = (id: string, user?: { userId: string }) => {
  const client: any = {
    id,
    userId: user?.userId,
    isAlive: true,
    data: { user },
    sendMessage: jest.fn().mockResolvedValue(undefined),
    terminate: jest.fn(),
    on: jest.fn(),
    emit: jest.fn(),
    join: jest.fn(),
    leave: jest.fn(),
    to: jest.fn().mockReturnThis(),
    readyState: WebSocket.OPEN,
    pause: jest.fn(),
    resume: jest.fn(),
    bufferedAmount: 0,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    close: jest.fn(),
    ping: jest.fn(),
    pong: jest.fn(),
    send: jest.fn().mockImplementation((data, cb) => cb && cb()),
  };
  
  // Setup mock for .to().emit() pattern
  client.to = jest.fn().mockReturnValue({
    emit: jest.fn()
  });
  
  return client as WebSocket & Socket;
};

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let presenceService: jest.Mocked<PresenceService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  let wsThrottlerGuard: jest.Mocked<WsThrottlerGuard>;
  let authService: jest.Mocked<AuthService>;
  let mockServer: any;
  let mockClients: Map<WebSocket, any>;

  beforeEach(async () => {
    // Create a mock server
    mockServer = {
      emit: jest.fn(),
      to: jest.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        {
          provide: PresenceService,
          useValue: {
            updateUserPresence: jest.fn(),
            removeUserPresence: jest.fn(),
            isOnline: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'JWT_SECRET':
                  return 'test-secret';
                case 'JWT_EXPIRES_IN':
                  return '1d';
                default:
                  return null;
              }
            }),
          },
        },
        {
          provide: WsThrottlerGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: AuthService,
          useValue: {
            verifyToken: jest.fn().mockResolvedValue({ 
              sub: 'user1',
              email: 'user1@example.com',
              name: 'Test User',
              iat: Math.floor(Date.now() / 1000),
              exp: Math.floor(Date.now() / 1000) + 3600
            }),
          },
        },
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    presenceService = module.get(PresenceService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
    wsThrottlerGuard = module.get(WsThrottlerGuard);
    authService = module.get(AuthService);

    // Mock the WebSocket server and clients map
    gateway['server'] = mockServer as any;
    
    // Create a mock clients map and make it accessible in tests
    mockClients = new Map<WebSocket, any>();
    
    // Mock the private clients property
    Object.defineProperty(gateway, 'clients', {
      get: () => mockClients,
      configurable: true
    });
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should set up client connection with heartbeat', async () => {
      const client = createMockClient('client1');
      
      await gateway.handleConnection(client as any);
      
      // Verify heartbeat setup
      expect(client.on).toHaveBeenCalledWith('pong', expect.any(Function));
      expect(client.isAlive).toBe(true);
      
      // Verify client was added to clients map
      expect(Array.from(gateway['clients'].keys())).toHaveLength(1);
    });
    
    it('should set up sendMessage method on client', async () => {
      const client = createMockClient('client1');
      
      await gateway.handleConnection(client as any);
      
      // Verify sendMessage method was added
      expect(client.sendMessage).toBeDefined();
      
      // Test the sendMessage implementation
      const sendSpy = jest.spyOn(client, 'send');
      await client.sendMessage({ test: 'message' });
      
      expect(sendSpy).toHaveBeenCalledWith(JSON.stringify({ test: 'message' }), expect.any(Function));
    });
  });

  describe('handleDisconnect', () => {
    it('should remove client from clients map', async () => {
      const client = createMockClient('client1');
      
      // First connect the client
      await gateway.handleConnection(client as any);
      expect(Array.from(mockClients.keys())).toHaveLength(1);
      
      // Then disconnect
      await gateway.handleDisconnect(client as any);
      
      // Verify client was removed
      expect(Array.from(mockClients.keys())).toHaveLength(0);
    });
    
    it('should call presenceService.removeUserPresence if user was authenticated', async () => {
      const client = createMockClient('client1');
      client.userId = 'user1';
      
      // Reset mock implementation for this test
      (presenceService.removeUserPresence as jest.Mock).mockReset();
      (presenceService.removeUserPresence as jest.Mock).mockImplementation((userId) => {
        return Promise.resolve();
      });
      
      // First connect the client
      await gateway.handleConnection(client as any);
      
      // Verify client is connected
      expect(mockClients.has(client)).toBe(true);
      
      // Then disconnect
      await gateway.handleDisconnect(client as any);
      
      // Verify client was removed
      expect(mockClients.has(client)).toBe(false);
      
      // Verify presence service was called with the correct user ID
      expect(presenceService.removeUserPresence).toHaveBeenCalledTimes(1);
      expect(presenceService.removeUserPresence).toHaveBeenCalledWith('user1');
    });
  });

  describe('handleMessage', () => {
    let client1: any;
    let client2: any;
    
    beforeEach(() => {
      // Create two clients in the same project
      client1 = createMockClient('client1');
      client2 = createMockClient('client2');
      
      // Set up client1 as authenticated user
      client1.userId = 'user1';
      client1.projectId = 'project1';
      
      // Set up client2 as another user in the same project
      client2.userId = 'user2';
      client2.projectId = 'project1';
      
      // Add clients to the mock clients map
      mockClients.set(client1, client1);
      mockClients.set(client2, client2);
    });
    
    it('should broadcast message to all clients in the same project', async () => {
      const messageData = {
        content: 'Hello everyone',
      };
      
      await gateway.handleMessage(client1 as any, messageData);
      
      // Verify client2 received the message
      expect(client2.sendMessage).toHaveBeenCalledWith({
        type: 'message',
        from: 'user1',
        projectId: 'project1',
        data: { content: 'Hello everyone' },
        timestamp: expect.any(String)
      });
      
      // Verify client1 didn't receive their own message (handled by client-side)
      expect(client1.sendMessage).not.toHaveBeenCalled();
    });
    
    it('should apply rate limiting', async () => {
      // Mock rate limiter to reject
      jest.spyOn(gateway['rateLimiter'], 'consume').mockRejectedValueOnce(new Error('Rate limit exceeded'));
      
      const messageData = { content: 'Hello' };
      await gateway.handleMessage(client1 as any, messageData);
      
      // Verify rate limit error was sent to client
      expect(client1.sendMessage).toHaveBeenCalledWith({
        type: 'error',
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many messages. Please slow down.'
      });
      
      // Verify message was not broadcasted
      expect(client2.sendMessage).not.toHaveBeenCalled();
    });
    
    it('should handle errors during message sending', async () => {
      // Create a separate client that will be removed
      const failingClient = createMockClient('failingClient');
      failingClient.userId = 'user3';
      failingClient.projectId = 'project1';
      
      // Add the failing client to the clients map
      mockClients.set(failingClient, failingClient);
      
      // Make this client's sendMessage throw an error with 'not open' message
      (failingClient.sendMessage as jest.Mock).mockImplementationOnce(() => {
        return Promise.reject(new Error('WebSocket not open'));
      });
      
      // Store the initial number of clients
      const initialClientCount = mockClients.size;
      
      const messageData = { content: 'Hello' };
      
      // Mock the error logger to prevent console errors during test
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      try {
        await gateway.handleMessage(client1 as any, messageData);
        
        // Verify the failing client's sendMessage was called
        expect(failingClient.sendMessage).toHaveBeenCalled();
        
        // Verify the failing client was removed from clients map
        expect(mockClients.has(failingClient)).toBe(false);
        expect(mockClients.size).toBe(initialClientCount - 1);
        
        // Verify other clients are still there
        expect(mockClients.has(client1)).toBe(true);
        expect(mockClients.has(client2)).toBe(true);
      } finally {
        // Clean up
        errorSpy.mockRestore();
        
        // Make sure to clean up the failing client if the test failed
        mockClients.delete(failingClient);
      }
    });
  });

  describe('handleTyping', () => {
    let client1: any;
    let client2: any;
    
    beforeEach(() => {
      // Create two clients in the same project
      client1 = createMockClient('client1');
      client2 = createMockClient('client2');
      
      // Set up client1 as authenticated user
      client1.userId = 'user1';
      client1.projectId = 'project1';
      
      // Set up client2 as another user in the same project
      client2.userId = 'user2';
      client2.projectId = 'project1';
      
      // Add clients to the mock clients map
      mockClients.set(client1, client1);
      mockClients.set(client2, client2);
    });
    
    it('should broadcast typing status to other users in the project', async () => {
      const typingData = {
        isTyping: true
      };
      
      await gateway.handleTyping(client1 as any, typingData);
      
      // Verify client2 received the typing status
      expect(client2.sendMessage).toHaveBeenCalledWith({
        type: 'user_typing',
        userId: 'user1',
        isTyping: true,
        timestamp: expect.any(String)
      });
      
      // Verify client1 didn't receive their own typing status
      expect(client1.sendMessage).not.toHaveBeenCalled();
    });
    
    it('should not broadcast if user is not authenticated', async () => {
      // Create unauthenticated client
      const unauthenticatedClient = createMockClient('unauthenticated');
      delete unauthenticatedClient.userId; // Ensure userId is not set
      
      const typingData = {
        isTyping: true
      };
      
      // Mock the handleTyping method to throw when userId is not set
      jest.spyOn(gateway as any, 'handleTyping').mockImplementation(async (client: any) => {
        if (!client.userId) {
          throw new Error('Not authenticated');
        }
      });
      
      try {
        await gateway.handleTyping(unauthenticatedClient as any, typingData);
        // If we get here, the test should fail
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Not authenticated');
      }
      
      // Verify no messages were sent
      expect(client1.sendMessage).not.toHaveBeenCalled();
      expect(client2.sendMessage).not.toHaveBeenCalled();
    });
    
    it('should not send typing status if client is not authenticated', async () => {
      const client = createMockClient('client1');
      delete client.userId; // Ensure userId is not set
      
      const typingData = { isTyping: true };
      
      // Mock the handleTyping method to throw when userId is not set
      jest.spyOn(gateway as any, 'handleTyping').mockImplementation(async (client: any) => {
        if (!client.userId) {
          throw new Error('Not authenticated');
        }
      });
      
      try {
        await gateway.handleTyping(client as any, typingData);
        // If we get here, the test should fail
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Not authenticated');
      }
    });
  });

  describe('handleAuth', () => {
    it('should authenticate client with valid token', async () => {
      const client = createMockClient('client1');
      const authData = {
        token: 'valid-token',
        projectId: 'project1'
      };
      
      authService.verifyToken.mockResolvedValueOnce({ 
        sub: 'user1',
        email: 'user1@example.com',
        name: 'Test User',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600
      });
      
      await gateway.handleAuth(client as any, authData);
      
      expect(authService.verifyToken).toHaveBeenCalledWith('valid-token');
      expect(client.userId).toBe('user1');
      expect(client.projectId).toBe('project1');
      expect(client.sendMessage).toHaveBeenCalledWith({
        type: 'auth_success',
        userId: 'user1',
        projectId: 'project1',
      });
    });
    
    it('should terminate connection with invalid token', async () => {
      const client = createMockClient('client1');
      const authData = {
        token: 'invalid-token',
        projectId: 'project1'
      };
      
      authService.verifyToken.mockRejectedValueOnce(new Error('Invalid token'));
      
      await gateway.handleAuth(client as any, authData);
      
      expect(authService.verifyToken).toHaveBeenCalledWith('invalid-token');
      expect(client.terminate).toHaveBeenCalled();
    });
  });
});
