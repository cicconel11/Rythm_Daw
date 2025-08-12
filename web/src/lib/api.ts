import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shouldUseMocks, getMockData } from './mocks';
import type {
  Plugin,
  Activity,
  User,
  File,
  Message,
  Conversation,
  FriendRequest,
  Friend,
  DashboardStats,
  Settings,
  DeviceStatus,
} from './types';

// Environment check
export const shouldUseMocks = () => {
  return process.env.NEXT_PUBLIC_USE_MOCKS === 'true' || 
         process.env.NODE_ENV === 'test' || 
         typeof window === 'undefined';
};

// API base configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

// Generic API client
async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Mock client with artificial delay
async function mockClient<T>(data: T, delay = 500): Promise<T> {
  await new Promise(resolve => setTimeout(resolve, delay));
  return data;
}

// API functions
export const api = {
  // Dashboard
  getDashboard: () => shouldUseMocks() 
    ? mockClient(getMockData.dashboardStats())
    : apiClient<DashboardStats>('/dashboard'),

  // Plugins
  getPlugins: () => shouldUseMocks()
    ? mockClient(getMockData.plugins())
    : apiClient<Plugin[]>('/plugins'),

  // Activities
  getActivities: () => shouldUseMocks()
    ? mockClient(getMockData.activities())
    : apiClient<Activity[]>('/activities'),

  // Files
  getFiles: () => shouldUseMocks()
    ? mockClient(getMockData.files())
    : apiClient<File[]>('/files'),

  uploadFile: (file: File, onProgress?: (progress: number) => void) => {
    if (shouldUseMocks()) {
      return mockClient({ id: Date.now().toString(), ...file, status: 'uploaded' as const });
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    return fetch(`${API_BASE}/files/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    }).then(res => res.json());
  },

  // Friends
  getFriends: () => shouldUseMocks()
    ? mockClient(getMockData.friends())
    : apiClient<Friend[]>('/friends'),

  getFriendRequests: () => shouldUseMocks()
    ? mockClient(getMockData.friendRequests())
    : apiClient<FriendRequest[]>('/friends/requests'),

  sendFriendRequest: (userId: string, message?: string) => shouldUseMocks()
    ? mockClient({ id: Date.now().toString(), from: 'user1', to: userId, status: 'pending' as const, createdAt: new Date().toISOString(), message })
    : apiClient<FriendRequest>('/friends/requests', {
        method: 'POST',
        body: JSON.stringify({ userId, message }),
      }),

  // Chat
  getConversations: () => shouldUseMocks()
    ? mockClient(getMockData.conversations())
    : apiClient<Conversation[]>('/chat/conversations'),

  getMessages: (conversationId: string) => shouldUseMocks()
    ? mockClient(getMockData.messages())
    : apiClient<Message[]>(`/chat/conversations/${conversationId}/messages`),

  sendMessage: (conversationId: string, content: string) => shouldUseMocks()
    ? mockClient({
        id: Date.now().toString(),
        content,
        sender: 'user1',
        timestamp: new Date().toISOString(),
        type: 'text' as const,
      })
    : apiClient<Message>(`/chat/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      }),

  // Settings
  getSettings: () => shouldUseMocks()
    ? mockClient(getMockData.settings())
    : apiClient<Settings>('/settings'),

  updateSettings: (settings: Partial<Settings>) => shouldUseMocks()
    ? mockClient({ ...getMockData.settings(), ...settings })
    : apiClient<Settings>('/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      }),

  // Device
  getDeviceStatus: () => shouldUseMocks()
    ? mockClient(getMockData.deviceStatus())
    : apiClient<DeviceStatus>('/device/status'),

  connectDevice: () => shouldUseMocks()
    ? mockClient({ ...getMockData.deviceStatus(), connected: true })
    : apiClient<DeviceStatus>('/device/connect', { method: 'POST' }),

  // Users
  getCurrentUser: () => shouldUseMocks()
    ? mockClient({ id: 'user1', username: 'djproducer', displayName: 'DJ Producer', status: 'online' as const })
    : apiClient<User>('/user/profile'),
};

// React Query hooks
export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: api.getDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePlugins = () => {
  return useQuery({
    queryKey: ['plugins'],
    queryFn: api.getPlugins,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useActivities = () => {
  return useQuery({
    queryKey: ['activities'],
    queryFn: api.getActivities,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useFiles = () => {
  return useQuery({
    queryKey: ['files'],
    queryFn: api.getFiles,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useFriends = () => {
  return useQuery({
    queryKey: ['friends'],
    queryFn: api.getFriends,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFriendRequests = () => {
  return useQuery({
    queryKey: ['friendRequests'],
    queryFn: api.getFriendRequests,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: api.getConversations,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => api.getMessages(conversationId),
    enabled: !!conversationId,
    staleTime: 10 * 1000, // 10 seconds
  });
};

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: api.getSettings,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useDeviceStatus = () => {
  return useQuery({
    queryKey: ['deviceStatus'],
    queryFn: api.getDeviceStatus,
    refetchInterval: 5000, // Poll every 5 seconds
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: api.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutations
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, message }: { userId: string; message?: string }) => 
      api.sendFriendRequest(userId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) =>
      api.sendMessage(conversationId, content),
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useConnectDevice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.connectDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deviceStatus'] });
    },
  });
};

// Query keys for easy invalidation
export const queryKeys = {
  dashboard: ['dashboard'],
  plugins: ['plugins'],
  activities: ['activities'],
  files: ['files'],
  friends: ['friends'],
  friendRequests: ['friendRequests'],
  conversations: ['conversations'],
  messages: (conversationId: string) => ['messages', conversationId],
  settings: ['settings'],
  deviceStatus: ['deviceStatus'],
  currentUser: ['currentUser'],
} as const;
