export declare class User {
    id: string;
    email: string;
    password: string;
    name: string;
    isApproved: boolean;
    hashPassword(): Promise<void>;
    validatePassword(password: string): Promise<boolean>;
}
