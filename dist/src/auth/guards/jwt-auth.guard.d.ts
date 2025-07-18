import { ExecutionContext } from '@nestjs/common';
declare global {
    namespace Express {
        interface User {
            userId: string;
            email: string;
            name?: string;
        }
        interface Request {
            user?: User;
        }
    }
}
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | import("rxjs").Observable<boolean>;
    handleRequest(err: any, user: any, info: any, context: ExecutionContext): any;
}
export {};
