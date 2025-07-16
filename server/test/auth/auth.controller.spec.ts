import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UnauthorizedException, HttpStatus } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '../../src/modules/auth/auth.controller';
import { AuthService } from '../../src/modules/auth/auth.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtStrategy } from '../../src/modules/auth/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '../../src/modules/auth/strategies/jwt-refresh.strategy';
import { JwtAuthGuard } from '../../src/modules/auth/guards/jwt-auth.guard';
import { RefreshTokenGuard } from '../../src/modules/auth/guards/refresh-token.guard';
import { prismaMock, resetPrismaMocks } from '../utils/prisma-mock';
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';

// Mock the response object
const mockResponse = () => {
  const res = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
    sendStatus: jest.fn(),
    redirect: jest.fn(),
    setHeader: jest.fn(),
    getHeader: jest.fn(),
    getHeaders: jest.fn(() => ({})),
    getHeaderNames: jest.fn(() => []),
    end: jest.fn(),
    on: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
    req: {},
    locals: {},
    app: {},
    statusCode: 200,
    statusMessage: 'OK',
    finished: false,
    headersSent: false,
  } as unknown as Response;
  return res;
};

describe('AuthController', () => {
  // Mock implementations
  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, any> = {
        'auth.accessToken.secret': 'test-access-secret',
        'auth.accessToken.expiresIn': '15m',
        'auth.refreshToken.secret': 'test-refresh-secret',
        'auth.refreshToken.expiresIn': '7d',
        'auth.jwt.secret': 'test-secret',
        'JWT_SECRET': 'test-jwt-secret',
        'JWT_REFRESH_SECRET': 'test-refresh-secret',
      };
      return config[key];
    }),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('test-token'),
    verify: jest.fn().mockReturnValue({ sub: 'test-user-id' }),
    signAsync: jest.fn().mockResolvedValue('test-token'),
    verifyAsync: jest.fn().mockResolvedValue({ sub: 'test-user-id' }),
  };

  const mockAuthService = {
    login: jest.fn(),
    signup: jest.fn(),
    refreshTokens: jest.fn().mockResolvedValue({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    }),
    logout: jest.fn(),
    setRefreshTokenCookie: jest.fn(),
    clearRefreshTokenCookie: jest.fn(),
  };

  let module: TestingModule;
  let controller: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;
  let prisma: PrismaService;
  let res: Response;

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    resetPrismaMocks();

    // Setup Prisma mock
    const mockPrisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
        findFirst: jest.fn(),
      },
    };

    // Create the testing module
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => ({
            auth: {
              accessToken: {
                secret: 'test-access-secret',
                expiresIn: '15m',
              },
              refreshToken: {
                secret: 'test-refresh-secret',
                expiresIn: '7d',
              },
              jwt: {
                secret: 'test-jwt-secret',
              },
            },
          })],
        }),
        JwtModule.register({
          secret: 'test-jwt-secret',
          signOptions: { expiresIn: '15m' },
        }),
        PassportModule,
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        {
          provide: JwtStrategy,
          useValue: {
            validate: jest.fn().mockResolvedValue({ id: 'test-user-id' })
          }
        },
        {
          provide: JwtRefreshStrategy,
          useValue: {
            validate: jest.fn().mockResolvedValue({ id: 'test-user-id' })
          }
        },
        JwtAuthGuard,
        RefreshTokenGuard,
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true })
    .overrideGuard(RefreshTokenGuard)
    .useValue({ canActivate: () => true })
    .compile();

    // Get the instances from the module
    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    prisma = module.get<PrismaService>(PrismaService);

    // Setup default mock implementations
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockImplementation(({ data }) => Promise.resolve({
      id: 'test-user-id',
      email: data.email,
      name: data.name || data.email.split('@')[0],
      password: data.password,
      isApproved: true,
      refreshToken: 'test-refresh-token',
    }));

    // Setup default AuthService mocks
    mockAuthService.login.mockResolvedValue({
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
      },
    });

    mockAuthService.signup.mockResolvedValue({
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
      },
    });

    mockAuthService.refreshTokens.mockResolvedValue({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
      },
    });
  });

  res = mockResponse();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('refreshToken', () => {
    it('should return new access token with valid refresh token', async () => {
      const req = {
        user: { id: TEST_USER.id },
        cookies: { refreshToken: TEST_USER.refreshToken },
      };

      const tokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
        },
      };

      authService.refreshTokens = jest.fn().mockResolvedValue(tokens);

      await controller.refreshToken(req, res);

      expect(authService.refreshTokens).toHaveBeenCalledWith(
        req.user.id,
        req.cookies.refreshToken,
      );
      expect(res.json).toHaveBeenCalledWith({
        accessToken: tokens.accessToken,
      });
    });

    it('should throw UnauthorizedException if refresh token is missing', async () => {
      const mockRequest = {
        user: { sub: 'user-id' },
        cookies: {},
      };

      // Mock the refreshTokens method to throw an error
      jest.spyOn(authService, 'refreshTokens').mockRejectedValue(new UnauthorizedException('Refresh token is required'));

      // Expect the controller to throw an UnauthorizedException
      await expect(
        controller.refreshToken(mockRequest as any, res as any)
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
