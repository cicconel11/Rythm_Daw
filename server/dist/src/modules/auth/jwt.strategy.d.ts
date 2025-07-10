import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    private configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    validate(payload: any): Promise<{
        userId: any;
        email: any;
        name: any;
    } | null>;
}
export {};
