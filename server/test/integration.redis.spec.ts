import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { createServer } from 'http';
import { Server as IoServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { AppModule } from '../src/app.module';
import { TestIoAdapter } from './utils/test-io-adapter';

describe('Redis Adapter Broadcast (integration)', () => {
  let appA: INestApplication, appB: INestApplication;
  let httpA: ReturnType<typeof createServer>, httpB: ReturnType<typeof createServer>;
  let ioA: IoServer, ioB: IoServer;
  let pubA, subA, pubB, subB;

  beforeAll(async () => {
    // Setup Redis clients
    pubA = createClient({ url: 'redis://localhost:6379' });
    subA = pubA.duplicate();
    pubB = createClient({ url: 'redis://localhost:6379' });
    subB = pubB.duplicate();
    await Promise.all([pubA.connect(), subA.connect(), pubB.connect(), subB.connect()]);

    // App A
    httpA = createServer();
    ioA = new IoServer(httpA, { cors: { origin: '*' } });
    ioA.adapter(createAdapter(pubA, subA));
    await new Promise<void>(resolve => httpA.listen(0, () => resolve()));
    const moduleA = await Test.createTestingModule({ imports: [AppModule] }).compile();
    appA = moduleA.createNestApplication();
    appA.useWebSocketAdapter(new TestIoAdapter(appA, ioA));
    await appA.init();

    // App B
    httpB = createServer();
    ioB = new IoServer(httpB, { cors: { origin: '*' } });
    ioB.adapter(createAdapter(pubB, subB));
    await new Promise<void>(resolve => httpB.listen(0, () => resolve()));
    const moduleB = await Test.createTestingModule({ imports: [AppModule] }).compile();
    appB = moduleB.createNestApplication();
    appB.useWebSocketAdapter(new TestIoAdapter(appB, ioB));
    await appB.init();
  }, 20000);

  afterAll(async () => {
    await appA.close();
    await appB.close();
    ioA.close();
    ioB.close();
    httpA.close();
    httpB.close();
    await pubA.disconnect();
    await subA.disconnect();
    await pubB.disconnect();
    await subB.disconnect();
  });

  it('should broadcast messages between instances', done => {
    const portA = (httpA.address() as any).port;
    const portB = (httpB.address() as any).port;
    const { io: clientA } = require('socket.io-client')(`http://localhost:${portA}`);
    const { io: clientB } = require('socket.io-client')(`http://localhost:${portB}`);
    clientB.on('test-broadcast', (msg) => {
      expect(msg).toBe('hello-redis');
      clientA.close();
      clientB.close();
      done();
    });
    clientA.on('connect', () => {
      ioA.emit('test-broadcast', 'hello-redis');
    });
  });
}); 