module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'test',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../src/$1',
  },
  modulePaths: ['<rootDir>/../src'],
  moduleDirectories: ['node_modules', 'src'],
};
