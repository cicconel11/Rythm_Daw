// Mock WebSocket Server
const mockServer = {
  on: jest.fn(),
  close: jest.fn((cb) => cb()),
  address: jest.fn(() => ({ port: 8080 })),
};

import { EventEmitter } from 'events';

// WebSocket mock class implementing the WebSocket interface
export class MockWebSocket extends EventEmitter implements WebSocket {
  public id: string;
  constructor(id: string = Math.random().toString(36).substring(2,15)) {
    super();
    this.id = id;
  }
  
  // Required WebSocket properties
  readonly CONNECTING = 0;
  readonly OPEN = 1;
  readonly CLOSING = 2;
  readonly CLOSED = 3;
  
  // WebSocket properties
  binaryType: BinaryType = 'arraybuffer';
  readonly bufferedAmount: number = 0;
  readonly extensions: string = '';
  readonly protocol: string = '';
  readonly url: string = 'ws://localhost:8080';
  
  // Event handlers
  onopen: ((this: WebSocket, ev: Event) => any) | null = null;
  onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null = null;
  onclose: ((this: WebSocket, ev: CloseEvent) => any) | null = null;
  onerror: ((this: WebSocket, ev: Event) => any) | null = null;
  
  // Mock implementations
  readyState: number = this.OPEN;
  
  // Mock methods
  public send = jest.fn((data: string | ArrayBufferLike | Blob | ArrayBufferView): void => {
    // Implementation for send
  });
  
  public close = jest.fn((code?: number, reason?: string): void => {
    this.readyState = this.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close', { code, reason }));
    }
  });
  
  public terminate = jest.fn((): void => {
    this.readyState = this.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close', { code: 1006, reason: 'Connection terminated' }));
    }
  });
  
  public pause = jest.fn();
  public resume = jest.fn();
  public ping = jest.fn((cb?: () => void) => cb && cb());
  public isAlive = true;
  // EventEmitter already provides on/once but for typing we alias
  public override on = super.on;
  public override once = super.once;
  
  public addEventListener = jest.fn(<K extends keyof WebSocketEventMap>(
    type: K,
    listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void => {
    if (type === 'open') this.onopen = listener as any;
    if (type === 'message') this.onmessage = listener as any;
    if (type === 'close') this.onclose = listener as any;
    if (type === 'error') this.onerror = listener as any;
  });

  public removeEventListener = jest.fn(<K extends keyof WebSocketEventMap>(
    type: K,
    listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void => {
    // Implementation for removeEventListener
  });
  
  public dispatchEvent = jest.fn((event: Event): boolean => {
    return true;
  });
  
  // Helper methods for testing
  public _triggerOpen(): void {
    this.readyState = this.OPEN;
    if (this.onopen) {
      this.onopen(new Event('open'));
    }
  }
  
  public _triggerMessage(data: any): void {
    if (this.onmessage) {
      this.onmessage(new MessageEvent('message', { data }));
    }
  }
  
  public _triggerClose(code: number = 1000, reason?: string): void {
    this.readyState = this.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close', { code, reason }));
    }
  }
  
  public _triggerError(error: any): void {
    if (this.onerror) {
      this.onerror(new Event('error'));
    }
  }
}

// Create the mock WebSocket function
export const WebSocket = jest.fn().mockImplementation((): WebSocket => {
  return new MockWebSocket() as unknown as WebSocket;
});

// Add WebSocket static properties
Object.defineProperty(WebSocket, 'Server', {
  value: jest.fn(() => mockServer),
  writable: true
});

Object.defineProperty(WebSocket, 'WebSocket', {
  value: WebSocket,
  writable: true
});

Object.defineProperty(WebSocket, 'CONNECTING', {
  value: 0,
  writable: true
});

Object.defineProperty(WebSocket, 'OPEN', {
  value: 1,
  writable: true
});

Object.defineProperty(WebSocket, 'CLOSING', {
  value: 2,
  writable: true
});

Object.defineProperty(WebSocket, 'CLOSED', {
  value: 3,
  writable: true
});

export default WebSocket;
