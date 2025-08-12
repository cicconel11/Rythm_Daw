'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

export default function RegistrationSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to device connection after 3 seconds
    const timer = setTimeout(() => {
      router.push('/device');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <Head>
        <title>Registration Successful - Rythm Daw</title>
      </Head>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                Registration Successful!
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Your account has been created successfully. Redirecting you to connect your device...
              </p>
              
              <div className="mt-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Setting up your account...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
