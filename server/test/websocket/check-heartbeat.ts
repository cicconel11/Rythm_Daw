// Simple script to verify WebSocket heartbeat functionality
console.log('=== Testing WebSocket Heartbeat Functionality ===\n');

// Mock dependencies
class MockPresenceService {
  updateUserPresence(userId: string) {
    console.log(`[MockPresenceService] updateUserPresence(${userId})`);
  }
  
  removeUserPresence(userId: string) {
    console.log(`[MockPresenceService] removeUserPresence(${userId})`);
  }
  
  isOnline(userId: string) {
    console.log(`[MockPresenceService] isOnline(${userId})`);
    return true;
  }
}

class MockRtcGateway {
  registerWsServer(server: unknown) {
    console.log('[MockRtcGateway] registerWsServer');
  }
}

// Import the ChatGateway after mocking dependencies
import { ChatGateway } from '../src/modules/chat/chat.gateway';

// Create test instance
const gateway = new ChatGateway(
  new MockPresenceService() as unknown,
  new MockRtcGateway() as unknown
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
  emit: (event: string, data: unknown) => {
    console.log(`[Socket] Emitted '${event}':`, data);
    
    // Simulate pong response for ping events
    if (event === 'ping') {
      console.log('  [Socket] Simulating pong response...');
      // The actual pong handler would be called here in a real scenario
      // We'll simulate this by directly calling the pong handler
      if (mockSocket['pongHandler']) {
        mockSocket['pongHandler'](data);
      }
    }
  },
  join: () => console.log('[Socket] join()'),
  leave: () => console.log('[Socket] leave()'),
  disconnect: () => {
    console.log('[Socket] disconnect()');
    mockSocket.connected = false;
  },
  on: (event: string, handler: unknown) => {
    console.log(`[Socket] Registered handler for '${event}'`);
    mockSocket[`${event}Handler`] = handler;
  },
  once: (event: string, handler: unknown) => {
    console.log(`[Socket] Registered one-time handler for '${event}'`);
    mockSocket[`${event}OnceHandler`] = handler;
  },
} as unknown;

// Mock server with sockets
const mockServer = {
  emit: (event: string, data: unknown) => {
    console.log(`[Server] Emitted '${event}':`, data);
  },
  to: () => ({
    emit: (event: string, data: unknown) => {
      console.log(`[Server] Emitted '${event}' to room:`, data);
    }
  }),
  sockets: {
    sockets: new Map([
      [mockSocket.id, mockSocket]
    ])
  }
};

// Assign mock server to gateway
(gateway as unknown as any).server = mockServer;

// Test the heartbeat functionality
async function testHeartbeat() {
  console.log('\n=== Test 1: Initial Connection ===');
  gateway.handleConnection(mockSocket);
  
  console.log('\n=== Test 2: Simulate Ping ===');
  // Manually trigger the ping interval
  const pingInterval = (gateway as unknown as any).pingInterval;
  
  if (!pingInterval) {
    console.log('No ping interval found, creating a manual test...');
    
    // Manually set up the ping interval for testing
    const mockTimestamp = 1000;
    const originalDateNow = Date.now;
    Date.now = () => mockTimestamp;
    
    console.log('\n=== Test 3: Manual Ping Test ===');
    console.log('Sending ping to client...');
    
    // Manually call the ping logic that would be in the interval
    const now = Date.now();
    console.log(`[Server] Sending ping at ${now}`);
    
    // The socket.emit('ping') should trigger our mock emit which simulates a pong
    mockSocket.emit('ping', { timestamp: now });
    
    // Verify the client received the ping and sent a pong
    console.log('\n=== Test 4: Verify Pong Handling ===');
    console.log('Checking if pong was handled...');
    
    // The pong handler should have been called by our mock socket.emit
    // and reset the missedPongs counter
    const missedPongs = (gateway as unknown as any).missedPongs.get(mockSocket.id);
    console.log(`Missed pongs count: ${missedPongs} (should be 0 after pong)`);
    
    // Test disconnection after missed pongs
    console.log('\n=== Test 5: Test Missed Pongs ===');
    console.log('Simulating missed pongs...');
    
    // Simulate missing pongs by directly incrementing the counter
    const MAX_MISSED_PONGS = 2;
    for (let i = 0; i < MAX_MISSED_PONGS + 1; i++) {
      const currentMissed = (gateway as unknown as any).missedPongs.get(mockSocket.id) || 0;
      (gateway as unknown as any).missedPongs.set(mockSocket.id, currentMissed + 1);
      console.log(`Set missed pongs to ${currentMissed + 1}`);
    }
    
    // The next ping should trigger a disconnection
    console.log('\n=== Test 6: Trigger Disconnection ===');
    console.log('Sending ping that should trigger disconnection...');
    mockSocket.emit('ping', { timestamp: Date.now() });
    
    // Restore Date.now
    Date.now = originalDateNow;
  }
  
  console.log('\n=== Test 5: Simulate Disconnection ===');
  gateway.handleDisconnect(mockSocket);
  
  console.log('\n=== Test Complete ===');
}

testHeartbeat().catch(console.error);
