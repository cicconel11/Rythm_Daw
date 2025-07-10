import { User } from '../../types';

export const useAuth = jest.fn(() => ({
  user: {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    image: null,
    role: 'USER',
  } as User,
  login: jest.fn().mockResolvedValue({ success: true }),
  register: jest.fn().mockResolvedValue({ success: true }),
  logout: jest.fn().mockResolvedValue(undefined),
  refreshToken: jest.fn().mockResolvedValue({ accessToken: 'new-access-token' }),
  isAuthenticated: true,
  isLoading: false,
  error: null,
  setError: jest.fn(),
  clearError: jest.fn(),
}));

// Export mock functions for easier testing
export const mockLogin = useAuth().login as jest.Mock;
export const mockLogout = useAuth().logout as jest.Mock;
export const mockRegister = useAuth().register as jest.Mock;
export const mockRefreshToken = useAuth().refreshToken as jest.Mock;
