// Simple verification script for WebSocket heartbeat functionality
console.log('Testing WebSocket Heartbeat Functionality');

import { ChatGateway } from '../src/modules/chat/chat.gateway';

// Mock dependencies
const mockPresenceService = {
  updateUserPresence: jest.fn(),
  removeUserPresence: jest.fn(),
  isOnline: jest.fn(),
};

const mockRtcGateway = {
  registerWsServer: jest.fn(),
};

// Create gateway instance
const gateway = new ChatGateway(
  mockPresenceService as any,
  mockRtcGateway as any,
);

// Mock WebSocket server and socket
const mockSocket = {
  id: 'test-socket-1',
  connected: true,
  data: {
    user: {
      userId: 'test-user-1',
      email: 'test@example.com',
      name: 'Test User',
    },
  },
  emit: jest.fn(),
  join: jest.fn(),
  leave: jest.fn(),
  disconnect: jest.fn(),
};

// Mock server with sockets
const mockServer = {
  emit: jest.fn(),
  to: jest.fn().mockReturnThis(),
  sockets: {
    sockets: new Map([
      [mockSocket.id, mockSocket]
    ])
  }
};

// Assign mock server to gateway
(gateway as any).server = mockServer;

// Test 1: Verify ping interval setup
console.log('\n=== Test 1: Verify ping interval setup ===');
let pingCallback: () => void = () => {};

const originalSetInterval = setInterval;

// Override setInterval to capture the ping callback
(global as any).setInterval = (callback: () => void) => {
  pingCallback = callback;
  return 12345; // Mock interval ID
};

// Initialize the gateway
(gateway as any).setupPingInterval();
console.log('✅ Ping interval setup complete');

// Restore original setInterval
(global as any).setInterval = originalSetInterval;

// Test 2: Verify ping is sent to connected clients
console.log('\n=== Test 2: Verify ping is sent ===');
const mockTimestamp = Date.now();
const originalDateNow = Date.now;
Date.now = jest.fn(() => mockTimestamp);

// Trigger the ping callback
pingCallback();

// Verify ping was sent
if (mockSocket.emit.mock.calls[0]?.[0] === 'ping' && 
    mockSocket.emit.mock.calls[0]?.[1]?.timestamp === mockTimestamp) {
  console.log('✅ Ping sent with correct timestamp');
} else {
  console.error('❌ Ping not sent correctly');
  console.log('Emit calls:', mockSocket.emit.mock.calls);
}

// Test 3: Verify pong handling
console.log('\n=== Test 3: Verify pong handling ===');
// Get the pong handler from the ping callback
const pongHandler = mockSocket.emit.mock.calls[0][1];

// Reset mock
mockSocket.emit.mockClear();

// Call the pong handler
pongHandler({ timestamp: mockTimestamp });

// Verify missed pongs counter was reset
if ((gateway as any).missedPongs.get(mockSocket.id) === 0) {
  console.log('✅ Pong handled correctly, missed pongs counter reset');
} else {
  console.error('❌ Pong not handled correctly');
  console.log('Missed pongs:', (gateway as any).missedPongs);
}

// Test 4: Verify disconnection after missed pongs
console.log('\n=== Test 4: Verify disconnection after missed pongs ===');
// Simulate missed pongs
const MAX_MISSED_PONGS = 2;
for (let i = 0; i < MAX_MISSED_PONGS + 1; i++) {
  pingCallback();
}

// Verify disconnect was called
if (mockSocket.disconnect.mock.calls.length > 0) {
  console.log('✅ Client disconnected after missing pongs');
} else {
  console.error('❌ Client not disconnected after missing pongs');
}

// Restore mocks
Date.now = originalDateNow;

console.log('\n=== Test Complete ===');
