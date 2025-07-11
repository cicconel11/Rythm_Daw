import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

interface JwtPayload {
  sub: string;
  email: string;
  name?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private prisma: PrismaClient;

  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwt.secret') || 'your-secret-key',
    });
    this.prisma = new PrismaClient();
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        isApproved: true,
      },
    });
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    if (!user.isApproved) {
      throw new UnauthorizedException('User account is not approved');
    }
    
    return { 
      userId: user.id,
      email: payload.email,
      name: payload.name,
    };
  }
}
