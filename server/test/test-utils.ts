import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger as NestLogger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

// Mock JWT service
const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
  verify: jest.fn().mockImplementation((token) => ({
    sub: 'test-user-id',
    email: 'test@example.com',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  })),
  decode: jest.fn().mockImplementation((token) => ({
    sub: 'test-user-id',
    email: 'test@example.com',
  })),
};

// Mock Config service
const mockConfigService = {
  get: jest.fn(<T = any>(key: string): T | null => {
    const config: Record<string, any> = {
      'JWT_SECRET': 'test-secret',
      'JWT_EXPIRES_IN': '1h',
      'REFRESH_TOKEN_SECRET': 'test-refresh-secret',
      'REFRESH_TOKEN_EXPIRES_IN': '7d',
      'NODE_ENV': 'test',
    };
    return config[key] ?? null;
  }),
};

// Mock Prisma service
const mockPrismaService = {
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  // Add other models as needed
};

// Mock WebSocket client
interface MockSocket {
  id: string;
  handshake: {
    auth: {
      token?: string;
    };
  };
  data: Record<string, any>;
  join: jest.Mock;
  leave: jest.Mock;
  emit: jest.Mock;
  to: jest.Mock;
  disconnect: jest.Mock;
}

/**
 * Create a test application with the given providers and imports
 */
export async function createTestingModule({
  providers = [],
  imports = [],
  controllers = [],
}: {
  providers?: any[];
  imports?: any[];
  controllers?: any[];
} = {}) {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env.test',
      }),
      ...imports,
    ],
    controllers,
    providers: [
      ...providers,
      {
        provide: JwtService,
        useValue: mockJwtService,
      },
      {
        provide: ConfigService,
        useValue: mockConfigService,
      },
      {
        provide: PrismaService,
        useValue: mockPrismaService,
      },
    ],
  })
    .setLogger(new NestLogger())
    .compile();

  const app = moduleFixture.createNestApplication();
  
  // Apply global pipes, filters, guards, etc. if needed
  // app.useGlobalPipes(new ValidationPipe());
  
  await app.init();
  
  return { 
    app, 
    module: moduleFixture,
    mocks: {
      jwtService: mockJwtService,
      configService: mockConfigService,
      prismaService: mockPrismaService,
    },
  };
}

/**
 * Create a mock WebSocket client
 */
export function createMockSocket(token?: string, user: any = { id: 'test-user-id' }): MockSocket {
  return {
    id: 'test-socket-id',
    handshake: {
      auth: {
        token: token || 'mock-jwt-token',
      },
    },
    data: { user },
    join: jest.fn().mockReturnThis(),
    leave: jest.fn().mockReturnThis(),
    emit: jest.fn().mockReturnThis(),
    to: jest.fn().mockReturnThis(),
    disconnect: jest.fn().mockReturnThis(),
  } as any;
}
