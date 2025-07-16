import { TEST_USER, ADMIN_USER } from './test-auth-config';

export const prismaMock = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $transaction: jest.fn(),
};

// Default mock implementations
export const setupPrismaMocks = () => {
  // Mock findUnique for user lookup
  prismaMock.user.findUnique.mockImplementation(({ where }) => {
    if (where.email === TEST_USER.email) return Promise.resolve(TEST_USER);
    if (where.email === ADMIN_USER.email) return Promise.resolve(ADMIN_USER);
    if (where.id === TEST_USER.id) return Promise.resolve(TEST_USER);
    if (where.id === ADMIN_USER.id) return Promise.resolve(ADMIN_USER);
    return Promise.resolve(null);
  });

  // Mock update for refresh token updates
  prismaMock.user.update.mockImplementation(({ where, data }) => {
    if (where.id === TEST_USER.id || where.email === TEST_USER.email) {
      return Promise.resolve({ ...TEST_USER, ...data });
    }
    if (where.id === ADMIN_USER.id || where.email === ADMIN_USER.email) {
      return Promise.resolve({ ...ADMIN_USER, ...data });
    }
    return Promise.resolve(null);
  });

  // Mock create for user registration
  prismaMock.user.create.mockImplementation(({ data }) => {
    return Promise.resolve({
      id: 'new-user-id',
      ...data,
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  // Mock transaction
  prismaMock.$transaction.mockImplementation((callback) => {
    return callback(prismaMock);
  });

  return prismaMock;
};

// Reset all mocks before each test
export const resetPrismaMocks = () => {
  Object.values(prismaMock).forEach((mock) => {
    if (typeof mock === 'object' && 'mockReset' in mock) {
      mock.mockReset();
    }
  });
  setupPrismaMocks();
};
