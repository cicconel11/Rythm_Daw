import { 
  Controller, 
  Post, 
  Body, 
  HttpStatus, 
  UsePipes, 
  ValidationPipe, 
  Res, 
  Get, 
  Req,
  UseGuards,
  HttpCode
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService, AuthResponse } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { GetCurrentUserId } from './decorators/get-current-user-id.decorator';
import { GetCurrentUser } from './decorators/get-current-user.decorator';

@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const result = await this.authService.signup(
      registerDto.email,
      registerDto.password,
      registerDto.name,
    );
    
    this.authService.setRefreshTokenCookie(res, result.refreshToken);
    
    return result;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const result = await this.authService.login(loginDto.email, loginDto.password);
    
    this.authService.setRefreshTokenCookie(res, result.refreshToken);
    
    return result;
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @GetCurrentUserId() userId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    await this.authService.logout(userId);
    this.authService.clearRefreshTokenCookie(res);
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
