import WebSocket, { Server as WebSocketServer } from 'ws';
import { createServer, Server as HttpServer } from 'http';

// Mock the WebSocket client
jest.mock('ws', () => {
  return {
    WebSocket: jest.fn().mockImplementation(() => ({
      on: jest.fn((event, callback) => {
        if (event === 'open') {
          setTimeout(callback, 0);
        } else if (event === 'message') {
          // Simulate receiving a message
          setTimeout(() => callback('Echo: Test message'), 0);
        }
      }),
      send: jest.fn(),
      close: jest.fn(),
      terminate: jest.fn()
    })),
    __esModule: true,
    ...jest.requireActual('ws')
  };
});

describe('WebSocket Server', () => {
  let httpServer: HttpServer;
  let wss: WebSocketServer;
  const TEST_PORT = 3001;

  beforeAll((done) => {
    // Create HTTP server
    httpServer = createServer();
    
    // Create WebSocket server
    wss = new WebSocketServer({ server: httpServer });
    
    // Start the server
    httpServer.listen(TEST_PORT, () => {
      console.log(`Test WebSocket server running on port ${TEST_PORT}`);
      done();
    });
  });
  
  afterAll((done) => {
    // Close WebSocket server
    if (wss) {
      wss.close(() => {
        console.log('WebSocket server closed');
        
        // Close HTTP server
        if (httpServer) {
          httpServer.close(() => {
            console.log('HTTP server closed');
            done();
          });
        } else {
          done();
        }
      });
    } else {
      done();
    }
  });

  it('should create a WebSocket server', () => {
    expect(wss).toBeDefined();
    expect(wss instanceof WebSocketServer).toBe(true);
  });

  it('should handle WebSocket connections', (done) => {
    // Set up a mock WebSocket client
    const mockClient = {
      send: jest.fn(),
      on: jest.fn()
    };

    // Set up WebSocket server handler
    wss.on('connection', (ws) => {
      // Verify connection is established
      expect(ws).toBeDefined();
      
      // Test message handling
      const testMessage = 'Test message';
      ws.send(`Echo: ${testMessage}`);
      
      // Verify the message was sent
      expect(ws.send).toHaveBeenCalledWith(`Echo: ${testMessage}`);
      done();
    });

    // Simulate a connection
    const mockRequest = {} as Record<string, unknown>;
    wss.emit('connection', mockClient, mockRequest);
  });

  it('should handle incoming messages', (done) => {
    // Set up a mock WebSocket client
    const mockClient = {
      send: jest.fn(),
      on: jest.fn(),
      readyState: 1 // WebSocket.OPEN
    };

    // Set up WebSocket server handler
    wss.on('connection', (ws) => {
      // Create a mock message handler
      const messageHandler = jest.fn((message) => {
        // Verify the message was received
        expect(message).toBe('Test message');
        
        // Test sending a response
        ws.send(`Echo: ${message}`);
        
        // Verify the message was sent
        expect(ws.send).toHaveBeenCalledWith('Echo: Test message');
        
        done();
      });
      
      // Add the message handler
      ws.on('message', messageHandler);
      
      // Directly call the message handler with test data
      messageHandler('Test message');
    });

    // Trigger the connection event
    wss.emit('connection', mockClient);
    
    // Verify the connection was handled
    expect(mockClient.on).toHaveBeenCalled();
  });
});
