"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const supertest_1 = __importDefault(require("supertest"));
const prisma_service_1 = require("../src/prisma/prisma.service");
const aws_s3_service_1 = require("../src/modules/files/aws-s3.service");
const rtc_gateway_1 = require("../src/modules/rtc/rtc.gateway");
const jwt_1 = require("@nestjs/jwt");
const app_module_1 = require("../src/app.module");
const platform_ws_1 = require("@nestjs/platform-ws");
const mockAwsS3Service = {
    getPresignedUrl: jest.fn().mockImplementation((key, operation) => ({
        url: `https://s3.amazonaws.com/test-bucket/${key}`,
        fields: { key },
    })),
};
const mockJwtService = {
    verify: jest.fn().mockReturnValue({ sub: 'test-user-id' }),
    sign: jest.fn().mockReturnValue('test-token'),
};
describe('RTC and File Upload Integration', () => {
    let app;
    let prisma;
    let rtcGateway;
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
                    id: 'test-user-id',
                    email: 'test@example.com',
                    name: 'Test User',
                }),
            },
        })
            .overrideProvider(aws_s3_service_1.AwsS3Service)
            .useValue(mockAwsS3Service)
            .overrideProvider(jwt_1.JwtService)
            .useValue(mockJwtService)
            .compile();
        app = moduleFixture.createNestApplication();
        app.useWebSocketAdapter(new platform_ws_1.WsAdapter(app));
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
        prisma = moduleFixture.get(prisma_service_1.PrismaService);
        rtcGateway = moduleFixture.get(rtc_gateway_1.RtcGateway);
        rtcGateway.server = {
            to: jest.fn().mockReturnThis(),
            emit: jest.fn(),
            sockets: {
                sockets: new Map(),
            },
        };
        await app.init();
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
            const response = await (0, supertest_1.default)(app.getHttpServer())
                .post('/files/presign')
                .set('Authorization', `Bearer ${authToken}`)
                .send(testFile)
                .expect(201);
            expect(response.body).toHaveProperty('putUrl');
            expect(response.body).toHaveProperty('getUrl');
            expect(mockAwsS3Service.getPresignedUrl).toHaveBeenCalledWith(expect.stringContaining('test-file.txt'), 'putObject');
        });
        it('should validate file metadata', async () => {
            const invalidFiles = [
                { name: '', mime: 'text/plain', size: 1024 },
                { name: 'test.txt', mime: '', size: 1024 },
                { name: 'test.txt', mime: 'text/plain', size: 0 },
                { name: 'test.txt', mime: 'text/plain', size: 6 * 1024 * 1024 * 1024 },
            ];
            for (const file of invalidFiles) {
                await (0, supertest_1.default)(app.getHttpServer())
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
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/rtc/offer')
                .set('Authorization', `Bearer ${authToken}`)
                .send(offer)
                .expect(204);
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
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/rtc/answer')
                .set('Authorization', `Bearer ${authToken}`)
                .send(answer)
                .expect(204);
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
            await rtcGateway.handleConnection(mockClient);
            expect(mockClient.join).toHaveBeenCalled();
            await rtcGateway.handleDisconnect(mockClient);
            expect(rtcGateway.server.emit).toHaveBeenCalledWith('user-disconnected', 'test-user-id');
        });
    });
    describe('Error Handling', () => {
        it('should handle invalid tokens', async () => {
            mockJwtService.verify.mockImplementationOnce(() => {
                throw new Error('Invalid token');
            });
            await (0, supertest_1.default)(app.getHttpServer())
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
            mockAwsS3Service.getPresignedUrl.mockRejectedValueOnce(new Error('S3 Error'));
            await (0, supertest_1.default)(app.getHttpServer())
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
//# sourceMappingURL=rtc.integration.spec.js.map