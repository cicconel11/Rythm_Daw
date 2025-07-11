"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("../src/app.module");
const prisma_service_1 = require("../src/prisma/prisma.service");
const auth_config_1 = __importDefault(require("../src/config/auth.config"));
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
        const configService = moduleFixture.get('ConfigService');
        authConfig = (0, auth_config_1.default)();
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
            const response = await (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/signup')
                .send(userData)
                .expect(201);
            expect(response.body).toHaveProperty('accessToken');
            expect(response.body).toHaveProperty('id');
            expect(response.body.email).toBe(userData.email);
            expect(response.body.name).toBe(userData.name);
        });
        it('should reject weak password', async () => {
            const response = await (0, supertest_1.default)(app.getHttpServer())
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
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/signup')
                .send(testUser);
        });
        it('should login with valid credentials', async () => {
            const response = await (0, supertest_1.default)(app.getHttpServer())
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
            if (Array.isArray(cookies)) {
                expect(cookies.some(cookie => cookie.includes('refreshToken='))).toBeTruthy();
            }
            else if (typeof cookies === 'string') {
                expect(cookies.includes('refreshToken=')).toBeTruthy();
            }
            else {
                fail('Expected cookies to be defined');
            }
        });
        it('should reject invalid credentials', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
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
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/signup')
                .send(user);
            const loginResponse = await (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/login')
                .send({
                email: user.email,
                password: user.password,
            });
            const cookies = loginResponse.headers['set-cookie'];
            if (Array.isArray(cookies)) {
                refreshToken = cookies.find(cookie => cookie.includes('refreshToken=')) || '';
            }
            else if (typeof cookies === 'string') {
                refreshToken = cookies.includes('refreshToken=') ? cookies : '';
            }
            else {
                refreshToken = '';
            }
        });
        it('should refresh access token with valid refresh token', async () => {
            const response = await (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/refresh')
                .set('Cookie', [refreshToken])
                .expect(200);
            expect(response.body).toHaveProperty('accessToken');
        });
        it('should reject invalid refresh token', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
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
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/signup')
                .send(user);
            const loginResponse = await (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/login')
                .send({
                email: user.email,
                password: user.password,
            });
            accessToken = loginResponse.body.accessToken;
            const cookies = loginResponse.headers['set-cookie'];
            if (Array.isArray(cookies)) {
                refreshToken = cookies.find(cookie => cookie.includes('refreshToken=')) || '';
            }
            else if (typeof cookies === 'string') {
                refreshToken = cookies.includes('refreshToken=') ? cookies : '';
            }
            else {
                refreshToken = '';
            }
        });
        it('should logout successfully', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/logout')
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', [refreshToken])
                .expect(201);
            await (0, supertest_1.default)(app.getHttpServer())
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
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/signup')
                .send(user);
            const loginResponse = await (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/login')
                .send({
                email: user.email,
                password: user.password,
            });
            accessToken = loginResponse.body.accessToken;
        });
        it('should return user profile with valid token', async () => {
            const response = await (0, supertest_1.default)(app.getHttpServer())
                .get('/auth/profile')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);
            expect(response.body).toHaveProperty('email', 'test@example.com');
        });
        it('should reject with invalid token', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .get('/auth/profile')
                .set('Authorization', 'Bearer invalidtoken')
                .expect(401);
        });
    });
});
//# sourceMappingURL=auth.e2e-spec.js.map