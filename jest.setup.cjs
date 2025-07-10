// For frontend tests
const { configure: configureRTL } = require('@testing-library/react');
const { configure: configureDTL } = require('@testing-library/dom');

// Configure RTL
configureRTL({ testIdAttribute: 'data-testid' });
configureDTL({ testIdAttribute: 'data-testid' });

// Mock global browser APIs
if (typeof globalThis.URL.createObjectURL === 'undefined') {
  Object.defineProperty(globalThis.URL, 'createObjectURL', {
    value: jest.fn(),
  });
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Environment variables for tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret';
process.env.AWS_ACCESS_KEY_ID = 'test-access-key';
process.env.AWS_SECRET_ACCESS_KEY = 'test-secret-key';
process.env.AWS_REGION = 'us-east-1';
process.env.AWS_S3_BUCKET = 'test-bucket';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.NEXTAUTH_SECRET = 'test-nextauth-secret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test?schema=public';

// Global mocks
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Mock fetch
global.fetch = jest.fn();

// Mock WebSocket
global.WebSocket = class MockWebSocket {
  constructor() {
    this.onopen = jest.fn();
    this.onclose = jest.fn();
    this.onmessage = jest.fn();
    this.onerror = jest.fn();
    this.close = jest.fn();
    this.send = jest.fn();
  }
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;
};

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

global.localStorage = localStorageMock;
