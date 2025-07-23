export declare class AuthCredentialsDto {
    email: string;
    password: string;
    name?: string;
}
export declare class AuthResponseDto {
    accessToken: string;
    user: {
        id: string;
        email: string;
        name?: string;
    };
}
