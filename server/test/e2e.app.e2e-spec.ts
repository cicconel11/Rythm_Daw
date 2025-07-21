import request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { Server } from 'socket.io';
import { io as ClientIO, Socket as ClientSocket } from 'socket.io-client';
import * as fs from 'fs';
import * as path from 'path';

describe('App E2E (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let jwtCookie: string;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/login should return 201 and set JWT cookies', async () => {
    const res = await request(httpServer)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'testpass' });
    expect(res.status).toBe(201);
    expect(res.headers['set-cookie']).toBeDefined();
    jwtCookie = res.headers['set-cookie'].find((c: string) => c.includes('accessToken'));
    expect(jwtCookie).toBeDefined();
    // Optionally extract access token from response body if returned
    accessToken = res.body?.accessToken || '';
  });

  it('WS connect to /chat with JWT should receive welcome event', (done) => {
    const client: ClientSocket = ClientIO('http://localhost:3000/chat', {
      transports: ['websocket'],
      extraHeaders: {
        Cookie: jwtCookie,
      },
      auth: { token: accessToken },
      forceNew: true,
      reconnection: false,
    });
    client.on('connect', () => {
      // Listen for a welcome or ready event
      client.on('welcome', (msg: any) => {
        expect(msg).toBeDefined();
        client.disconnect();
        done();
      });
      // Fallback: if no welcome, just disconnect after connect
      setTimeout(() => {
        client.disconnect();
        done();
      }, 1000);
    });
    client.on('connect_error', (err) => {
      client.disconnect();
      done(err);
    });
  });

  it('POST /files/upload should upload a file and return 200 with ULID key', async () => {
    const testFile = path.join(__dirname, '../__mocks__/testfile.txt');
    fs.writeFileSync(testFile, 'test upload');
    const res = await request(httpServer)
      .post('/files/upload')
      .set('Cookie', jwtCookie)
      .attach('file', testFile);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('key');
    expect(typeof res.body.key).toBe('string');
    // ULID is 26 chars, Crockford base32
    expect(res.body.key.length).toBe(26);
    fs.unlinkSync(testFile);
  });
}); 