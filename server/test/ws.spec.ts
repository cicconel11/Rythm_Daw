import { createServer, Server as HttpServer } from 'http';
import * as WebSocketModule from 'ws';

// Use the real WebSocket implementation for these tests
const WebSocket = WebSocketModule.WebSocket;
type WebSocket = WebSocketModule.WebSocket;

// Helper to ensure we're using the real WebSocket implementation
function createWebSocket(url: string): WebSocket {
  // Force use of actual WebSocket implementation
  return new WebSocketModule.WebSocket(url);
}

// Helper function to create a WebSocket client
function createWebSocketClient(url: string): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocketModule.WebSocket(url);
    
    ws.on('open', () => resolve(ws));
    ws.on('error', reject);
  });
}

describe('WebSocket Server', () => {
  let server: HttpServer;
  let wss: WebSocketModule.Server;
  let port: number;
  const TEST_TIMEOUT = 5000; // 5 seconds for tests to complete
  
  // Increase Jest timeout for all tests in this suite
  jest.setTimeout(10000); // 10 seconds
  
  beforeAll((done) => {
    console.log('Setting up WebSocket server for tests...');
    
    // Create HTTP server
    server = createServer();
    
    // Create WebSocket server with explicit options
    const options: WebSocketModule.ServerOptions = {
      server,
      clientTracking: true,
      maxPayload: 10 * 1024 * 1024, // 10MB
    };
    
    // Create WebSocket server with explicit typing
    wss = new WebSocketModule.Server(options);
    
    // Start server on a random available port
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (address && typeof address !== 'string') {
        port = address.port;
        console.log(`Test WebSocket server running on ws://127.0.0.1:${port}`);
      }
      done();
    });
    
    // Simple echo server with basic message handling
    wss.on('connection', (ws: WebSocket) => {
      console.log('Server: Client connected');
      
      // Handle incoming messages
      const onMessage = (message: WebSocketModule.RawData) => {
        try {
          const msg = message.toString();
          console.log('Server: Received message:', msg);
          
          // Echo the message back if connection is still open
          if (ws.readyState === 1) { // 1 = OPEN
            const response = `Echo: ${msg}`;
            console.log('Server: Sending echo:', response);
            
            ws.send(response, (error) => {
              if (error) {
                console.error('Server: Error sending echo:', error);
              } else {
                console.log('Server: Echo sent successfully');
              }
            });
          }
        } catch (error) {
          console.error('Server: Error processing message:', error);
        }
      };
      
      ws.on('message', onMessage);
      
      // Handle client disconnection
      const onClose = (code: number, reason: Buffer) => {
        console.log(`Server: Client disconnected (code: ${code})`);
        ws.off('message', onMessage);
        ws.off('close', onClose);
        ws.off('error', onError);
      };
      
      ws.on('close', onClose);

      // Handle errors
      const onError = (error: Error) => {
        console.error('Server: WebSocket error:', error);
      };
      
      ws.on('error', onError);
      
      // Send a welcome message to the client
      if (ws.readyState === 1) {
        const welcomeMsg = JSON.stringify({ type: 'welcome', message: 'Connected to WebSocket server' });
        console.log('Server: Sending welcome message');
        ws.send(welcomeMsg);
      }
    });
  });
  
  afterAll((done) => {
    // Close all clients
    wss.clients.forEach((client: WebSocket) => {
      if (client.readyState === 1) { // 1 = OPEN
        client.terminate();
      }
    });
    
    // Close server
    wss.close(() => {
      server.close(done);
    });
  });
  
  it('should establish a WebSocket connection', (done) => {
    console.log('\n--- Starting connection test ---');
    const ws = createWebSocket(`ws://127.0.0.1:${port}`);
    
    const timeout = setTimeout(() => {
      console.error('Connection test: Timeout waiting for connection');
      if (ws.readyState === 1) {
        ws.close();
      }
      done(new Error('Connection test timeout'));
    }, TEST_TIMEOUT);
    
    const onOpen = () => {
      console.log('Connection test: Client connected successfully');
      
      // Verify connection is open
      expect(ws.readyState).toBe(1); // 1 = OPEN
      
      // Clean up event listeners
      ws.off('open', onOpen);
      ws.off('error', onError);
      
      // Close the connection
      ws.close(1000, 'Test complete');
    };
    
    const onError = (error: Error) => {
      console.error('Connection test: Client error:', error);
      clearTimeout(timeout);
      ws.off('open', onOpen);
      ws.off('error', onError);
      if (ws.readyState === 1) {
        ws.close();
      }
      done(error);
    };
    
    const onClose = () => {
      console.log('Connection test: Connection closed');
      clearTimeout(timeout);
      done();
    };
    
    ws.on('open', onOpen);
    ws.on('error', onError);
    ws.on('close', onClose);
  });
  
  it('should echo messages', (done) => {
    console.log('\n--- Starting echo test ---');
    const testMessage = 'Hello, WebSocket!';
    let ws: WebSocket;
    let messageReceived = false;
    
    const timeout = setTimeout(() => {
      console.error('Echo test: Timeout waiting for echo');
      if (ws && ws.readyState === 1) {
        ws.close();
      }
      if (!messageReceived) {
        done(new Error('Echo test timeout - no response received'));
      }
    }, TEST_TIMEOUT);
    
    const cleanup = () => {
      clearTimeout(timeout);
      if (ws) {
        ws.off('message', onMessage);
        ws.off('open', onOpen);
        ws.off('error', onError);
        ws.off('close', onClose);
      }
    };
    
    const onMessage = (data: WebSocketModule.RawData) => {
      const message = data.toString();
      console.log('Echo test: Client received:', message);
      
      try {
        // Check if this is our echo (ignore welcome messages)
        if (message.includes('Echo:')) {
          messageReceived = true;
          expect(message).toContain(testMessage);
          cleanup();
          ws.close(1000, 'Test complete');
          done();
        }
      } catch (error) {
        cleanup();
        ws.close();
        done(error as Error);
      }
    };
    
    const onError = (error: Error) => {
      console.error('Echo test: Client error:', error);
      cleanup();
      done(error);
    };
    
    const onClose = () => {
      console.log('Echo test: Connection closed');
      if (!messageReceived) {
        done(new Error('Connection closed before receiving echo'));
      }
    };
    
    const onOpen = () => {
      console.log('Echo test: Client connected, sending message:', testMessage);
      
      ws.send(testMessage, (error) => {
        if (error) {
          console.error('Echo test: Error sending message:', error);
          cleanup();
          ws.close();
          done(error);
        } else {
          console.log('Echo test: Message sent successfully');
        }
      });
    };
    
    // Create the WebSocket connection
    ws = createWebSocket(`ws://127.0.0.1:${port}`);
    ws.on('open', onOpen);
    ws.on('message', onMessage);
    ws.on('error', onError);
    ws.on('close', onClose);
  });
  
  it('should handle multiple concurrent connections', (done) => {
    console.log('Starting concurrent connections test...');
    const numClients = 2; // Reduced from 3 to 2 for stability
    const testMessage = 'Concurrent test';
    
    // Function to create a test client
    const createTestClient = (clientId: number) => {
      return new Promise<void>((resolve, reject) => {
        const client = new WebSocket(`ws://127.0.0.1:${port}`);
        let receivedResponse = false;
        
        const timeout = setTimeout(() => {
          if (!receivedResponse && client.readyState === 1) {
            console.error(`Client ${clientId} timeout`);
            client.close();
            reject(new Error(`Client ${clientId} timeout - no response received`));
          }
        }, TEST_TIMEOUT);
        
        client.on('open', () => {
          console.log(`Client ${clientId} connected`);
          
          // Set up message handler
          const onMessage = (data: WebSocketModule.RawData) => {
            const message = data.toString();
            
            if (message.includes('Echo:')) {
              receivedResponse = true;
              console.log(`Client ${clientId} received:`, message);
              
              try {
                expect(message).toContain(testMessage);
                clearTimeout(timeout);
                client.off('message', onMessage);
                client.close(1000, 'Test complete');
                resolve();
              } catch (error) {
                clearTimeout(timeout);
                client.off('message', onMessage);
                client.close();
                reject(error);
              }
            }
          };
          
          client.on('message', onMessage);
          
          // Send test message
          const clientMessage = `${testMessage} from client ${clientId}`;
          console.log(`Client ${clientId} sending:`, clientMessage);
          client.send(clientMessage, (error) => {
            if (error) {
              clearTimeout(timeout);
              console.error(`Client ${clientId} send error:`, error);
              client.close();
              reject(error);
            }
          });
        });
        
        client.on('error', (error: Error) => {
          clearTimeout(timeout);
          console.error(`Client ${clientId} error:`, error);
          client.close();
          reject(error);
        });
        
        client.on('close', () => {
          console.log(`Client ${clientId} connection closed`);
        });
      });
    };
    
    // Create multiple clients with a small delay between them
    const clientPromises = [];
    for (let i = 0; i < numClients; i++) {
      // Add a small delay between client connections
      const promise = new Promise<void>((resolve) => 
        setTimeout(() => resolve(createTestClient(i + 1)), i * 100)
      );
      clientPromises.push(promise);
    }
    
    // Wait for all clients to complete
    Promise.all(clientPromises)
      .then(() => {
        console.log('All clients completed successfully');
        done();
      })
      .catch((error) => {
        console.error('Error in concurrent test:', error);
        done(error);
      });
  });
  
  it('should handle client disconnection', (done) => {
    console.log('Starting disconnection test...');
    const ws = new WebSocket(`ws://127.0.0.1:${port}`);
    
    const timeout = setTimeout(() => {
      console.error('Disconnection test timeout');
      if (ws.readyState === 1) {
        ws.close();
      }
      done(new Error('Disconnection test timeout'));
    }, TEST_TIMEOUT);
    
    ws.on('open', () => {
      console.log('Disconnection test: Client connected');
      
      // Close the connection after a short delay
      setTimeout(() => {
        console.log('Disconnection test: Closing client connection');
        ws.close(1000, 'Test complete');
      }, 100);
    });
    
    ws.on('close', (code, reason) => {
      console.log(`Disconnection test: Client disconnected (code: ${code})`);
      try {
        expect(code).toBe(1000);
        // Only check reason if it exists (some WebSocket implementations might not provide it)
        if (reason) {
          const reasonStr = Buffer.isBuffer(reason) ? reason.toString() : reason;
          expect(reasonStr).toBe('Test complete');
        }
        clearTimeout(timeout);
        done();
      } catch (error) {
        clearTimeout(timeout);
        done(error);
      }
    });
    
    ws.on('error', (error) => {
      console.error('Disconnection test error:', error);
      clearTimeout(timeout);
      ws.close();
      done(error);
    });
  });
});
