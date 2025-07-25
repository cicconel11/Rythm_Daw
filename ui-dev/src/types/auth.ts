export interface AuthUser {
  isAdmin?: boolean;
}

export interface Auth {
  id: string;
  email: string;
  isApproved: boolean;
  user?: AuthUser;
} 