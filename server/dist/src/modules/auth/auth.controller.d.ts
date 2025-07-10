import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
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
    login(req: any, res: Response): Promise<{
        accessToken: string;
        user: {
            id: any;
            email: any;
            name: any;
        };
    }>;
    refreshToken(req: any, res: Response): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    logout(req: any, res: Response): Promise<{
        message: string;
    }>;
    getProfile(req: any): any;
}
