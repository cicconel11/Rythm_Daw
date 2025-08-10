'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRegistration } from '@/app/components/RegistrationProvider';
import { emailSchema } from '@/app/lib/validation';
import Link from 'next/link';

export default function EmailRegistrationPage() {
  const router = useRouter();
  const { state, send } = useRegistration();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate email
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Call the API to initiate registration
      const response = await fetch('/api/auth/register/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include', // Important for cookies
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (data.code === 'DUPLICATE_EMAIL') {
          setError('An account with this email already exists. Please log in instead.');
        } else {
          setError(data.message || 'An error occurred. Please try again.');
        }
        return;
      }

      // Update state and navigate to verification
      send({ type: 'SUBMIT_EMAIL', email });
      router.push('/register/verify');
    } catch (err) {
      console.error('Registration error:', err);
      setError('Failed to process your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If we already have an email in state, use it
  useEffect(() => {
    if (state.context.email) {
      setEmail(state.context.email);
    }
  }, [state.context.email]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending code...' : 'Continue'}
            </button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                By continuing, you agree to our
              </span>
            </div>
          </div>
          <div className="mt-2 text-center text-sm text-gray-600">
            <Link href="/terms" className="font-medium text-indigo-600 hover:text-indigo-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="font-medium text-indigo-600 hover:text-indigo-500">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
