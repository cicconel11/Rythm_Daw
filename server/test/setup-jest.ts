import { jest } from '@jest/globals';

// Mock NestJS WebSocket decorators to avoid undefined SOCKET issues
global.SOCKET = {}; // Fallback for undefined SOCKET

jest.mock('@nestjs/websockets', () => ({
  ...jest.requireActual('@nestjs/websockets'),
  ConnectedSocket: jest.fn((target, propertyKey, descriptor) => descriptor),
  MessageBody: jest.fn((target, propertyKey, descriptor) => descriptor),
  SubscribeMessage: jest.fn((message) => (target, propertyKey, descriptor) => descriptor),
  WebSocketGateway: jest.fn(() => (target) => target),
  WebSocketServer: jest.fn(() => () => ({ server: { on: jest.fn(), close: jest.fn() } })),
}));

// Add any other global mocks here

console.log('Jest setup loaded'); 