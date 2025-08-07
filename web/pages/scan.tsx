'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const handleStartScan = () => {
    setIsScanning(true);
    // Simulate scanning
    setTimeout(() => {
      setIsScanning(false);
      toast({
        title: 'Scan complete',
        description: 'Your system has been scanned successfully',
      });
    }, 3000);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">System Scan</h1>
        <p className="text-gray-600">Scan your system for connected devices</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-12">
          <div
            className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full ${
              isScanning ? 'bg-blue-100 animate-pulse' : 'bg-blue-50'
            }`}
          >
            <svg
              className={`h-12 w-12 ${isScanning ? 'text-blue-600 animate-spin' : 'text-blue-400'}`}
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>

          <h3 className="mt-6 text-lg font-medium text-gray-900">
            {isScanning ? 'Scanning your system...' : 'Ready to scan'}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {isScanning
              ? 'Please wait while we scan for connected devices.'
              : 'Click the button below to start scanning for connected devices.'}
          </p>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleStartScan}
              disabled={isScanning}
              className={`inline-flex items-center rounded-md border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm ${
                isScanning
                  ? 'cursor-not-allowed bg-blue-400'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
            >
              {isScanning ? 'Scanning...' : 'Start Scan'}
            </button>
          </div>
        </div>

        {!isScanning && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900">Scan Results</h3>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                No recent scan results. Run a scan to see connected devices.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
