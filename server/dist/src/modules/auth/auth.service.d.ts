import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
interface SafeUser {
    id: string;
    email: string;
    name: string | null;
}
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
export interface TokenPayload {
    sub: string;
    email: string;
    name?: string;
    [key: string]: any;
}
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        name: string | null;
    };
}
export interface Tokens {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        name: string | null;
    };
}
export declare class AuthService {
    private readonly jwtService;
    private readonly prisma;
    private readonly configService;
    private readonly logger;
    private readonly SALT_ROUNDS;
    private readonly REFRESH_TOKEN_EXPIRY;
    private readonly ACCESS_TOKEN_EXPIRY;
    constructor(jwtService: JwtService, prisma: PrismaService, configService: ConfigService);
    signup(email: string, password: string, name?: string): Promise<AuthResponse>;
    login(email: string, password: string): Promise<AuthResponse>;
    logout(userId: string): Promise<boolean>;
    refreshTokens(userId: string, refreshToken: string): Promise<Tokens>;
    validateUser(email: string, password: string): Promise<SafeUser | null>;
    verifyToken(token: string): Promise<TokenPayload>;
    private updateRefreshToken;
    private revokeUserRefreshTokens;
    private getTokens;
    setRefreshTokenCookie(res: Response, refreshToken: string): void;
    clearRefreshTokenCookie(res: Response): void;
    getUserById(userId: string): Promise<{
        id: string;
        email: string;
        name: string | null;
    }>;
}
export {};
