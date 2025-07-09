import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { WsAdapter } from '../src/ws/ws-adapter';

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = module.createNestApplication();
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.init();
  (global as any).__APP__ = app;        // reuse in individual specs
});

afterAll(async () => {
  await (global as any).__APP__.close();
});
