// Mock Prisma Client Implementation
class MockPrismaClient {
  constructor() {
    // Setup default mock implementations
    this.$connect = jest.fn().mockResolvedValue(undefined);
    this.$disconnect = jest.fn().mockResolvedValue(undefined);
    this.$on = jest.fn();
    this.$transaction = jest.fn((fn) => fn(this));
    this.$executeRaw = jest.fn();
    this.$executeRawUnsafe = jest.fn();
    this.$queryRaw = jest.fn();
    this.$queryRawUnsafe = jest.fn();
    
    // User model
    this.user = {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      upsert: jest.fn(),
      count: jest.fn(),
    };
    
    // Add other models as needed
  }
  
  // Add methods that might be called on the instance
  $connect: jest.Mock<Promise<void>>;
  $disconnect: jest.Mock<Promise<void>>;
  $on: jest.Mock;
  $transaction: jest.Mock;
  $executeRaw: jest.Mock;
  $executeRawUnsafe: jest.Mock;
  $queryRaw: jest.Mock;
  $queryRawUnsafe: jest.Mock;
  
  // Add model types
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
}

// Create a single instance of the mock
const mockPrismaClient = new MockPrismaClient();

// Export the mock Prisma client
export const prisma = mockPrismaClient;

// Export the PrismaClient class
export class PrismaClient {
  constructor() {
    return mockPrismaClient as unknown as PrismaClient;
  }
}

// Export the Prisma namespace
export const Prisma = {
  PrismaClient,
  // Add other Prisma exports as needed
};

// Default export
export default Prisma;
