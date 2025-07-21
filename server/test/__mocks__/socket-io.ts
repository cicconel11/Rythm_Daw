import { EventEmitter } from 'events';

// Mock Socket class
class MockSocket extends EventEmitter {
  id: string;
  connected: boolean = true;
  disconnected: boolean = false;
  handshake: any;
  data: any = {};
  rooms: Set<string> = new Set();
  broadcast: MockSocket;

  constructor(id: string = 'mock-socket-id') {
    super();
    this.id = id;
    this.handshake = {
      query: {},
      headers: {},
      user: null
    };
    this.broadcast = this;
  }

  join(room: string): Promise<void> {
    this.rooms.add(room);
    return Promise.resolve();
  }

  leave(room: string): Promise<void> {
    this.rooms.delete(room);
    return Promise.resolve();
  }

  to(room: string): MockSocket {
    return this;
  }

  emit(event: string, ...args: any[]): boolean {
    super.emit(event, ...args);
    return true;
  }

  disconnect(close: boolean = true): void {
    this.connected = false;
    this.disconnected = true;
    this.emit('disconnect', 'disconnected');
  }

  once(event: string, listener: (...args: any[]) => void): MockSocket {
    super.once(event, listener);
    return this;
  }

  on(event: string, listener: (...args: any[]) => void): MockSocket {
    super.on(event, listener);
    return this;
  }
}

// Mock Server class
class MockServer extends EventEmitter {
  sockets: any;
  engine: any;

  constructor() {
    super();
    this.sockets = {
      sockets: new Map(),
      emit: jest.fn(),
      to: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      join: jest.fn(),
      leave: jest.fn(),
      disconnect: jest.fn(),
      adapter: {
        rooms: new Map(),
        sids: new Map()
      }
    };
    this.engine = {
      clientsCount: 0
    };
  }

  emit(event: string, ...args: any[]): boolean {
    super.emit(event, ...args);
    return true;
  }

  to(room: string): MockServer {
    return this;
  }

  in(room: string): MockServer {
    return this;
  }

  of(namespace: string): MockServer {
    return this;
  }

  use(middleware: any): MockServer {
    return this;
  }

  on(event: string, listener: (...args: any[]) => void): MockServer {
    super.on(event, listener);
    return this;
  }

  once(event: string, listener: (...args: any[]) => void): MockServer {
    super.once(event, listener);
    return this;
  }
}

// Mock Server constructor
const Server = jest.fn().mockImplementation(() => {
  return new MockServer();
});

// Mock Socket constructor
const Socket = jest.fn().mockImplementation((id?: string) => {
  return new MockSocket(id);
});

export class MockIoServer extends EventEmitter {
  to = () => this;
  emit = this.emit.bind(this);
  on = this.on.bind(this);
  sockets = { leave: jest.fn(), join: jest.fn() };
}

// Export the mock
export default {
  Server,
  Socket,
  MockSocket,
  MockServer
};

// Named exports
export { Server, Socket, MockSocket, MockServer }; 