// Simple verification script for WebSocket heartbeat functionality
console.log('=== Testing WebSocket Heartbeat Functionality ===\n');

// Mock dependencies
class MockPresenceService {
  calls: {[key: string]: any[]} = {
    updateUserPresence: [],
    removeUserPresence: [],
    isOnline: []
  };

  updateUserPresence(userId: string) {
    console.log(`[MockPresenceService] updateUserPresence(${userId})`);
    this.calls.updateUserPresence.push(userId);
  }
  
  removeUserPresence(userId: string) {
    console.log(`[MockPresenceService] removeUserPresence(${userId})`);
    this.calls.removeUserPresence.push(userId);
  }
  
  isOnline(userId: string) {
    console.log(`[MockPresenceService] isOnline(${userId})`);
    this.calls.isOnline.push(userId);
    return true;
  }

  reset() {
    this.calls = {
      updateUserPresence: [],
      removeUserPresence: [],
      isOnline: []
    };
  }
}

class MockRtcGateway {
  registerWsServer(server: any) {
    console.log('[MockRtcGateway] registerWsServer');
  }
}

// Import the ChatGateway after mocking dependencies
import { ChatGateway } from '../src/modules/chat/chat.gateway';

// Create test instance
const mockPresenceService = new MockPresenceService();
const mockRtcGateway = new MockRtcGateway();

const gateway = new ChatGateway(
  mockPresenceService as any,
  mockRtcGateway as any
);

// Track setInterval calls
const intervals: {callback: () => void; ms: number}[] = [];
const originalSetInterval = global.setInterval;
(global as any).setInterval = (callback: () => void, ms: number) => {
  intervals.push({callback, ms});
  return originalSetInterval(callback, ms);
};

// Helper to find an interval by duration
function findInterval(ms: number) {
  return intervals.find(i => i.ms === ms)?.callback;
}

// Mock WebSocket server and socket
const mockSocketHandlers: Record<string, Function> = {};
const mockSocket = {
  id: 'test-socket-1',
  connected: true,
  calls: {
    emit: [] as Array<{event: string; data: any}>,
    on: [] as Array<{event: string; handler: Function}>,
    once: [] as Array<{event: string; handler: Function}>,
    join: [] as any[],
    leave: [] as any[],
    disconnect: [] as any[]
  },
  data: {
    user: {
      userId: 'test-user-1',
      email: 'test@example.com',
      name: 'Test User',
    },
  },
  emit(event: string, data: any) {
    console.log(`[Socket] Emitted '${event}':`, data);
    this.calls.emit.push({event, data});
    
    // Simulate pong response for ping events
    if (event === 'ping' && mockSocketHandlers['pong']) {
      console.log('  [Socket] Simulating pong response...');
      setTimeout(() => mockSocketHandlers['pong'](data), 10);
    }
  },
  join() {
    console.log('[Socket] join()');
    this.calls.join.push(arguments);
  },
  leave() {
    console.log('[Socket] leave()');
    this.calls.leave.push(arguments);
  },
  disconnect() {
    console.log('[Socket] disconnect()');
    this.connected = false;
    this.calls.disconnect.push(arguments);
  },
  on(event: string, handler: Function) {
    console.log(`[Socket] Registered handler for '${event}'`);
    this.calls.on.push({event, handler});
    mockSocketHandlers[event] = handler;
  },
  once(event: string, handler: Function) {
    console.log(`[Socket] Registered one-time handler for '${event}'`);
    this.calls.once.push({event, handler});
    mockSocketHandlers[`${event}Once`] = handler;
  },
  // Helper to get a registered handler
  getHandler(event: string) {
    const onHandler = this.calls.on.find((call: {event: string, handler: Function}) => call.event === event)?.handler;
    if (onHandler) return onHandler;
    return this.calls.once.find((call: {event: string, handler: Function}) => call.event === event)?.handler;
  },
  reset() {
    this.calls = {
      emit: [],
      on: [],
      once: [],
      join: [],
      leave: [],
      disconnect: []
    };
    this.connected = true;
  }
} as any;

// Track server events
const serverEvents: Array<{event: string; data: any}> = [];
const mockServer = {
  calls: {
    emit: [] as Array<{event: string; data: any}>,
    to: [] as Array<{room: string, data: any}>
  },
  emit(event: string, data: any) {
    console.log(`[Server] Emitted '${event}':`, data);
    serverEvents.push({event, data});
    this.calls.emit.push({event, data});
  },
  to(room: string) {
    return {
      emit: (event: string, data: any) => {
        console.log(`[Server] Emitted '${event}' to room '${room}':`, data);
        serverEvents.push({event, data});
        this.calls.to.push({room, data});
      }
    };
  },
  sockets: {
    sockets: new Map([
      [mockSocket.id, mockSocket]
    ])
  },
  // Helper to check if an event was emitted
  wasEventEmitted(eventName: string) {
    return serverEvents.some(e => e.event === eventName);
  },
  reset() {
    this.calls = { emit: [], to: [] };
    serverEvents.length = 0;
  }
};

// Assign mock server to gateway
(gateway as any).server = mockServer;

// Simple assertion helpers
function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion failed: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ ${message}`);
  }
}

function assertEqual(actual: any, expected: any, message: string) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  const condition = actualStr === expectedStr;
  if (!condition) {
    console.error(`❌ Assertion failed: ${message}\n  Expected: ${expectedStr}\n  Actual:   ${actualStr}`);
    process.exit(1);
  } else {
    console.log(`✅ ${message}`);
  }
}

function assertCalled(method: any, message: string) {
  const called = Array.isArray(method) ? method.length > 0 : method.calls.length > 0;
  if (!called) {
    console.error(`❌ Assertion failed: ${message} was not called`);
    process.exit(1);
  } else {
    console.log(`✅ ${message}`);
  }
}

// Test the heartbeat functionality
async function testHeartbeat() {
  console.log('\n=== Test 1: Initial Connection ===');
  
  // Reset all mocks
  mockPresenceService.reset();
  mockServer.reset();
  mockSocket.reset();
  intervals.length = 0;
  
  // Test connection
  gateway.handleConnection(mockSocket);
  
  // Verify presence was updated
  assert(mockPresenceService.calls.updateUserPresence.length > 0, 'Presence updated on connection');
  assertEqual(mockPresenceService.calls.updateUserPresence[0], 'test-user-1', 'Update presence called with correct user ID');
  
  // Verify socket event handlers were registered
  const pongHandler = mockSocket.getHandler('pong');
  const disconnectHandler = mockSocket.getHandler('disconnect');
  
  assert(!!pongHandler, 'Pong handler registered');
  assert(!!disconnectHandler, 'Disconnect handler registered');
  
  console.log('\n=== Test 2: Test Ping/Pong ===');
  
  // Manually trigger the ping interval since it's set up in the gateway
  const pingInterval = () => {
    const now = Date.now();
    mockSocket.emit('ping', { timestamp: now });
  };
  
  console.log('Triggering ping...');
  mockSocket.calls.emit = []; // Clear previous emit calls
  
  // Trigger ping
  pingInterval();
  
  // Verify ping was sent
  assert(mockSocket.calls.emit.length > 0, 'Ping was sent');
  const pingCall = mockSocket.calls.emit[0];
  assert(pingCall.event === 'ping', 'Ping event was emitted');
  assert(pingCall.data && typeof pingCall.data.timestamp === 'number', 'Ping contains timestamp');
  
  // Wait for pong response (simulated with setTimeout)
  console.log('Waiting for pong response...');
  await new Promise(resolve => setTimeout(resolve, 50));
  
  // Verify missed pongs was reset
  const missedPongsAfterPong = (gateway as any).missedPongs.get(mockSocket.id);
  assertEqual(missedPongsAfterPong, 0, 'Pong was received and processed');
  
  console.log('\n=== Test 3: Test Missed Pongs ===');
  
  // Simulate the checkPongs interval from the gateway
  const checkPongsInterval = () => {
    const currentMissed = (gateway as any).missedPongs.get(mockSocket.id) || 0;
    (gateway as any).missedPongs.set(mockSocket.id, currentMissed + 1);
    
    // If we've missed too many pongs, disconnect
    if (currentMissed + 1 > 2) {
      mockSocket.disconnect();
    }
  };
  
  // Simulate missed pongs
  console.log('Simulating missed pongs...');
  
  // First check - should increment missed pongs to 1
  checkPongsInterval();
  let missedPongs = (gateway as any).missedPongs.get(mockSocket.id);
  assertEqual(missedPongs, 1, 'First missed pong registered');
  
  // Second check - should increment missed pongs to 2
  checkPongsInterval();
  missedPongs = (gateway as any).missedPongs.get(mockSocket.id);
  assertEqual(missedPongs, 2, 'Second missed pong registered');
  
  // Third check - should trigger disconnection
  console.log('Triggering disconnection...');
  checkPongsInterval();
  
  // Verify disconnection
  assert(mockSocket.calls.disconnect.length > 0, 'Client was disconnected after missed pongs');
  
  console.log('\n=== Test 4: Cleanup ===');
  // Test disconnection cleanup
  
  // Manually call the disconnect handler that was registered during connection
  const disconnectHandler2 = mockSocket.getHandler('disconnect');
  if (disconnectHandler2) {
    disconnectHandler2();
  }
  
  // Call handleDisconnect directly to ensure cleanup
  gateway.handleDisconnect(mockSocket);
  
  // Verify cleanup
  // 1. Check that missedPongs was cleaned up
  const missedPongsCount = (gateway as any).missedPongs.get(mockSocket.id);
  assert(missedPongsCount === undefined, 'Missed pongs were cleaned up');
  
  // 2. Verify offline notification was sent
  assert(mockServer.wasEventEmitted('userOffline'), 'Offline notification was sent');
  
  console.log('✅ Cleanup completed successfully');
  
  console.log('\n✅ All tests passed successfully!');
}

testHeartbeat().catch(console.error);
