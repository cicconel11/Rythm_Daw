"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const request = __importStar(require("supertest"));
const app_module_1 = require("../src/app.module");
const prisma_service_1 = require("../src/prisma/prisma.service");
describe('AuthController (e2e)', () => {
    let app;
    let prisma;
    let authConfig;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
        prisma = moduleFixture.get(prisma_service_1.PrismaService);
        const configService = moduleFixture.get(ConfigService);
        authConfig = configService.get('auth');
        await app.init();
    });
    afterAll(async () => {
        await prisma.$disconnect();
        await app.close();
    });
    beforeEach(async () => {
        await prisma.$executeRaw `TRUNCATE TABLE "User" CASCADE;`;
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
            const cookies = response.headers['set-cookie'];
            expect(cookies).toBeDefined();
            expect(cookies.some((cookie) => cookie.includes(authConfig.refreshToken.cookieName))).toBeTruthy();
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
        let refreshToken;
        beforeEach(async () => {
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
                .find((cookie) => cookie.includes(authConfig.refreshToken.cookieName));
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
        let accessToken;
        let refreshToken;
        beforeEach(async () => {
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
                .find((cookie) => cookie.includes(authConfig.refreshToken.cookieName));
        });
        it('should logout successfully', async () => {
            await request(app.getHttpServer())
                .post('/auth/logout')
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', [refreshToken])
                .expect(201);
            await request(app.getHttpServer())
                .post('/auth/refresh')
                .set('Cookie', [refreshToken])
                .expect(401);
        });
    });
    describe('GET /auth/profile', () => {
        let accessToken;
        beforeEach(async () => {
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
//# sourceMappingURL=auth.e2e-spec.js.map