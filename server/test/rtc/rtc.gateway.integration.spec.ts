import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server as SocketIoServer } from 'socket.io';
import { Server as HttpServer, createServer } from 'http';
import { AddressInfo } from 'net';
import { io as Client, Socket } from 'socket.io-client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RtcGateway } from '../../src/modules/rtc/rtc.gateway';
import { WsThrottlerGuard } from '../../src/common/guards/ws-throttler.guard';
import { JwtWsAuthGuard } from '../../src/auth/guards/jwt-ws-auth.guard';
import { WsExceptionFilter } from '../../src/common/filters/ws-exception.filter';

describe('RtcGateway (Integration)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let io: SocketIoServer;
  let clientSocket: Socket;
  let jwtService: JwtService;
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
        }
      ]
    })
    .overrideGuard(JwtWsAuthGuard)
    .useValue({ canActivate: () => true })
    .overrideGuard(WsThrottlerGuard)
    .useValue({ canActivate: () => true })
    .overrideFilter(WsExceptionFilter)
    .useValue({ catch: jest.fn() })
    .compile();

    // Create HTTP server
    httpServer = createServer();
    
    // Create Socket.IO server
    io = new SocketIoServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      },
      transports: ['websocket']
    });
    
    // Create app
    app = moduleFixture.createNestApplication();
    
    // Create a custom WebSocket adapter
    const ioAdapter = {
      create: (port: number) => io,
      bindClientConnect: (server: any, callback: Function) => {
        io.on('connection', (socket) => {
          callback(socket);
        });
      },
      bindClientDisconnect: (client: any, callback: Function) => {
        client.on('disconnect', callback);
      },
      close: (callback?: Function) => {
        io.close(() => {
          if (callback) callback();
        });
      }
    };
    
    // @ts-ignore
    app.useWebSocketAdapter(ioAdapter);
    
    // Initialize the app
    await app.init();
    
    // Start the HTTP server
    await new Promise<void>((resolve) => {
      httpServer.listen(0, () => {
        // @ts-ignore
        port = httpServer.address().port;
        resolve();
      });
    });
    
    // Get services
    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  afterEach(() => {
    // Disconnect client after each test
    if (clientSocket?.connected) {
      clientSocket.disconnect();
    }
  });

  afterAll(async () => {
    // Clean up
    await new Promise<void>((resolve) => {
      if (io) {
        io.close(() => {
          if (httpServer) {
            httpServer.close(() => resolve());
          } else {
            resolve();
          }
        });
      } else if (httpServer) {
        httpServer.close(() => resolve());
      } else {
        resolve();
      }
    });
    
    if (app) {
      await app.close();
    }
    
    // Additional cleanup
    if (clientSocket?.connected) {
      clientSocket.disconnect();
    }
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
      // Mock JWT verification
      const token = 'valid-token';
      (jwtService.verify as jest.Mock).mockReturnValueOnce(testUser);
      
      clientSocket = await createClient(token);
      
      expect(clientSocket.connected).toBe(true);
      expect(jwtService.verify).toHaveBeenCalledWith(token);
    });
    
    it('should reject connection with invalid token', async () => {
      // Mock JWT verification to throw error
      const token = 'invalid-token';
      (jwtService.verify as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });
      
      clientSocket = await createClient(token);
      
      // Connection should be closed by the server
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(clientSocket.connected).toBe(false);
    });
  });

  describe('Room Management', () => {
    let roomId: string;
    
    beforeEach(async () => {
      // Create a test room
      roomId = 'test-room';
      clientSocket = await createClient('valid-token');
    });
    
    it('should join a room', (done) => {
      clientSocket.emit('joinRoom', { roomId }, (response) => {
        try {
          expect(response).toBeDefined();
          expect(response.room).toBeDefined();
          expect(response.room.id).toBe(roomId);
          expect(response.participants).toBeDefined();
          done();
        } catch (err) {
          done(err);
        }
      });
    });
    
    it('should notify others when a user joins', (done) => {
      // First client joins
      clientSocket.emit('joinRoom', { roomId });
      
      // Create second client
      createClient('valid-token-2').then((secondClient) => {
        secondClient.on('userJoined', (data) => {
          try {
            expect(data).toBeDefined();
            expect(data.userId).toBe(testUser.userId);
            secondClient.disconnect();
            done();
          } catch (err) {
            secondClient.disconnect();
            done(err);
          }
        });
        
        // Second client joins
        secondClient.emit('joinRoom', { roomId });
      });
    });
  });

  describe('Messaging', () => {
    let roomId: string;
    let secondClient: Socket;
    
    beforeEach(async () => {
      roomId = 'test-room';
      clientSocket = await createClient('valid-token');
      secondClient = await createClient('valid-token-2');
      
      // Join room with both clients
      await new Promise((resolve) => {
        clientSocket.emit('joinRoom', { roomId }, resolve);
      });
      await new Promise((resolve) => {
        secondClient.emit('joinRoom', { roomId }, resolve);
      });
    });
    
    afterEach(() => {
      if (secondClient?.connected) {
        secondClient.disconnect();
      }
    });
    
    it('should broadcast track updates to room', (done) => {
      const trackUpdate = {
        trackId: 'track-1',
        type: 'add',
        data: { id: 'track-1', name: 'Test Track' }
      };
      
      secondClient.on('trackUpdated', (update) => {
        try {
          expect(update).toBeDefined();
          expect(update.trackId).toBe(trackUpdate.trackId);
          expect(update.type).toBe(trackUpdate.type);
          expect(update.data).toEqual(trackUpdate.data);
          done();
        } catch (err) {
          done(err);
        }
      });
      
      clientSocket.emit('updateTrack', trackUpdate);
    });
    
    it('should handle direct messages between users', (done) => {
      const message = {
        to: 'valid-token-2',
        content: 'Hello, World!'
      };
      
      secondClient.on('message', (msg) => {
        try {
          expect(msg).toBeDefined();
          expect(msg.from).toBe(testUser.userId);
          expect(msg.content).toBe(message.content);
          done();
        } catch (err) {
          done(err);
        }
      });
      
      clientSocket.emit('sendMessage', message);
    });
  });

  describe('Connection Health', () => {
    it('should respond to ping', (done) => {
      clientSocket = Client(`http://localhost:${(httpServer.address() as AddressInfo).port}`, {
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
    
    it('should detect disconnection', async () => {
      clientSocket = await createClient('valid-token');
      
      // Wait for connection to be established
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Disconnect client
      clientSocket.disconnect();
      
      // Wait for disconnection to be processed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // The gateway should have cleaned up the connection
      const gateway = app.get(RtcGateway);
      const activeConnections = (gateway as any).activeConnections;
      
      expect(activeConnections).toBe(0);
    });
  });
});
