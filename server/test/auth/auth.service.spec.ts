import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../src/modules/auth/auth.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { prismaMock } from '../utils/auth-test-setup';
import * as bcrypt from 'bcrypt';

// Create a mock JWT service that implements the required methods
const createMockJwtService = (): jest.Mocked<JwtService> => {
  const mock = {
    sign: jest.fn().mockImplementation((payload: any, options?: any) => {
      if (options?.expiresIn === '15m') return 'mocked-access-token';
      if (options?.expiresIn === '7d') return 'mocked-refresh-token';
      return 'mocked-token';
    }),
    
    verify: jest.fn().mockImplementation((token: string, options: any) => ({
      sub: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User'
    })),
    
    signAsync: jest.fn().mockImplementation((payload: any, options?: any) => {
      if (options?.expiresIn === '15m') return Promise.resolve('mocked-access-token');
      if (options?.expiresIn === '7d') return Promise.resolve('mocked-refresh-token');
      return Promise.resolve('mocked-token');
    }),
    
    verifyAsync: jest.fn().mockResolvedValue({
      sub: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User'
    }),
    
    // Add other required methods with default mock implementations
    decode: jest.fn(),
    signSync: jest.fn().mockReturnValue('mocked-token'),
    verifySync: jest.fn().mockReturnValue({ sub: 'test-user-id' }),
    decodeSync: jest.fn().mockReturnValue({ sub: 'test-user-id' }),
    
    // Add any other methods that might be called
    mergeJwtOptions: jest.fn().mockReturnThis(),
    overrideSecretFromOptions: jest.fn().mockReturnThis(),
    getSecretKey: jest.fn().mockReturnValue('test-secret'),
    createToken: jest.fn().mockReturnValue({ token: 'mocked-token' })
  };
  
  return mock as unknown as jest.Mocked<JwtService>;
};

// Extend the NodeJS namespace to include our custom global types
declare global {
  namespace NodeJS {
    interface Global {
      prisma: typeof prismaMock;
    }
  }
}

const TEST_USER = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashed-password',
  refreshToken: 'hashed-refresh-token',
  isApproved: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwtService: jest.Mocked<JwtService>;
  let configService: any;

  beforeEach(async () => {
    // Create fresh mocks for each test
    jwtService = createMockJwtService();
    
    // Create a simple mock ConfigService
    configService = {
      get: jest.fn((key: string) => {
        const config: Record<string, any> = {
          'auth.accessToken.secret': 'test-secret',
          'auth.accessToken.expiresIn': '15m',
          'auth.refreshToken.secret': 'test-refresh-secret',
          'auth.refreshToken.expiresIn': '7d',
          'JWT_REFRESH_SECRET': 'test-refresh-secret',
        };
        return config[key];
      })
    };

    // Setup bcrypt mocks with proper typing
    (bcrypt.hash as jest.Mock) = jest.fn().mockResolvedValue('hashed-password');
    (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(true);

    // Reset Prisma mock
    prisma = {
      ...prismaMock,
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
      }
    };

    // Setup Prisma mocks
    prisma.user.findUnique.mockImplementation(({ where }: any) => {
      if (where.id === 'test-user-id' || where.email === 'test@example.com') {
        return Promise.resolve({ ...TEST_USER, ...where });
      }
      return Promise.resolve(null);
    });
    
    prisma.user.create.mockResolvedValue(TEST_USER);
    prisma.user.update.mockImplementation(({ where, data }: any) => 
      Promise.resolve({ ...TEST_USER, ...data })
    );
    prisma.user.findFirst.mockResolvedValue(TEST_USER);

    // Initialize the service with mocks in the correct order
    service = new AuthService(
      jwtService,
      prisma,
      configService
    );
    
    // Mock bcrypt
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashed-password'));
    
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('refreshTokens', () => {
    it('should return new tokens with valid refresh token', async () => {
      // Mock the user with a refresh token
      const mockUser = {
        ...TEST_USER,
        refreshToken: 'valid-refresh-token',
      };

      // Setup the JWT verify mock
      jwtService.verify.mockImplementationOnce((token: string, options: any) => ({
        sub: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User'
      }));

      // Mock the Prisma responses
      prisma.user.findUnique.mockResolvedValueOnce(mockUser);
      prisma.user.update.mockImplementation(({ where, data }: any) => 
        Promise.resolve({ ...mockUser, ...data })
      );

      // Call the method
      const result = await service.refreshTokens('test-user-id', 'valid-refresh-token');

      // Verify the results
      expect(result).toHaveProperty('accessToken', 'mocked-access-token');
      expect(result).toHaveProperty('refreshToken', 'mocked-refresh-token');
      expect(result).toHaveProperty('user');
      
      // Verify JWT verify was called with correct parameters
      expect(jwtService.verify).toHaveBeenCalledWith('valid-refresh-token', {
        secret: 'test-refresh-secret',
      });
      
      // Verify the user was updated with a new refresh token
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'test-user-id' },
        data: { refreshToken: 'mocked-refresh-token' },
      });
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      const refreshToken = 'invalid-refresh-token';
      
      const mockUser = {
        ...TEST_USER,
        refreshToken: 'different-hashed-token',
      };
      
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.refreshTokens(TEST_USER.id, refreshToken)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const userId = 'non-existent-user-id';
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.refreshTokens(userId, 'any-token')).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException if refresh token does not match', async () => {
      const refreshToken = 'valid-refresh-token';
      
      const mockUser = {
        ...TEST_USER,
        refreshToken: 'different-hashed-token',
      };
      
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.refreshTokens(TEST_USER.id, refreshToken)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
