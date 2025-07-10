import { Test, TestingModule } from '@nestjs/testing';
import { RtcGateway } from '../src/modules/rtc/rtc.gateway';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';
import { JwtWsAuthGuard } from '../src/modules/auth/guards/jwt-ws-auth.guard';

// Mock JwtWsAuthGuard
jest.mock('../src/modules/auth/guards/jwt-ws-auth.guard', () => ({
  JwtWsAuthGuard: jest.fn().mockImplementation(() => ({
    canActivate: (context: any) => {
      const client = context.switchToWs().getClient();
      client.user = { sub: 'test-user-id' };
      return true;
    },
  })),
}));

// Define AuthenticatedSocket interface for testing
interface AuthenticatedSocket extends Socket {
  user: { sub: string };
}

// Create a test gateway class that extends RtcGateway for testing
class TestRtcGateway extends RtcGateway {
  private _testServer: any;
  public jwtService: any;
  public configService: any;
  
  constructor() {
    super();
    // Initialize private maps
    this['userSockets'] = new Map();
    this['socketToUser'] = new Map();
    
    // Set up default server mock
    this.setupServerMock();
    
    // Initialize server property
    Object.defineProperty(this, 'server', {
      get: () => this._testServer,
      set: (server: any) => { this._testServer = server; },
      configurable: true
    });
  }
  
  // Add afterInit method for testing
  async afterInit() {
    // No-op for testing
  }
  
  // Override the getter for jwtService to use our test instance
  getJwtService() {
    return this.jwtService;
  }
  
  // Override the getter for configService to use our test instance
  getConfigService() {
    return this.configService;
  }
  
  // Method to set up server mock
  setupServerMock(client?: any) {
    this._testServer = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      sockets: {
        sockets: new Map(client ? [[client.id, client]] : []),
        adapter: {
          rooms: new Map(),
          sids: new Map(),
          addAll: jest.fn(),
          del: jest.fn(),
          delAll: jest.fn(),
          broadcast: {
            to: jest.fn().mockReturnThis(),
            emit: jest.fn(),
            compress: jest.fn().mockReturnThis(),
            volatile: jest.fn().mockReturnThis(),
            local: jest.fn().mockReturnThis()
          }
        },
        join: jest.fn(),
        leave: jest.fn(),
        disconnect: jest.fn(),
      },
      of: jest.fn().mockReturnThis(),
      use: jest.fn().mockReturnThis(),
      engine: {
        generateId: jest.fn().mockReturnValue('mock-socket-id')
      }
    };
  }
  
  // Add public methods for testing
  testHandleConnection(client: AuthenticatedSocket) {
    return this.handleConnection(client);
  }
  
  testHandleDisconnect(client: AuthenticatedSocket) {
    return this.handleDisconnect(client);
  }
  
  testEmitToUser(userId: string, event: string, payload: any) {
    return this.emitToUser(userId, event, payload);
  }
  
  // Get the test server instance
  getTestServer() {
    return this._testServer;
  }
}

describe('RtcGateway', () => {
  let gateway: TestRtcGateway;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    // Create a new instance of TestRtcGateway directly
    gateway = new TestRtcGateway();
    
    // Manually set up the dependencies
    jwtService = {
      verify: jest.fn().mockReturnValue({ sub: 'test-user-id' }),
    } as any;
    
    configService = {
      get: jest.fn((key: string) => ({
        'JWT_SECRET': 'test-secret',
        'NODE_ENV': 'test',
      })[key]),
    } as any;
    
    // Set the dependencies on the gateway
    gateway.jwtService = jwtService;
    gateway.configService = configService;
    
    // Initialize the gateway
    await gateway.afterInit();
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('emitToUser', () => {
    it('should emit events to all user sockets', () => {
      const userId = 'test-user-1';
      const event = 'test-event';
      const data = { test: 'data' };
      
      // Create mock sockets for the user
      const mockSocket1 = {
        id: 'test-client-1',
        emit: jest.fn(),
      };
      
      const mockSocket2 = {
        id: 'test-client-2',
        emit: jest.fn(),
      };
      
      // Create a test server mock with the sockets
      const testServer = {
        sockets: {
          sockets: new Map([
            ['test-client-1', mockSocket1],
            ['test-client-2', mockSocket2],
          ]),
        },
      };
      
      // Set the test server on the gateway
      gateway['_testServer'] = testServer;
      
      // Set up the userSockets map with both sockets for the user
      gateway['userSockets'] = new Map([
        [userId, new Set([mockSocket1.id, mockSocket2.id])]
      ]);
      
      // Set up the socketToUser map
      gateway['socketToUser'] = new Map([
        [mockSocket1.id, userId],
        [mockSocket2.id, userId],
      ]);
      
      // Call the method under test
      const result = gateway.testEmitToUser(userId, event, data);
      
      // Verify the results
      expect(result).toBe(true);
      
      // Verify both sockets received the event
      expect(mockSocket1.emit).toHaveBeenCalledWith(event, data);
      expect(mockSocket2.emit).toHaveBeenCalledWith(event, data);
    });
  });
  
  // Add a test for the getTestServer method
  describe('getTestServer', () => {
    it('should return the test server instance', () => {
      const testServer = gateway.getTestServer();
      expect(testServer).toBeDefined();
      expect(testServer.to).toBeDefined();
      expect(testServer.emit).toBeDefined();
    });
  });
  
  // Clean up after all tests
  afterAll(async () => {
    // Clean up any remaining resources if needed
  });
});

describe('RtcGateway', () => {
  let gateway: TestRtcGateway;
  
  beforeEach(() => {
    // Create test gateway instance
    gateway = new TestRtcGateway();
    
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should disconnect client if no user in handshake', async () => {
      const mockSocket: any = {
        id: 'test-client-id',
        handshake: {
          auth: {},
          headers: {},
          time: new Date().toISOString(),
          address: '127.0.0.1',
          xdomain: false,
          secure: false,
          issued: Date.now(),
          url: '/',
          query: {},
        },
        disconnect: jest.fn(),
        on: jest.fn(),
        join: jest.fn(),
        leave: jest.fn(),
        emit: jest.fn(),
      };
      
      // Set up the server mock with the test socket using the public method
      gateway.setupServerMock(mockSocket);
      
      // Test connection
      await gateway.testHandleConnection(mockSocket);
      
      // Verify disconnect was called due to missing user in handshake
      expect(mockSocket.disconnect).toHaveBeenCalled();
    });

    it('should handle connection with valid user', async () => {
      const client: AuthenticatedSocket = {
        handshake: {
          auth: {
            token: 'valid-token',
          },
        },
        join: jest.fn().mockResolvedValue(undefined),
        id: 'test-client-id',
        user: { sub: 'test-user-id' },
        disconnect: jest.fn(),
      } as unknown as AuthenticatedSocket;

      // Set up the server mock with the test socket
      gateway.setupServerMock(client);
      
      // Test connection
      await gateway.testHandleConnection(client);
      
      // Verify the socket was added to the userSockets map
      expect(gateway['userSockets'].has('test-user-id')).toBe(true);
      expect(gateway['socketToUser'].has('test-client-id')).toBe(true);
      
      // Test disconnection
      await gateway.testHandleDisconnect(client);
      
      // Verify cleanup
      expect(gateway['userSockets'].has('test-user-id')).toBe(false);
      expect(gateway['socketToUser'].has('test-client-id')).toBe(false);
    });

    it('should handle connection without user', async () => {
      // Create a mock JWT service that throws an error
      const mockJwtService = {
        verify: jest.fn().mockImplementation(() => {
          throw new Error('Invalid token');
        })
      };
      
      // Set the mock JWT service on the gateway
      gateway.jwtService = mockJwtService;
      
      const client: any = {
        handshake: {
          auth: {
            token: 'invalid-token',
          },
          headers: {},
          time: new Date().toISOString(),
          address: '127.0.0.1',
          xdomain: false,
          secure: false,
          issued: Date.now(),
          url: '/',
          query: {},
        },
        id: 'test-client-id',
        disconnect: jest.fn(),
        on: jest.fn(),
        join: jest.fn(),
        leave: jest.fn(),
        emit: jest.fn(),
      };

      // Set up the server mock with the test socket
      gateway.setupServerMock(client);
      
      // Test connection
      await gateway.testHandleConnection(client);
      
      // Verify disconnect was called due to invalid token
      expect(client.disconnect).toHaveBeenCalled();
    });
  });

  describe('handleDisconnect', () => {
    it('should clean up user connections on disconnect', async () => {
      const mockSocket: any = {
        id: 'test-client-id',
        user: { sub: 'test-user-id' },
        handshake: {
          auth: {},
          headers: {},
          time: new Date().toISOString(),
          address: '127.0.0.1',
          xdomain: false,
          secure: false,
          issued: Date.now(),
          url: '/',
          query: {},
        },
        disconnect: jest.fn(),
        on: jest.fn(),
        join: jest.fn(),
        leave: jest.fn(),
        emit: jest.fn(),
      };

      // Add a connected client
      gateway['userSockets'].set('test-user-id', new Set([mockSocket.id]));
      gateway['socketToUser'].set(mockSocket.id, 'test-user-id');
      
      // Set up the server mock with the test socket
      gateway.setupServerMock(mockSocket);
      
      // Test disconnection
      await gateway.testHandleDisconnect(mockSocket);
      
      // Verify cleanup
      expect(gateway['userSockets'].has('test-user-id')).toBe(false);
      expect(gateway['socketToUser'].has('test-client-id')).toBe(false);
    });
  });

  describe('emitToUser', () => {
    let mockSocket: any;
    
    beforeEach(() => {
      mockSocket = {
        id: 'test-client-1',
        emit: jest.fn(),
        user: { sub: 'test-user-1' },
        handshake: {
          auth: {},
          headers: {},
          time: new Date().toISOString(),
          address: '127.0.0.1',
          xdomain: false,
          secure: false,
          issued: Date.now(),
          url: '/',
          query: {},
        },
        disconnect: jest.fn(),
        on: jest.fn(),
        join: jest.fn(),
        leave: jest.fn(),
      };
      
      gateway = new TestRtcGateway();
      
      // Add a connected client
      gateway['userSockets'].set('test-user-1', new Set([mockSocket.id]));
      gateway['socketToUser'].set(mockSocket.id, 'test-user-1');
      
      // Set up the server mock with the test socket
      gateway.setupServerMock(mockSocket);
    });
    
    it('should emit event to all user sockets', () => {
      const testEvent = 'test-event';
      const testPayload = { data: 'test' };
      
      const result = gateway.testEmitToUser('test-user-1', testEvent, testPayload);
      
      expect(result).toBe(true);
      expect(mockSocket.emit).toHaveBeenCalledWith(testEvent, testPayload);
    });
    
    it('should return false if user has no sockets', () => {
      const result = gateway.testEmitToUser('non-existent-user', 'test-event', {});
      
      expect(result).toBe(false);
    });
    
    it('should handle missing server.sockets.sockets', () => {
      // Set up server with missing sockets.sockets
      const testServer = gateway.getTestServer();
      testServer.sockets = {
        // No 'sockets' property here
      };
      
      const result = gateway.testEmitToUser('test-user-1', 'test-event', {});
      
      expect(result).toBe(false);
    });
    
    it('should handle missing server', () => {
      // Clean up by resetting the server mock
      gateway.setupServerMock();
      
      const result = gateway.testEmitToUser('test-user-1', 'test-event', {});
      
      expect(result).toBe(false);
    });
  });
});
