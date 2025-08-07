import { createMachine, assign, fromPromise } from 'xstate';

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

// Helper function to validate credentials
const validateCredentials = async ({
  email,
  password,
  recaptchaToken,
}: {
  email: string;
  password: string;
  recaptchaToken: string;
}) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      captchaToken: recaptchaToken,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Validation failed');
  }

  return response.json();
};

// Helper function to submit registration
const submitRegistration = async ({
  email,
  password,
  displayName,
  avatar,
  recaptchaToken,
}: {
  email: string;
  password: string;
  displayName: string;
  avatar?: string;
  recaptchaToken: string;
}) => {
  const response = await fetch('/api/auth/register', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      displayName,
      avatar,
      recaptchaToken,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  return response.json();
};

// Machine definition
export const registrationMachine = createMachine({
  id: 'registration',
  initial: 'start',
  context: {
    email: '',
    password: '',
    displayName: '',
    avatar: undefined,
    error: undefined,
    recaptchaToken: undefined,
  },
  states: {
    start: {
      always: 'credentials',
    },
    credentials: {
      on: {
        SUBMIT_CREDENTIALS: {
          target: 'validating',
          actions: assign({
            email: (_, event) => event.email,
            password: (_, event) => event.password,
            recaptchaToken: (_, event) => event.recaptchaToken,
            error: () => undefined,
          }),
        },
      },
    },
    validating: {
      invoke: {
        src: fromPromise(({ input }: { input: { email: string; password: string; recaptchaToken: string } }) =>
          validateCredentials(input)
        ),
        input: ({ context }) => ({
          email: context.email,
          password: context.password,
          recaptchaToken: context.recaptchaToken || '',
        }),
        onDone: 'profile',
        onError: {
          target: 'credentials',
          actions: assign({
            error: (_, event) => event.error.message || 'Validation failed',
          }),
        },
      },
    },
    profile: {
      on: {
        BACK: 'credentials',
        SUBMIT_PROFILE: {
          target: 'submitting',
          actions: assign({
            displayName: (_, event) => event.displayName,
            avatar: (_, event) => event.avatar,
            error: () => undefined,
          }),
        },
      },
    },
    submitting: {
      invoke: {
        src: fromPromise(({ input }: { 
          input: { 
            email: string; 
            password: string; 
            displayName: string; 
            avatar?: string; 
            recaptchaToken: string 
          } 
        }) => submitRegistration(input)),
        input: ({ context }) => ({
          email: context.email,
          password: context.password,
          displayName: context.displayName,
          avatar: context.avatar,
          recaptchaToken: context.recaptchaToken || '',
        }),
        onDone: 'done',
        onError: {
          target: 'profile',
          actions: assign({
            error: (_, event) => event.error.message || 'Registration failed',
          }),
        },
      },
    },
    done: {
      type: 'final',
    },
    error: {
      on: {
        RETRY: {
          target: 'credentials',
          actions: assign({
            error: () => undefined,
          }),
        },
      },
    },
  },
  on: {
    RETRY: {
      target: '.credentials',
    },
  },
});
