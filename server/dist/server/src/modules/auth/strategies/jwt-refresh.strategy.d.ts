import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
interface JwtPayload {
    sub: string;
    email: string;
}
declare const JwtRefreshStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    private readonly prisma;
    private readonly configService;
    private readonly authConfig;
    constructor(prisma: PrismaService, configService: ConfigService);
    validate(req: any, payload: JwtPayload): Promise<{
        userId: string;
        email: string;
    }>;
}
export {};
