// Simple mock implementation for socket.io-client
interface MockSocket {
  id: string;
  connected: boolean;
  disconnected: boolean;
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
  on: jest.Mock<MockSocket, [event: string, callback: (...args: any[]) => void]>;
  off: jest.Mock<MockSocket, [event?: string, callback?: (...args: any[]) => void]>;
  emit: jest.Mock<MockSocket, [event: string, ...args: any[]]>;
  close: jest.Mock<MockSocket, []>;
  disconnect: jest.Mock<MockSocket, []>;
  listeners: jest.Mock<any[], [event: string]>;
  hasListeners: jest.Mock<boolean, [event: string]>;
  removeAllListeners: jest.Mock<MockSocket, [event?: string]>;
  join: jest.Mock<MockSocket, [room: string]>;
  leave: jest.Mock<MockSocket, [room: string]>;
  to: jest.Mock<MockSocket, [room: string]>;
  in: jest.Mock<MockSocket, [room: string]>;
  compress: jest.Mock<MockSocket, [compress: boolean]>;
  volatile: MockSocket;
  broadcast: MockSocket;
}

// Create a type-safe mock socket
const createMockSocket = (): MockSocket => {
  // Create a base object with all the required properties
  const baseSocket: Omit<MockSocket, 'volatile' | 'broadcast'> = {
    id: `test-socket-${Math.random().toString(36).substr(2, 9)}`,
    connected: true,
    disconnected: false,
    io: {
      reconnection: jest.fn().mockReturnThis(),
      reconnectionAttempts: jest.fn().mockReturnThis(),
      reconnectionDelay: jest.fn().mockReturnThis(),
      reconnectionDelayMax: jest.fn().mockReturnThis(),
      timeout: jest.fn().mockReturnThis(),
    },
    _pid: 'test-pid',
    _lastOffset: '0',
    recovered: false,
    handshake: {
      auth: {},
      headers: {},
      query: {},
      user: {}
    },
    on: jest.fn<MockSocket, [string, (...args: any[]) => void]>((event, callback) => {
      if (event === 'connect') {
        process.nextTick(() => callback());
      }
      return socket as MockSocket;
    }),
    off: jest.fn<MockSocket, [string, (...args: any[]) => void]>(() => socket as MockSocket),
    emit: jest.fn<MockSocket, [string, ...any[]]>((event, ...args) => {
      // Simulate event emission
      if (baseSocket.on.mock.calls) {
        baseSocket.on.mock.calls.forEach((call) => {
          const [e, cb] = call as [string, (...args: any[]) => void];
          if (e === event) {
            cb(...args);
          }
        });
      }
      return socket as MockSocket;
    }),
    close: jest.fn<MockSocket, []>(() => {
      baseSocket.connected = false;
      baseSocket.disconnected = true;
      return socket as MockSocket;
    }),
    disconnect: jest.fn<MockSocket, []>(() => {
      baseSocket.connected = false;
      baseSocket.disconnected = true;
      return socket as MockSocket;
    }),
    listeners: jest.fn<any[], [string]>(() => []),
    hasListeners: jest.fn<boolean, [string]>(() => false),
    removeAllListeners: jest.fn<MockSocket, [string]>(() => socket as MockSocket),
    join: jest.fn<MockSocket, [string]>(() => socket as MockSocket),
    leave: jest.fn<MockSocket, [string]>(() => socket as MockSocket),
    to: jest.fn<MockSocket, [string]>(() => socket as MockSocket),
    in: jest.fn<MockSocket, [string]>(() => socket as MockSocket),
    compress: jest.fn<MockSocket, [boolean]>(() => socket as MockSocket),
  };

  // Create the socket with circular references
  const socket = {
    ...baseSocket,
    get volatile() { return this as unknown as MockSocket; },
    get broadcast() { return this as unknown as MockSocket; },
  } as MockSocket;

  return socket;
};

// Mock the io function
const io = jest.fn<MockSocket, [string, any]>((url: string, options?: any) => {
  return createMockSocket();
});

// Add static properties
(io as any).protocol = 4;
(io as any).Manager = jest.fn();
(io as any).Socket = jest.fn();
(io as any).connect = io;

export { io };
export default io;
