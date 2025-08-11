'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterBioFull() {
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    avatarUrl: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationData, setRegistrationData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if we have registration data from step 1
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      const stored = sessionStorage.getItem('registration_ctx_v1');
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setRegistrationData(data);
          setFormData(prev => ({
            ...prev,
            displayName: data.email?.split('@')[0] || '',
          }));
        } catch (err) {
          console.error('Failed to parse registration data:', err);
          router.replace('/register/credentials');
        }
      } else {
        router.replace('/register/credentials');
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!registrationData) {
      setError('No registration data found. Please start over.');
      setIsLoading(false);
      return;
    }

    // Validate bio length
    if (formData.bio.length > 140) {
      setError('Bio must be 140 characters or less');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/register/bio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${registrationData.token}`,
        },
        body: JSON.stringify({
          requestId: registrationData.requestId,
          displayName: formData.displayName,
          bio: formData.bio,
          avatarUrl: formData.avatarUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Profile completion failed');
      }

      // Clear session storage
      if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem('registration_ctx_v1');
      }

      // Navigate to success page
      router.push('/registration-success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Profile completion failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking registration data
  if (!registrationData) {
    return (
      <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="rounded-lg bg-white px-4 py-8 shadow sm:px-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Validating registration data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-lg bg-white px-4 py-8 shadow sm:px-10">
          <div className="mb-8">
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
              Complete your profile
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Step 2 of 2: Tell us about yourself
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                Display Name
              </label>
              <div className="mt-1">
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  required
                  placeholder="Enter your display name"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio <span className="text-gray-500">(140 characters max)</span>
              </label>
              <div className="mt-1">
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  required
                  maxLength={140}
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
                <div className="mt-1 text-xs text-gray-500 text-right">
                  <span>{formData.bio.length}</span>/140 characters
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700">
                Avatar URL (optional)
              </label>
              <div className="mt-1">
                <input
                  id="avatarUrl"
                  name="avatarUrl"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Completing registration...' : 'Complete registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
