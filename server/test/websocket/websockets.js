// Mock WebSocket server decorator
function WebSocketServer() {
  return function (target, propertyKey) {
    // Store the server instance on the class prototype
    Object.defineProperty(target.constructor.prototype, propertyKey, {
      value: {
        // Mock WebSocket server methods
        sockets: {
          sockets: new Map(),
          to: jest.fn().mockReturnThis(),
          emit: jest.fn(),
        },
      },
      configurable: true,
      enumerable: true,
      writable: true,
    });
  };
}

// Mock WebSocket gateway decorator
function WebSocketGateway(options) {
  return function (target) {
    return target;
  };
}

// Mock SubscribeMessage decorator
function SubscribeMessage(event) {
  return function (target, propertyKey, descriptor) {
    return descriptor;
  };
}

// Mock ConnectedSocket decorator
function ConnectedSocket() {
  return function (target, propertyKey, parameterIndex) {
    return target;
  };
}

// Mock MessageBody decorator
function MessageBody() {
  return function (target, propertyKey, parameterIndex) {
    return target;
  };
}

// Mock WebSocket server class
class Server {
  constructor() {
    this.sockets = {
      sockets: new Map(),
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    };
  }
}

// Export all mocks
module.exports = {
  WebSocketServer,
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  Server,
  // Add any other exports that might be needed
  IoAdapter: class IoAdapter {},
  WsException: class WsException extends Error {},
  WebSocketAdapter: class WebSocketAdapter {},
  OnGatewayConnection: class OnGatewayConnection {},
  OnGatewayDisconnect: class OnGatewayDisconnect {},
  OnGatewayInit: class OnGatewayInit {},
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
};
