import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../src/prisma/prisma.service';
import { AwsS3Service } from '../src/modules/files/aws-s3.service';
import { TestWebSocketAdapter } from './test-websocket.adapter';

// Mock PrismaService
export const mockPrismaService = {
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
  },
};

// Mock AwsS3Service
export const mockAwsS3Service = {
  getPresignedUrl: jest.fn().mockResolvedValue({
    putUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
    getUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
  }),
};

// Mock ConfigService
export const mockConfigService = {
  get: jest.fn((key: string) => {
    const config: { [key: string]: string } = {
      'JWT_SECRET': 'test-secret',
      'JWT_EXPIRES_IN': '1h',
      'AWS_REGION': 'us-east-1',
      'AWS_ACCESS_KEY_ID': 'test-access-key-id',
      'AWS_SECRET_ACCESS_KEY': 'test-secret-access-key',
      'S3_BUCKET_NAME': 'test-bucket',
    };
    return config[key];
  }),
};

// Global test setup
beforeAll(async () => {
  // Mock the PrismaService
  jest.mock('../src/prisma/prisma.service', () => ({
    PrismaService: jest.fn().mockImplementation(() => mockPrismaService),
  }));

  // Mock the AwsS3Service
  jest.mock('../src/modules/files/aws-s3.service', () => ({
    AwsS3Service: jest.fn().mockImplementation(() => mockAwsS3Service),
  }));
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
