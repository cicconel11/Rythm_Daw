export declare class User {
    id: string;
    email: string;
    name?: string;
    isApproved: boolean;
    constructor(partial: Partial<User>);
}
