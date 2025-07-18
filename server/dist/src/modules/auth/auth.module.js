"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const auth_config_1 = __importDefault(require("../../config/auth.config"));
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const prisma_service_1 = require("../../prisma/prisma.service");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const jwt_refresh_strategy_1 = require("./strategies/jwt-refresh.strategy");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const refresh_token_guard_1 = require("./guards/refresh-token.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forFeature(auth_config_1.default),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('auth.accessToken.secret', 'defaultSecret'),
                    signOptions: {
                        expiresIn: configService.get('auth.accessToken.expiresIn', '15m'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            prisma_service_1.PrismaService,
            jwt_strategy_1.JwtStrategy,
            jwt_refresh_strategy_1.JwtRefreshStrategy,
            jwt_auth_guard_1.JwtAuthGuard,
            refresh_token_guard_1.RefreshTokenGuard,
        ],
        exports: [
            auth_service_1.AuthService,
            jwt_1.JwtModule,
            jwt_auth_guard_1.JwtAuthGuard,
            refresh_token_guard_1.RefreshTokenGuard,
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map