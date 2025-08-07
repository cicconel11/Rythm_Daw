import { createMachine, assign, setup, fromPromise } from 'xstate';
import { signIn } from 'next-auth/react';

// Types
interface RegistrationContext {
  email: string;
  password: string;
  displayName: string;
  avatar?: string;
  error?: string;
  recaptchaToken?: string;
}

type RegistrationEvent =
  | { type: 'SUBMIT_CREDENTIALS'; email: string; password: string; recaptchaToken: string }
  | { type: 'SUBMIT_PROFILE'; displayName: string; avatar?: string }
  | { type: 'RETRY' }
  | { type: 'BACK' };

type RegistrationError = {
  message: string;
};

// Create the machine with proper typing
export const registrationMachine = setup({
  types: {
    context: {} as RegistrationContext,
    events: {} as RegistrationEvent,
  },
  guards: {
    hasRecaptchaToken: ({ context }) => !!context.recaptchaToken,
  },
  actions: {
    clearError: assign({
      error: undefined,
    }),
    setError: assign({
      error: (_, params: { error: string }) => params.error,
    }),
    setCredentials: assign({
      email: ({ event }) => event.type === 'SUBMIT_CREDENTIALS' ? event.email : '',
      password: ({ event }) => event.type === 'SUBMIT_CREDENTIALS' ? event.password : '',
    }),
    setProfile: assign({
      displayName: ({ event }) => event.type === 'SUBMIT_PROFILE' ? event.displayName : '',
      avatar: ({ event }) => event.type === 'SUBMIT_PROFILE' ? event.avatar : undefined,
    }),
    setRecaptchaToken: assign({
      recaptchaToken: ({ event }) => event.type === 'SUBMIT_CREDENTIALS' ? event.recaptchaToken : undefined,
    }),
  },
  actors: {
    validateCredentials: fromPromise(async ({ input }: { 
      input: { email: string; password: string; recaptchaToken: string } 
    }) => {
      const response = await fetch('/api/auth/validate-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: input.email,
          password: input.password,
          recaptchaToken: input.recaptchaToken,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to validate credentials');
      }

      return { success: true };
    }),
    submitProfile: fromPromise(async ({ input }: { 
      input: { email: string; password: string; displayName: string; avatar?: string } 
    }) => {
      // First, create the user
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: input.email,
          password: input.password,
          displayName: input.displayName,
          avatar: input.avatar,
        }),
      });

      if (!registerResponse.ok) {
        const error = await registerResponse.json();
        throw new Error(error.message || 'Failed to register');
      }

      // Then sign in
      const signInResult = await signIn('credentials', {
        redirect: false,
        email: input.email,
        password: input.password,
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error);
      }

      return { success: true };
    }),
  },
}).createMachine({
  id: 'registration',
  initial: 'credentials',
  context: {
    email: '',
    password: '',
    displayName: '',
    avatar: undefined,
    error: undefined,
    recaptchaToken: undefined,
  },
  states: {
    credentials: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            SUBMIT_CREDENTIALS: [
              {
                guard: 'hasRecaptchaToken',
                target: 'validating',
                actions: ['setCredentials', 'setRecaptchaToken', 'clearError'],
              },
              {
                actions: [{
                  type: 'setError',
                  params: { error: 'reCAPTCHA verification is required' },
                }],
              },
            ],
          },
        },
        validating: {
          invoke: {
            src: 'validateCredentials',
            input: ({ context }) => ({
              email: context.email,
              password: context.password,
              recaptchaToken: context.recaptchaToken!,
            }),
            onDone: {
              target: '#registration.profile',
              actions: ['clearError'],
            },
            onError: {
              target: 'idle',
              actions: [{
                type: 'setError',
                params: { error: 'Validation failed' },
              }],
            },
          },
        },
      },
    },
    profile: {
      id: 'profile',
      initial: 'idle',
      states: {
        idle: {
          on: {
            SUBMIT_PROFILE: {
              target: 'submitting',
              actions: ['setProfile', 'clearError'],
            },
            BACK: {
              target: '#registration.credentials',
              actions: ['clearError'],
            },
          },
        },
        submitting: {
          invoke: {
            src: 'submitProfile',
            input: ({ context }) => ({
              email: context.email,
              password: context.password,
              displayName: context.displayName,
              avatar: context.avatar,
            }),
            onDone: {
              target: '#registration.complete',
            },
            onError: {
              target: 'idle',
              actions: [{
                type: 'setError',
                params: { error: 'Registration failed' },
              }],
            },
          },
        },
      },
    },
    complete: {
      id: 'complete',
      type: 'final' as const,
    },
  },
});
