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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
const config_1 = require("@nestjs/config");
let AuthService = AuthService_1 = class AuthService {
    constructor(jwtService, prisma, configService) {
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.configService = configService;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.SALT_ROUNDS = 12;
        this.REFRESH_TOKEN_EXPIRY = '7d';
        this.ACCESS_TOKEN_EXPIRY = '15m';
    }
    async signup(email, password, name) {
        try {
            const existingUser = await this.prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                throw new common_1.ConflictException('Email already in use');
            }
            const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
            const user = await this.prisma.user.create({
                data: {
                    email,
                    name: name || email.split('@')[0],
                    password: hashedPassword,
                },
            });
            const tokens = await this.getTokens(user.id, user.email, user.name || '');
            await this.updateRefreshToken(user.id, tokens.refreshToken);
            return {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            };
        }
        catch (error) {
            this.logger.error(`Signup error: ${error.message}`, error.stack);
            throw error;
        }
    }
    async login(email, password) {
        try {
            const user = await this.prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const tokens = await this.getTokens(user.id, user.email, user.name || '');
            await this.updateRefreshToken(user.id, tokens.refreshToken);
            return {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            };
        }
        catch (error) {
            this.logger.error(`Login error: ${error.message}`, error.stack);
            throw error;
        }
    }
    async logout(userId) {
        try {
            await this.prisma.user.updateMany({
                where: { id: userId, refreshToken: { not: null } },
                data: { refreshToken: null },
            });
            return true;
        }
        catch (error) {
            this.logger.error(`Logout error: ${error.message}`, error.stack);
            throw error;
        }
    }
    async refreshTokens(userId, refreshToken) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user?.refreshToken) {
                await this.revokeUserRefreshTokens(userId);
                throw new common_1.ForbiddenException('Access Denied - Invalid Token');
            }
            const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
            if (!refreshTokenMatches) {
                await this.revokeUserRefreshTokens(userId);
                throw new common_1.ForbiddenException('Access Denied - Token Mismatch');
            }
            const tokens = await this.getTokens(user.id, user.email, user.name || '');
            await this.updateRefreshToken(user.id, tokens.refreshToken);
            return tokens;
        }
        catch (error) {
            this.logger.error(`Refresh tokens error: ${error.message}`, error.stack);
            throw error;
        }
    }
    async refreshTokens(userId, refreshToken) {
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Refresh token is required');
        }
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            if (user.refreshToken !== refreshToken) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const tokens = await this.getTokens(user.id, user.email, user.name || undefined);
            await this.prisma.user.update({
                where: { id: user.id },
                data: { refreshToken: tokens.refreshToken },
            });
            return tokens;
        }
        catch (error) {
            console.error('Refresh token error:', error);
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, name: true, password: true }
        });
        if (!user) {
            return null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name
        };
    }
    async verifyToken(token) {
        try {
            return this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
        }
        catch (error) {
            this.logger.error(`Token verification failed: ${error.message}`, error.stack);
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    async updateRefreshToken(userId, refreshToken) {
        try {
            const hashedRefreshToken = await bcrypt.hash(refreshToken, this.SALT_ROUNDS);
            await this.prisma.user.update({
                where: { id: userId },
                data: { refreshToken: hashedRefreshToken },
            });
        }
        catch (error) {
            this.logger.error(`Update refresh token error: ${error.message}`, error.stack);
            throw error;
        }
    }
    async revokeUserRefreshTokens(userId) {
        try {
            await this.prisma.user.updateMany({
                where: { id: userId },
                data: { refreshToken: null },
            });
        }
        catch (error) {
            this.logger.error(`Revoke refresh tokens error: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getTokens(userId, email, name) {
        try {
            const [accessToken, refreshToken] = await Promise.all([
                this.jwtService.signAsync({ sub: userId, email, name }, {
                    secret: this.configService.get('JWT_SECRET'),
                    expiresIn: this.ACCESS_TOKEN_EXPIRY,
                }),
                this.jwtService.signAsync({ sub: userId, email, name }, {
                    secret: this.configService.get('JWT_REFRESH_SECRET'),
                    expiresIn: this.REFRESH_TOKEN_EXPIRY,
                }),
            ]);
            return {
                accessToken,
                refreshToken,
                user: {
                    id: userId,
                    email,
                    name,
                },
            };
        }
        catch (error) {
            this.logger.error(`Failed to generate tokens: ${error.message}`, error.stack);
            throw error;
        }
    }
    setRefreshTokenCookie(res, refreshToken) {
        const isProduction = this.configService.get('NODE_ENV') === 'production';
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'strict' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        });
    }
    clearRefreshTokenCookie(res) {
        const isProduction = this.configService.get('NODE_ENV') === 'production';
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'strict' : 'lax',
            path: '/',
        });
    }
    async getUserById(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true }
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map