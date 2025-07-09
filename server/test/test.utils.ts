import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { mockPrismaService, mockAwsS3Service, mockConfigService } from './test.setup';
import { AwsS3Service } from '../src/modules/files/aws-s3.service';
import { ConfigService } from '@nestjs/config';
import { WsAdapter } from '../src/ws/ws-adapter';

export const createTestApp = async (): Promise<{
  app: INestApplication;
  moduleFixture: TestingModule;
}> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider('PrismaService')
    .useValue(mockPrismaService)
    .overrideProvider(AwsS3Service)
    .useValue(mockAwsS3Service)
    .overrideProvider(ConfigService)
    .useValue(mockConfigService)
    .compile();

  const app = moduleFixture.createNestApplication();
  
  // Use our WebSocket adapter with ws engine
  const wsAdapter = new WsAdapter(app);
  app.useWebSocketAdapter(wsAdapter);
  
  await app.init();
  
  // Update CORS for WebSocket if needed
  wsAdapter.updateCors(app, '*');

  return { app, moduleFixture };
};

export const closeTestApp = async (app: INestApplication) => {
  if (app) {
    try {
      await app.close();
    } catch (error) {
      console.error('Error closing test app:', error);
    }
  }
};

export const getAuthToken = async (app: INestApplication, email: string, password: string): Promise<string> => {
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password });
  
  return response.body.accessToken;
};

export const createTestUser = async (app: INestApplication, userData: {
  email: string;
  password: string;
  name?: string;
}) => {
  return request(app.getHttpServer())
    .post('/auth/register')
    .send(userData);
};
