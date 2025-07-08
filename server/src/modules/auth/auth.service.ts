import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export interface TokenPayload {
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
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async signup(email: string, password: string, name: string): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const userName = name || email.split('@')[0];
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: userName,
        isApproved: true,
      },
    });

    // Ensure name is not null for the response
    const safeName = user.name || '';

    // Generate JWT token
    const payload = { 
      sub: user.id, 
      email: user.email, 
      name: safeName 
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      id: user.id,
      email: user.email,
      name: safeName,
      accessToken,
    };
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  generateToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload);
  }
}
