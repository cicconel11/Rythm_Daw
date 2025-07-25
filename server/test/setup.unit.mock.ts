import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

// Load environment variables from .env file
config({ path: '.env.test' });

// Global ConfigService mock
jest.mock('@nestjs/config');
(ConfigService as jest.Mock).mockImplementation(() => ({
  get: jest.fn((key: string) => {
    const config: { [key: string]: string } = {
      JWT_REFRESH_SECRET: 'test-refresh-secret',
      JWT_ACCESS_SECRET: 'test-access-secret',
      S3_BUCKET: 'test-bucket',
      AWS_REGION: 'us-east-1',
      AWS_ACCESS_KEY_ID: 'test-access-key',
      AWS_SECRET_ACCESS_KEY: 'test-secret-key',
    };
    return config[key] || process.env[key];
  }),
}));

// Mock WebSocket server for testing
jest.mock('ws', () => {
  // Create a mock WebSocket instance
  class MockWebSocket {
    static CONNECTING = 0;
    static OPEN = 1;
    static CLOSING = 2;
    static CLOSED = 3;

    public readyState = MockWebSocket.OPEN;
    public bufferedAmount = 0;
    public onopen: (() => void) | null = null;
    public onmessage: ((data: unknown) => void) | null = null;
    public onclose: (() => void) | null = null;
    public onerror: ((error: Error) => void) | null = null;

    public send = jest.fn((data: unknown, cb: (err?: Error) => void) => cb());
    public close = jest.fn();
    public terminate = jest.fn();
    public pause = jest.fn();
    public resume = jest.fn();
    public addEventListener = jest.fn();
    public removeEventListener = jest.fn();
    public dispatchEvent = jest.fn();

    constructor() {
      // Simulate connection after a small delay
      setTimeout(() => {
        if (this.onopen) this.onopen();
      }, 10);
    }
  }


  // Mock WebSocket server
  const mockServer = {
    on: jest.fn(),
    close: jest.fn((cb) => cb()),
    address: jest.fn(() => ({ port: 8080 })),
  };

  // Add static properties to the mock WebSocket
  const mockWebSocket: unknown = MockWebSocket;
  mockWebSocket.Server = jest.fn(() => mockServer);
  mockWebSocket.WebSocket = MockWebSocket;

  return mockWebSocket;
});

// Mock JWT verification
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn().mockReturnValue({ sub: 'test-user' }),
  sign: jest.fn().mockReturnValue('test-token'),
  decode: jest.fn().mockReturnValue({ sub: 'test-user' }),
}));

// Mock rate-limiter-flexible
jest.mock('rate-limiter-flexible', () => {
  return {
    RateLimiterMemory: jest.fn().mockImplementation(() => ({
      consume: jest.fn().mockResolvedValue(1),
      get: jest.fn().mockResolvedValue({ remainingPoints: 100 }),
      delete: jest.fn().mockResolvedValue(true),
    })),
  };
});
