'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Simple loading component for SSR
function SignupNewLoading() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-lg bg-white px-4 py-8 shadow sm:px-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading signup form...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dynamically import the full component with SSR disabled
const SignupNewFull = dynamic(
  () => import('@/components/SignupNewFull'),
  {
    ssr: false,
    loading: SignupNewLoading,
  }
);

export default function SignupNewPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <SignupNewLoading />;
  }

  return <SignupNewFull />;
}
