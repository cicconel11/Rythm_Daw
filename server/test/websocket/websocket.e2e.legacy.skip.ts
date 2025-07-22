import { Socket } from 'socket.io-client';
import { createWsTestApp, teardownTestApp } from './websocket-test.setup';
import { mockIo } from './utils/mock-io';

describe('WebSocket (e2e)', () => {
  let ctx: Awaited<ReturnType<typeof createWsTestApp>>;
  let client: Socket;
  let serverUrl: string;

  beforeAll(async () => {
    // Create test app with WebSocket support
    ctx = await createWsTestApp();
    await new Promise<void>((res) => {
      ctx.httpServer.listen(0, () => {
        const address = ctx.httpServer.address();
        const port = typeof address === 'string' 
          ? parseInt(address.split(':').pop() || '0', 10) 
          : address?.port || 0;
        serverUrl = `http://localhost:${port}`;
        res();
      });
    });
  });

  afterAll(async () => {
    if (client?.connected) {
      client.disconnect();
    }
    await teardownTestApp(ctx.app, ctx.httpServer);
  });

  afterEach(() => {
    if (client?.connected) {
      client.disconnect();
    }
  });

  it('should connect to WebSocket server', (done) => {
    client = mockIo(serverUrl, { transports: ['websocket'] });
    
    client.on('connect', () => {
      expect(client.connected).toBe(true);
      done();
    });
    
    client.on('connect_error', (err: Error) => {
      done.fail(`Connection failed: ${err.message}`);
    });
  });

  it('should receive echo message', (done) => {
    const testMessage = 'Hello, WebSocket!';
    client = mockIo(serverUrl, { transports: ['websocket'] });
    
    client.on('connect', () => {
      client.emit('message', testMessage);
    });
    
    client.on('message', (message: string) => {
      expect(message).toContain(testMessage);
      done();
    });
    
    client.on('connect_error', (err: Error) => {
      done.fail(`Connection failed: ${err.message}`);
    });
  });

  it('should handle multiple messages', (done) => {
    const messages = ['first', 'second', 'third'];
    let receivedCount = 0;
    
    client = mockIo(serverUrl, { transports: ['websocket'] });
    
    client.on('connect', () => {
      messages.forEach(msg => client.emit('message', msg));
    });
    
    client.on('message', (message: string) => {
      expect(messages).toContain(message);
      receivedCount++;
      
      if (receivedCount === messages.length) {
        done();
      }
    });
    
    client.on('connect_error', (err: Error) => {
      done.fail(`Connection failed: ${err.message}`);
    });
  });

  it('should handle disconnection', (done) => {
    client = mockIo(serverUrl, { transports: ['websocket'] });
    
    client.on('connect', () => {
      client.on('disconnect', (reason) => {
        expect(reason).toBe('io client disconnect');
        done();
      });
      
      client.disconnect();
    });
    
    client.on('connect_error', (err: Error) => {
      done.fail(`Connection failed: ${err.message}`);
    });
  });
});
