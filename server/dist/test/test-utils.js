"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockSocket = exports.createTestingModule = void 0;
const testing_1 = require("@nestjs/testing");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const mockJwtService = {
    verify: jest.fn(),
};
const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret'),
};
async function createTestingModule(providers = []) {
    const moduleFixture = await testing_1.Test.createTestingModule({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
        ],
        providers: [
            ...providers,
            {
                provide: jwt_1.JwtService,
                useValue: mockJwtService,
            },
            {
                provide: 'ConfigService',
                useValue: mockConfigService,
            },
        ],
    }).compile();
    const app = moduleFixture.createNestApplication();
    await app.init();
    return { app, module: moduleFixture };
}
exports.createTestingModule = createTestingModule;
function createMockSocket(token, user) {
    return {
        handshake: {
            auth: {
                token: token ? `Bearer ${token}` : undefined,
            },
        },
        data: {},
        join: jest.fn(),
        leave: jest.fn(),
        emit: jest.fn(),
        to: jest.fn().mockReturnThis(),
    };
}
exports.createMockSocket = createMockSocket;
//# sourceMappingURL=test-utils.js.map