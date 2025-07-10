// Mock TypeORM
const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(entity => entity),
  createQueryBuilder: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
    getOne: jest.fn().mockResolvedValue(null),
    getCount: jest.fn().mockResolvedValue(0),
    execute: jest.fn().mockResolvedValue({}),
  })),
};

const mockConnection = {
  getRepository: jest.fn(() => mockRepository),
  createQueryRunner: jest.fn(() => ({
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      getRepository: jest.fn(() => mockRepository),
    },
  })),
};

const mockDataSource = {
  initialize: jest.fn().mockResolvedValue(mockConnection),
  getRepository: mockConnection.getRepository,
  createQueryRunner: mockConnection.createQueryRunner,
};

module.exports = {
  Entity: () => (target) => target,
  PrimaryGeneratedColumn: () => (target, propertyKey) => {},
  Column: () => (target, propertyKey) => {},
  CreateDateColumn: () => (target, propertyKey) => {},
  UpdateDateColumn: () => (target, propertyKey) => {},
  ManyToOne: () => (target, propertyKey) => {},
  OneToMany: () => (target, propertyKey) => {},
  JoinColumn: () => (target, propertyKey) => {},
  Index: () => (target, propertyKey) => {},
  Unique: () => (target, propertyKey) => {},
  BeforeInsert: () => (target, propertyKey, descriptor) => {},
  BeforeUpdate: () => (target, propertyKey, descriptor) => {},
  
  DataSource: jest.fn().mockImplementation(() => mockDataSource),
  
  // Mock repository methods
  getRepository: jest.fn(() => mockRepository),
  getConnection: jest.fn(() => mockConnection),
  createConnection: jest.fn(() => Promise.resolve(mockConnection)),
  
  // Mock query builder
  createQueryBuilder: jest.fn(() => mockRepository.createQueryBuilder()),
  
  // Mock repository instance for testing
  getMockRepository: () => mockRepository,
  getMockConnection: () => mockConnection,
  getMockDataSource: () => mockDataSource,
};
