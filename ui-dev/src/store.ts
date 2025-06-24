import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'other';
  timestamp: string;
}

interface Upload {
  id: number;
  name: string;
  progress: number;
  status: 'uploading' | 'done';
}

interface Snapshot {
  id: number;
  name: string;
  timestamp: string;
}

interface Plugin {
  id: number;
  name: string;
  compatible: boolean;
}

interface AppState {
  activeTab: string;
  recording: boolean;
  messages: Message[];
  uploads: Upload[];
  snapshots: Snapshot[];
  plugins: Plugin[];
  setActiveTab: (tab: string) => void;
  toggleRecording: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      activeTab: 'Chat',
      recording: false,
      messages: Array.from({ length: 30 }, (_, i) => ({
        id: i,
        text: `This is a mock message ${i + 1}`,
        sender: i % 3 === 0 ? 'user' : 'other',
        timestamp: new Date(Date.now() - i * 60000).toLocaleTimeString(),
      })),
      uploads: [
        { id: 1, name: 'Drums.zip', progress: 54, status: 'uploading' },
        { id: 2, name: 'Bass.wav', progress: 100, status: 'done' },
      ],
      snapshots: [
        { id: 1, name: 'Kick tweak', timestamp: '10 minutes ago' },
        { id: 2, name: 'Vocal comp', timestamp: '2 hours ago' },
      ],
      plugins: Array.from({ length: 8 }, (_, i) => ({
        id: i,
        name: `Plugin ${i + 1}`,
        compatible: i % 2 === 0,
      })),
      setActiveTab: (tab) => set({ activeTab: tab }),
      toggleRecording: () => set((state) => ({ recording: !state.recording })),
    }),
    {
      name: 'rhythm-ui-state',
    }
  )
);
