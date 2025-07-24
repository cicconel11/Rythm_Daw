declare const _default: (() => {
    accessToken: {
        secret: string;
        expiresIn: string;
    };
    refreshToken: {
        secret: string;
        expiresIn: string;
        cookieName: string;
        httpOnly: boolean;
        secure: boolean;
        sameSite: "strict";
        maxAge: number;
    };
    password: {
        saltRounds: number;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    accessToken: {
        secret: string;
        expiresIn: string;
    };
    refreshToken: {
        secret: string;
        expiresIn: string;
        cookieName: string;
        httpOnly: boolean;
        secure: boolean;
        sameSite: "strict";
        maxAge: number;
    };
    password: {
        saltRounds: number;
    };
}>;
export default _default;
