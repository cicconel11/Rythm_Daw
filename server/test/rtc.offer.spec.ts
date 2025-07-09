import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('RtcController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    
    await app.init();
    
    // Create a test user and get auth token
    const authResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
      
    authToken = authResponse.body.accessToken;
    userId = authResponse.body.userId;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /rtc/offer', () => {
    it('should forward offer to target user', async () => {
      const offerData = {
        to: 'target-user-id',
        sdp: 'test-sdp-offer',
        type: 'offer'
      };

      // Mock WebSocket server to verify emit
      const mockEmit = jest.fn();
      const mockServer = {
        to: jest.fn().mockReturnThis(),
        emit: mockEmit
      };

      // Replace the server instance with our mock
      const rtcGateway = app.get('RtcGateway');
      rtcGateway.server = mockServer;

      await request(app.getHttpServer())
        .post('/rtc/offer')
        .set('Authorization', `Bearer ${authToken}`)
        .send(offerData)
        .expect(204);

      // Verify the offer was forwarded via WebSocket
      expect(mockServer.to).toHaveBeenCalledWith(offerData.to);
      expect(mockServer.emit).toHaveBeenCalledWith('rtc-offer', {
        from: userId,
        sdp: offerData.sdp,
        type: 'offer'
      });
    });

    it('should return 400 for invalid offer data', async () => {
      await request(app.getHttpServer())
        .post('/rtc/offer')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ invalid: 'data' })
        .expect(400);
    });

    it('should return 401 when not authenticated', async () => {
      await request(app.getHttpServer())
        .post('/rtc/offer')
        .send({
          to: 'target-user-id',
          sdp: 'test-sdp-offer',
          type: 'offer'
        })
        .expect(401);
    });
  });
});
