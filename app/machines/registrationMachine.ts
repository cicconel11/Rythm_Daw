import { createMachine, assign } from 'xstate';
import { z } from 'zod';
import { emailSchema, codeSchema, displayNameSchema, passwordSchema, avatarUrlSchema } from '../lib/validation';

// Types
type Email = z.infer<typeof emailSchema>;
type Code = z.infer<typeof codeSchema>;
type DisplayName = z.infer<typeof displayNameSchema>;
type Password = z.infer<typeof passwordSchema>;
type AvatarUrl = z.infer<typeof avatarUrlSchema>;

export interface RegistrationContext {
  email: Email | null;
  requestId: string | null;
  code: Code | null;
  token: string | null;
  displayName: DisplayName | null;
  password: Password | null;
  avatarUrl: AvatarUrl;
  error: string | null;
}

type RegistrationEvent =
  | { type: 'START' }
  | { type: 'SUBMIT_EMAIL'; email: Email }
  | { type: 'SUBMIT_CODE'; code: Code }
  | { type: 'SUBMIT_PROFILE'; displayName: DisplayName; password: Password; avatarUrl: AvatarUrl }
  | { type: 'RESET' }
  | { type: 'ERROR'; error: string };

// Helper function to validate email
const isValidEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success;
};

// Helper function to validate code
const isValidCode = (code: string): boolean => {
  return codeSchema.safeParse(code).success;
};

// Helper function to validate profile data
const isValidProfileData = (data: {
  displayName: string;
  password: string;
}): boolean => {
  return (
    displayNameSchema.safeParse(data.displayName).success &&
    passwordSchema.safeParse(data.password).success
  );
};

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
    } as RegistrationContext,
    states: {
      idle: {
        on: {
          START: 'emailEntry',
        },
      },
      emailEntry: {
        on: {
          SUBMIT_EMAIL: [
            {
              target: 'codeEntry',
              actions: ['storeEmail', 'clearError'],
              guard: 'validEmail',
            },
            {
              target: 'error',
              actions: ['setError'],
            },
          ],
        },
      },
      codeEntry: {
        on: {
          SUBMIT_CODE: [
            {
              target: 'profileEntry',
              actions: ['storeCode', 'clearError'],
              guard: 'validCode',
            },
            {
              target: 'error',
              actions: ['setError'],
            },
          ],
        },
      },
      profileEntry: {
        on: {
          SUBMIT_PROFILE: [
            {
              target: 'submitting',
              actions: ['storeProfileData', 'clearError'],
              guard: 'validProfileData',
            },
            {
              target: 'error',
              actions: ['setError'],
            },
          ],
        },
      },
      submitting: {
        invoke: {
          src: 'completeRegistration',
          onDone: {
            target: 'success',
            actions: ['onRegistrationComplete'],
          },
          onError: {
            target: 'error',
            actions: ['setError'],
          },
        },
      },
      success: {
        type: 'final',
        entry: ['redirectToSuccess'],
      },
      error: {
        on: {
          RESET: 'emailEntry',
        },
      },
    },
  },
  {
    actions: {
      storeEmail: assign({
        email: (_, event) => (event.type === 'SUBMIT_EMAIL' ? event.email : null),
      }),
      storeCode: assign({
        code: (_, event) => (event.type === 'SUBMIT_CODE' ? event.code : null),
      }),
      storeProfileData: assign({
        displayName: (_, event) =>
          event.type === 'SUBMIT_PROFILE' ? event.displayName : null,
        password: (_, event) =>
          event.type === 'SUBMIT_PROFILE' ? event.password : null,
        avatarUrl: (_, event) =>
          event.type === 'SUBMIT_PROFILE' ? event.avatarUrl : null,
      }),
      setError: assign({
        error: (_, event) =>
          event.type === 'ERROR' ? event.error : 'An unknown error occurred',
      }),
      clearError: assign({
        error: (_) => null,
      }),
      redirectToSuccess: () => {
        // This will be handled by the component
      },
      onRegistrationComplete: (context) => {
        // Clear sensitive data
        context.password = null;
        context.token = null;
      },
    },
    guards: {
      validEmail: (_, event) => {
        if (event.type !== 'SUBMIT_EMAIL') return false;
        return isValidEmail(event.email);
      },
      validCode: (_, event) => {
        if (event.type !== 'SUBMIT_CODE') return false;
        return isValidCode(event.code);
      },
      validProfileData: (_, event) => {
        if (event.type !== 'SUBMIT_PROFILE') return false;
        return isValidProfileData({
          displayName: event.displayName,
          password: event.password,
        });
      },
    },
  }
);

export type RegistrationMachine = typeof registrationMachine;
