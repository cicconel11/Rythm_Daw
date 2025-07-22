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
import type { Request, Response } from 'express';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiBearerAuth 
} from '@nestjs/swagger';
import { AuthService, AuthResponse, Tokens } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
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
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name || result.user.email.split('@')[0] // Use email prefix as fallback for name
        }
      };
    } catch (error) {
      throw new HttpException(
        (error as any).message || 'Registration failed',
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

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string; user: { id: string; email: string; name: string } }> {
    const { email, password } = loginDto;
    const result = await this.authService.login(email, password);
    this.authService.setRefreshTokenCookie(res, result.refreshToken);
    
    return {
      accessToken: result.accessToken,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name || result.user.email.split('@')[0], // Use email prefix as fallback for name
      },
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
