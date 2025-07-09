import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsJwtGuard } from '../modules/auth/guards/ws-jwt.guard';

const mockJwtService = {
  verify: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('test-secret'),
};

export async function createTestingModule(providers: any[] = []) {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
      }),
    ],
    providers: [
      ...providers,
      {
        provide: JwtService,
        useValue: mockJwtService,
      },
      {
        provide: 'ConfigService',
        useValue: mockConfigService,
      },
    ],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();
  
  return { app, module: moduleFixture };
}

export function createMockSocket(token?: string, user?: any) {
  return {
    handshake: {
      auth: {
        token: token ? `Bearer ${token}` : undefined,
      },
    },
    data: {},
    join: jest.fn(),
    leave: jest.fn(),
    emit: jest.fn(),
    to: jest.fn().mockReturnThis(),
  } as any;
}
