import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
export interface WsJwtPayload {
    sub: string;
    email: string;
    name?: string;
}
declare const WsJwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class WsJwtStrategy extends WsJwtStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: WsJwtPayload): Promise<{
        userId: string;
        email: string;
        name: string | undefined;
    }>;
}
export {};
