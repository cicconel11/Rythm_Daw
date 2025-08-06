import { io, Socket } from 'socket.io-client';
import { createWsTestApp } from './websocket-test.setup';

describe('WebSocket Server', () => {
  let _app: unknown;
  let _httpServer: unknown;
  let _clientSocket: Socket;
  let _wsPort: number;

  beforeAll(async () => {
    // Create test application with WebSocket support
    const testApp = await createWsTestApp();
    _app = testApp.app;
    _httpServer = testApp.httpServer;
    
    // Start listening on a random port
    await new Promise<void>((resolve) => {
      _httpServer.listen(0, () => {
        const address = _httpServer.address();
        if (typeof address === 'string' || !address) {
          throw new Error('Could not get server address');
        }
        _wsPort = address.port;
        process.env.WS_PORT = _wsPort.toString();
        console.log(`Test WebSocket server listening on port ${_wsPort}`);
        resolve();
      });
    });
  });

  afterAll(async () => {
    await _app.close();
  });

  beforeEach((done) => {
    // Create a client connection for each test
    _clientSocket = io(`http://localhost:${_wsPort}`, {
      transports: ['websocket'],
      forceNew: true,
      reconnection: false
    });

    _clientSocket.on('connect', () => {
      done();
    });

    _clientSocket.on('connect_error', (err: Error) => {
      console.error('Connection error:', err);
      done.fail('Failed to connect to WebSocket server');
    });
  });

  afterEach((done) => {
    if (_clientSocket.connected) {
      _clientSocket.disconnect();
    }
    done();
  });

  it('should connect and disconnect', (done) => {
    expect(_clientSocket.connected).toBe(true);
    _clientSocket.disconnect();
    expect(_clientSocket.connected).toBe(false);
    done();
  });

  it('should send and receive messages', (done) => {
    const testMessage = 'Hello, WebSocket!';

    _clientSocket.emit('message', testMessage);

    _clientSocket.on('message', (data: string) => {
      expect(data).toBe(`Echo: ${testMessage}`);
      done();
    });
  });
});
