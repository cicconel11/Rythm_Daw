module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  testPathIgnorePatterns: ['/node_modules/'],
  detectOpenHandles: true,
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', {
      tsconfig: 'tsconfig.spec.json',
    }],
  },
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/test/test.setup.ts'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
    '^@prisma/client$': '<rootDir>/test/__mocks__/@prisma/client',
    'aws-sdk': '<rootDir>/test/__mocks__/aws-sdk',
    'socket.io-client': '<rootDir>/test/__mocks__/socket.io-client',
    '^@prisma/client/(.*)$': '<rootDir>/node_modules/@prisma/client/$1',
  },
  modulePaths: ['<rootDir>', '<rootDir>/node_modules'],
  moduleDirectories: ['node_modules', 'src'],
  globals: {},
  transformIgnorePatterns: [
    '/node_modules/(?!@nestjs|@nestjs/.*|@prisma/client|@?\\.(js|mjs|cjs)$)'
  ],
  // Reset mocks between tests
  resetMocks: true,
  // Clear mock calls between tests
  clearMocks: true,
  // Reset modules between tests to avoid state leakage
  resetModules: true,
};
