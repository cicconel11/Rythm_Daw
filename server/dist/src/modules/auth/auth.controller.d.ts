import { AuthService, AuthResponse } from './auth.service';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(registerDto: RegisterDto): Promise<AuthResponse>;
    register(registerDto: RegisterDto): Promise<AuthResponse>;
}
