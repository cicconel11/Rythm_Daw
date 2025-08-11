'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DevicePage() {
  const [connectionCode, setConnectionCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    generateConnectionCode();
  }, []);

  const generateConnectionCode = () => {
    setIsGenerating(true);
    // Generate a 6-digit connection code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setConnectionCode(code);
    setIsGenerating(false);
  };

  const handleContinue = () => {
    router.push('/scan');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Connect Your Device
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Use this code to link your RHYTHM plugin
            </p>
          </div>

          <div className="mt-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-center">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Connection Code
                </label>
                <div className="text-4xl font-mono font-bold text-blue-600 tracking-wider">
                  {isGenerating ? (
                    <div className="animate-pulse">------</div>
                  ) : (
                    connectionCode
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Enter this code in your RHYTHM plugin to connect
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <button
                onClick={generateConnectionCode}
                disabled={isGenerating}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate New Code'}
              </button>
              
              <button
                onClick={handleContinue}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Continue to Plugin Download
              </button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-blue-600 hover:text-blue-500 text-sm"
              >
                Skip to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
