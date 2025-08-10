'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRegistration } from '@/app/components/RegistrationProvider';
import { displayNameSchema, passwordSchema } from '@/app/lib/validation';
import Link from 'next/link';

export default function ProfileSetupPage() {
  const router = useRouter();
  const { state, send } = useRegistration();
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [errors, setErrors] = useState<{
    displayName?: string;
    password?: string;
    confirmPassword?: string;
    form?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
  });

  // Check if we have the required state
  useEffect(() => {
    if (!state.context.email || !state.context.token) {
      router.push('/register/email');
    }
  }, [state.context.email, state.context.token, router]);

  // Validate password strength
  useEffect(() => {
    if (password) {
      try {
        passwordSchema.parse(password);
        setErrors(prev => ({ ...prev, password: undefined }));
      } catch (err: any) {
        if (err.issues && err.issues[0]) {
          setPasswordStrength({
            score: 0,
            feedback: err.issues[0].message,
          });
        }
      }
    } else {
      setPasswordStrength({ score: 0, feedback: '' });
    }
  }, [password]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate display name
    try {
      displayNameSchema.parse(displayName);
    } catch (err: any) {
      setErrors(prev => ({
        ...prev,
        displayName: err.issues[0]?.message || 'Invalid display name',
      }));
      return;
    }

    // Validate password
    try {
      passwordSchema.parse(password);
    } catch (err: any) {
      setErrors(prev => ({
        ...prev,
        password: err.issues[0]?.message || 'Password is too weak',
      }));
      return;
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: 'Passwords do not match',
      }));
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Call the complete registration API
      const response = await fetch('/api/auth/register/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: state.context.token,
          displayName,
          password,
          avatarUrl: avatarUrl || null,
        }),
        credentials: 'include',
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (data.code === 'INVALID_TOKEN') {
          setErrors({
            form: 'Your session has expired. Please start over.',
          });
          send({ type: 'RESET' });
          router.push('/register/email');
          return;
        } else if (data.code === 'WEAK_PASSWORD') {
          setErrors({
            password: 'Please choose a stronger password.',
          });
          return;
        } else {
          throw new Error(data.message || 'An error occurred');
        }
      }

      // Registration successful, update state and redirect
      send({ 
        type: 'SUBMIT_PROFILE', 
        displayName, 
        password, 
        avatarUrl: avatarUrl || null 
      });
      
      // The success page will handle the redirect to login
      router.push('/register/success');
    } catch (err) {
      console.error('Registration error:', err);
      setErrors({
        form: 'Failed to complete registration. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate password strength meter width and color
  const getPasswordStrengthMeter = () => {
    const width = ((passwordStrength.score + 1) / 5) * 100;
    let color = 'bg-red-500';
    
    if (passwordStrength.score >= 3) {
      color = 'bg-green-500';
    } else if (passwordStrength.score >= 1) {
      color = 'bg-yellow-500';
    }
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
        <div 
          className={`h-2.5 rounded-full ${color}`} 
          style={{ width: `${width}%` }}
        />
      </div>
    );
  };

  if (!state.context.email || !state.context.token) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complete your profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Just a few more details to get started
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Display Name */}
            <div className="mb-4">
              <label htmlFor="display-name" className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              <input
                id="display-name"
                name="displayName"
                type="text"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  errors.displayName ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="John Doe"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={isSubmitting}
              />
              {errors.displayName && (
                <p className="mt-1 text-sm text-red-600">{errors.displayName}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
              {getPasswordStrengthMeter()}
              {passwordStrength.feedback && (
                <p className="mt-1 text-sm text-yellow-600">{passwordStrength.feedback}</p>
              )}
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters with a mix of letters, numbers, and symbols.
              </p>
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Avatar URL (Optional) */}
            <div className="mb-4">
              <label htmlFor="avatar-url" className="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture URL (optional)
              </label>
              <input
                id="avatar-url"
                name="avatarUrl"
                type="url"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="https://example.com/avatar.jpg"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                disabled={isSubmitting}
              />
              <p className="mt-1 text-xs text-gray-500">
                You can add a profile picture later in your account settings.
              </p>
            </div>
          </div>

          {errors.form && (
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
                  <p className="text-sm font-medium text-red-800">{errors.form}</p>
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
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
