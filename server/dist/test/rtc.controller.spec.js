"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const test_utils_1 = require("./test.utils");
describe('RtcController (e2e)', () => {
    let app;
    let authToken;
    const testUser = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
    };
    beforeAll(async () => {
        const { app: testApp } = await (0, test_utils_1.createTestApp)();
        app = testApp;
        await (0, test_utils_1.createTestUser)(app, testUser);
        authToken = await (0, test_utils_1.getAuthToken)(app, testUser.email, testUser.password);
    });
    afterAll(async () => {
        await (0, test_utils_1.closeTestApp)(app);
    });
    describe('POST /rtc/offer', () => {
        it('should handle RTC offer', async () => {
            const offerData = {
                targetUserId: 'test-target-user',
                sdp: 'test-sdp',
                type: 'offer'
            };
            const response = await (0, supertest_1.default)(app.getHttpServer())
                .post('/rtc/offer')
                .set('Authorization', `Bearer ${authToken}`)
                .send(offerData)
                .expect(201);
            expect(response.body).toHaveProperty('status', 'offer-received');
        });
        it('should return 400 for invalid offer data', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/rtc/offer')
                .set('Authorization', `Bearer ${authToken}`)
                .send({})
                .expect(400);
        });
        it('should return 401 when not authenticated', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/rtc/offer')
                .send({
                targetUserId: 'test-target-user',
                sdp: 'test-sdp',
                type: 'offer'
            })
                .expect(401);
        });
    });
});
//# sourceMappingURL=rtc.controller.spec.js.map