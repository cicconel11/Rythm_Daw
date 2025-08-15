import { create } from 'zustand';
import { Activity, ActivityType } from '@/types/activity';

type DateRange = { start?: Date; end?: Date };

interface Filters {
  types: ActivityType[];
  dateRange: DateRange;
  user?: string;
  actor?: string;
  projectId?: string;
  q?: string;
}

interface ActivityState {
  activities: Activity[]; // hot WS window
  isLoading: boolean;
  filters: Filters;
  setFilters: (f: Partial<Filters>) => void;
  prepend: (a: Activity) => void;
  clearAll: () => void;
}

export const useHistoryStore = create<ActivityState>((set) => ({
  activities: [],
  isLoading: false,
  filters: { types: [], dateRange: {} },
  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
  prepend: (a) => set((s) => ({ activities: [a, ...s.activities].slice(0, 200) })),
  clearAll: () => set({ activities: [] }),
}));
