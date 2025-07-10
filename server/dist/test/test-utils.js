"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestingModule = createTestingModule;
exports.createMockSocket = createMockSocket;
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
    verify: jest.fn().mockImplementation((token) => ({
        sub: 'test-user-id',
        email: 'test@example.com',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
    })),
    decode: jest.fn().mockImplementation((token) => ({
        sub: 'test-user-id',
        email: 'test@example.com',
    })),
};
const mockConfigService = {
    get: jest.fn((key) => {
        const config = {
            'JWT_SECRET': 'test-secret',
            'JWT_EXPIRES_IN': '1h',
            'REFRESH_TOKEN_SECRET': 'test-refresh-secret',
            'REFRESH_TOKEN_EXPIRES_IN': '7d',
            'NODE_ENV': 'test',
        };
        return config[key] ?? null;
    }),
};
const mockPrismaService = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};
async function createTestingModule({ providers = [], imports = [], controllers = [], } = {}) {
    const moduleFixture = await testing_1.Test.createTestingModule({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env.test',
            }),
            ...imports,
        ],
        controllers,
        providers: [
            ...providers,
            {
                provide: jwt_1.JwtService,
                useValue: mockJwtService,
            },
            {
                provide: config_1.ConfigService,
                useValue: mockConfigService,
            },
            {
                provide: prisma_service_1.PrismaService,
                useValue: mockPrismaService,
            },
        ],
    })
        .setLogger(new common_1.Logger())
        .compile();
    const app = moduleFixture.createNestApplication();
    await app.init();
    return {
        app,
        module: moduleFixture,
        mocks: {
            jwtService: mockJwtService,
            configService: mockConfigService,
            prismaService: mockPrismaService,
        },
    };
}
function createMockSocket(token, user = { id: 'test-user-id' }) {
    return {
        id: 'test-socket-id',
        handshake: {
            auth: {
                token: token || 'mock-jwt-token',
            },
        },
        data: { user },
        join: jest.fn().mockReturnThis(),
        leave: jest.fn().mockReturnThis(),
        emit: jest.fn().mockReturnThis(),
        to: jest.fn().mockReturnThis(),
        disconnect: jest.fn().mockReturnThis(),
    };
}
//# sourceMappingURL=test-utils.js.map