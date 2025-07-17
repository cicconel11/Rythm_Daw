module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/websocket.connection.spec.ts'],
  testTimeout: 30000, // 30 second timeout
  setupFilesAfterEnv: ['<rootDir>/test/test.websocket.setup.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};
