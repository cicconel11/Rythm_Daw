import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../src/prisma/prisma.service';
import { AwsS3Service } from '../src/modules/files/aws-s3.service';

// Mock PrismaService
interface MockPrismaService {
  $connect: jest.Mock;
  $disconnect: jest.Mock;
  $on: jest.Mock;
  $transaction: jest.Mock;
  user: {
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    findMany: jest.Mock;
    delete: jest.Mock;
  };
}

export const mockPrismaService: MockPrismaService = {
  $connect: jest.fn().mockResolvedValue(undefined),
  $disconnect: jest.fn().mockResolvedValue(undefined),
  $on: jest.fn(),
  $transaction: jest.fn((fn) => fn(mockPrismaService)),
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
  },
};

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
}

export const mockAwsS3Service: MockAwsS3Service = {
  uploadFile: jest.fn(),
  deleteFile: jest.fn(),
  getFileUrl: jest.fn(),
  getPresignedUrl: jest.fn().mockResolvedValue({
    putUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
    getUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
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
