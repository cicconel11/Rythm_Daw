import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { AwsS3Service } from '../src/modules/files/aws-s3.service';
import { createTestingApp } from './utils/create-testing-module';

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
    const moduleFixture = await createTestingApp({
      awsS3: {
        getPresignedUrl: jest.fn().mockResolvedValue({
          putUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
          getUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
        }),
      },
      prisma: {
        user: {
          findUnique: jest.fn().mockResolvedValue({
            id: 1,
            email: 'test@example.com',
            name: 'Test User',
            password: 'hashedpassword',
          }),
        },
      },
    });

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    awsS3Service = app.get<AwsS3Service>(AwsS3Service);

    await app.init();
    
    // Create a test user and get auth token
    // This assumes you have an auth endpoint to get a token
    const authResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
      
    authToken = authResponse.body.accessToken;
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
