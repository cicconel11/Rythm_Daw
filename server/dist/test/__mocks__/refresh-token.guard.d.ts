import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class RefreshTokenGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
export declare const mockRefreshTokenGuard: {
    canActivate: jest.Mock<any, any, any>;
};
