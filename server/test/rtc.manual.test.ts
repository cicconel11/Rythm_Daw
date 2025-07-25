import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { RtcGateway } from '../src/modules/rtc/rtc.gateway';
import { JwtService } from '@nestjs/jwt';
import { createServer, Server as HttpServer } from 'http';
import { AddressInfo } from 'net';
import { io, Socket } from 'socket.io-client';

// Mock JWT service
const mockJwtService = {
  verify: jest.fn().mockImplementation((token: string) => {
    return { userId: 'test-user-1' };
  }),
  sign: jest.fn().mockReturnValue('test-jwt-token'),
};

// Mock WsThrottlerGuard
const mockWsThrottlerGuard = {
  canActivate: jest.fn().mockImplementation(() => true),
};

// Mock ThrottlerStorage
class MockThrottlerStorage {
  private storage: Record<string, { totalHits: number; timeToExpire: number }> = {};

  async getRecord(key: string) {
    return this.storage[key] || { totalHits: 0, timeToExpire: 0 };
  }

  async addRecord(key: string, ttl: number) {
    this.storage[key] = {
      totalHits: (this.storage[key]?.totalHits || 0) + 1,
      timeToExpire: Date.now() + ttl,
    };
  }
}

// Mock Reflector
const mockReflector = {
  getAllAndOverride: jest.fn().mockReturnValue(null),
  get: jest.fn(),
};

describe('RtcGateway (Manual Test)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let gateway: RtcGateway;
  let socket: Socket;
  
  beforeAll(async () => {
    console.log('1. Setting up test module...');
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RtcGateway,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        // Provide the actual WsThrottlerGuard with its dependencies
        {
          provide: 'THROTTLER:MODULE_OPTIONS',
          useValue: {
            limit: 10,
            ttl: 60,
            storage: new MockThrottlerStorage(),
          },
        },
        {
          provide: 'ThrottlerStorage',
          useClass: MockThrottlerStorage,
        },
        {
          provide: 'Reflector',
          useValue: mockReflector,
        },
        // Mock the WsThrottlerGuard
        {
          provide: 'APP_GUARD',
          useValue: mockWsThrottlerGuard,
        },
      ],
    }).compile();

    console.log('2. Creating Nest application...');
    app = module.createNestApplication();
    
    // Get gateway instance
    gateway = module.get<RtcGateway>(RtcGateway);
    
    // Create HTTP server
    httpServer = createServer();
    
    // Attach WebSocket server to the HTTP server
    const io = require('socket.io')(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    
    // Manually attach the WebSocket server to the gateway
    (gateway as unknown as { server: unknown })['server'] = io;
    
    // Initialize the application
    await app.init();
    
    // Start the HTTP server
    await new Promise<void>((resolve) => {
      httpServer.listen(0, '127.0.0.1', () => {
        const port = (httpServer.address() as AddressInfo).port;
        console.log(`Test server listening on port ${port}`);
        resolve();
      });
    });
  }, 30000);

  afterAll(async () => {
    console.log('Cleaning up...');
    
    if (socket) {
      socket.disconnect();
    }
    
    if (httpServer) {
      await new Promise<void>((resolve) => {
        httpServer.close(() => {
          console.log('HTTP server closed');
          resolve();
        });
      });
    }
    
    if (app) {
      await app.close();
    }
    
    console.log('Cleanup complete');
  }, 10000);

  it('should connect to WebSocket server', (done) => {
    const port = (httpServer.address() as AddressInfo).port;
    const socketUrl = `http://localhost:${port}`;
    
    console.log(`\n=== Starting WebSocket Test ===`);
    console.log(`1. Connecting to WebSocket server at ${socketUrl}...`);
    
    // Log environment info
    console.log('Environment:');
    console.log(`- Node.js: ${process.version}`);
    console.log(`- Platform: ${process.platform} ${process.arch}`);
    console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
    
    // Log socket.io-client version
    try {
      const clientVersion = require('socket.io-client/package.json').version;
      console.log(`- socket.io-client version: ${clientVersion}`);
    } catch (e) {
      console.error('Error getting socket.io-client version:', e);
    }
    
    // Log available transports
    console.log('Available transports:', ['websocket', 'polling'].filter(t => {
      try {
        require.resolve(`engine.io-client/transports/${t}`);
        return true;
      } catch (e) {
        return false;
      }
    }));
    
    // Create a socket.io client with detailed logging
    console.log('Creating socket.io client with options:', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: false,
      forceNew: true,
      upgrade: true,
      rememberUpgrade: true,
      path: '/socket.io/',
      query: {
        test: 'true',
        userId: 'test-user-1',
        timestamp: Date.now()
      },
      auth: {
        token: 'test-jwt-token'
      },
      extraHeaders: {
        'x-test-client': 'jest-test'
      }
    });
    
    socket = io(socketUrl, {
      transports: ['websocket', 'polling'], // Try both transports
      autoConnect: true,
      reconnection: false,
      forceNew: true,
      upgrade: true,
      rememberUpgrade: true,
      path: '/socket.io/',
      query: {
        test: 'true',
        userId: 'test-user-1',
        timestamp: Date.now()
      },
      auth: {
        token: 'test-jwt-token'
      },
      extraHeaders: {
        'x-test-client': 'jest-test'
      }
    });
    
    // Log socket events for debugging
    const events = [
      'connect', 'connect_error', 'error', 'disconnect', 'reconnect_attempt',
      'reconnect_error', 'reconnect_failed', 'ping', 'pong'
    ];
    
    events.forEach(event => {
      socket.on(event, (...args) => {
        console.log(`[socket:${event}]`, ...args);
      });
    });
    
    // Set a timeout for the test
    const testTimeout = setTimeout(() => {
      console.error('❌ Test timeout reached (10s)');
      console.log('   - Socket connected:', socket.connected);
      console.log('   - Socket id:', socket.id);
      
      if (socket.connected) {
        console.log('   - Disconnecting socket...');
        socket.disconnect();
      }
      
      done(new Error('Test timeout'));
    }, 10000);
    
    // Connection established
    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket server');
      console.log('   - Socket ID:', socket.id);
      
      // Test a simple echo
      const testMessage = {
        event: 'test',
        data: { message: 'Hello from test' },
        timestamp: new Date().toISOString()
      };
      
      console.log('Sending test message:', testMessage);
      socket.emit('message', testMessage);
      
      // Listen for messages from the server
      socket.on('message', (data: unknown) => {
        console.log('Received message from server:', data);
        
        // Clean up and complete the test
        clearTimeout(testTimeout);
        socket.disconnect();
        done();
      });
    });
    
    // Error handling
    socket.on('connect_error', (error: unknown) => {
      console.error('❌ Connection error:', (error as Error).message);
      clearTimeout(testTimeout);
      done(error);
    });
    
    socket.on('error', (error: unknown) => {
      console.error('❌ Socket error:', (error as Error).message);
      clearTimeout(testTimeout);
      done(error);
    });
    
    socket.on('disconnect', (reason: string) => {
      console.log('ℹ️  Disconnected:', reason);
    });
  }, 15000);
});
