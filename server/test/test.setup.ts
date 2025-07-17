import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../src/prisma/prisma.service';
import { AwsS3Service } from '../src/modules/files/aws-s3.service';

// Import our mock Prisma client
import prisma from './__mocks__/@prisma/client';

// Define the shape of our mock Prisma service
interface MockPrismaService {
  $connect: jest.Mock<Promise<void>>;
  $disconnect: jest.Mock<Promise<void>>;
  $on: jest.Mock;
  $transaction: <T>(fn: (prisma: MockPrismaService) => Promise<T>) => Promise<T>;
  user: {
    findUnique: jest.Mock;
    findFirst: jest.Mock;
    findMany: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    upsert: jest.Mock;
    count: jest.Mock;
  };
  // Add other models as needed
}

// Create a mock Prisma service with all required methods
const mockPrismaService: MockPrismaService = {
  $connect: jest.fn().mockResolvedValue(undefined),
  $disconnect: jest.fn().mockResolvedValue(undefined),
  $on: jest.fn(),
  $transaction: jest.fn((fn) => fn(mockPrismaService)),
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    upsert: jest.fn(),
    count: jest.fn(),
  },
  // Add other models as needed
};

export { mockPrismaService };

// Mock ConfigService
interface MockConfigService {
  get: jest.Mock;
}

export const mockConfigService: MockConfigService = {
  get: jest.fn((key: string) => {
    const config: Record<string, string> = {
      JWT_SECRET: 'test-secret',
      JWT_EXPIRES_IN: '3600s',
      REFRESH_TOKEN_EXPIRES_IN: '7d',
      NODE_ENV: 'test',
      AWS_REGION: 'us-east-1',
      AWS_ACCESS_KEY_ID: 'test-access-key-id',
      AWS_SECRET_ACCESS_KEY: 'test-secret-access-key',
      S3_BUCKET_NAME: 'test-bucket',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
    };
    return config[key];
  }),
};

// Mock AwsS3Service
interface MockAwsS3Service {
  uploadFile: jest.Mock;
  deleteFile: jest.Mock;
  getFileUrl: jest.Mock;
  getPresignedUrl: jest.Mock;
  getPresignedPair: jest.Mock;
}

export const mockAwsS3Service: MockAwsS3Service = {
  uploadFile: jest.fn().mockResolvedValue({
    Location: 'https://s3.amazonaws.com/test-bucket/test-file.txt'
  }),
  deleteFile: jest.fn().mockResolvedValue({}),
  getFileUrl: jest.fn().mockReturnValue('https://s3.amazonaws.com/test-bucket/test-file.txt'),
  getPresignedUrl: jest.fn().mockResolvedValue('https://s3.amazonaws.com/test-bucket/test-file.txt'),
  getPresignedPair: jest.fn().mockResolvedValue({
    putUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
    getUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
  }),
};

// Global test setup
beforeAll(async () => {
  // Mock the PrismaService
  jest.mock('../src/prisma/prisma.service', () => ({
    PrismaService: jest.fn().mockImplementation(() => ({
      ...mockPrismaService,
      $on: jest.fn(),
      $connect: jest.fn().mockResolvedValue(undefined),
      $disconnect: jest.fn().mockResolvedValue(undefined),
    })),
  }));

  // Mock the AwsS3Service
  jest.mock('../src/modules/files/aws-s3.service', () => ({
    AwsS3Service: jest.fn().mockImplementation(() => mockAwsS3Service),
  }));

  // Mock ConfigModule
  jest.mock('@nestjs/config', () => ({
    ConfigModule: {
      forRoot: jest.fn(),
    },
  }));
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await mockPrismaService.$disconnect();
});
