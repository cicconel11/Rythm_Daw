// Data layer that switches between API and mocks based on NEXT_PUBLIC_USE_API

const useApi = String(process.env.NEXT_PUBLIC_USE_API) === 'true';

async function fromApi<T>(path: string): Promise<T> {
  const r = await fetch(path, { credentials: 'include' });
  if (!r.ok) throw new Error(`API ${path} ${r.status}`);
  return r.json();
}

async function fromMock<T>(file: string): Promise<T> {
  const r = await fetch(`/__mocks__/${file}`, { cache: 'no-store' });
  return r.json();
}

export type DashboardData = { 
  totalPlugins: number; 
  activePlugins: number; 
  averageUsage: number; 
  availableUpdates: number; 
};

export const getDashboard = () => useApi ? fromApi<DashboardData>('/api/dashboard') : fromMock<DashboardData>('dashboard.json');

export type FileItem = { 
  id: string; 
  name: string; 
  size: number; 
  status: 'inbox'|'sent'|'processing' 
};

export const getFiles = () => useApi ? fromApi<FileItem[]>('/api/files') : fromMock<FileItem[]>('files.json');

export type Friend = { 
  id: string; 
  name: string; 
  online: boolean; 
  compatibility?: string 
};

export const getFriends = () => useApi ? fromApi<Friend[]>('/api/friends') : fromMock<Friend[]>('friends.json');

// Device connection functions
export async function getDeviceStatus(): Promise<{ connected: boolean; lastSeen?: string }> {
  if (useApi) {
    return fromApi<{ connected: boolean; lastSeen?: string }>('/api/device/status');
  }
  
  // Mock device status with polling simulation
  await new Promise(resolve => setTimeout(resolve, 100));
  return { connected: false };
}

export async function connectDevice(): Promise<{ connected: boolean }> {
  if (useApi) {
    return fromApi<{ connected: boolean }>('/api/device/connect');
  }
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  return { connected: true };
}

// OS detection utility
export function detectOS(): 'macOS' | 'Windows' | 'Other' {
  if (typeof window === 'undefined') return 'Other';
  
  const userAgent = window.navigator.userAgent;
  
  if (/Macintosh|Mac OS X/.test(userAgent)) return 'macOS';
  if (/Windows/.test(userAgent)) return 'Windows';
  
  return 'Other';
}

// Export mock data for testing
export const MOCK_DATA = {
  dashboard: {
    totalPlugins: 6,
    activePlugins: 5,
    averageUsage: 74,
    availableUpdates: 3
  },
  files: [
    { id: '1', name: 'Project Alpha.wav', size: 45200000, status: 'inbox' as const },
    { id: '2', name: 'Mixdown Final.mp3', size: 12800000, status: 'sent' as const },
    { id: '3', name: 'Session Notes.pdf', size: 2100000, status: 'processing' as const }
  ],
  friends: [
    { id: '1', name: 'BeatMaker99', online: true, compatibility: 'High' },
    { id: '2', name: 'ProducerX', online: false },
    { id: '3', name: 'SynthMaster', online: true, compatibility: 'Medium' }
  ]
};
