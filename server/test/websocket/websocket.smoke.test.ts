import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { RtcGateway } from '../src/modules/rtc/rtc.gateway';
import { createServer, Server as HttpServer } from 'http';
import { AddressInfo } from 'net';
import { io, Socket } from 'socket.io-client';

// Simple mock for JWT service
const mockJwtService = {
  verify: jest.fn().mockImplementation((token: string) => {
    return { userId: 'test-user-1' };
  })
};

// Mock JwtWsAuthGuard
const mockJwtWsAuthGuard = {
  canActivate: jest.fn().mockImplementation(() => true),
};

describe('WebSocket Smoke Test', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let socket: Socket;
  
  beforeAll(async () => {
    console.log('1. Setting up test module...');
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RtcGateway,
        {
          provide: 'JwtService',
          useValue: mockJwtService,
        },
        {
          provide: 'JwtWsAuthGuard',
          useValue: mockJwtWsAuthGuard,
        },
      ],
    }).compile();

    console.log('2. Creating Nest application...');
    app = module.createNestApplication();
    
    // Create HTTP server
    httpServer = createServer();
    
    // Create WebSocket server
    const ioServer = require('socket.io')(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    
    // Get gateway instance and attach server
    const gateway = module.get<RtcGateway>(RtcGateway);
    (gateway as unknown as { server: unknown })['server'] = ioServer;
    
    // Initialize application
    await app.init();
    
    // Start HTTP server
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

  it('should establish WebSocket connection', (done) => {
    const port = (httpServer.address() as AddressInfo).port;
    const socketUrl = `http://localhost:${port}`;
    
    console.log(`\n=== Starting WebSocket Test ===`);
    console.log(`1. Connecting to WebSocket server at ${socketUrl}...`);
    
    // Create socket.io client
    socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: false,
      auth: {
        token: 'test-jwt-token'
      },
      query: {
        test: 'true',
        userId: 'test-user-1'
      }
    });
    
    // Set test timeout
    const testTimeout = setTimeout(() => {
      console.error('❌ Test timeout reached (10s)');
      socket.disconnect();
      done(new Error('Test timeout'));
    }, 10000);
    
    // Connection established
    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket server');
      console.log('   - Socket ID:', socket.id);
      
      // Clean up and complete the test
      clearTimeout(testTimeout);
      socket.disconnect();
      done();
    });
    
    // Error handling
    socket.on('connect_error', (error: unknown) => {
      console.error('❌ Connection error:', (error as unknown as { message: string }).message);
      clearTimeout(testTimeout);
      done(error);
    });
    
    socket.on('error', (error: unknown) => {
      console.error('❌ Socket error:', (error as unknown as { message: string }).message);
      clearTimeout(testTimeout);
      done(error);
    });
  }, 15000);
});
