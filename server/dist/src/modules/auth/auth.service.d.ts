import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
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
export declare class AuthService {
    private readonly jwtService;
    private readonly prisma;
    constructor(jwtService: JwtService, prisma: PrismaService);
    signup(email: string, password: string, name: string): Promise<AuthResponse>;
    verifyToken(token: string): Promise<TokenPayload>;
    generateToken(payload: TokenPayload): string;
}
