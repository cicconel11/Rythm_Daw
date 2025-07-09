import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthConfig } from '../src/config/auth.config';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authConfig: ReturnType<typeof AuthConfig>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    const configService = moduleFixture.get(ConfigService);
    authConfig = configService.get<ReturnType<typeof AuthConfig>>('auth');

    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    // Reset database before each test
    await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE;`;
  });

  describe('POST /auth/signup', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'StrongPass123!',
        name: 'Test User',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(userData.email);
      expect(response.body.name).toBe(userData.name);
    });

    it('should reject weak password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'weak',
          name: 'Test User',
        })
        .expect(400);

      expect(response.body.message).toContain('Password must contain');
    });
  });

  describe('POST /auth/login', () => {
    const testUser = {
      email: 'test@example.com',
      password: 'StrongPass123!',
      name: 'Test User',
    };

    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(testUser);
    });

    it('should login with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.email).toBe(testUser.email);
      
      // Check for httpOnly cookie
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.some((cookie: string) => 
        cookie.includes(authConfig.refreshToken.cookieName))).toBeTruthy();
    });

    it('should reject invalid credentials', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('POST /auth/refresh', () => {
    let refreshToken: string;
    
    beforeEach(async () => {
      // Create a test user and login
      const user = {
        email: 'test@example.com',
        password: 'StrongPass123!',
        name: 'Test User',
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(user);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: user.email,
          password: user.password,
        });

      refreshToken = loginResponse.headers['set-cookie']
        .find((cookie: string) => cookie.includes(authConfig.refreshToken.cookieName));
    });

    it('should refresh access token with valid refresh token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Cookie', [refreshToken])
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
    });

    it('should reject invalid refresh token', async () => {
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Cookie', [`${authConfig.refreshToken.cookieName}=invalidtoken`])
        .expect(401);
    });
  });

  describe('POST /auth/logout', () => {
    let accessToken: string;
    let refreshToken: string;
    
    beforeEach(async () => {
      // Create a test user and login
      const user = {
        email: 'test@example.com',
        password: 'StrongPass123!',
        name: 'Test User',
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(user);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: user.email,
          password: user.password,
        });

      accessToken = loginResponse.body.accessToken;
      refreshToken = loginResponse.headers['set-cookie']
        .find((cookie: string) => cookie.includes(authConfig.refreshToken.cookieName));
    });

    it('should logout successfully', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Cookie', [refreshToken])
        .expect(201);

      // Verify refresh token is invalidated
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Cookie', [refreshToken])
        .expect(401);
    });
  });

  describe('GET /auth/profile', () => {
    let accessToken: string;
    
    beforeEach(async () => {
      // Create a test user and login
      const user = {
        email: 'test@example.com',
        password: 'StrongPass123!',
        name: 'Test User',
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(user);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: user.email,
          password: user.password,
        });

      accessToken = loginResponse.body.accessToken;
    });

    it('should return user profile with valid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('email', 'test@example.com');
    });

    it('should reject with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401);
    });
  });
});
