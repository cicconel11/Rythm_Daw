import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { Request } from 'express';
interface JwtPayload {
    sub: string;
    email: string;
}
declare const RefreshTokenStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithoutRequest] | [opt: import("passport-jwt").StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class RefreshTokenStrategy extends RefreshTokenStrategy_base {
    private prisma;
    constructor(prisma: PrismaService, configService: ConfigService);
    validate(req: Request, payload: JwtPayload): Promise<{
        refreshToken: any;
        sub: string;
        email: string;
    }>;
}
export {};
