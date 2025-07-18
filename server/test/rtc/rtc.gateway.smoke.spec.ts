import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Server as HttpServer } from 'http';
import { AddressInfo } from 'net';
import { io as Client, Socket } from 'socket.io-client';
import { RtcGateway } from '../../src/modules/rtc/rtc.gateway';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { WsThrottlerGuard } from '../../src/common/guards/ws-throttler.guard';
import { JwtWsAuthGuard } from '../../src/auth/guards/jwt-ws-auth.guard';
import { WsExceptionFilter } from '../../src/common/filters/ws-exception.filter';

describe('RtcGateway (Smoke Test)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let clientSocket: Socket;
  let port: number;
  
  // Test user data
  const testUser = {
    userId: 'test-user-1',
    email: 'test@example.com',
    name: 'Test User'
  };

  beforeAll(async () => {
    // Create testing module
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([{
          ttl: 60,
          limit: 10,
        }]),
      ],
      providers: [
        RtcGateway,
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn().mockReturnValue(testUser)
          }
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'JWT_SECRET':
                  return 'test-secret';
                case 'FRONTEND_URL':
                  return 'http://localhost:3000';
                default:
                  return null;
              }
            })
          }
        },
        {
          provide: APP_GUARD,
          useClass: WsThrottlerGuard,
        },
        {
          provide: 'ThrottlerStorage',
          useValue: {
            increment: jest.fn(),
            get: jest.fn(),
          },
        },
        {
          provide: 'Reflector',
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ]
    })
    .overrideGuard(JwtWsAuthGuard)
    .useValue({ canActivate: () => true })
    .overrideFilter(WsExceptionFilter)
    .useValue({ catch: jest.fn() })
    .compile();

    // Create app
    app = moduleFixture.createNestApplication();
    
    // Enable CORS for testing
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    
    // Start HTTP server
    await app.init();
    
    // Get the HTTP server and port
    httpServer = app.getHttpServer();
    port = (httpServer.address() as AddressInfo).port;
  }, 30000); // Increase timeout for setup

  afterEach(() => {
    // Disconnect client after each test
    if (clientSocket?.connected) {
      clientSocket.disconnect();
    }
  });

  afterAll(async () => {
    await app.close();
  }, 10000);

  const createClient = (token?: string): Promise<Socket> => {
    return new Promise((resolve, reject) => {
      const client = Client(`http://localhost:${port}`, {
        transports: ['websocket'],
        auth: token ? { token } : {},
        reconnection: false,
        forceNew: true,
        timeout: 5000
      });
      
      const timeout = setTimeout(() => {
        client.close();
        reject(new Error('Connection timeout'));
      }, 5000);
      
      client.on('connect', () => {
        clearTimeout(timeout);
        resolve(client);
      });
      
      client.on('connect_error', (err) => {
        clearTimeout(timeout);
        client.close();
        resolve(client); // Resolve even on error to allow testing failed connections
      });
    });
  };

  describe('Connection', () => {
    it('should connect with valid token', async () => {
      clientSocket = await createClient('valid-token');
      expect(clientSocket.connected).toBe(true);
    });
    
    it('should reject connection with invalid token', async () => {
      // This test expects the connection to be rejected
      clientSocket = await createClient('invalid-token');
      expect(clientSocket.connected).toBe(false);
    });
  });

  describe('Ping-Pong', () => {
    it('should respond to ping', (done) => {
      clientSocket = Client(`http://localhost:${port}`, {
        transports: ['websocket'],
        auth: { token: 'valid-token' },
        reconnection: false,
        forceNew: true,
        timeout: 2000
      });
      
      clientSocket.on('pong', () => {
        done();
      });
      
      clientSocket.on('connect', () => {
        clientSocket.emit('ping');
      });
    });
  });
});
