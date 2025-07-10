import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
export interface TokenPayload {
    sub: string;
    email: string;
    name?: string;
    [key: string]: any;
}
export interface AuthResponse {
    id: string;
    email: string;
    name: string;
    accessToken: string;
}
export interface Tokens {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}
export declare class AuthService {
    private readonly jwtService;
    private readonly prisma;
    private readonly configService;
    private readonly authConfig;
    constructor(jwtService: JwtService, prisma: PrismaService, configService: ConfigService);
    signup(email: string, password: string, name?: string): Promise<{
        user: {
            id: any;
            email: any;
            name: any;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    login(user: any): Promise<{
        user: {
            id: any;
            email: any;
            name: any;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<boolean>;
    refreshTokens(userId: string, refreshToken: string): Promise<Tokens>;
    private updateRefreshToken;
    private getTokens;
    validateUser(email: string, pass: string): Promise<any>;
    setRefreshTokenCookie(res: Response, refreshToken: string): void;
    clearRefreshTokenCookie(res: Response): void;
    verifyToken(token: string): Promise<TokenPayload>;
    generateToken(payload: TokenPayload): string;
}
