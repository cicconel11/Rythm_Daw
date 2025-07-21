import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('Security Headers & Throttling (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // NOTE: /api/ping endpoint must exist in the test app for this test to pass.
  // If it does not, add a simple controller or route handler for /api/ping.
  it('should return Helmet security headers on /api/ping', async () => {
    const res = await request(app.getHttpServer()).get('/api/ping');
    expect(res.status).toBe(200);
    expect(res.headers['strict-transport-security']).toBeDefined();
    expect(res.headers['content-security-policy']).toBeDefined();
  });

  it('should return HTTP 429 after 101 requests in 15 min', async () => {
    for (let i = 0; i < 100; i++) {
      await request(app.getHttpServer()).get('/api/ping');
    }
    const res = await request(app.getHttpServer()).get('/api/ping');
    expect(res.status).toBe(429);
  });
}); 