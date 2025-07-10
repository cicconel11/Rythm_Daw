"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const prisma_service_1 = require("../src/prisma/prisma.service");
const aws_s3_service_1 = require("../src/modules/files/aws-s3.service");
const app_module_1 = require("../src/app.module");
const platform_ws_1 = require("@nestjs/platform-ws");
jest.mock('../src/modules/files/aws-s3.service');
jest.mock('@nestjs/passport', () => ({
    AuthGuard: () => jest.fn().mockImplementation(() => true),
}));
describe('FilesController (e2e)', () => {
    let app;
    let prisma;
    let awsS3Service;
    let authToken;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        })
            .overrideProvider(prisma_service_1.PrismaService)
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
            .overrideProvider(aws_s3_service_1.AwsS3Service)
            .useValue({
            getPresignedUrl: jest.fn().mockResolvedValue({
                putUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
                getUrl: 'https://s3.amazonaws.com/test-bucket/test-file.txt',
            }),
        })
            .compile();
        app = moduleFixture.createNestApplication();
        app.useWebSocketAdapter(new platform_ws_1.WsAdapter(app));
        prisma = moduleFixture.get(prisma_service_1.PrismaService);
        awsS3Service = moduleFixture.get(aws_s3_service_1.AwsS3Service);
        await app.init();
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
                size: 1024,
            };
            const response = await (0, supertest_1.default)(app.getHttpServer())
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
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/files/presign')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ invalid: 'data' })
                .expect(400);
        });
        it('should return 401 when not authenticated', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
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
//# sourceMappingURL=rtc.presign.spec.js.map