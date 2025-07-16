import { Request, Response } from 'express';
import { AuthService, AuthResponse } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto, res: Response): Promise<AuthResponse>;
    login(loginDto: LoginDto, res: Response): Promise<AuthResponse>;
    refreshTokens(userId: string, refreshToken: string, res: Response): Promise<AuthResponse>;
    logout(userId: string, res: Response): Promise<boolean>;
    getProfile(req: Request): Express.User | undefined;
}
