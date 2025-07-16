import { Server as HttpServer } from 'http';
import { Server as IoServer, Socket as BaseSocket, Namespace, ServerOptions } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

// Create a proper mock for the socket
export const createMockSocket = (id: string, server: any) => {
  const listeners: Record<string, Array<(...args: any[]) => void>> = {};
  let connected = true;
  
  const mockSocket: any = {
    id,
    connected: true,
    disconnected: false,
    data: {},
    handshake: {
      query: {},
      headers: {},
      auth: {},
      time: new Date().toISOString(),
      issued: Date.now(),
      url: '',
      address: '127.0.0.1',
      xdomain: false,
      secure: false,
    },
    rooms: new Set(),
    server,
    adapter: {
      rooms: new Map(),
      sids: new Map(),
      addAll: jest.fn(),
      del: jest.fn(),
      delAll: jest.fn(),
      broadcast: jest.fn(),
      sockets: jest.fn(),
      fetchSockets: jest.fn().mockResolvedValue([]),
      addSockets: jest.fn(),
      delSockets: jest.fn(),
      disconnectSockets: jest.fn(),
    },
    nsp: {
      name: '/',
      server,
      sockets: new Map(),
    },
    client: {
      conn: {
        id,
        server,
        client: {},
        request: {},
      },
      conns: new Map(),
    },
    conn: {
      id,
      server,
      client: {},
      request: {},
    },
    request: {},
    _events: {},
    _eventsCount: 0,
    _maxListeners: undefined,
    // Socket.IO methods
    on: function(event: string, listener: (...args: any[]) => void) {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(listener);
      return this;
    },
    
    once: function(event: string, listener: (...args: any[]) => void) {
      const onceWrapper = (...args: any[]) => {
        this.off(event, onceWrapper);
        listener(...args);
      };
      return this.on(event, onceWrapper);
    },
    
    off: function(event: string, listener?: (...args: any[]) => void) {
      if (!listeners[event]) return this;
      if (!listener) {
        delete listeners[event];
        return this;
      }
      listeners[event] = listeners[event].filter(l => l !== listener);
      if (listeners[event].length === 0) {
        delete listeners[event];
      }
      return this;
    },
    
    emit: function(event: string, ...args: any[]) {
      if (event === 'ping' && typeof args[0] === 'object' && args[0].timestamp) {
        // Simulate pong response
        setTimeout(() => {
          if (listeners['pong']) {
            listeners['pong'].forEach(cb => cb({ timestamp: args[0].timestamp }));
          }
        }, 100);
      }
      
      if (listeners[event]) {
        listeners[event].forEach(cb => cb(...args));
      }
      return true;
    },
    
    disconnect: function(close = false) {
      connected = false;
      mockSocket.connected = false;
      mockSocket.disconnected = true;
      
      if (listeners['disconnect']) {
        listeners['disconnect'].forEach(cb => cb());
      }
      
      // Remove from server's connected sockets
      if (server?.sockets?.connected) {
        server.sockets.connected.delete(id);
      }
      
      return this;
    },
    
    join: function(room: string) {
      if (!mockSocket.rooms) {
        mockSocket.rooms = new Set();
      }
      mockSocket.rooms.add(room);
      return this;
    },
    
    to: function(room: string) {
      return {
        emit: (event: string, ...args: any[]) => {
          // In a real implementation, this would emit to all sockets in the room
          return true;
        }
      };
    },
    
    broadcast: {
      to: function(room: string) {
        return {
          emit: jest.fn()
        };
      }
    },
    
    listeners: function(event: string) {
      return listeners[event] || [];
    },
    
    // Add other required Socket.IO methods with mock implementations
    removeAllListeners: function() { return this; },
    addListener: function() { return this; },
    removeListener: function() { return this; },
    setMaxListeners: function() { return this; },
    getMaxListeners: function() { return 0; },
    eventNames: function() { return []; },
    listenerCount: function() { return 0; },
    prependListener: function() { return this; },
    prependOnceListener: function() { return this; },
    rawListeners: function() { return []; },
  };
  
  // Add the socket to the server's connected sockets
  if (server?.sockets?.connected) {
    server.sockets.connected.set(id, mockSocket);
  }
  
  return mockSocket as unknown as BaseSocket;
}

export const createMockServer = (): any => {
  const server: any = {
    sockets: {
      sockets: new Map(),
      connected: new Map(),
      adapter: {
        rooms: new Map(),
        sids: new Map(),
        addAll: jest.fn(),
        del: jest.fn(),
        delAll: jest.fn(),
        broadcast: jest.fn(),
        sockets: jest.fn(),
        fetchSockets: jest.fn().mockResolvedValue([]),
        addSockets: jest.fn(),
        delSockets: jest.fn(),
        disconnectSockets: jest.fn(),
      },
      socketsJoin: jest.fn(),
      socketsLeave: jest.fn(),
      disconnectSockets: jest.fn(),
      fetchSockets: jest.fn().mockResolvedValue([]),
    },
    
    // Server methods
    emit: function(event: string, ...args: any[]) {
      return true;
    },
    
    to: function(room: string) {
      return {
        emit: jest.fn()
      };
    },
    
    in: function(room: string) {
      return this.to(room);
    },
    
    // Mock other required Server methods
    of: function() { return this; },
    close: jest.fn(),
    attach: jest.fn(),
    bind: jest.fn(),
    onconnection: jest.fn(),
    engine: {
      on: jest.fn(),
      clientsCount: 0,
    },
    
    // Helper method to create a connected socket
    createConnectedSocket: function(id: string) {
      return createMockSocket(id, this);
    }
  };
  
  return server;
};

// Export mock functions with aliases for backward compatibility
export const Server = createMockServer;
export const Socket = createMockSocket;
