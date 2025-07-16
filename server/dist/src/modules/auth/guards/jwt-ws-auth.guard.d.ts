import { ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
declare const JwtWsAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtWsAuthGuard extends JwtWsAuthGuard_base {
    getRequest(context: ExecutionContext): {
        headers: {
            authorization: string;
        };
    };
    handleRequest(err: any, user: any, info: any): any;
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
export {};
