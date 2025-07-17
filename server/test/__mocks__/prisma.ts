export const mockPrismaClient = {
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

export const PrismaClient = jest.fn(() => mockPrismaClient);

export default {
  PrismaClient,
  mockPrismaClient,
};
