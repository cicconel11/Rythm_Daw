'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRegistration } from '@/app/components/RegistrationProvider';
import Link from 'next/link';

export default function RegistrationSuccessPage() {
  const router = useRouter();
  const { state, send } = useRegistration();

  // Redirect to login after 5 seconds
  useEffect(() => {
    // Clear any existing registration state
    send({ type: 'RESET' });
    
    // Set up the redirect timer
    const timer = setTimeout(() => {
      router.push('/login?registered=true');
    }, 5000);

    // Clean up the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [router, send]);

  // If we don't have a display name, redirect to the start
  if (!state.context.displayName) {
    router.push('/register/email');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Welcome, {state.context.displayName}!
        </h2>
        
        <p className="mt-2 text-lg text-gray-600">
          Your account has been successfully created.
        </p>
        
        <div className="mt-8">
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  You'll be redirected to the login page in a few seconds...
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <p className="text-sm text-gray-600">
            Not being redirected?{' '}
            <Link href="/login?registered=true" className="font-medium text-indigo-600 hover:text-indigo-500">
              Click here to log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
