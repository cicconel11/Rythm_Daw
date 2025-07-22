import { monotonicFactory } from 'ulid';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

// NOTE: The 'ulid' package must be installed for this test to run.
// If not installed, run 'pnpm add -w ulid'.
describe('ULID Upload (integration)', () => {
  it('should generate monotonic, ordered ULIDs', () => {
    const ulid = monotonicFactory();
    const ids = Array.from({ length: 10 }, () => ulid());
    for (let i = 1; i < ids.length; i++) {
      expect(ids[i] > ids[i - 1]).toBe(true);
    }
  });

  describe('File upload integration', () => {
    let app: INestApplication;
    beforeAll(async () => {
      const moduleFixture = await Test.createTestingModule({ imports: [AppModule] }).compile();
      app = moduleFixture.createNestApplication();
      await app.init();
    });
    afterAll(async () => {
      await app.close();
    });
    it('should upload a file and DB row/S3 key start with same ULID', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/files/upload')
        .attach('file', Buffer.from('test-content'), 'test.txt');
      expect(res.status).toBe(200);
      const { dbId, s3Key } = res.body;
      expect(dbId).toBeDefined();
      expect(s3Key).toBeDefined();
      expect(s3Key.startsWith(dbId)).toBe(true);
    });
  });
}); 