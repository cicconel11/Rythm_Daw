import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
declare const WsJwtGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class WsJwtGuard extends WsJwtGuard_base {
    private jwtService;
    private configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    getRequest(context: ExecutionContext): any;
    private extractTokenFromHeader;
}
export {};
