import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
export interface AuthResponse {
    id: string;
    email: string;
    name: string;
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    private readonly jwtService;
    private readonly prisma;
    private readonly configService;
    private readonly SALT_ROUNDS;
    private readonly REFRESH_TOKEN_EXPIRY;
    private readonly ACCESS_TOKEN_EXPIRY;
    private readonly JWT_SECRET;
    private readonly NODE_ENV;
    constructor(jwtService: JwtService, prisma: PrismaService, configService: ConfigService);
    signup(email: string, password: string, name?: string): Promise<AuthResponse>;
    login(email: string, password: string): Promise<AuthResponse>;
    logout(userId: string): Promise<boolean>;
    refreshTokens(userId: string, refreshToken: string): Promise<AuthResponse>;
    setRefreshTokenCookie(res: Response, refreshToken: string): void;
    clearRefreshTokenCookie(res: Response): void;
    private generateTokens;
    validateUser(email: string, password: string): Promise<any>;
}
