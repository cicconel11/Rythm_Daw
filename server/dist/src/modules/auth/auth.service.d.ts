import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    verifyToken(token: string): Promise<{
        sub: string;
        email?: string;
        name?: string;
    }>;
}
