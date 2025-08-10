'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRegistration } from '@/app/components/RegistrationProvider';
import { codeSchema } from '@/app/lib/validation';
import Link from 'next/link';

export default function VerifyRegistrationPage() {
  const router = useRouter();
  const { state, send } = useRegistration();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendAvailable, setResendAvailable] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Check if we have an email in the state
  useEffect(() => {
    if (!state.context.email) {
      router.push('/register/email');
    }
  }, [state.context.email, router]);

  // Handle countdown for resend availability
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendAvailable(true);
    }
  }, [countdown]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate code
    const result = codeSchema.safeParse(code);
    if (!result.success) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Call the verify API
      const response = await fetch('/api/auth/register/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: state.context.email,
          requestId: state.context.requestId,
          code: code,
        }),
        credentials: 'include',
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (data.code === 'INVALID_CODE') {
          setError('Invalid or expired code. Please try again.');
        } else if (data.code === 'RATE_LIMITED') {
          setError('Too many attempts. Please try again later.');
        } else {
          setError(data.message || 'An error occurred. Please try again.');
        }
        return;
      }

      // Update state and navigate to profile setup
      send({ type: 'SUBMIT_CODE', code });
      router.push('/register/profile');
    } catch (err) {
      console.error('Verification error:', err);
      setError('Failed to verify your code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    if (!resendAvailable) return;
    
    setError('');
    setResendAvailable(false);
    setCountdown(30);
    
    try {
      const response = await fetch('/api/auth/register/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: state.context.email }),
        credentials: 'include',
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Failed to resend code. Please try again.');
        setResendAvailable(true);
      } else {
        // Update request ID in state
        send({ type: 'SUBMIT_EMAIL', email: state.context.email || '' });
      }
    } catch (err) {
      console.error('Resend error:', err);
      setError('Failed to resend code. Please try again.');
      setResendAvailable(true);
    }
  };

  // Auto-submit when code is 6 digits
  useEffect(() => {
    if (code.length === 6) {
      const form = document.querySelector('form');
      if (form) form.requestSubmit();
    }
  }, [code]);

  if (!state.context.email) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a 6-digit code to {state.context.email}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="verification-code" className="sr-only">
                Verification code
              </label>
              <input
                id="verification-code"
                name="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                autoComplete="one-time-code"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center text-2xl tracking-widest"
                placeholder="000000"
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setCode(value);
                }}
                disabled={isSubmitting}
                autoFocus
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
              disabled={isSubmitting || code.length !== 6}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Verifying...' : 'Continue'}
            </button>
          </div>

          <div className="text-center text-sm">
            <p className="text-gray-600">
              Didn't receive a code?{' '}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={!resendAvailable}
                className={`font-medium ${
                  resendAvailable
                    ? 'text-indigo-600 hover:text-indigo-500'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                {resendAvailable ? 'Resend code' : `Resend in ${countdown}s`}
              </button>
            </p>
          </div>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Wrong email?{' '}
            <Link
              href="/register/email"
              className="font-medium text-indigo-600 hover:text-indigo-500"
              onClick={() => send({ type: 'RESET' })}
            >
              Go back
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
