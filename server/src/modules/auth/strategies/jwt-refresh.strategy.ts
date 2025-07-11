import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  private readonly authConfig: any;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const authConfig = configService.get('auth');
    
    super({
      jwtFromRequest: (req: { cookies?: { [key: string]: string } }) => {
        return req?.cookies?.[authConfig.refreshToken.cookieName];
      },
      secretOrKey: authConfig.refreshToken.secret,
      passReqToCallback: true,
    } as any); // Using type assertion to bypass the type checking issue
    
    this.authConfig = authConfig;
  }

  async validate(req: any, payload: JwtPayload) {
    const refreshToken = req?.cookies?.[this.authConfig.refreshToken.cookieName];
    
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokenMatching) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return { userId: payload.sub, email: payload.email };
  }
}
