import { EventEmitter } from 'events';

// Helper function to generate UUIDs
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function createMockSocket(id: string = generateUUID()) {
  const s: any = new EventEmitter();
  s.id = id;
  s.join = jest.fn();
  s.emit = jest.fn();
  s.to = jest.fn().mockReturnThis();   // so we can chain .emit()
  s.disconnect = jest.fn();
  s.handshake = {
    auth: { token: 'valid-token' }
  };
  return s;
}

export function createMockServer() {
  const server = new EventEmitter() as any;
  server.sockets = {
    sockets: new Map(),
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  };
  return server;
}
