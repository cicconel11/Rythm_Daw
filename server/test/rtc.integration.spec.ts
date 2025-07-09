import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { FilesModule } from '../src/modules/files/files.module';
import { RtcModule } from '../src/modules/rtc/rtc.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AwsS3Service } from '../src/modules/files/aws-s3.service';
import { RtcGateway } from '../src/modules/rtc/rtc.gateway';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '../src/app.module';
import { WsAdapter } from '@nestjs/platform-ws';

// Mock AWS S3 service
const mockAwsS3Service = {
  getPresignedUrl: jest.fn().mockImplementation((key, operation) => ({
    url: `https://s3.amazonaws.com/test-bucket/${key}`,
    fields: { key },
  })),
};

// Mock JWT service
const mockJwtService = {
  verify: jest.fn().mockReturnValue({ sub: 'test-user-id' }),
  sign: jest.fn().mockReturnValue('test-token'),
};

describe('RTC and File Upload Integration', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let rtcGateway: RtcGateway;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $connect: jest.fn(),
        $disconnect: jest.fn(),
        user: {
          findUnique: jest.fn().mockResolvedValue({
            id: 'test-user-id',
            email: 'test@example.com',
            name: 'Test User',
          }),
        },
      })
      .overrideProvider(AwsS3Service)
      .useValue(mockAwsS3Service)
      .overrideProvider(JwtService)
      .useValue(mockJwtService)
      .compile();

    app = moduleFixture.createNestApplication();
    
    // Use WebSocket adapter that won't try to initialize Socket.IO
    app.useWebSocketAdapter(new WsAdapter(app));
    
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    
    // Get the PrismaService instance from the testing module
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    
    // Get the RtcGateway instance and mock its server
    rtcGateway = moduleFixture.get<RtcGateway>(RtcGateway);
    rtcGateway.server = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
      sockets: {
        sockets: new Map(),
      },
    } as any;

    await app.init();
    
    // Mock authenticated user
    authToken = 'test-token';
  });

  afterAll(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  describe('File Upload', () => {
    const testFile = {
      name: 'test-file.txt',
      mime: 'text/plain',
      size: 1024,
    };

    it('should generate pre-signed URLs for file upload', async () => {
      const response = await request(app.getHttpServer())
        .post('/files/presign')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testFile)
        .expect(201);

      expect(response.body).toHaveProperty('putUrl');
      expect(response.body).toHaveProperty('getUrl');
      expect(mockAwsS3Service.getPresignedUrl).toHaveBeenCalledWith(
        expect.stringContaining('test-file.txt'),
        'putObject'
      );
    });

    it('should validate file metadata', async () => {
      const invalidFiles = [
        { name: '', mime: 'text/plain', size: 1024 }, // Empty name
        { name: 'test.txt', mime: '', size: 1024 }, // Empty mime
        { name: 'test.txt', mime: 'text/plain', size: 0 }, // Invalid size
        { name: 'test.txt', mime: 'text/plain', size: 6 * 1024 * 1024 * 1024 }, // Too large (6GB)
      ];

      for (const file of invalidFiles) {
        await request(app.getHttpServer())
          .post('/files/presign')
          .set('Authorization', `Bearer ${authToken}`)
          .send(file)
          .expect(400);
      }
    });
  });

  describe('WebRTC Signaling', () => {
    it('should handle RTC offer', async () => {
      const offer = {
        to: 'target-user-id',
        sdp: 'test-sdp-offer',
        type: 'offer',
      };

      await request(app.getHttpServer())
        .post('/rtc/offer')
        .set('Authorization', `Bearer ${authToken}`)
        .send(offer)
        .expect(204);

      // Verify the gateway forwarded the offer
      expect(rtcGateway.server.to).toHaveBeenCalledWith(offer.to);
      expect(rtcGateway.server.emit).toHaveBeenCalledWith('rtc-offer', {
        from: 'test-user-id',
        sdp: offer.sdp,
        type: 'offer',
      });
    });

    it('should handle RTC answer', async () => {
      const answer = {
        to: 'target-user-id',
        sdp: 'test-sdp-answer',
        type: 'answer',
      };

      await request(app.getHttpServer())
        .post('/rtc/answer')
        .set('Authorization', `Bearer ${authToken}`)
        .send(answer)
        .expect(204);

      // Verify the gateway forwarded the answer
      expect(rtcGateway.server.to).toHaveBeenCalledWith(answer.to);
      expect(rtcGateway.server.emit).toHaveBeenCalledWith('rtc-answer', {
        from: 'test-user-id',
        sdp: answer.sdp,
        type: 'answer',
      });
    });
  });

  describe('WebRTC Connection Management', () => {
    it('should handle client connection and disconnection', async () => {
      const mockClient = {
        id: 'test-client-id',
        handshake: {
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        },
        join: jest.fn(),
        emit: jest.fn(),
        disconnect: jest.fn(),
      };

      // Test connection
      await rtcGateway.handleConnection(mockClient as any);
      expect(mockClient.join).toHaveBeenCalled();

      // Test disconnection
      await rtcGateway.handleDisconnect(mockClient as any);
      expect(rtcGateway.server.emit).toHaveBeenCalledWith(
        'user-disconnected',
        'test-user-id'
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid tokens', async () => {
      // Mock invalid token
      mockJwtService.verify.mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });

      await request(app.getHttpServer())
        .post('/files/presign')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          name: 'test.txt',
          mime: 'text/plain',
          size: 1024,
        })
        .expect(401);
    });

    it('should handle AWS S3 errors', async () => {
      // Mock S3 error
      mockAwsS3Service.getPresignedUrl.mockRejectedValueOnce(
        new Error('S3 Error')
      );

      await request(app.getHttpServer())
        .post('/files/presign')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'test.txt',
          mime: 'text/plain',
          size: 1024,
        })
        .expect(500);
    });
  });
});
