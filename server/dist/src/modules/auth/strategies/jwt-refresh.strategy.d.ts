import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
declare const JwtRefreshStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    private prisma;
    constructor(prisma: PrismaService, configService: ConfigService);
    validate(req: any, payload: any): Promise<{
        userId: any;
        email: any;
    }>;
}
export {};
