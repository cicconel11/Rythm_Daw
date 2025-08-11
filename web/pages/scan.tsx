'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ScanPage() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentOS, setCurrentOS] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    detectOS();
    
    // Request notification permission for download notifications
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const detectOS = () => {
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent;
      if (userAgent.includes('Mac')) {
        setCurrentOS('mac');
      } else if (userAgent.includes('Windows')) {
        setCurrentOS('windows');
      } else if (userAgent.includes('Linux')) {
        setCurrentOS('linux');
      } else {
        setCurrentOS('unknown');
      }
    }
  };

  const getDownloadLink = (os: string) => {
    switch (os) {
      case 'mac':
        return '/downloads/rhythm-plugin-mac.tar.gz';
      case 'windows':
        return '/downloads/rhythm-plugin-windows.exe';
      case 'linux':
        return '/downloads/rhythm-plugin-linux.tar.gz';
      default:
        return '#';
    }
  };

  const handleDownload = (os: string) => {
    setIsDownloading(true);
    setDownloadComplete(false);
    const link = getDownloadLink(os);
    
    try {
      // Create a temporary download link for the actual file
      const downloadLink = document.createElement('a');
      downloadLink.href = link;
      
      // Set appropriate filename for each OS
      const filename = os === 'mac' ? 'rhythm-plugin-mac.tar.gz' : 
                      os === 'windows' ? 'rhythm-plugin-windows.exe' : 
                      'rhythm-plugin-linux.tar.gz';
      
      downloadLink.download = filename;
      downloadLink.style.display = 'none';
      
      // Add to DOM, click, and remove
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Show success state after download starts
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadComplete(true);
        console.log(`Download started for ${os}: ${link}`);
        
        // Reset success state after 3 seconds
        setTimeout(() => {
          setDownloadComplete(false);
        }, 3000);
      }, 1000);
      
      // Show a browser notification about the download
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('RHYTHM Plugin Download', {
          body: `Download started for ${os === 'mac' ? 'macOS' : os === 'windows' ? 'Windows' : 'Linux'}`,
          icon: '/favicon.ico'
        });
      }
      
    } catch (error) {
      console.error('Download failed:', error);
      setIsDownloading(false);
    }
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  // Show loading while detecting OS
  if (!isClient || currentOS === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Detecting your system...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Download RHYTHM Plugin
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Install the plugin to start collaborating in your DAW
            </p>
          </div>

          <div className="mt-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Recommended for your system
                </h3>
                
                <div className="bg-white rounded-lg border-2 border-blue-200 p-4 mb-4">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="text-2xl">
                      {currentOS === 'mac' && '🍎'}
                      {currentOS === 'windows' && '🪟'}
                      {currentOS === 'linux' && '🐧'}
                      {currentOS === 'unknown' && '💻'}
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">
                        RHYTHM Plugin for {currentOS === 'mac' ? 'macOS' : currentOS === 'windows' ? 'Windows' : currentOS === 'linux' ? 'Linux' : 'Your System'}
                      </div>
                      <div className="text-sm text-gray-500">
                        VST3/AU Plugin • Works in Logic, Ableton, Pro Tools
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(currentOS)}
                  disabled={isDownloading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 ${
                    downloadComplete 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isDownloading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Downloading...
                    </div>
                  ) : downloadComplete ? (
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Download Complete!
                    </div>
                  ) : (
                    'Download Plugin'
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Other platforms</h4>
              <div className="space-y-2">
                {currentOS !== 'mac' && (
                  <button
                    onClick={() => handleDownload('mac')}
                    className="w-full flex items-center justify-between py-2 px-3 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <span>🍎 macOS</span>
                    <span className="text-gray-500">Download</span>
                  </button>
                )}
                {currentOS !== 'windows' && (
                  <button
                    onClick={() => handleDownload('windows')}
                    className="w-full flex items-center justify-between py-2 px-3 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <span>🪟 Windows</span>
                    <span className="text-gray-500">Download</span>
                  </button>
                )}
                {currentOS !== 'linux' && (
                  <button
                    onClick={() => handleDownload('linux')}
                    className="w-full flex items-center justify-between py-2 px-3 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <span>🐧 Linux</span>
                    <span className="text-gray-500">Download</span>
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={handleSkip}
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
