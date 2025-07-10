/** @type {import('jest').Config} */
module.exports = {
  rootDir: '.',
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Default configuration for Node.js tests
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.node.cjs'],
  
  // Project-specific configurations
  projects: [
    // Node.js (backend) tests
    {
      displayName: 'node',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/server/test/**/*.spec.ts', '<rootDir>/server/test/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.node.cjs'],
    },
    // Browser (frontend) tests
    {
      displayName: 'browser',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/website/src/**/*.test.{ts,tsx}'],
      setupFilesAfterEnv: [
        '<rootDir>/jest.setup.node.cjs',
        '<rootDir>/jest.setup.browser.cjs',
      ],
    },
  ],
  
  // Common configuration for all projects
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/website/src/$1',
    '^@server/(.*)$': '<rootDir>/server/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '^@mocks/(.*)$': '<rootDir>/server/test/__mocks__/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  
  // Don't transform node_modules except for specific packages that need it
  transformIgnorePatterns: [
    '/node_modules/(?!(bcrypt|@nestjs|@prisma|@socket|rxjs|uuid|class-validator|class-transformer|@mikro-orm)/)',
  ],
  
  transform: {
    '^.+\\.(t|j)sx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.json',
        isolatedModules: true,
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',
              options: { metaObjectReplacement: { url: 'https://localhost' } },
            },
          ],
        },
      },
    ],
  },
  
  transformIgnorePatterns: [
    '/node_modules/(?!(nanoid|uuid|@socket.io|@nestjs|@babel|@swc|@testing-library|@types)/)',
  ],
  
  collectCoverageFrom: [
    'server/src/**/*.(service|gateway|controller).ts',
    'website/src/components/**/*.{ts,tsx}',
    '!**/node_modules/**',
  ],
  
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/.next/',
    '/cypress/',
    '/e2e/'
  ],
  
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
