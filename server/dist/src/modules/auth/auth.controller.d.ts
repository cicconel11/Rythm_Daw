import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(registerDto: RegisterDto, res: Response): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    register(registerDto: RegisterDto, res: Response): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    login(loginDto: LoginDto, res: Response): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    refreshToken(req: any, res: Response): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string | null;
        };
    }>;
    logout(req: any, res: Response): Promise<{
        message: string;
    }>;
    getProfile(req: any): any;
}
