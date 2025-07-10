"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestUser = exports.getAuthToken = exports.closeTestApp = exports.createTestApp = void 0;
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("../src/app.module");
const test_setup_1 = require("./test.setup");
const aws_s3_service_1 = require("../src/modules/files/aws-s3.service");
const config_1 = require("@nestjs/config");
const ws_adapter_1 = require("../src/ws/ws-adapter");
const createTestApp = async () => {
    const moduleFixture = await testing_1.Test.createTestingModule({
        imports: [app_module_1.AppModule],
    })
        .overrideProvider('PrismaService')
        .useValue(test_setup_1.mockPrismaService)
        .overrideProvider(aws_s3_service_1.AwsS3Service)
        .useValue(test_setup_1.mockAwsS3Service)
        .overrideProvider(config_1.ConfigService)
        .useValue(test_setup_1.mockConfigService)
        .compile();
    const app = moduleFixture.createNestApplication();
    const wsAdapter = new ws_adapter_1.WsAdapter(app);
    app.useWebSocketAdapter(wsAdapter);
    await app.init();
    wsAdapter.updateCors(app, '*');
    return { app, moduleFixture };
};
exports.createTestApp = createTestApp;
const closeTestApp = async (app) => {
    if (app) {
        try {
            await app.close();
        }
        catch (error) {
            console.error('Error closing test app:', error);
        }
    }
};
exports.closeTestApp = closeTestApp;
const getAuthToken = async (app, email, password) => {
    const response = await (0, supertest_1.default)(app.getHttpServer())
        .post('/auth/login')
        .send({ email, password });
    return response.body.accessToken;
};
exports.getAuthToken = getAuthToken;
const createTestUser = async (app, userData) => {
    return (0, supertest_1.default)(app.getHttpServer())
        .post('/auth/register')
        .send(userData);
};
exports.createTestUser = createTestUser;
//# sourceMappingURL=test.utils.js.map