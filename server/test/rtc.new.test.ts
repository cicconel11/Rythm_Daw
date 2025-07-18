import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';
import { RtcGateway } from '../src/modules/rtc/rtc.gateway';
import { JwtService } from '@nestjs/jwt';
import { createServer, Server as HttpServer } from 'http';
import { AddressInfo } from 'net';
import { WsAdapter } from '@nestjs/platform-ws';
// Import the client as a default import
import { io } from 'socket.io-client';

// Mock JWT service
const mockJwtService = {
  verify: jest.fn(),
  sign: jest.fn(),
};

// Mock WsThrottlerGuard
jest.mock('@nestjs/throttler', () => ({
  ThrottlerGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockReturnValue(true),
  })),
}));

describe('RtcGateway (New Test)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let io: Server;
  let gateway: RtcGateway;
  
  // Mock user data
  const mockUser = {
    userId: 'test-user-1',
    email: 'test@example.com',
  };

  beforeAll(async () => {
    console.log('1. Setting up test module...');
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RtcGateway,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        // Mock Throttler dependencies
        {
          provide: 'THROTTLER:MODULE_OPTIONS',
          useValue: {
            limit: 10,
            ttl: 60,
          },
        },
        {
          provide: 'ThrottlerStorage',
          useValue: {
            getRecord: jest.fn().mockResolvedValue({ totalHits: 0, timeToExpire: 0 }),
            addRecord: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: 'Reflector',
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    console.log('2. Creating Nest application...');
    app = module.createNestApplication();
    
    // Create HTTP server
    httpServer = createServer();
    
    // Create Socket.IO server
    io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    
    // Get gateway instance
    gateway = module.get<RtcGateway>(RtcGateway);
    
    // Set the server instance on the gateway
    (gateway as any)['server'] = io;
    
    // Use WebSocket adapter
    app.useWebSocketAdapter(new WsAdapter(app));
    
    // Initialize the application first
    await app.init();
    
    // Start HTTP server after app is initialized
    await new Promise<void>((resolve) => {
      httpServer.listen(0, '127.0.0.1', () => {
        const port = (httpServer.address() as AddressInfo).port;
        console.log(`Test server listening on port ${port}`);
        resolve();
      });
    });
  }, 30000); // Increase timeout to 30 seconds

  afterAll(async () => {
    console.log('Cleaning up...');
    
    // Close in the reverse order of initialization
    if (app) {
      await app.close();
    }
    
    if (io) {
      io.close();
    }
    
    if (httpServer) {
      await new Promise<void>((resolve) => {
        httpServer.close(() => {
          console.log('HTTP server closed');
          resolve();
        });
      });
    }
    
    console.log('Cleanup complete');
  }, 10000); // Increase timeout to 10 seconds

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should handle basic WebSocket connection', async () => {
    const port = (httpServer.address() as AddressInfo).port;
    const socketUrl = `http://localhost:${port}`;
    
    console.log(`\n=== Starting WebSocket Test ===`);
    console.log(`1. Attempting to connect to WebSocket server at ${socketUrl}...`);
    
    // Create a promise to handle the test completion
    return new Promise<void>(async (resolve, reject) => {
      try {
        console.log('2. Creating socket.io client...');
        console.log('   - Socket.io version:', require('socket.io-client/package.json').version);
        
        // Create socket with explicit options
        const socket = io(socketUrl, {
          transports: ['websocket'],
          autoConnect: true,
          reconnection: false,
          timeout: 10000,
          forceNew: true,
          reconnectionAttempts: 1,
          query: {
            test: 'true',
            userId: 'test-user-1',
            clientType: 'test-suite'
          },
          auth: {
            token: 'test-token-123'
          }
        });
        
        console.log('3. Socket created, setting up event handlers...');
        
        // Set a timeout for the test
        const testTimeout = setTimeout(() => {
          console.error('❌ Test timeout reached (30s)');
          console.log('   - Socket connected:', socket.connected);
          console.log('   - Socket id:', socket.id);
          
          if (socket.connected) {
            console.log('   - Disconnecting socket...');
            socket.disconnect();
          } else {
            console.log('   - Closing socket...');
            socket.close();
          }
          reject(new Error('Test timeout'));
        }, 30000); // 30 second test timeout
        
        // Helper function to clean up
        const cleanup = () => {
          clearTimeout(testTimeout);
          if (socket.connected) {
            socket.disconnect();
          }
        };
        
        console.log('4. Setting up connection event handlers...');
        
        // Connection established
        socket.on('connect', () => {
          console.log('5. ✅ Client connected successfully');
          console.log('   - Socket ID:', socket.id);
          console.log('   - Transport:', socket.io.engine.transport.name);
          
          // Listen for server events
          socket.on('message', (data: any) => {
            console.log('   - Received message:', data);
          });
          
          // Handle custom events from the server
          socket.onAny((event, ...args) => {
            console.log(`   - Received event '${event}':`, args);
          });
          
          // Send a test message
          console.log('6. Sending test message...');
          const testMessage = { 
            message: 'Hello from test',
            timestamp: new Date().toISOString(),
            testId: 'test-' + Math.random().toString(36).substr(2, 9)
          };
          
          socket.emit('test', testMessage, (response: any) => {
            console.log('7. ✅ Server response received:', response);
            
            // Add a small delay before disconnecting
            setTimeout(() => {
              console.log('8. Disconnecting socket...');
              cleanup();
              console.log('9. ✅ Test completed successfully');
              resolve();
            }, 500);
          });
        });
        
        // Connection error handling
        socket.on('connect_error', (error: any) => {
          console.error('❌ Connection error:', error.message);
          console.error('   - Error details:', error);
          cleanup();
          reject(error);
        });
        
        // General error handling
        socket.on('error', (error: any) => {
          console.error('❌ Socket error:', error.message);
          console.error('   - Error details:', error);
          cleanup();
          reject(error);
        });
        
        // Disconnection handling
        socket.on('disconnect', (reason: string) => {
          console.log('ℹ️  Socket disconnected:', reason);
          console.log('   - Socket connected:', socket.connected);
          
          // If we get disconnected before the test completes, fail the test
          if (testTimeout) {
            cleanup();
            reject(new Error(`Socket disconnected: ${reason}`));
          }
        });
        
        // Reconnection handling (shouldn't happen with reconnection disabled, but just in case)
        socket.on('reconnect_attempt', () => {
          console.log('ℹ️  Reconnection attempt');
        });
        
        socket.on('reconnect_error', (error: any) => {
          console.error('❌ Reconnection error:', error);
          cleanup();
          reject(error);
        });
        
        console.log('   - All event handlers registered');
        
      } catch (error) {
        console.error('❌ Error in test:', error);
        reject(error);
      }
    });
  }, 45000); // 45 second timeout for this test
});
