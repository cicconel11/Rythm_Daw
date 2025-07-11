module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    // Prevent test code from leaking into production
    'no-restricted-globals': ['error', 'jest', 'expect', 'describe', 'it', 'beforeEach', 'afterEach', 'beforeAll', 'afterAll', 'test'],
    'no-restricted-imports': ['error', {
      paths: ['jest'],
      patterns: ['**/__mocks__/**']
    }]
  },
  overrides: [
    {
      // Allow test globals in test files
      files: ['**/*.spec.ts', '**/__mocks__/**', '**/test/**'],
      env: {
        jest: true,
        node: true,
      },
      rules: {
        'no-restricted-globals': 'off',
        'no-restricted-imports': 'off',
      },
    },
  ],
  env: {
    node: true,
    es2021: true,
  },
};
