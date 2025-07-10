"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authOptions = void 0;
exports.handleDeviceCodeRequest = handleDeviceCodeRequest;
exports.handleDeviceToken = handleDeviceToken;
const next_auth_1 = __importDefault(require("next-auth"));
const prisma_adapter_1 = require("@next-auth/prisma-adapter");
const client_1 = require("@prisma/client");
const google_1 = __importDefault(require("next-auth/providers/google"));
const apple_1 = __importDefault(require("next-auth/providers/apple"));
const email_1 = __importDefault(require("next-auth/providers/email"));
const crypto_1 = require("crypto");
const prisma = new client_1.PrismaClient();
const deviceCodeStore = new Map();
const generateRandomString = (length) => {
    return (0, crypto_1.randomBytes)(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};
exports.authOptions = {
    adapter: (0, prisma_adapter_1.PrismaAdapter)(prisma),
    providers: [
        (0, email_1.default)({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
        }),
        (0, google_1.default)({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        (0, apple_1.default)({
            clientId: process.env.APPLE_ID || '',
            clientSecret: process.env.APPLE_SECRET || '',
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user = {
                    ...session.user,
                    id: token.sub || '',
                    email: token.email || '',
                    name: token.name || null,
                };
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
        verifyRequest: '/auth/verify-request',
    },
};
exports.default = (0, next_auth_1.default)(exports.authOptions);
async function handleDeviceCodeRequest(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    try {
        const { client_id, scope } = req.body;
        const userCode = generateRandomString(8).toUpperCase();
        const deviceCode = generateRandomString(40);
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);
        deviceCodeStore.set(deviceCode, {
            userCode,
            deviceCode,
            expiresAt,
            scope: scope ? scope.split(' ') : [],
        });
        return res.status(200).json({
            device_code: deviceCode,
            user_code: userCode,
            verification_uri: `${process.env.NEXTAUTH_URL}/device`,
            expires_in: 900,
            interval: 5,
        });
    }
    catch (error) {
        console.error('Device code request error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
async function handleDeviceToken(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    try {
        const { device_code, client_id } = req.body;
        if (!device_code) {
            return res.status(400).json({ error: 'device_code is required' });
        }
        const deviceData = deviceCodeStore.get(device_code);
        if (!deviceData) {
            return res.status(400).json({ error: 'Invalid device code' });
        }
        if (new Date() > deviceData.expiresAt) {
            deviceCodeStore.delete(device_code);
            return res.status(400).json({ error: 'Device code expired' });
        }
        if (!deviceData.userId) {
            return res.status(400).json({ error: 'authorization_pending' });
        }
        const user = await prisma.user.findUnique({
            where: { id: deviceData.userId },
        });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        deviceCodeStore.delete(device_code);
        return res.status(200).json({
            access_token: generateRandomString(40),
            token_type: 'bearer',
            expires_in: 3600,
            refresh_token: generateRandomString(40),
        });
    }
    catch (error) {
        console.error('Device token error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
//# sourceMappingURL=AuthService.js.map