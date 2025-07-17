import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ChatGateway } from '../src/modules/chat/chat.gateway';
import { PresenceService } from '../src/modules/presence/presence.service';
import { RtcGateway } from '../src/modules/rtc/rtc.gateway';
import { WsJwtGuard } from '../src/modules/auth/guards/ws-jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createWsTestApp, createSocketClient } from './__utils__/websocket';
import type { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { AddressInfo } from 'net';

describe('ChatGateway (e2e)', () => {
  let app: INestApplication;
  let chatGateway: ChatGateway;
  let httpServer: HttpServer;
  let io: Server;
  let port: number;
  
  // Mock services
  const mockPresenceService = {
    updateUserPresence: jest.fn(),
    getUserPresence: jest.fn(),
  };

  const mockRtcGateway = {
    registerWsServer: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ChatGateway,
        {
          provide: PresenceService,
          useValue: mockPresenceService,
        },
        {
          provide: RtcGateway,
          useValue: mockRtcGateway,
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn().mockResolvedValue({ userId: 'test-user-id' }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'JWT_SECRET') return 'test-secret';
              if (key === 'JWT_EXPIRES_IN') return '1h';
              return null;
            }),
          },
        },
      ],
    })
    .overrideGuard(WsJwtGuard)
    .useValue({ canActivate: () => true })
    .compile();

    app = moduleRef.createNestApplication();
    chatGateway = moduleRef.get<ChatGateway>(ChatGateway);
    
    // Set up WebSocket server
    const wsConfig = await createWsTestApp(app);
    httpServer = wsConfig.httpServer;
    port = wsConfig.port;
    
    // Create Socket.IO server instance
    io = new Server(httpServer);
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    httpServer.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should establish WebSocket connection and handle ping/pong', async () => {
    // Create a real socket.io client
    const client = createSocketClient(port, {
      auth: {
        token: 'test-token',
      },
    });

    // Wait for connection
    await new Promise<void>((resolve) => {
      client.on('connect', () => resolve());
    });
    
    // Test ping/pong
    const pongPromise = new Promise<boolean>((resolve) => {
      client.on('ping', (data: { timestamp: number }) => {
        client.emit('pong', { timestamp: data.timestamp });
        resolve(true);
      });
    });

    // Wait for ping and verify pong was sent
    await expect(pongPromise).resolves.toBe(true);
    
    // Clean up
    client.disconnect();
  });

  it('should disconnect client after missing pongs', async () => {
    // Create a client that won't respond to pings
    const client = createSocketClient(port, {
      auth: { token: 'test-token' },
    });

    // Wait for connection
    await new Promise<void>((resolve) => {
      client.on('connect', () => resolve());
    });
    
    // Wait for disconnect due to missed pongs
    const disconnectPromise = new Promise<boolean>((resolve) => {
      client.on('disconnect', (reason: string) => {
        expect(reason).toBe('ping timeout');
        resolve(true);
      });
    });

    // Wait for disconnect
    await expect(disconnectPromise).resolves.toBe(true);
  });
});
