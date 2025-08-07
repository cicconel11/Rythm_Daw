'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    notifications: true,
    darkMode: false,
  });

  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Success',
      description: 'Your settings have been saved.',
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600">Manage your account preferences</p>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-lg font-medium text-gray-900">Profile</h2>
          <p className="mt-1 text-sm text-gray-500">Update your account information.</p>
        </div>

        <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
          <div className="space-y-6 px-6 py-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-base font-medium text-gray-900">Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="notifications"
                    name="notifications"
                    type="checkbox"
                    checked={formData.notifications}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="notifications"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    Email notifications
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="darkMode"
                    name="darkMode"
                    type="checkbox"
                    checked={formData.darkMode}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="darkMode"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    Dark mode
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 text-right">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
