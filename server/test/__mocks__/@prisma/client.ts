import { PrismaClient as OriginalPrismaClient } from '@prisma/client';

// Define the shape of our mock Prisma client
type MockPrismaClient = {
  $connect: jest.Mock<Promise<void>>;
  $disconnect: jest.Mock<Promise<void>>;
  $on: jest.Mock;
  $transaction: <T>(fn: (prisma: MockPrismaClient) => Promise<T>) => Promise<T>;
  user: {
    findUnique: jest.Mock;
    findFirst: jest.Mock;
    findMany: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    count: jest.Mock;
  };
  // Add other models as needed
};

// Create a typed mock Prisma client
const prisma: MockPrismaClient = {
  $connect: jest.fn().mockResolvedValue(undefined),
  $disconnect: jest.fn().mockResolvedValue(undefined),
  $on: jest.fn(),
  $transaction: jest.fn((fn) => fn(prisma)),
  
  // Add your models here with their CRUD operations
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  // Add other models as needed
};

// Mock the PrismaClient constructor
const PrismaClient = jest.fn((): MockPrismaClient => prisma) as unknown as typeof OriginalPrismaClient;

// Mock the Prisma namespace
export const Prisma = {
  PrismaClient,
  // Add other Prisma exports as needed
};

export default prisma;
