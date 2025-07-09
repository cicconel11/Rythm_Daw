import { EventEmitter } from 'events';

export function createMockSocket(id = crypto.randomUUID()) {
  const s: any = new EventEmitter();
  s.id = id;
  s.join = jest.fn();
  s.emit = jest.fn();
  s.to = jest.fn().mockReturnThis();   // so we can chain .emit()
  s.disconnect = jest.fn();
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
