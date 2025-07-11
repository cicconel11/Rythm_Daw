import { 
  Injectable, 
  UnauthorizedException, 
  ConflictException,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

interface TokenPayload {
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
  refreshToken: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 12;
  private readonly REFRESH_TOKEN_EXPIRY = '7d';
  private readonly ACCESS_TOKEN_EXPIRY = '15m';
  private readonly JWT_SECRET: string;
  private readonly NODE_ENV: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.JWT_SECRET = this.configService.get<string>('JWT_SECRET') || 'your-secret-key';
    this.NODE_ENV = this.configService.get<string>('NODE_ENV') || 'development';
  }

  async signup(email: string, password: string, name?: string): Promise<AuthResponse> {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
    
    // Set default name from email if not provided
    const userName = name || email.split('@')[0];

    // Create new user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: userName,
        isApproved: true, // Auto-approve users by default
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.name);
    
    return {
      id: user.id,
      email: user.email,
      name: user.name || '',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isApproved) {
      throw new ForbiddenException('Account not approved');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.name);
    
    return {
      id: user.id,
      email: user.email,
      name: user.name || '',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async logout(userId: string): Promise<boolean> {
    await this.prisma.user.updateMany({
      where: { id: userId, refreshToken: { not: null } },
      data: { refreshToken: null },
    });
    return true;
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({ 
      where: { id: userId },
      select: { id: true, email: true, name: true, refreshToken: true }
    });

    if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.name);
    
    return {
      id: user.id,
      email: user.email,
      name: user.name || '',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  setRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  clearRefreshTokenCookie(res: Response): void {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: this.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  }

  private async generateTokens(userId: string, email: string, name: string | null): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, name },
        { secret: this.JWT_SECRET, expiresIn: this.ACCESS_TOKEN_EXPIRY }
      ),
      this.jwtService.signAsync(
        { sub: userId, email, name },
        { secret: this.JWT_SECRET, expiresIn: this.REFRESH_TOKEN_EXPIRY }
      ),
    ]);

    // Store the refresh token in the database
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });

    return {
      accessToken,
      refreshToken,
      user: { id: userId, email, name },
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
