export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: 'USER' | 'ADMIN';
  emailVerified?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthResponse {
  user: User | null;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface AuthError {
  message: string;
  code?: string;
}
