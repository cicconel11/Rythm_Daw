module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.e2e.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/website/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageDirectory: 'coverage-e2e',
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  collectCoverageFrom: [
    'server/src/**/*.{ts,tsx}',
    '!server/src/**/*.{test,spec}.{ts,tsx}',
  ],
};
