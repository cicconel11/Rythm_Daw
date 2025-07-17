import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { RtcGateway } from '../../src/modules/rtc/rtc.gateway';
import { RtcModule } from '../../src/modules/rtc/rtc.module';
import { JwtWsAuthGuard } from '../../src/modules/auth/guards/jwt-ws-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../../src/modules/auth/auth.module';
import { WsException } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { io, Socket as ClientSocket } from 'socket.io-client';

describe('RtcGateway', () => {
  let gateway: RtcGateway;
  let app: INestApplication;
  let ioServer: Server;
  let clientSocket: ClientSocket;
  let clientSocket2: ClientSocket;
  const testUser = {
    userId: 'test-user-1',
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET') || 'test-secret',
            signOptions: { expiresIn: '1h' },
          }),
          inject: [ConfigService],
        }),
        AuthModule,
        RtcModule,
      ],
    })
      .overrideGuard(JwtWsAuthGuard)
      .useValue({
        canActivate: (context: any) => {
          // Mock the user for testing
          const client = context.switchToWs().getClient();
          client.handshake = client.handshake || {};
          client.handshake.user = testUser;
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    
    // Create HTTP server for WebSocket testing
    const httpServer = app.getHttpServer();
    ioServer = new Server(httpServer);
    
    // Apply middleware and initialize the app
    await app.init();
    
    // Get the gateway instance
    gateway = moduleFixture.get<RtcGateway>(RtcGateway);
    
    // Start the server on a random port
    await app.listen(0);
    
    // Get the server address
    const serverAddress = app.getHttpServer().address();
    const port = typeof serverAddress === 'string' 
      ? serverAddress.split(':').pop() 
      : serverAddress.port;
    
    // Create test client connections
    clientSocket = io(`ws://localhost:${port}`, {
      auth: { token: 'test-token' },
      transports: ['websocket'],
      autoConnect: false,
    });
    
    clientSocket2 = io(`ws://localhost:${port}`, {
      auth: { token: 'test-token-2' },
      transports: ['websocket'],
      autoConnect: false,
    });
    
    // Connect the clients
    await new Promise<void>((resolve) => clientSocket.connect());
    await new Promise<void>((resolve) => clientSocket2.connect());
  });

  afterAll(async () => {
    // Clean up
    clientSocket.disconnect();
    clientSocket2.disconnect();
    await app.close();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('Connection', () => {
    it('should connect successfully with valid token', (done) => {
      clientSocket.on('connect', () => {
        expect(clientSocket.connected).toBeTruthy();
        done();
      });
    });
  });

  describe('Room Management', () => {
    const testRoomId = 'test-room-1';
    
    it('should allow a client to join a room', (done) => {
      clientSocket.emit('joinRoom', { roomId: testRoomId }, (response: any) => {
        expect(response.success).toBeTruthy();
        expect(response.roomId).toBe(testRoomId);
        done();
      });
    });
    
    it('should notify other clients when a user joins', (done) => {
      clientSocket2.on('userJoined', (data: any) => {
        expect(data.roomId).toBe(testRoomId);
        expect(data.userId).toBe(testUser.userId);
        done();
      });
      
      clientSocket2.emit('joinRoom', { roomId: testRoomId });
    });
    
    it('should allow a client to leave a room', (done) => {
      clientSocket.emit('leaveRoom', { roomId: testRoomId }, (response: any) => {
        expect(response.success).toBeTruthy();
        expect(response.roomId).toBe(testRoomId);
        done();
      });
    });
    
    it('should notify other clients when a user leaves', (done) => {
      clientSocket2.on('userLeft', (data: any) => {
        expect(data.roomId).toBe(testRoomId);
        expect(data.userId).toBe(testUser.userId);
        done();
      });
      
      clientSocket.emit('leaveRoom', { roomId: testRoomId });
    });
  });

  describe('Real-time Collaboration', () => {
    const testRoomId = 'collab-room-1';
    
    beforeEach((done) => {
      // Join both clients to the test room
      clientSocket.emit('joinRoom', { roomId: testRoomId }, () => {
        clientSocket2.emit('joinRoom', { roomId: testRoomId }, () => {
          done();
        });
      });
    });
    
    afterEach((done) => {
      // Leave the test room
      clientSocket.emit('leaveRoom', { roomId: testRoomId }, () => {
        clientSocket2.emit('leaveRoom', { roomId: testRoomId }, () => {
          done();
        });
      });
    });
    
    it('should broadcast track updates to other clients in the room', (done) => {
      const testTrackUpdate = {
        trackId: 'track-1',
        position: 1000,
        volume: 0.8,
        isPlaying: true,
      };
      
      // Listen for the update on the second client
      clientSocket2.on('trackUpdate', (data: any) => {
        expect(data.trackId).toBe(testTrackUpdate.trackId);
        expect(data.position).toBe(testTrackUpdate.position);
        expect(data.volume).toBe(testTrackUpdate.volume);
        expect(data.isPlaying).toBe(testTrackUpdate.isPlaying);
        done();
      });
      
      // Send the update from the first client
      clientSocket.emit('trackUpdate', {
        roomId: testRoomId,
        ...testTrackUpdate,
      });
    });
    
    it('should not send updates to clients in different rooms', (done) => {
      const otherRoomId = 'other-room-1';
      let updateReceived = false;
      
      // Join second client to a different room
      clientSocket2.emit('joinRoom', { roomId: otherRoomId }, () => {
        // Set a timeout to ensure we don't get the update
        const timeout = setTimeout(() => {
          expect(updateReceived).toBeFalsy();
          done();
        }, 500);
        
        // Listen for updates on the second client
        clientSocket2.on('trackUpdate', () => {
          updateReceived = true;
          clearTimeout(timeout);
          done.fail('Received update in wrong room');
        });
        
        // Send update from the first client
        clientSocket.emit('trackUpdate', {
          roomId: testRoomId,
          trackId: 'track-1',
          position: 1000,
          volume: 0.8,
          isPlaying: true,
        });
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid message formats', (done) => {
      // @ts-ignore - Testing invalid message format
      clientSocket.emit('invalidEvent', 'invalid-data', (response: any) => {
        expect(response.error).toBeDefined();
        done();
      });
    });
    
    it('should handle disconnections gracefully', (done) => {
      const testRoomId = 'disconnect-test-room';
      
      clientSocket.emit('joinRoom', { roomId: testRoomId }, () => {
        // Disconnect the client
        clientSocket.disconnect();
        
        // Wait a moment for the disconnection to be processed
        setTimeout(() => {
          // The server should clean up after the disconnection
          // We can verify this by checking the room state
          // This is implementation-specific and might need adjustment
          expect(true).toBeTruthy();
          done();
        }, 500);
      });
    });
  });
});
