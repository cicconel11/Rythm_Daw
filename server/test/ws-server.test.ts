import { io, Socket } from 'socket.io-client';
import { createWsTestApp } from './websocket-test.setup';

describe('WebSocket Server', () => {
  let app: any;
  let httpServer: any;
  let clientSocket: Socket;
  let wsPort: number;

  beforeAll(async () => {
    // Create test application with WebSocket support
    const testApp = await createWsTestApp();
    app = testApp.app;
    httpServer = testApp.httpServer;
    
    // Start listening on a random port
    await new Promise<void>((resolve) => {
      httpServer.listen(0, () => {
        const address = httpServer.address();
        if (typeof address === 'string' || !address) {
          throw new Error('Could not get server address');
        }
        wsPort = address.port;
        process.env.WS_PORT = wsPort.toString();
        console.log(`Test WebSocket server listening on port ${wsPort}`);
        resolve();
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach((done) => {
    // Create a client connection for each test
    clientSocket = io(`http://localhost:${wsPort}`, {
      transports: ['websocket'],
      forceNew: true,
      reconnection: false
    });

    clientSocket.on('connect', () => {
      done();
    });

    clientSocket.on('connect_error', (err: Error) => {
      console.error('Connection error:', err);
      done.fail('Failed to connect to WebSocket server');
    });
  });

  afterEach((done) => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
    done();
  });

  it('should connect and disconnect', (done) => {
    expect(clientSocket.connected).toBe(true);
    clientSocket.disconnect();
    expect(clientSocket.connected).toBe(false);
    done();
  });

  it('should send and receive messages', (done) => {
    const testMessage = 'Hello, WebSocket!';

    clientSocket.emit('message', testMessage);

    clientSocket.on('message', (data: string) => {
      expect(data).toBe(`Echo: ${testMessage}`);
      done();
    });
  });
});
