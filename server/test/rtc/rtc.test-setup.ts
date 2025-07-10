import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { RtcModule } from '../../src/modules/rtc/rtc.module';
import { JwtWsAuthGuard } from '../../src/modules/auth/guards/jwt-ws-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RtcGateway } from '../../src/modules/rtc/rtc.gateway';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { WsAdapter } from '@nestjs/platform-ws';

// Mock JwtWsAuthGuard
const mockJwtWsAuthGuard = {
  canActivate: jest.fn((context) => {
    const client = context.switchToWs().getClient();
    client.user = { sub: 'test-user-id' };
    return true;
  }),
};

// Mock JwtService
const mockJwtService = {
  verify: jest.fn().mockReturnValue({ sub: 'test-user-id' }),
  sign: jest.fn().mockReturnValue('test-token'),
};

// Mock ConfigService
const mockConfigService = {
  get: jest.fn((key: string) => {
    switch (key) {
      case 'JWT_SECRET':
        return 'test-secret';
      case 'JWT_EXPIRES_IN':
        return '3600s';
      default:
        return null;
    }
  }),
};

export const createTestRtcApp = async (): Promise<{
  app: INestApplication;
  moduleFixture: TestingModule;
}> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [RtcModule],
  })
    .overrideProvider(JwtService)
    .useValue(mockJwtService)
    .overrideProvider(ConfigService)
    .useValue(mockConfigService)
    .overrideGuard(JwtWsAuthGuard)
    .useValue(mockJwtWsAuthGuard)
    .compile();

  const app = moduleFixture.createNestApplication();
  
  // Use WebSocket adapter
  app.useWebSocketAdapter(new WsAdapter(app) as any);
  
  // Initialize the app
  await app.init();
  
  // Get the WebSocket server instance
  const httpServer = app.getHttpServer();
  
  // Get the RTC gateway instance
  const rtcGateway = app.get(RtcGateway);
  
  // Manually initialize the WebSocket server
  const io = require('socket.io')(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });
  
  // Register the WebSocket server with the gateway
  rtcGateway.registerWsServer(io);
  
  return { app, moduleFixture };
};

export const closeTestRtcApp = async (app: INestApplication) => {
  if (app) {
    await app.close();
  }
};
