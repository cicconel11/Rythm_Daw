import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { EventEmitter } from 'events';
import { attachMockServer } from '../utils/gateway';

// Simple mock for socket.io-client
const mockSocket = {
  id: 'test-socket-123',
  connected: true,
  disconnected: false,
  on: jest.fn(),
  emit: jest.fn(),
  disconnect: jest.fn()
};

// Mock the socket.io-client module
jest.mock('socket.io-client', () => ({
  io: jest.fn(() => mockSocket)
}));



// Test Gateway for WebSocket testing
@WebSocketGateway()
class TestHeartbeatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: any;
  
  handleConnection(client: any) {
    console.log('Client connected:', client.id);
    if (this.server && this.server.sockets) {
      this.server.sockets.set(client.id, client);
    }
  }
  
  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
    if (this.server && this.server.sockets) {
      this.server.sockets.delete(client.id);
    }
  }
  
  sendPing(client: any) {
    if (client && typeof client.emit === 'function') {
      client.emit('ping', { timestamp: Date.now() });
    }
  }
}

// Mock IoAdapter
class MockIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server = new EventEmitter() as any;
    server.sockets = {
      sockets: new Map(),
    };
    return server;
  }
}

describe('WebSocket Heartbeat', () => {
  let gateway: TestHeartbeatGateway;
  
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Create a new instance of the gateway for each test
    gateway = new TestHeartbeatGateway();
    attachMockServer(gateway, {
      sockets: new Map()
    });
  });

  it('should handle connection', () => {
    const mockClient = { id: 'test-client' };
    gateway.handleConnection(mockClient);
    expect(gateway.server.sockets.has(mockClient.id)).toBe(true);
  });

  it('should handle disconnection', () => {
    const mockClient = { id: 'test-client' };
    gateway.handleConnection(mockClient);
    gateway.handleDisconnect(mockClient);
    expect(gateway.server.sockets.has(mockClient.id)).toBe(false);
  });

  it('should send ping to client', () => {
    const mockClient = { 
      id: 'test-client',
      emit: jest.fn() 
    };
    gateway.server.sockets.set(mockClient.id, mockClient);
    
    gateway.sendPing(mockClient);
    
    expect(mockClient.emit).toHaveBeenCalledWith('ping', {
      timestamp: expect.any(Number)
    });
  });
});
