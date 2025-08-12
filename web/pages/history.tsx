'use client';

import { usePageMeta } from '@/hooks/usePageMeta';
import { Layout } from '@/components/Layout';

export default function HistoryPage() {
  // Use dynamic page meta
  usePageMeta('history');

  const historyContent = () => (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">History</h1>
        <p className="text-gray-600">View your activity and project history</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No history yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Your activity history will appear here once you start using the platform
          </p>
        </div>
      </div>
    </div>
  );

  return <Layout>{historyContent()}</Layout>;
}
