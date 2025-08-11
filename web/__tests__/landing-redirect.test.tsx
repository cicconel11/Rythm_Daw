import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Landing from '../pages/landing';

// Mock next-auth/react
const mockUseSession = jest.fn();
jest.mock('next-auth/react', () => ({
  useSession: mockUseSession,
}));

// Mock next/router
const mockPush = jest.fn();
const mockUseRouter = jest.fn(() => ({
  push: mockPush,
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  reload: jest.fn(),
  pathname: '/landing',
  route: '/landing',
  query: {},
  asPath: '/landing',
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  defaultLocale: 'en',
  domainLocales: [],
  isPreview: false,
}));

jest.mock('next/router', () => ({
  useRouter: mockUseRouter,
}));

describe('Landing Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect authenticated users to dashboard', async () => {
    mockUseSession.mockReturnValue({
      data: { user: { email: 'test@example.com' } },
      status: 'authenticated',
    });

    render(<Landing />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should show loading state while checking auth status', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'loading',
    });

    render(<Landing />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show landing page for unauthenticated users', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<Landing />);

    expect(screen.getByText('Rythm: AI-Powered Music Collaboration')).toBeInTheDocument();
    expect(screen.getByTestId('btn-get-started')).toBeInTheDocument();
    expect(screen.getByTestId('btn-login')).toBeInTheDocument();
  });

  it('should navigate to register page when Get Started is clicked', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<Landing />);

    screen.getByTestId('btn-get-started').click();
    expect(mockPush).toHaveBeenCalledWith('/register/credentials');
  });

  it('should navigate to login page when Login is clicked', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<Landing />);

    screen.getByTestId('btn-login').click();
    expect(mockPush).toHaveBeenCalledWith('/auth/login');
  });
});
