// Minimal mock for socket.io-client
const mockSocket = {
  id: 'test-socket-id',
  connected: true,
  disconnected: false,
  disconnectOnServer: false,
  
  // Basic event handling
  on: jest.fn((event: string, callback: (...args: any[]) => void) => {
    if (event === 'connect') {
      callback();
    }
    return mockSocket;
  }),
  
  // Mock Socket.IO methods
  off: jest.fn().mockReturnThis(),
  emit: jest.fn().mockReturnThis(),
  close: jest.fn().mockReturnThis(),
  disconnect: jest.fn().mockImplementation(() => {
    mockSocket.connected = false;
    mockSocket.disconnected = true;
    return mockSocket;
  }),
  
  // Mock Manager instance with minimal implementation
  io: {
    reconnection: jest.fn().mockReturnThis(),
    reconnectionAttempts: jest.fn().mockReturnThis(),
    reconnectionDelay: jest.fn().mockReturnThis(),
    reconnectionDelayMax: jest.fn().mockReturnThis(),
    randomizationFactor: jest.fn().mockReturnThis(),
    timeout: jest.fn().mockReturnThis(),
  },
  
  // Mock other required properties
  auth: {},
  listeners: jest.fn().mockReturnValue([]),
  hasListeners: jest.fn().mockReturnValue(false),
  removeAllListeners: jest.fn().mockReturnThis(),
};

// Mock the io function
const io = jest.fn(() => mockSocket);

// Add mock reset functionality
(io as any)._mockSocket = mockSocket;
(io as any)._reset = () => {
  mockSocket.connected = true;
  mockSocket.disconnected = false;
};

// Export the mock
export { io };
export default io;
