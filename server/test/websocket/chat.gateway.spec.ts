import { Test } from '@nestjs/testing';
import { createServer } from 'http';
import { Server as IoServer } from 'socket.io';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { TestIoAdapter } from '../utils/test-io-adapter';

describe('Chat Gateway (integration)', () => {
  let app: INestApplication;
  let httpSrv: ReturnType<typeof createServer>;
  let ioSrv: IoServer;

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
