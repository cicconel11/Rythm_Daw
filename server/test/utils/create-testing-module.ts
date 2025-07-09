import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AppModule } from '../../src/app.module';
import { AwsS3Service } from '../../src/modules/files/aws-s3.service';

declare const global: any;

interface PrismaOverrides {
  $connect?: jest.Mock;
  $disconnect?: jest.Mock;
  user?: {
    findUnique?: jest.Mock;
    create?: jest.Mock;
    update?: jest.Mock;
    findMany?: jest.Mock;
    delete?: jest.Mock;
  };
  // Add other Prisma models as needed
}

interface AwsS3Overrides {
  getPresignedUrl?: jest.Mock;
  // Add other AWS S3 methods as needed
}

interface TestingOverrides {
  prisma?: Partial<PrismaOverrides>;
  awsS3?: Partial<AwsS3Overrides>;
}

// Mock Prisma client
const mockPrismaClient = {
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
  },
  // Add other models as needed
};

// Mock AWS S3 service
const mockAwsS3Service = {
  getPresignedUrl: jest.fn(),
};

export async function createTestingApp(overrides: TestingOverrides = {}): Promise<TestingModule> {
  // Clear all mocks before each test
  jest.clearAllMocks();

  // Apply overrides to mock Prisma client
  Object.assign(mockPrismaClient, overrides.prisma || {});
  
  // Apply overrides to mock AWS S3 service
  Object.assign(mockAwsS3Service, overrides.awsS3 || {});

  // Create testing module with WebSocket adapter
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PrismaService)
    .useValue(mockPrismaClient)
    .overrideProvider(AwsS3Service)
    .useValue(mockAwsS3Service)
    .overrideProvider('IO_SERVER')
    .useValue(null) // Disable the default WebSocket server
    .compile();

  // Store references to mocks for easier access in tests
  const prisma = moduleFixture.get<PrismaService>(PrismaService);
  const awsS3 = moduleFixture.get<AwsS3Service>(AwsS3Service);

  // Make mocks available globally for test setup/assertions
  global.prismaMock = prisma;
  global.awsS3Mock = awsS3;

  return moduleFixture;
}
