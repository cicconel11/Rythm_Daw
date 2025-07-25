import '@testing-library/jest-dom';
import '@testing-library/react';
import 'jest-axe';

// Mock global fetch
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({}),
    })
  );
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
