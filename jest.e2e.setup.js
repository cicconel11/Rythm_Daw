import { TestClient } from 'supertest';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../server/src/app.module';

let app;

beforeAll(async () => {
  app = await NestFactory.create(AppModule);
  await app.init();
});

afterAll(async () => {
  await app.close();
});

global.testRequest = TestClient(app.getHttpServer());
