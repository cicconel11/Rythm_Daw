'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Simulate sending message
    console.log('Message sent:', message);
    setMessage('');

    toast({
      title: 'Message sent',
      description: 'Your message has been sent successfully',
    });
  };

  return (
    <div className="container mx-auto p-6 h-screen flex flex-col">
      <Toaster />
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Chat</h1>
        <p className="text-gray-600">Connect with your friends and team</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 flex-1 flex flex-col">
        {/* Chat header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600 font-medium">JD</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">John Doe</h3>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {/* Received message */}
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                <span className="text-xs text-gray-600">JD</span>
              </div>
              <div className="ml-3">
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="text-sm text-gray-800">Hey there! How can I help you today?</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">10:30 AM</p>
              </div>
            </div>

            {/* Sent message */}
            <div className="flex items-start justify-end">
              <div className="text-right">
                <div className="bg-blue-600 text-white rounded-lg p-3 inline-block">
                  <p className="text-sm">I need help with my account settings.</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">10:32 AM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message input */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
