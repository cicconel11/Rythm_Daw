// Global test setup
import 'dotenv/config';
import { ensureTestBucket } from "./server/test/ensure-s3-bucket";

// Mock WebSocket for Node.js environment
global.WebSocket = class MockWebSocket extends EventTarget {
  url: string;
  readyState: number;
  CONNECTING = 0;
  OPEN = 1;
  CLOSING = 2;
  CLOSED = 3;

  constructor(url: string) {
    super();
    this.url = url;
    this.readyState = this.CONNECTING;
    
    // Simulate connection
    setTimeout(() => {
      this.readyState = this.OPEN;
      this.dispatchEvent(new Event('open'));
    }, 0);
  }

  send(data: string | ArrayBuffer | ArrayBufferView): void {
    // Mock send implementation
  }

  close(code?: number, reason?: string): void {
    this.readyState = this.CLOSING;
    setTimeout(() => {
      this.readyState = this.CLOSED;
      this.dispatchEvent(new Event('close'));
    }, 0);
  }

  addEventListener(type: string, listener: EventListener): void {
    super.addEventListener(type, listener);
  }

  removeEventListener(type: string, listener: EventListener): void {
    super.removeEventListener(type, listener);
  }
} as any;

// Mock console methods to reduce noise in tests
const originalConsole = { ...console };
beforeAll(() => ensureTestBucket());
beforeAll(async () => {
  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
});

// Global test timeout
jest.setTimeout(15000); 