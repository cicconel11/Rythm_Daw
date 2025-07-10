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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = __importStar(require("supertest"));
const prisma_service_1 = require("../src/prisma/prisma.service");
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../src/app.module");
describe('RtcController (e2e)', () => {
    let app;
    let prisma;
    let authToken;
    let userId;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        })
            .overrideProvider(prisma_service_1.PrismaService)
            .useValue({
            user: {
                findUnique: jest.fn().mockResolvedValue({
                    id: 1,
                    email: 'test@example.com',
                    name: 'Test User',
                }),
            },
        })
            .overrideProvider('AwsS3Service')
            .useValue({
            getPresignedUrl: jest.fn().mockResolvedValue('http://mock-presigned-url'),
        })
            .compile();
        app = moduleFixture.createNestApplication();
        prisma = moduleFixture.get(prisma_service_1.PrismaService);
        await app.init();
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
            const mockEmit = jest.fn();
            const mockServer = {
                to: jest.fn().mockReturnThis(),
                emit: mockEmit
            };
            const rtcGateway = app.get('RtcGateway');
            rtcGateway.server = mockServer;
            await request(app.getHttpServer())
                .post('/rtc/offer')
                .set('Authorization', `Bearer ${authToken}`)
                .send(offerData)
                .expect(204);
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
//# sourceMappingURL=rtc.offer.spec.js.map