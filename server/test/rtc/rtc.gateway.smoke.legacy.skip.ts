import { Test } from '@nestjs/testing';
import { createServer } from 'http';
import { Server as IoServer } from 'socket.io';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { TestIoAdapter } from '../utils/test-io-adapter';
import { io as Client, Socket } from 'socket.io-client';

describe('RtcGateway (Smoke Test)', () => {
  let app: INestApplication;
  let httpSrv: ReturnType<typeof createServer>;
  let ioSrv: IoServer;
  let clientSocket: Socket;
  let port: number;

  beforeAll(async () => {
    httpSrv = createServer();
    ioSrv = new IoServer(httpSrv, { cors: { origin: '*' } });
    await new Promise(r => httpSrv.listen(0, r));
    port = (httpSrv.address() as any).port;

    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useWebSocketAdapter(new TestIoAdapter(app, ioSrv));
    await app.init();
  }, 30000);

  afterEach(() => {
    if (clientSocket?.connected) {
      clientSocket.disconnect();
    }
  });

  afterAll(async () => {
    await app.close();
    ioSrv.close();
    httpSrv.close();
  }, 10000);

  const createClient = (token?: string): Promise<Socket> => {
    return new Promise((resolve, reject) => {
      const client = Client(`http://localhost:${port}`, {
        transports: ['websocket'],
        auth: token ? { token } : {},
        reconnection: false,
        forceNew: true,
        timeout: 5000
      });
      const timeout = setTimeout(() => {
        client.close();
        reject(new Error('Connection timeout'));
      }, 5000);
      client.on('connect', () => {
        clearTimeout(timeout);
        resolve(client);
      });
      client.on('connect_error', (err) => {
        clearTimeout(timeout);
        client.close();
        resolve(client); // Resolve even on error to allow testing failed connections
      });
    });
  };

  describe('Connection', () => {
    it('should connect with valid token', async () => {
      clientSocket = await createClient('valid-token');
      expect(clientSocket.connected).toBe(true);
    });
    it('should reject connection with invalid token', async () => {
      clientSocket = await createClient('invalid-token');
      expect(clientSocket.connected).toBe(false);
    });
  });

  describe('Ping-Pong', () => {
    it('should respond to ping', (done) => {
      clientSocket = Client(`http://localhost:${port}`, {
        transports: ['websocket'],
        auth: { token: 'valid-token' },
        reconnection: false,
        forceNew: true,
        timeout: 2000
      });
      clientSocket.on('pong', () => {
        done();
      });
      clientSocket.on('connect', () => {
        clientSocket.emit('ping');
      });
    });
  });
});
