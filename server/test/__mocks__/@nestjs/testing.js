const { Test } = require('@nestjs/testing');
const { Logger } = require('@nestjs/common');

// Mock the actual Test module
const actualTesting = jest.requireActual('@nestjs/testing');

// Create a mock Logger class
class MockLogger extends Logger {
  constructor() {
    super();
    this.log = jest.fn();
    this.error = jest.fn();
    this.warn = jest.fn();
    this.debug = jest.fn();
    this.verbose = jest.fn();
  }
}

// Create a TestingModuleBuilder with our mocks
class TestingModuleBuilder {
  constructor() {
    this.providers = [];
    this.controllers = [];
    this.imports = [];
    this.exports = [];
  }

  overrideProvider(token: unknown) {
    return this;
  }

  overrideGuard(token: unknown) {
    return this;
  }

  overrideInterceptor(token: unknown) {
    return this;
  }

  overridePipe(token: unknown) {
    return this;
  }

  overrideFilter(token: unknown) {
    return this;
  }

  overrideModule(token: unknown) {
    return this;
  }

  compile() {
    return {
      createNestApplication: jest.fn().mockReturnValue({
        useGlobalPipes: jest.fn().mockReturnThis(),
        useGlobalFilters: jest.fn().mockReturnThis(),
        useGlobalInterceptors: jest.fn().mockReturnThis(),
        useGlobalGuards: jest.fn().mockReturnThis(),
        listen: jest.fn().mockResolvedValue(undefined),
        get: jest.fn(),
        getHttpServer: jest.fn().mockReturnValue({
          address: jest.fn().mockReturnValue({ port: 3000 }),
        }),
        close: jest.fn().mockResolvedValue(undefined),
      }),
      get: jest.fn(),
      select: jest.fn().mockReturnThis(),
      resolve: jest.fn(),
      create: jest.fn(),
      close: jest.fn().mockResolvedValue(undefined),
    };
  }
}

// Export our mocks
module.exports = {
  ...actualTesting,
  Test,
  TestingModuleBuilder,
  Logger: MockLogger,
};
