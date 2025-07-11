export interface UserResponse {
    id: string;
    email: string;
    name: string | null;
    isApproved: boolean;
}
export interface AuthResponse {
    user: UserResponse;
    token: string;
}
