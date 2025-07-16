import { 
  Injectable, 
  UnauthorizedException, 
  ConflictException,
  ForbiddenException,
  Logger
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// Import PrismaService and types
import { PrismaService } from '../../prisma/prisma.service';

// Define the user data we want to expose
interface SafeUser {
  id: string;
  email: string;
  name: string | null;
}
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

export interface TokenPayload {
  sub: string;
  email: string;
  name?: string;
  [key: string]: any;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

export interface Tokens {
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
  private readonly logger = new Logger(AuthService.name);
  private readonly SALT_ROUNDS = 12;
  private readonly REFRESH_TOKEN_EXPIRY = '7d';
  private readonly ACCESS_TOKEN_EXPIRY = '15m';

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async signup(email: string, password: string, name?: string): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
      
      // Create user
      const user = await this.prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          password: hashedPassword,
        },
      });

      // Generate tokens
      const tokens = await this.getTokens(user.id, user.email, user.name || '');
      
      // Update refresh token in database
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      
      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      this.logger.error(`Signup error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate tokens
      const tokens = await this.getTokens(user.id, user.email, user.name || '');
      
      // Update refresh token in database
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      
      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      this.logger.error(`Login error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async logout(userId: string): Promise<boolean> {
    try {
      await this.prisma.user.updateMany({
        where: { id: userId, refreshToken: { not: null } },
        data: { refreshToken: null },
      });
      return true;
    } catch (error) {
      this.logger.error(`Logout error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user?.refreshToken) {
        await this.revokeUserRefreshTokens(userId);
        throw new ForbiddenException('Access Denied - Invalid Token');
      }

      const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!refreshTokenMatches) {
        await this.revokeUserRefreshTokens(userId);
        throw new ForbiddenException('Access Denied - Token Mismatch');
      }

      const tokens = await this.getTokens(user.id, user.email, user.name || '');
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      this.logger.error(`Refresh tokens error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      // Verify the refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Verify the user exists
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Verify the token matches the one in the database
      if (user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = await this.getTokens(user.id, user.email, user.name || undefined);
      
      // Update the refresh token in the database
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: tokens.refreshToken },
      });

      return tokens;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(email: string, password: string): Promise<SafeUser | null> {
    const user = await this.prisma.user.findUnique({ 
      where: { email },
      select: { id: true, email: true, name: true, password: true }
    });
    
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // Return only the safe user fields
    return {
      id: user.id,
      email: user.email,
      name: user.name
    };
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch (error) {
      this.logger.error(`Token verification failed: ${error.message}`, error.stack);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    try {
      const hashedRefreshToken = await bcrypt.hash(refreshToken, this.SALT_ROUNDS);
      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: hashedRefreshToken },
      });
    } catch (error) {
      this.logger.error(`Update refresh token error: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async revokeUserRefreshTokens(userId: string): Promise<void> {
    try {
      await this.prisma.user.updateMany({
        where: { id: userId },
        data: { refreshToken: null },
      });
    } catch (error) {
      this.logger.error(`Revoke refresh tokens error: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async getTokens(userId: string, email: string, name: string): Promise<Tokens> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          { sub: userId, email, name },
          {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.ACCESS_TOKEN_EXPIRY,
          },
        ),
        this.jwtService.signAsync(
          { sub: userId, email, name },
          {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: this.REFRESH_TOKEN_EXPIRY,
          },
        ),
      ]);

      return {
        accessToken,
        refreshToken,
        user: {
          id: userId,
          email,
          name,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to generate tokens: ${error.message}`, error.stack);
      throw error;
    }
  }

  setRefreshTokenCookie(res: Response, refreshToken: string): void {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });
  }

  clearRefreshTokenCookie(res: Response): void {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      path: '/',
    });
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true }
    });
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    return user;
  }
}
