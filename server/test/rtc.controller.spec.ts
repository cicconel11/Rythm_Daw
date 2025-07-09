import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, closeTestApp, getAuthToken, createTestUser } from './test.utils';

describe('RtcController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  };

  beforeAll(async () => {
    const { app: testApp } = await createTestApp();
    app = testApp;
    
    // Create a test user and get auth token
    await createTestUser(app, testUser);
    authToken = await getAuthToken(app, testUser.email, testUser.password);
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  describe('POST /rtc/offer', () => {
    it('should handle RTC offer', async () => {
      const offerData = {
        targetUserId: 'test-target-user',
        sdp: 'test-sdp',
        type: 'offer'
      };

      const response = await request(app.getHttpServer())
        .post('/rtc/offer')
        .set('Authorization', `Bearer ${authToken}`)
        .send(offerData)
        .expect(201);

      expect(response.body).toHaveProperty('status', 'offer-received');
    });

    it('should return 400 for invalid offer data', async () => {
      await request(app.getHttpServer())
        .post('/rtc/offer')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);
    });

    it('should return 401 when not authenticated', async () => {
      await request(app.getHttpServer())
        .post('/rtc/offer')
        .send({
          targetUserId: 'test-target-user',
          sdp: 'test-sdp',
          type: 'offer'
        })
        .expect(401);
    });
  });
});
