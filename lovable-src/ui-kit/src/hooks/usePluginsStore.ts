
import { create } from 'zustand';

interface Plugin {
  id: string;
  name: string;
  version: string;
  status: 'active' | 'inactive';
  cpuUsage: number;
  lastUsed: Date;
  sessions: number;
  type: string;
}

interface PluginsState {
  plugins: Plugin[];
  activePlugins: Plugin[];
  inactivePlugins: Plugin[];
  updatePluginStatus: (pluginId: string, status: 'active' | 'inactive') => void;
  getPluginById: (pluginId: string) => Plugin | undefined;
}

export const usePluginsStore = create<PluginsState>((set, get) => ({
  plugins: [
    {
      id: '1',
      name: 'Serum',
      version: '1.365',
      status: 'active',
      cpuUsage: 12,
      lastUsed: new Date(Date.now() - 2 * 60 * 1000),
      sessions: 3,
      type: 'Synthesizer',
    },
    {
      id: '2',
      name: 'FabFilter Pro-Q 3',
      version: '3.24',
      status: 'active',
      cpuUsage: 8,
      lastUsed: new Date(Date.now() - 5 * 60 * 1000),
      sessions: 1,
      type: 'EQ',
    },
    {
      id: '3',
      name: 'Massive X',
      version: '1.4.1',
      status: 'inactive',
      cpuUsage: 0,
      lastUsed: new Date(Date.now() - 60 * 60 * 1000),
      sessions: 0,
      type: 'Synthesizer',
    },
    {
      id: '4',
      name: 'Ozone 10',
      version: '10.0.2',
      status: 'inactive',
      cpuUsage: 0,
      lastUsed: new Date(Date.now() - 3 * 60 * 60 * 1000),
      sessions: 0,
      type: 'Mastering',
    },
    {
      id: '5',
      name: 'Battery 4',
      version: '4.2.1',
      status: 'active',
      cpuUsage: 15,
      lastUsed: new Date(Date.now() - 1 * 60 * 1000),
      sessions: 2,
      type: 'Drum Machine',
    },
    {
      id: '6',
      name: 'Kontakt 6',
      version: '6.7.1',
      status: 'active',
      cpuUsage: 22,
      lastUsed: new Date(Date.now() - 10 * 60 * 1000),
      sessions: 1,
      type: 'Sampler',
    },
  ],
  get activePlugins() {
    return get().plugins.filter(p => p.status === 'active');
  },
  get inactivePlugins() {
    return get().plugins.filter(p => p.status === 'inactive');
  },
  updatePluginStatus: (pluginId, status) => {
    set((state) => ({
      plugins: state.plugins.map((plugin) =>
        plugin.id === pluginId ? { ...plugin, status } : plugin
      ),
    }));
  },
  getPluginById: (pluginId) => {
    return get().plugins.find(p => p.id === pluginId);
  },
}));
