import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UnauthorizedException, HttpStatus } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../../src/modules/auth/auth.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtStrategy } from '../../src/modules/auth/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '../../src/modules/auth/strategies/jwt-refresh.strategy';
import { JwtAuthGuard } from '../../src/modules/auth/guards/jwt-auth.guard';
import { RefreshTokenGuard } from '../../src/modules/auth/guards/refresh-token.guard';
import { prismaMock, resetPrismaMocks } from '../utils/prisma-mock';
import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let prisma: PrismaService;
  let mockPrisma: PrismaClient;
  let mockPrisma: any;

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    resetPrismaMocks();

    // Create mock Prisma service
    mockPrisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({
          id: 'test-user-id',
          email: data.email,
          name: data.name || data.email.split('@')[0],
          password: data.password,
          isApproved: true,
          refreshToken: 'test-refresh-token',
        })),
        findFirst: jest.fn(),
      },
    };

    // Create JWT service
    const jwtService = new JwtService({
      secret: 'test-jwt-secret',
      signOptions: { expiresIn: '15m' },
    });

    // Create config service
    const configService = new ConfigService({
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
    });

    // Mock JWT methods
    jest.spyOn(jwtService, 'sign').mockReturnValue('mocked-jwt-token');
    jest.spyOn(jwtService, 'verify').mockReturnValue({ sub: 'test-user-id' });
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mocked-jwt-token');
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ sub: 'test-user-id' });

    // Mock bcrypt
    jest.spyOn(require('bcrypt'), 'compare').mockImplementation(() => Promise.resolve(true));
    jest.spyOn(require('bcrypt'), 'hash').mockImplementation(() => Promise.resolve('hashed-password'));

    // Create auth service
    authService = new AuthService(jwtService, prisma as any, configService);

    // Make instances available for tests
    this.jwtService = jwtService;
    this.configService = configService;
    this.prisma = prisma;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('refreshTokens', () => {
    it('should return new tokens with valid refresh token', async () => {
      const userId = 'test-user-id';
      const refreshToken = 'valid-refresh-token';
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

      prisma.user.findUnique.mockResolvedValue({
        ...TEST_USER,
        refreshToken: hashedRefreshToken,
      });

      jwtService.verify.mockReturnValue({ sub: TEST_USER.id });
      jwtService.sign.mockReturnValue('new-access-token');
      jwtService.signAsync.mockResolvedValue('new-refresh-token');

      const result = await authService.refreshTokens(TEST_USER.id, refreshToken);

      expect(result).toBeDefined();
      expect(result.accessToken).toBe('new-access-token');
      expect(result.refreshToken).toBe('new-refresh-token');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: TEST_USER.id },
        data: { refreshToken: expect.any(String) },
      });
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      const refreshToken = 'invalid-refresh-token';

      prisma.user.findUnique.mockResolvedValue({
        ...TEST_USER,
        refreshToken: 'different-hashed-token',
      });

      jwtService.verify.mockReturnValue({ sub: TEST_USER.id });

      await expect(
        authService.refreshTokens(TEST_USER.id, refreshToken),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
