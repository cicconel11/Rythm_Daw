import { 
  Controller, 
  Post, 
  Body, 
  HttpStatus, 
  HttpException, 
  UsePipes, 
  ValidationPipe, 
  Req, 
  Res, 
  UseGuards, 
  Get, 
  HttpCode 
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService, AuthResponse, Tokens } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const result = await this.authService.signup(
        registerDto.email,
        registerDto.password,
        registerDto.name,
      );
      
      // Set refresh token in HTTP-only cookie
      this.authService.setRefreshTokenCookie(res, result.refreshToken);
      
      return {
        accessToken: result.accessToken,
        user: result.user
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Registration failed',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.signup(registerDto, res);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(req.user);
    this.authService.setRefreshTokenCookie(res, result.refreshToken);
    
    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshToken(
    @Req() req: any, 
    @Res({ passthrough: true }) res: Response
  ) {
    const userId = req.user.sub;
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new HttpException('Refresh token is required', HttpStatus.BAD_REQUEST);
    }

    const tokens = await this.authService.refreshTokens(userId, refreshToken);
    this.authService.setRefreshTokenCookie(res, tokens.refreshToken);

    return { 
      accessToken: tokens.accessToken,
      user: tokens.user
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: any, 
    @Res({ passthrough: true }) res: Response
  ) {
    await this.authService.logout(req.user.id);
    this.authService.clearRefreshTokenCookie(res);
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }
}
