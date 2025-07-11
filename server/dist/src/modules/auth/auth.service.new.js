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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(jwtService, prisma, configService) {
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.configService = configService;
        this.SALT_ROUNDS = 12;
        this.REFRESH_TOKEN_EXPIRY = '7d';
        this.ACCESS_TOKEN_EXPIRY = '15m';
        this.JWT_SECRET = this.configService.get('JWT_SECRET') || 'your-secret-key';
        this.NODE_ENV = this.configService.get('NODE_ENV') || 'development';
    }
    async signup(email, password, name) {
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new common_1.ConflictException('Email already in use');
        }
        const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
        const userName = name || email.split('@')[0];
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: userName,
                isApproved: true,
            },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });
        const tokens = await this.generateTokens(user.id, user.email, user.name);
        return {
            id: user.id,
            email: user.email,
            name: user.name || '',
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }
    async login(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isApproved) {
            throw new common_1.ForbiddenException('Account not approved');
        }
        const tokens = await this.generateTokens(user.id, user.email, user.name);
        return {
            id: user.id,
            email: user.email,
            name: user.name || '',
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }
    async logout(userId) {
        await this.prisma.user.updateMany({
            where: { id: userId, refreshToken: { not: null } },
            data: { refreshToken: null },
        });
        return true;
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, refreshToken: true }
        });
        if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
            throw new common_1.ForbiddenException('Access Denied');
        }
        const tokens = await this.generateTokens(user.id, user.email, user.name);
        return {
            id: user.id,
            email: user.email,
            name: user.name || '',
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }
    setRefreshTokenCookie(res, refreshToken) {
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: this.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }
    clearRefreshTokenCookie(res) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: this.NODE_ENV === 'production',
            sameSite: 'lax',
        });
    }
    async generateTokens(userId, email, name) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({ sub: userId, email, name }, { secret: this.JWT_SECRET, expiresIn: this.ACCESS_TOKEN_EXPIRY }),
            this.jwtService.signAsync({ sub: userId, email, name }, { secret: this.JWT_SECRET, expiresIn: this.REFRESH_TOKEN_EXPIRY }),
        ]);
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken },
        });
        return {
            accessToken,
            refreshToken,
            user: { id: userId, email, name },
        };
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.new.js.map