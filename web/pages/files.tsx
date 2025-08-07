'use client';

import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function FilesPage() {
  const { toast } = useToast();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Success',
        description: `${file.name} uploaded successfully`,
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Toaster />
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Files</h1>
        <p className="text-gray-600">Manage and organize your files</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-12">
          <label className="cursor-pointer">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
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
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Upload files</h3>
            <p className="mt-1 text-sm text-gray-500">
              Drag and drop files here, or click to browse
            </p>
            <input type="file" className="sr-only" onChange={handleUpload} />
          </label>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Files</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {[1, 2, 3].map(i => (
              <li key={i} className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">Document {i}.pdf</p>
                      <p className="text-sm text-gray-500">2.{i} MB</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      Uploaded {i} day{i !== 1 ? 's' : ''} ago
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
