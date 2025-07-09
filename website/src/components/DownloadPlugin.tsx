import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Download, LogicPro, Ableton, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
import { Transition } from '@headlessui/react';
import { useToast } from '@/components/ui/use-toast';

interface ReleaseAsset {
  url: string;
  sha256: string;
}

interface ReleaseAssets {
  au: ReleaseAsset;
  vst3: ReleaseAsset;
}

interface DownloadState {
  isDownloading: boolean;
  error: string | null;
  checksum: string | null;
}

export default function DownloadPlugin() {
  const [assets, setAssets] = useState<ReleaseAssets | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [downloadState, setDownloadState] = useState<DownloadState>({
    isDownloading: false,
    error: null,
    checksum: null,
  });
  const router = useRouter();

  // Cache for 1 hour
  const cacheKey = 'release-assets';
  const cacheTimeout = 3600000; // 1 hour

  useEffect(() => {
    const cachedAssets = localStorage.getItem(cacheKey);
    if (cachedAssets) {
      const { data, timestamp } = JSON.parse(cachedAssets);
      if (Date.now() - timestamp < cacheTimeout) {
        setAssets(data);
        return;
      }
    }

    fetch('/latest-downloads.json')
      .then((res) => res.json())
      .then((data) => {
        setAssets(data);
        localStorage.setItem(cacheKey, JSON.stringify({
          data,
          timestamp: Date.now(),
        }));
      })
      .catch((err) => setError('Failed to fetch download links'));
  }, []);

  const detectPlatform = () => {
    const platform = navigator.platform.toLowerCase();
    const userAgent = navigator.userAgent.toLowerCase();

    const isMac = /mac/i.test(platform);
    const isWin = /win/i.test(platform);
    const isLinux = /linux/i.test(platform);
    const isLogic = /logic|mainstage/i.test(userAgent);

    return {
      isMac,
      isWin,
      isLinux,
      isLogic,
      platform: isMac ? 'macOS' : isWin ? 'Windows' : isLinux ? 'Linux' : 'Unknown',
    };
  };

  const { isMac, isWin, isLinux, isLogic } = detectPlatform();
  const currentVersion = router.query.tag as string | undefined || 'latest';

  const downloadFile = (asset: ReleaseAsset) => {
    setDownloadState({
      isDownloading: true,
      error: null,
      checksum: asset.sha256,
    });

    try {
      const a = document.createElement('a');
      a.href = asset.url;
      a.download = asset.url.split('/').pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download file:', error);
      setDownloadState(prev => ({
        ...prev,
        error: 'Failed to start download',
        isDownloading: false,
      }));
    }
  };

  if (error) {
    return (
      <div className="text-red-500">
        <AlertCircle className="w-5 h-5 inline-block mr-2" />
        Error: {error}
      </div>
    );
  }

  if (!assets) {
    return (
      <div className="flex items-center gap-2">
        <Download className="w-5 h-5 animate-spin" />
        Loading...
      </div>
    );
  }

  const primaryAsset = isMac ? assets.au : assets.vst3;
  const secondaryAsset = isMac ? assets.vst3 : assets.au;

  return (
    <div className="space-y-4">
      <div className="relative">
        <button
          onClick={() => downloadFile(primaryAsset)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Download className="w-5 h-5 inline-block mr-2" />
          Download Plug-in
          <ChevronDown className="w-4 h-4 ml-2" />
        </button>

        <Transition
          show={isDropdownOpen}
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-in"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-2">
                Detected: {isMac ? 'macOS' : isWin ? 'Windows' : isLinux ? 'Linux' : 'Unknown'}
              </p>
              
              <div className="space-y-2">
                <button
                  onClick={() => downloadFile(assets.au)}
                  className="flex items-center justify-between w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-100"
                >
                  <span className="flex items-center gap-2">
                    <LogicPro className="w-4 h-4" />
                    Logic Pro / AU
                  </span>
                  <span className="text-xs text-gray-500">{assets.au.sha256.slice(0, 8)}...</span>
                </button>

                <button
                  onClick={() => downloadFile(assets.vst3)}
                  className="flex items-center justify-between w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-100"
                >
                  <span className="flex items-center gap-2">
                    <Ableton className="w-4 h-4" />
                    VST3 (Ableton, Cubase...)
                  </span>
                  <span className="text-xs text-gray-500">{assets.vst3.sha256.slice(0, 8)}...</span>
                </button>
              </div>

              <div className="mt-4 border-t border-gray-200 pt-2">
                <Link
                  href="/docs/installation"
                  className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Troubleshooting / Install Guide
                </Link>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      {downloadState.isDownloading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Downloading...</span>
          <span className="text-xs text-gray-500">{downloadState.checksum?.slice(0, 8)}...</span>
        </div>
      )}

      {downloadState.error && (
        <div className="text-red-500">
          <AlertCircle className="w-4 h-4 inline-block mr-2" />
          {downloadState.error}
        </div>
      )}
    </div>
  );
}
