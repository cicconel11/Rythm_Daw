import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { AwsS3Service } from '../src/modules/files/aws-s3.service';
import { AppModule } from '../src/app.module';
import { ConfigService } from '@nestjs/config';
import { WsAdapter } from '@nestjs/platform-ws';

// Mock AWS S3 service
jest.mock('../src/modules/files/aws-s3.service');

// Mock auth guard
jest.mock('@nestjs/passport', () => ({
  AuthGuard: () => jest.fn().mockImplementation(() => true),
}));

describe('FilesController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let awsS3Service: AwsS3Service;
  let authToken: string;

  beforeAll(async () => {
    // Create testing module
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $connect: jest.fn(),
        $disconnect: jest.fn(),
        user: {
          findUnique: jest.fn().mockResolvedValue({
            id: 1,
            email: 'test@example.com',
            name: 'Test User',
            password: 'hashedpassword',
          }),
        },
      })
      .overrideProvider(AwsS3Service)
      .useValue({
        getPresignedUrl: jest.fn().mockResolvedValue({
          putUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
          getUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    
    // Use WebSocket adapter that won't try to initialize Socket.IO
    app.useWebSocketAdapter(new WsAdapter(app));
    
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    awsS3Service = moduleFixture.get<AwsS3Service>(AwsS3Service);

    await app.init();
    
    // Mock auth token for testing
    authToken = 'test-token';
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /files/presign', () => {
    it('should return pre-signed URLs for file upload', async () => {
      const fileData = {
        name: 'test-file.txt',
        mime: 'text/plain',
        size: 1024, // 1KB
      };

      const response = await request(app.getHttpServer())
        .post('/files/presign')
        .set('Authorization', `Bearer ${authToken}`)
        .send(fileData)
        .expect(201);

      expect(response.body).toHaveProperty('putUrl');
      expect(response.body).toHaveProperty('getUrl');
      expect(typeof response.body.putUrl).toBe('string');
      expect(typeof response.body.getUrl).toBe('string');
      expect(response.body.putUrl).toContain('amazonaws.com');
      expect(response.body.getUrl).toContain('amazonaws.com');
    });

    it('should return 400 for invalid file data', async () => {
      await request(app.getHttpServer())
        .post('/files/presign')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ invalid: 'data' })
        .expect(400);
    });

    it('should return 401 when not authenticated', async () => {
      await request(app.getHttpServer())
        .post('/files/presign')
        .send({
          name: 'test-file.txt',
          mime: 'text/plain',
          size: 1024,
        })
        .expect(401);
    });
  });
});
