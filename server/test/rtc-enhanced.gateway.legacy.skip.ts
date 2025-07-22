import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Server } from 'socket.io';
import { io as ioClient, Socket } from 'socket.io-client';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { WsAdapter } from '@nestjs/platform-ws';

// Import the gateway and types
import { RtcEnhancedGateway } from '../src/modules/rtc/rtc-enhanced.gateway';
import { ClientEvents, ServerEvents } from '../src/modules/rtc/types/websocket.types';

// Extend the Socket interface to include our custom properties
declare module 'socket.io' {
  interface Handshake {
    user?: {
      userId: string;
      email: string;
    };
  }
}

// Test configuration
const TEST_PORT = 3001;
const TEST_ROOM = 'test-room-1';
const TEST_USER = {
  userId: 'test-user-1',
  email: 'test@example.com',
  roles: ['user']
};

// Mock JWT service
const mockJwtService = {
  verifyAsync: jest.fn().mockImplementation((token: string) => {
    if (token === 'valid-token') {
      return Promise.resolve(TEST_USER);
    }
    return Promise.reject(new Error('Invalid token'));
  }),
};

// Mock Throttler Storage
class MockThrottlerStorage {
  private storage: Record<string, { totalHits: number; timeToExpire: number }> = {};

  async increment(key: string, ttl: number) {
    if (!this.storage[key]) {
      this.storage[key] = { totalHits: 0, timeToExpire: Date.now() + ttl * 1000 };
    }
    this.storage[key].totalHits++;
    return { 
      totalHits: this.storage[key].totalHits, 
      timeToExpire: this.storage[key].timeToExpire 
    };
  }
}

describe('RtcEnhancedGateway (e2e)', () => {
  let app: INestApplication;
  let server: Server;
  let client: Socket;
  let testClient: Socket;

  // Helper function to create a test client
  const createTestClient = (): Promise<Socket> => {
    return new Promise((resolve, reject) => {
      const newClient = ioClient(`http://localhost:${TEST_PORT}`, {
        auth: { token: 'valid-token' },
        transports: ['websocket'],
        forceNew: true,
      });

      // Add error handler first
      newClient.once('connect_error', (err) => {
        reject(err);
      });

      // Then add success handler
      newClient.once('connect', () => {
        // Remove the error handler to prevent memory leaks
        newClient.off('connect_error');
        resolve(newClient);
      });

      // Set a timeout for connection
      setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, 5000);
    });
  };

  beforeAll(async () => {
    jest.setTimeout(30000);
    jest.clearAllMocks();

    const throttlerStorage = new MockThrottlerStorage();
    
    const moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        ThrottlerModule.forRoot({
          throttlers: [
            {
              ttl: 60,
              limit: 100,
            },
          ],
          storage: {
            increment: async (key: string, ttl: number) => {
              const result = await throttlerStorage.increment(key, ttl);
              return {
                totalHits: result.totalHits,
                timeToExpire: result.timeToExpire,
                isBlocked: false,
                timeToBlockExpire: 0,
              };
            },
          },
        }),
      ],
      providers: [
        RtcEnhancedGateway,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useWebSocketAdapter(new WsAdapter(app));
    await app.init();

    // Get the HTTP server and create Socket.IO server
    const httpServer = app.getHttpServer();
    server = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    // Start listening
    await app.listen(TEST_PORT);
  });

  afterAll(async () => {
    if (client?.connected) client.disconnect();
    if (testClient?.connected) testClient.disconnect();
    if (server) {
      server.close();
    }
    if (app) {
      await app.close();
    }
  });

  // 1. Basic connection test
  describe('Connection', () => {
    it('should connect successfully with valid token', async () => {
      const client = await createTestClient();
      expect(client.connected).toBeTruthy();
      client.disconnect();
    });

    it('should reject connection with invalid token', (done) => {
      const invalidClient = ioClient(`http://localhost:${TEST_PORT}`, {
        auth: { token: 'invalid-token' },
        transports: ['websocket'],
        reconnection: false,
        timeout: 1000,
      });

      invalidClient.once('connect_error', (err) => {
        expect(err.message).toMatch(/invalid|unauthorized/i);
        invalidClient.close();
        done();
      });

      invalidClient.once('connect', () => {
        invalidClient.disconnect();
        done.fail('Should not have connected with invalid token');
      });
    });
  });

  // 2. Room management tests
  describe('Room Management', () => {
    beforeEach(async () => {
      testClient = await createTestClient();
    });

    afterEach((done) => {
      if (testClient?.connected) {
        testClient.disconnect();
        testClient.on('disconnect', () => done());
      } else {
        done();
      }
    });

    it('should allow joining a room', (done) => {
      testClient.emit(ClientEvents.JOIN_ROOM, { roomId: TEST_ROOM }, (response: any) => {
        try {
          expect(response.success).toBe(true);
          expect(response.roomId).toBe(TEST_ROOM);
          done();
        } catch (err) {
          done(err);
        }
      });
    });

    it('should notify others when user joins a room', (done) => {
      createTestClient().then((secondClient) => {
        testClient.emit(ClientEvents.JOIN_ROOM, { roomId: TEST_ROOM });

        secondClient.on(ServerEvents.USER_JOINED, (data: any) => {
          expect(data.roomId).toBe(TEST_ROOM);
          expect(data.userId).toBe(TEST_USER.userId);
          secondClient.disconnect();
          done();
        });

        secondClient.emit(ClientEvents.JOIN_ROOM, { roomId: TEST_ROOM });
      });
    });

    it('should allow leaving a room', (done) => {
      testClient.emit(ClientEvents.JOIN_ROOM, { roomId: TEST_ROOM }, () => {
        testClient.emit(ClientEvents.LEAVE_ROOM, { roomId: TEST_ROOM }, (response: any) => {
          expect(response.success).toBe(true);
          expect(response.roomId).toBe(TEST_ROOM);
          done();
        });
      });
    });
  });

  // 3. Signaling tests
  describe('Signaling', () => {
    let client1: Socket;
    let client2: Socket;

    beforeAll(async () => {
      [client1, client2] = await Promise.all([
        createTestClient(),
        createTestClient()
      ]);
    });

    afterAll(() => {
      if (client1?.connected) client1.disconnect();
      if (client2?.connected) client2.disconnect();
    });

    it('should relay signaling messages between clients', (done) => {
      const testSignal = { type: 'offer', sdp: 'test-sdp' };
      
      client1.emit(ClientEvents.JOIN_ROOM, { roomId: TEST_ROOM });
      
      client2.emit(ClientEvents.JOIN_ROOM, { roomId: TEST_ROOM }, () => {
        client2.on(ServerEvents.SIGNAL, (data: any) => {
          expect(data.signal).toEqual(testSignal);
          done();
        });

        // Use the correct event name from ClientEvents
        client1.emit(ClientEvents.SIGNAL, {
          targetUserId: 'test-user-1',
          signal: testSignal
        });
      });
    });
  });

  // 4. Health check
  describe('Health Check', () => {
    it('should respond to ping with pong', (done) => {
      const testClient = ioClient(`http://localhost:${TEST_PORT}`, {
        auth: { token: 'valid-token' },
        transports: ['websocket'],
        forceNew: true,
      });

      testClient.once('connect', () => {
        testClient.emit(ClientEvents.PING, (response: any) => {
          expect(response.timestamp).toBeDefined();
          testClient.disconnect();
          done();
        });
      });

      testClient.once('connect_error', (err) => {
        testClient.close();
        done(err);
      });
    });
  });
});
