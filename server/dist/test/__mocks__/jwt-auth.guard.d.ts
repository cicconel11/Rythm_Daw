import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class JwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
export declare const mockJwtAuthGuard: {
    canActivate: jest.Mock<any, any, any>;
};
