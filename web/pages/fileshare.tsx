'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function FileSharePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the files page which now has the FileShare functionality
    router.replace('/files');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to File Share...</p>
      </div>
    </div>
  );
}
