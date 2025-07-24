"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('auth', () => ({
    accessToken: {
        secret: process.env.JWT_SECRET || 'your-access-secret',
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    },
    refreshToken: {
        secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        cookieName: 'refreshToken',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    password: {
        saltRounds: 12,
    },
}));
//# sourceMappingURL=auth.config.js.map