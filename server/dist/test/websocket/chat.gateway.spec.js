"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const chat_gateway_1 = require("../../src/modules/websocket/chat.gateway");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("../../src/modules/auth/auth.service");
const mockAuthService = {
    verifyToken: jest.fn().mockResolvedValue({ sub: 'test-user' })
};
const ws_1 = require("../__mocks__/ws");
describe('ChatGateway', () => {
    let gateway;
    let authService;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                chat_gateway_1.ChatGateway,
                {
                    provide: auth_service_1.AuthService,
                    useValue: mockAuthService,
                },
                {
                    provide: jwt_1.JwtService,
                    useValue: {
                        verify: jest.fn().mockReturnValue({ sub: 'test-user' }),
                    },
                },
                {
                    provide: config_1.ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue('test-secret'),
                    },
                },
            ],
        }).compile();
        gateway = module.get(chat_gateway_1.ChatGateway);
        authService = module.get(auth_service_1.AuthService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });
    describe('handleConnection', () => {
        it('should add client to clients map', () => {
            const mockClient = new ws_1.MockWebSocket();
            gateway.handleConnection(mockClient);
            expect(gateway['clients'].has(mockClient)).toBe(true);
        });
    });
    describe('handleDisconnect', () => {
        it('should remove client from clients map', () => {
            const mockClient = new ws_1.MockWebSocket();
            gateway['clients'].set(mockClient, mockClient);
            gateway.handleDisconnect(mockClient);
            expect(gateway['clients'].has(mockClient)).toBe(false);
        });
    });
});
//# sourceMappingURL=chat.gateway.spec.js.map