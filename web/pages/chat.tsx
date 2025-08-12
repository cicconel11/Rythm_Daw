'use client';

import { usePageMeta } from '@/hooks/usePageMeta';
import { Layout } from '@/components/Layout';

export default function ChatPage() {
  // Use dynamic page meta
  usePageMeta('chat');

  const chatContent = () => (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Chat</h1>
        <p className="text-gray-600">Connect with your team and collaborators</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-12">
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Chat coming soon</h3>
          <p className="mt-1 text-sm text-gray-500">
            Real-time messaging and collaboration features will be available soon
          </p>
        </div>
      </div>
    </div>
  );

  return <Layout>{chatContent()}</Layout>;
}
