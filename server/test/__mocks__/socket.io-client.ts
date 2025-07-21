import { EventEmitter } from 'events';

// Mock Socket class that extends EventEmitter
class MockSocketClient extends EventEmitter {
  id: string;
  connected: boolean = true;
  disconnected: boolean = false;
  io: any;
  _pid: string;
  _lastOffset: string;
  recovered: boolean;
  handshake: {
    auth: Record<string, any>;
    headers: Record<string, any>;
    query: Record<string, any>;
    user: Record<string, any>;
  };

  constructor(url: string, options?: any) {
    super();
    this.id = `test-socket-${Math.random().toString(36).substr(2, 9)}`;
    this.io = {
      reconnection: jest.fn().mockReturnThis(),
      reconnectionAttempts: jest.fn().mockReturnThis(),
      reconnectionDelay: jest.fn().mockReturnThis(),
      reconnectionDelayMax: jest.fn().mockReturnThis(),
      timeout: jest.fn().mockReturnThis(),
    };
    this._pid = 'test-pid';
    this._lastOffset = '0';
    this.recovered = false;
    this.handshake = {
      auth: {},
      headers: {},
      query: {},
      user: {}
    };

    // Simulate connection
    process.nextTick(() => {
      this.emit('connect');
    });
  }

  emit(event: string, ...args: any[]): boolean {
    super.emit(event, ...args);
    return true;
  }

  on(event: string, listener: (...args: any[]) => void): MockSocketClient {
    super.on(event, listener);
    return this;
  }

  off(event: string, listener: (...args: any[]) => void): MockSocketClient {
    super.off(event, listener);
    return this;
  }

  close(): MockSocketClient {
    this.connected = false;
    this.disconnected = true;
    this.emit('disconnect');
    return this;
  }

  disconnect(): MockSocketClient {
    this.connected = false;
    this.disconnected = true;
    this.emit('disconnect');
    return this;
  }

  listeners(event: string): any[] {
    return super.listeners(event);
  }

  hasListeners(event: string): boolean {
    return super.listenerCount(event) > 0;
  }

  removeAllListeners(event?: string): MockSocketClient {
    super.removeAllListeners(event);
    return this;
  }

  join(room: string): MockSocketClient {
    return this;
  }

  leave(room: string): MockSocketClient {
    return this;
  }

  to(room: string): MockSocketClient {
    return this;
  }

  in(room: string): MockSocketClient {
    return this;
  }

  compress(compress: boolean): MockSocketClient {
    return this;
  }

  get volatile(): MockSocketClient {
    return this;
  }

  get broadcast(): MockSocketClient {
    return this;
  }
}

// Mock the io function
const io = jest.fn<MockSocketClient, [string, any]>((url: string, options?: any) => {
  return new MockSocketClient(url, options);
});

// Add static properties
(io as any).protocol = 4;
(io as any).Manager = jest.fn();
(io as any).Socket = MockSocketClient;
(io as any).connect = io;

export { io, MockSocketClient };
export default io;
