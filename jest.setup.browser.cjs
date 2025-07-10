// Setup specific to browser environment
const { configure: configureRTL } = require('@testing-library/react');
const { configure: configureDTL } = require('@testing-library/dom');

// Configure RTL
configureRTL({ testIdAttribute: 'data-testid' });
configureDTL({ testIdAttribute: 'data-testid' });

// Mock browser APIs
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

// Mock WebSocket
class MockWebSocket {
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
}

global.WebSocket = MockWebSocket;

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
