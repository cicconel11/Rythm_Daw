import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { WebSocketTestModule } from './websocket-test.module';
import { JwtService } from '@nestjs/jwt';
import { Server } from 'http';
import { WsAdapter } from '@nestjs/platform-ws';
import * as WebSocket from 'ws';

type SocketAuth = {
  token: string;
};

const TEST_PORT = 3001; // Fixed port for testing

describe('WebSocket Heartbeat (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let accessToken: string;
  const testUser = {
    userId: 'test-user-1',
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WebSocketTestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Enable CORS for testing
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    
    // Use WebSocket adapter
    app.useWebSocketAdapter(new WsAdapter(app));
    
    // Initialize the app first
    await app.init();
    
    // Create HTTP server
    const httpServer = await app.listen(TEST_PORT, '0.0.0.0');
    
    // Create a test JWT token
    jwtService = moduleFixture.get<JwtService>(JwtService);
    accessToken = jwtService.sign(
      { sub: testUser.userId, email: testUser.email, name: testUser.name }
    );
    
    // Store the port for use in tests
    (global as any).__TEST_PORT__ = TEST_PORT;
    
    console.log(`Test server running on port ${TEST_PORT}`);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for server to close
    }
    // Clean up global test port
    delete (global as any).__TEST_PORT__;
  });

  describe('WebSocket Heartbeat', () => {
    let socket: Socket;
    let port: number;
    let url: string;
    let socketOptions: {
      transports: string[];
      forceNew: boolean;
      reconnection: boolean;
      auth: SocketAuth;
    };
    
    beforeAll(() => {
      port = (global as any).__TEST_PORT__ || TEST_PORT;
      url = `http://localhost:${port}`;
      socketOptions = {
        transports: ['websocket', 'polling'],
        forceNew: true,
        reconnection: false,
        auth: {
          token: accessToken,
        },
      };
    });

    beforeEach((done) => {
      socket = io(url, socketOptions);
      
      const connectTimeout = setTimeout(() => {
        if (!socket.connected) {
          done.fail('Connection timeout');
        }
      }, 5000);
      
      socket.on('connect', () => {
        clearTimeout(connectTimeout);
        done();
      });
      
      socket.on('connect_error', (error: Error) => {
        clearTimeout(connectTimeout);
        done.fail(`Failed to connect: ${error.message}`);
      });
    });

    afterEach((done) => {
      if (socket && socket.connected) {
        socket.on('disconnect', () => {
          done();
        });
        socket.disconnect();
      } else {
        done();
      }
    });

    it('should receive ping and respond with pong', (done) => {
      const testStart = Date.now();
      let pingReceived = false;
      
      // Set a timeout for the test
      const testTimeout = setTimeout(() => {
        if (!pingReceived) {
          done.fail('No ping received within timeout');
        }
      }, 10000);
      
      // Listen for ping
      const onPing = (data: { timestamp: number }) => {
        try {
          pingReceived = true;
          clearTimeout(testTimeout);
          
          expect(data).toHaveProperty('timestamp');
          expect(data.timestamp).toBeGreaterThanOrEqual(testStart);
          
          // Send pong response
          socket.emit('pong', { timestamp: data.timestamp });
          
          // Clean up and finish the test
          socket.off('ping', onPing);
          done();
        } catch (error) {
          clearTimeout(testTimeout);
          socket.off('ping', onPing);
          done(error as Error);
        }
      };
      
      socket.on('ping', onPing);
    }, 15000); // 15 second timeout

    it('should disconnect after missing pongs', (done) => {
      let pingCount = 0;
      let disconnected = false;
      
      // Set a timeout for the test
      const testTimeout = setTimeout(() => {
        if (!disconnected) {
          done.fail('Expected disconnection after missing pongs');
        }
      }, 30000); // 30 second timeout
      
      // Handle ping events
      const onPing = () => {
        try {
          pingCount++;
          console.log(`Received ping #${pingCount}`);
          
          // Don't respond to simulate missed pongs
          if (pingCount >= 2) {
            console.log('Waiting for disconnection...');
          }
        } catch (error) {
          clearTimeout(testTimeout);
          socket.off('ping', onPing);
          done(error as Error);
        }
      };
      
      // Handle disconnect
      const onDisconnect = (reason: string) => {
        console.log(`Disconnected: ${reason}`);
        if (['transport close', 'ping timeout', 'io server disconnect'].includes(reason)) {
          clearTimeout(testTimeout);
          socket.off('ping', onPing);
          socket.off('disconnect', onDisconnect);
          disconnected = true;
          done();
        }
      };
      
      // Set up event listeners
      socket.on('ping', onPing);
      socket.on('disconnect', onDisconnect);
    }, 35000); // 35 second timeout
  });
});
