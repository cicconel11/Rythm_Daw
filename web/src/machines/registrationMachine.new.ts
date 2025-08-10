import { createMachine, assign } from 'xstate';

// Types
interface RegistrationContext {
  email: string | null;
  requestId: string | null;
  code: string | null;
  token: string | null;
  displayName: string | null;
  password: string | null;
  avatarUrl: string | null;
  error: string | null;
}

type RegistrationEvent =
  | { type: 'START' }
  | { type: 'SUBMIT_EMAIL'; email: string }
  | { type: 'SUBMIT_CODE'; code: string }
  | { type: 'SUBMIT_PROFILE'; displayName: string; password: string; avatarUrl?: string }
  | { type: 'RESET' }
  | { type: 'ERROR'; error: string };

// API Response Types
interface InitRegistrationResponse {
  requestId: string;
}

interface VerifyCodeResponse {
  token: string;
}

interface CompleteRegistrationResponse {
  success: boolean;
  userId: string;
}

// API Calls
const initRegistration = async (email: string): Promise<InitRegistrationResponse> => {
  const response = await fetch('/api/auth/register/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to initiate registration');
  }
  return response.json();
};

const verifyCode = async (
  email: string,
  requestId: string,
  code: string
): Promise<VerifyCodeResponse> => {
  const response = await fetch('/api/auth/register/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, requestId, code }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Invalid verification code');
  }
  return response.json();
};

const completeRegistration = async (
  token: string,
  displayName: string,
  password: string,
  avatarUrl?: string
): Promise<CompleteRegistrationResponse> => {
  const response = await fetch('/api/auth/register/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, displayName, password, avatarUrl }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to complete registration');
  }
  return response.json();
};

// Helper function to save state to sessionStorage
const saveState = (state: Partial<RegistrationContext>) => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('registrationState', JSON.stringify(state));
};

// Helper function to load state from sessionStorage
const loadState = (): Partial<RegistrationContext> => {
  if (typeof window === 'undefined') return {};
  const saved = sessionStorage.getItem('registrationState');
  return saved ? JSON.parse(saved) : {};
};

// State Machine
export const registrationMachine = createMachine(
  {
    id: 'registration',
    initial: 'idle',
    context: {
      email: null,
      requestId: null,
      code: null,
      token: null,
      displayName: null,
      password: null,
      avatarUrl: null,
      error: null,
    },
    states: {
      idle: {
        on: { START: 'emailEntry' },
        entry: [
          assign((context) => ({
            ...context,
            ...loadState(),
            error: null,
          })),
        ],
      },
      emailEntry: {
        on: {
          SUBMIT_EMAIL: {
            target: 'verifyingEmail',
            actions: [
              assign({
                email: (_, event) => event.email,
                error: () => null,
              }),
            ],
          },
          ERROR: {
            target: 'emailEntry',
            actions: assign({
              error: (_, event) => event.error,
            }),
          },
        },
      },
      verifyingEmail: {
        invoke: {
          src: async (context) => {
            if (!context.email) throw new Error('Email is required');
            return initRegistration(context.email);
          },
          onDone: {
            target: 'codeEntry',
            actions: [
              assign({
                requestId: (_, event) => event.data.requestId,
              }),
              (context) => {
                saveState({
                  email: context.email,
                  requestId: context.requestId,
                  token: context.token,
                });
              },
            ],
          },
          onError: {
            target: 'emailEntry',
            actions: assign({
              error: (_, event) =>
                event.error instanceof Error
                  ? event.error.message
                  : 'Failed to send verification code',
            }),
          },
        },
      },
      codeEntry: {
        on: {
          SUBMIT_CODE: {
            target: 'verifyingCode',
            actions: [
              assign({
                code: (_, event) => event.code,
                error: () => null,
              }),
            ],
          },
          ERROR: {
            target: 'codeEntry',
            actions: assign({
              error: (_, event) => event.error,
            }),
          },
        },
      },
      verifyingCode: {
        invoke: {
          src: async (context) => {
            if (!context.email || !context.requestId || !context.code) {
              throw new Error('Missing required verification data');
            }
            return verifyCode(context.email, context.requestId, context.code);
          },
          onDone: {
            target: 'profileEntry',
            actions: [
              assign({
                token: (_, event) => event.data.token,
              }),
              (context) => {
                saveState({
                  email: context.email,
                  requestId: context.requestId,
                  token: context.token,
                });
              },
            ],
          },
          onError: {
            target: 'codeEntry',
            actions: assign({
              error: (_, event) =>
                event.error instanceof Error ? event.error.message : 'Verification failed',
            }),
          },
        },
      },
      profileEntry: {
        on: {
          SUBMIT_PROFILE: {
            target: 'completingRegistration',
            actions: [
              assign({
                displayName: (_, event) => event.displayName,
                password: (_, event) => event.password,
                avatarUrl: (_, event) => event.avatarUrl || null,
                error: () => null,
              }),
            ],
          },
          ERROR: {
            target: 'profileEntry',
            actions: assign({
              error: (_, event) => event.error,
            }),
          },
        },
      },
      completingRegistration: {
        invoke: {
          src: async (context) => {
            if (!context.token || !context.displayName || !context.password) {
              throw new Error('Missing required profile data');
            }
            return completeRegistration(
              context.token,
              context.displayName,
              context.password,
              context.avatarUrl || undefined
            );
          },
          onDone: {
            target: 'success',
            actions: [
              () => {
                if (typeof window !== 'undefined') {
                  sessionStorage.removeItem('registrationState');
                }
              },
            ],
          },
          onError: {
            target: 'profileEntry',
            actions: assign({
              error: (_, event) =>
                event.error instanceof Error ? event.error.message : 'Registration failed',
            }),
          },
        },
      },
      success: {
        entry: () => {
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login?registered=true';
          }
        },
        type: 'final' as const,
      },
      error: {
        on: {
          RESET: 'idle',
        },
      },
    },
  },
  {
    types: {
      context: {} as RegistrationContext,
      events: {} as RegistrationEvent,
    },
  }
);
