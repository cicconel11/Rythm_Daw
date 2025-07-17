// Mock Prisma Client
export const PrismaClient = jest.fn().mockImplementation(() => ({
  $connect: jest.fn().mockResolvedValue(undefined),
  $disconnect: jest.fn().mockResolvedValue(undefined),
  $on: jest.fn(),
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
  },
  // Add other Prisma models as needed
}));

export default {
  PrismaClient,
};
