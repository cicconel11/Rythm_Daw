'use client';

import { useMachine } from '@xstate/react';
import { registrationMachine } from '../machines/registrationMachine';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

// Simple form components to replace the UI kit components
const CredentialsForm = ({
  error,
  onSubmit,
}: {
  error?: string;
  onSubmit: (data: { email: string; password: string }) => void;
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Continue
        </button>
      </div>
    </form>
  );
};

const ProfileForm = ({
  error,
  onBack,
  onSubmit,
}: {
  error?: string;
  onBack: () => void;
  onSubmit: (data: { displayName: string; avatar?: string }) => void;
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      displayName: formData.get('displayName') as string,
      avatar: formData.get('avatar') as string | undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
          Display Name
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
          Avatar URL (optional)
        </label>
        <input
          id="avatar"
          name="avatar"
          type="url"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back
        </button>
        <button
          type="submit"
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Complete Registration
        </button>
      </div>
    </form>
  );
};

// Registration machine hook
function useRegistration() {
  const router = useRouter();
  const [state, send] = useMachine(registrationMachine, {
    // Any machine options can go here
  });

  // Handle successful registration
  useEffect(() => {
    if (state.matches('complete')) {
      const { email, password } = state.context;
      // Sign in with credentials
      signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/dashboard'
      }).then((result) => {
        if (result?.error) {
          console.error('Sign in after registration failed:', result.error);
          router.push('/auth/signin');
        } else if (result?.url) {
          router.push(result.url);
        }
      });
    }
  }, [state, router]);

  return { state, send };
}

export default function SignupFull() {
  const { data: session, status } = useSession();
  const { state, send } = useRegistration();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {state.matches('profile') ? 'Complete Your Profile' : 'Create Your Account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {state.matches('credentials') && (
            <CredentialsForm
              error={state.context.error}
              onSubmit={(data) => {
                send({ 
                  type: 'SUBMIT_CREDENTIALS',
                  email: data.email,
                  password: data.password,
                  recaptchaToken: 'dummy-recaptcha-token' // In a real app, implement reCAPTCHA
                });
              }}
            />
          )}

          {state.matches('profile') && (
            <ProfileForm
              error={state.context.error}
              onBack={() => send({ type: 'BACK' })}
              onSubmit={(data) => {
                send({
                  type: 'SUBMIT_PROFILE',
                  displayName: data.displayName,
                  avatar: data.avatar
                });
              }}
            />
          )}

          {(state.matches('validating') || state.matches('submitting')) && (
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}

          {state.matches('complete') && (
            <div className="text-center">
              <p className="text-green-600">Registration complete! Redirecting...</p>
            </div>
          )}

          {state.context.error && (
            <div className="text-red-500 text-center">
              {state.context.error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
