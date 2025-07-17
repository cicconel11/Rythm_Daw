import { createServer, Server as HttpServer } from 'http';
import * as WebSocketModule from 'ws';
import { AddressInfo } from 'net';

// WebSocket constants for readyState
const WS_OPEN = 1;
const WS_CLOSED = 3;

// Type for WebSocket server instance
type WebSocketServer = WebSocketModule.Server;

// Type for WebSocket client instance
type WebSocket = WebSocketModule.WebSocket;

// Extend WebSocket types to include missing properties
declare module 'ws' {
  interface WebSocket {
    CONNECTING: number;
    OPEN: number;
    CLOSING: number;
    CLOSED: number;
  }
}

// Helper function to create a WebSocket client with proper typing
const createWebSocketClient = (url: string): Promise<WebSocket> => {
  return new Promise((resolve, reject) => {
    const ws = new WebSocketModule.WebSocket(url);
    
    ws.on('open', () => resolve(ws));
    ws.on('error', reject);
  });
};

describe('WebSocket Connection', () => {
  let wss: WebSocketServer;
  let server: HttpServer;
  let port: number;
  const HOST = '127.0.0.1';

  beforeAll((done) => {
    // Create HTTP server
    server = createServer();
    
    // Create WebSocket server
    wss = new WebSocketModule.Server({ server, clientTracking: true });
    
    // Start server on a random available port
    server.listen(0, HOST, () => {
      const address = server.address();
      if (address && typeof address !== 'string') {
        port = address.port;
        console.log(`Test WebSocket server listening on ws://${HOST}:${port}`);
      }
      done();
    });

    // Simple echo server implementation
    wss.on('connection', (ws: WebSocket) => {
      console.log('Server: Client connected');
      
      ws.on('message', (message: WebSocketModule.RawData) => {
        const msg = message.toString();
        console.log('Server received:', msg);
        
        if (ws.readyState === WS_OPEN) {
          console.log('Server sending echo:', msg);
          try {
            ws.send(msg, (error) => {
              if (error) {
                console.error('Server send error:', error);
              } else {
                console.log('Server echo sent successfully');
              }
            });
          } catch (error) {
            console.error('Server send exception:', error);
          }
        } else {
          console.log('Server cannot echo - connection not open. State:', ws.readyState);
        }
      });
      
      ws.on('pong', () => {
        console.log('Server: received pong');
      });
      
      ws.on('close', () => {
        console.log('Server: Client disconnected');
      });
      
      ws.on('error', (error) => {
        console.error('Server WebSocket error:', error);
      });
      
      // Send a ping to verify the connection
      if (ws.readyState === WS_OPEN) {
        console.log('Server: Sending ping to client');
        ws.ping();
      }
    });
  });

  afterAll((done) => {
    // Close all WebSocket clients
    if (wss.clients) {
      wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WS_OPEN) {
          client.terminate();
        }
      });
    }
    
    // Close the server
    wss.close(() => {
      server.close(done);
    });
  });

  it('should establish WebSocket connection', async () => {
    const ws = await createWebSocketClient(`ws://${HOST}:${port}`);
    
    try {
      expect(ws.readyState).toBe(WS_OPEN);
      
      // Test is complete, close the connection
      await new Promise<void>((resolve) => {
        ws.once('close', resolve);
        ws.close();
      });
    } finally {
      // Ensure the connection is closed even if the test fails
      if (ws.readyState === WS_OPEN) {
        ws.close();
      }
    }
  });

  it('should send and receive messages', (done) => {
    const testMessage = 'Hello, WebSocket!';
    const ws = new WebSocketModule.WebSocket(`ws://127.0.0.1:${port}`);
    
    // Set up a test timeout
    const testTimeout = setTimeout(() => {
      ws.close();
      done(new Error('Test timeout'));
    }, 10000); // 10 second timeout for the entire test
    
    // Handle connection open
    ws.on('open', () => {
      console.log('Connection opened, sending message:', testMessage);
      
      // Set up message handler
      ws.on('message', (data: WebSocketModule.RawData) => {
        const receivedMessage = data.toString();
        console.log('Received message:', receivedMessage);
        
        try {
          // Verify the message
          expect(receivedMessage).toBe(testMessage);
          clearTimeout(testTimeout);
          ws.close();
          done();
        } catch (error) {
          clearTimeout(testTimeout);
          ws.close();
          done(error);
        }
      });
      
      // Send message
      ws.send(testMessage, (error) => {
        if (error) {
          console.error('Error sending message:', error);
          clearTimeout(testTimeout);
          ws.close();
          done(error);
        } else {
          console.log('Message sent successfully');
        }
      });
    });
    
    // Handle connection errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clearTimeout(testTimeout);
      done(error);
    });
    
    // Handle connection close
    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  it('should handle connection close', async () => {
    const ws = await createWebSocketClient(`ws://${HOST}:${port}`);
    
    // Verify connection is open
    expect(ws.readyState).toBe(WS_OPEN);
    
    // Close the connection
    await new Promise<void>((resolve) => {
      ws.once('close', resolve);
      ws.close();
    });
    
    // Verify connection is closed
    expect(ws.readyState).toBe(WS_CLOSED);
  });
});
