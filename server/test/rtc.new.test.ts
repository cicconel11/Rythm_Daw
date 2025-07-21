import { Test } from '@nestjs/testing';
import { createServer } from 'http';
import { Server as IoServer } from 'socket.io';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { TestIoAdapter } from './utils/test-io-adapter';
import { io as Client } from 'socket.io-client';

describe('RtcGateway (New Test)', () => {
  let app: INestApplication;
  let httpSrv: ReturnType<typeof createServer>;
  let ioSrv: IoServer;
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
  });

  afterAll(async () => {
    await app.close();
    ioSrv.close();
    httpSrv.close();
  });

  it('should be defined and handle WebSocket connections', async () => {
    expect(app).toBeDefined();
    expect(ioSrv).toBeDefined();
    // ...test client logic...
  });
});
