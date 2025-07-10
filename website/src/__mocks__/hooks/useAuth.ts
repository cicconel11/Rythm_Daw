export const useAuth = jest.fn(() => ({
  user: null,
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  isAuthenticated: false,
  isLoading: false,
  error: null,
}));
