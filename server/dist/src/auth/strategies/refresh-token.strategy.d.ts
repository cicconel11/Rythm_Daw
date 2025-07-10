import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
declare const RefreshTokenStrategy_base: new (...args: any[]) => Strategy;
export declare class RefreshTokenStrategy extends RefreshTokenStrategy_base {
    private prisma;
    constructor(prisma: PrismaService, configService: ConfigService);
    validate(req: any, payload: any): Promise<any>;
}
export {};
