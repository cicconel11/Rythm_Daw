import { EventEmitter } from 'events';

// Mock WebSocket class
class MockWebSocket extends EventEmitter {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  binaryType: 'arraybuffer' | 'blob' = 'arraybuffer';
  bufferedAmount = 0;
  extensions = '';
  protocol = '';
  readyState = MockWebSocket.OPEN;
  url: string;

  // Event handlers
  onclose: ((this: MockWebSocket, ev: any) => any) | null = null;
  onerror: ((this: MockWebSocket, ev: any) => any) | null = null;
  onmessage: ((this: MockWebSocket, ev: any) => any) | null = null;
  onopen: ((this: MockWebSocket, ev: any) => any) | null = null;

  constructor(url: string, protocols?: string | string[]) {
    super();
    this.url = url;
    
    // Auto-open the connection
    process.nextTick(() => {
      this.readyState = MockWebSocket.OPEN;
      if (this.onopen) this.onopen({ type: 'open' });
      this.emit('open');
    });
  }

  send(data: any) {
    this.emit('send', data);
    
    // Simulate server response for echo functionality
    if (typeof data === 'string' && data.includes('Hello')) {
      process.nextTick(() => {
        const response = `Echo: ${data}`;
        if (this.onmessage) this.onmessage({ data: response, type: 'message' });
        this.emit('message', response);
      });
    }
  }

  close(code?: number, reason?: string) {
    this.readyState = MockWebSocket.CLOSED;
    if (this.onclose) this.onclose({ code, reason, type: 'close' });
    this.emit('close', { code, reason });
  }

  // Override EventEmitter methods to return this for chaining
  override once(event: string, listener: (...args: any[]) => void): this {
    super.once(event, listener);
    return this;
  }

  override off(event: string, listener?: (...args: any[]) => void): this {
    if (listener) {
      super.off(event, listener);
    } else {
      super.removeAllListeners(event);
    }
    return this;
  }

  override removeAllListeners(event?: string): this {
    super.removeAllListeners(event);
    return this;
  }

  // Test helpers
  _simulateMessage(data: any) {
    if (this.onmessage) this.onmessage({ data, type: 'message' });
    this.emit('message', { data });
  }

  _simulateError(error: Error) {
    if (this.onerror) this.onerror({ error, type: 'error' });
    this.emit('error', error);
  }
}

// Mock WebSocket Server class
class MockWebSocketServer extends EventEmitter {
  options: any;
  clients = new Set<MockWebSocket>();
  
  constructor(options: any) {
    super();
    this.options = options;
  }
  
  // Mock WebSocket server methods
  handleUpgrade() {
    // Simulate upgrade
  }
  
  close(cb?: () => void) {
    this.emit('close');
    if (cb) cb();
  }
  
  // Test helpers
  _simulateConnection(ws: MockWebSocket) {
    this.clients.add(ws);
    this.emit('connection', ws);
  }
}

// Export as default (WebSocket constructor)
const WebSocket = MockWebSocket;

// Export named exports
export { MockWebSocketServer as Server };
export { WebSocket };

// Default export for `import WebSocket from 'ws'`
export default WebSocket; 