// Mock sessionStorage
const mockSessionStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

// Mock fetch
global.fetch = jest.fn() as jest.Mock;

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Mock @zxcvbn-ts/core
jest.mock('@zxcvbn-ts/core', () => ({
  zxcvbn: jest.fn().mockReturnValue({
    score: 4,
    feedback: {
      warning: '',
      suggestions: [],
    },
  }),
}));

// Mock lru-cache
jest.mock('lru-cache', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    has: jest.fn(),
  }));
});
