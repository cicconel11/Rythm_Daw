// Custom Jest configuration for WebSocket tests
const baseConfig = require('../jest.config.js');

module.exports = {
  ...baseConfig,
  // Disable test environment to prevent WebSocket mocking
  testEnvironment: 'node',
  // Reset mocks between tests
  resetMocks: true,
  // Clear mock calls between tests
  clearMocks: true,
  // Reset modules between tests to avoid state leakage
  resetModules: true,
  // Setup files after the environment is loaded
  setupFilesAfterEnv: ['<rootDir>/test/test.websocket.setup.ts'],
  // Override module mocks to avoid mocking WebSocket
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    // Remove any WebSocket mocks
    '^ws$': require.resolve('ws')
  },
  // Transform all files with ts-jest
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', {
      tsconfig: 'tsconfig.spec.json',
    }],
  },
};
