// @ts-nocheck  → skip TS parsing inside this test-only stub
import { jest } from '@jest/globals';

export class MockSocket {
  id: string;
  connected = true;
  disconnected = false;
  rooms = new Set<string>();
  data: any = { user: { userId: 'test-user-id', email: 'test@example.com' } };
  private _listeners: Record<string, Array<(...args: any[]) => void>> = {};
  private _onceListeners: Record<string, Array<(...args: any[]) => void>> = {};

  constructor(id?: string) {
    this.id = id || `mock-${Math.random().toString(36).slice(2)}`;
  }

  // Socket.IO methods
  on = jest.fn((event: string, cb: (...args: any[]) => void) => {
    this._listeners[event] = this._listeners[event] || [];
    this._listeners[event].push(cb);
    return this;
  });

  once = jest.fn((event: string, cb: (...args: any[]) => void) => {
    this._onceListeners[event] = this._onceListeners[event] || [];
    this._onceListeners[event].push(cb);
    return this;
  });

  off = jest.fn((event: string, cb?: (...args: any[]) => void) => {
    if (!event) {
      this._listeners = {};
      this._onceListeners = {};
    } else if (!cb) {
      delete this._listeners[event];
      delete this._onceListeners[event];
    } else {
      this._listeners[event] = (this._listeners[event] || []).filter(l => l !== cb);
      this._onceListeners[event] = (this._onceListeners[event] || []).filter(l => l !== cb);
    }
    return this;
  });

  emit = jest.fn((event: string, ...args: any[]) => {
    // Trigger regular listeners
    (this._listeners[event] || []).forEach(cb => cb(...args));
    // Trigger once listeners and remove them
    (this._onceListeners[event] || []).forEach(cb => cb(...args));
    delete this._onceListeners[event];
    return this;
  });

  disconnect = jest.fn(() => {
    this.connected = false;
    this.disconnected = true;
    this.emit('disconnect');
    return this;
  });

  join = jest.fn((room: string) => {
    this.rooms.add(room);
    return this;
  });

  leave = jest.fn((room: string) => {
    this.rooms.delete(room);
    return this;
  });

  to = jest.fn(() => this);
  in = jest.fn(() => this);
  
  listeners = jest.fn((event: string) => {
    return [...(this._listeners[event] || []), ...(this._onceListeners[event] || [])];
  });

  // Test helpers
  _trigger(event: string, ...args: any[]) {
    this.emit(event, ...args);
  }
}

export class MockServer {
  sockets = { sockets: new Map<string, MockSocket>() };
  to = jest.fn(() => this);
  in = jest.fn(() => this);
  emit = jest.fn();
  use = jest.fn(() => this);
  of = jest.fn(() => this);
  close = jest.fn();
  listen = jest.fn();

  // Test helpers
  _addSocket(socket: MockSocket) {
    this.sockets.sockets.set(socket.id, socket);
    return socket;
  }
}

// Helper functions for tests
export function createMockSocket(id?: string): any {
  return new MockSocket(id);
}

export function createMockServer(): any {
  return new MockServer();
}

// Export everything
module.exports = { 
  Server: MockServer, 
  Socket: MockSocket,
  createMockSocket,
  createMockServer
};
