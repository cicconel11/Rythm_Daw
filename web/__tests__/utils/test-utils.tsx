import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { NextRouter } from 'next/router';

type TestProvidersProps = {
  children: React.ReactNode;
  session?: any;
  router?: Partial<NextRouter>;
};

export const TestProviders: React.FC<TestProvidersProps> = ({
  children,
  session = {
    data: null,
    status: 'unauthenticated',
  },
  router = {},
}) => {
  // Mock Next.js router
  jest.mock('next/router', () => ({
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      ...router,
    }),
  }));

  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
};

type CustomRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  session?: any;
  router?: Partial<NextRouter>;
};

export const renderWithProviders = (
  ui: React.ReactElement,
  { session, router, ...renderOptions }: CustomRenderOptions = {}
) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <TestProviders session={session} router={router}>
      {children}
    </TestProviders>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

// Mock sessionStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Mock window object for tests
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
});

// Mock the next-auth client
jest.mock('next-auth/react', () => {
  const originalModule = jest.requireActual('next-auth/react');
  return {
    ...originalModule,
    signIn: jest.fn(() => Promise.resolve({ error: null, status: 200, ok: true })),
    signOut: jest.fn(() => Promise.resolve()),
    getSession: jest.fn(() => Promise.resolve(null)),
    getProviders: jest.fn(() => Promise.resolve({})),
    getCsrfToken: jest.fn(() => Promise.resolve('mock-csrf-token')),
  };
});

// Mock the fetch API
const mockFetch = jest.fn();
global.fetch = mockFetch as jest.MockedFunction<typeof fetch>;

// Helper to mock successful API responses
export const mockApiResponse = (
  url: string | RegExp,
  response: any,
  status = 200
) => {
  mockFetch.mockImplementation((input: RequestInfo | URL) => {
    const requestUrl = typeof input === 'string' ? input : input.url;
    
    if (
      (typeof url === 'string' && requestUrl.includes(url)) ||
      (url instanceof RegExp && url.test(requestUrl))
    ) {
      return Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.resolve(response),
      } as Response);
    }
    
    return Promise.reject(new Error(`No mock for URL: ${requestUrl}`));
  });
};
