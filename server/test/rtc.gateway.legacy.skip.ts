import { Test } from '@nestjs/testing';
import { createServer } from 'http';
import { Server as IoServer } from 'socket.io';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { TestIoAdapter } from './utils/test-io-adapter';
import { RtcGateway } from '../src/rtc/rtc.gateway';

describe('RTC Gateway (integration)', () => {
  let app: INestApplication;
  let httpSrv: ReturnType<typeof createServer>;
  let ioSrv: IoServer;
  let gateway: RtcGateway;

  beforeAll(async () => {
    httpSrv = createServer();
    ioSrv = new IoServer(httpSrv, { cors: { origin: '*' } });
    await new Promise(r => httpSrv.listen(0, r));

    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useWebSocketAdapter(new TestIoAdapter(app, ioSrv));
    await app.init();
  });

  beforeEach(() => {
    gateway = new RtcGateway();
    // Read-only mock for server
    Object.defineProperty(gateway, 'server', { get: () => mockServer });
    // Initialize required maps
    gateway.userSockets = new Map();
    gateway.socketToUser = new Map();
  });

  afterAll(async () => {
    await app.close();
    ioSrv.close();
    httpSrv.close();
  });

  it('handles ping-pong', done => {
    ioSrv.on('connection', socket => socket.emit('pong'));
    // ...test client logic...
    done();
  });
});
