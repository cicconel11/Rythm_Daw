const config = require('./jest.config');

module.exports = {
  ...config,
  testMatch: ['**/*.e2e-spec.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/setup-e2e.ts']
};
