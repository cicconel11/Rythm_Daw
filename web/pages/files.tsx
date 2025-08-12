'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { usePageMeta } from '@/hooks/usePageMeta';
import { getFiles, uploadFile, FileItem } from '@/lib/dataClient';
import { Layout } from '@/components/Layout';

export default function FilesPage() {
  const { toast } = useToast();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use dynamic page meta
  usePageMeta('files');

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const filesData = await getFiles();
      setFiles(filesData);
    } catch (error) {
      console.error('Failed to load files:', error);
      setError('Failed to load files');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const newFile = await uploadFile(file);
      setFiles(prev => [newFile, ...prev]);
      toast({
        title: 'Success',
        description: `${file.name} uploaded successfully`,
      });
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };

  const filesContent = () => {
    if (isLoading) {
      return (
        <div className="container mx-auto p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading files...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="container mx-auto p-6">
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadFiles}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

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
                {isUploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                ) : (
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
                )}
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {isUploading ? 'Uploading...' : 'Upload files'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {isUploading ? 'Please wait...' : 'Drag and drop files here, or click to browse'}
              </p>
              <input 
                type="file" 
                className="sr-only" 
                onChange={handleUpload}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Recent Files ({files.length})
          </h2>
          {files.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <p className="text-gray-500">No files uploaded yet</p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {files.map((file) => (
                  <li key={file.id} className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {file.type === 'audio' ? (
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
                              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                            />
                          </svg>
                        ) : (
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
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">{file.size}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          Uploaded {formatDate(file.uploadedAt)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return <Layout>{filesContent()}</Layout>;
}
