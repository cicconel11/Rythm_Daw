"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeTestRtcApp = exports.createTestRtcApp = void 0;
const testing_1 = require("@nestjs/testing");
const rtc_module_1 = require("../../src/modules/rtc/rtc.module");
const jwt_ws_auth_guard_1 = require("../../src/modules/auth/guards/jwt-ws-auth.guard");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const rtc_gateway_1 = require("../../src/modules/rtc/rtc.gateway");
const platform_ws_1 = require("@nestjs/platform-ws");
const mockJwtWsAuthGuard = {
    canActivate: jest.fn((context) => {
        const client = context.switchToWs().getClient();
        client.user = { sub: 'test-user-id' };
        return true;
    }),
};
const mockJwtService = {
    verify: jest.fn().mockReturnValue({ sub: 'test-user-id' }),
    sign: jest.fn().mockReturnValue('test-token'),
};
const mockConfigService = {
    get: jest.fn((key) => {
        switch (key) {
            case 'JWT_SECRET':
                return 'test-secret';
            case 'JWT_EXPIRES_IN':
                return '3600s';
            default:
                return null;
        }
    }),
};
const createTestRtcApp = async () => {
    const moduleFixture = await testing_1.Test.createTestingModule({
        imports: [rtc_module_1.RtcModule],
    })
        .overrideProvider(jwt_1.JwtService)
        .useValue(mockJwtService)
        .overrideProvider(config_1.ConfigService)
        .useValue(mockConfigService)
        .overrideGuard(jwt_ws_auth_guard_1.JwtWsAuthGuard)
        .useValue(mockJwtWsAuthGuard)
        .compile();
    const app = moduleFixture.createNestApplication();
    app.useWebSocketAdapter(new platform_ws_1.WsAdapter(app));
    await app.init();
    const httpServer = app.getHttpServer();
    const rtcGateway = app.get(rtc_gateway_1.RtcGateway);
    const io = require('socket.io')(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });
    rtcGateway.registerWsServer(io);
    return { app, moduleFixture };
};
exports.createTestRtcApp = createTestRtcApp;
const closeTestRtcApp = async (app) => {
    if (app) {
        await app.close();
    }
};
exports.closeTestRtcApp = closeTestRtcApp;
//# sourceMappingURL=rtc.test-setup.js.map