import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Message {
  id: number;
  text: string;
  sender: string; // Changed to string to support multiple users
  timestamp: string;
  channelId: string;
}

interface Upload {
  id: number;
  name: string;
  progress: number;
  status: "uploading" | "done";
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

interface User {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "offline" | "away" | "busy";
  lastSeen?: string;
}

interface Channel {
  id: string;
  name: string;
  description?: string;
  type: "direct" | "group" | "project";
  participants: string[]; // user IDs
  unreadCount: number;
  isPrivate?: boolean;
  createdAt?: string;
  createdBy?: string;
  lastMessage?: {
    text: string;
    timestamp: string;
    senderId: string;
  };
  avatar?: string;
}

export type Tab =
  | "dashboard"
  | "files"
  | "history"
  | "friends"
  | "chat"
  | "settings"
  | "admin";

interface AppState {
  // ... (previous state remains the same)

  // New actions for group chats
  createGroup: (params: {
    name: string;
    participants: string[];
    description?: string;
    isPrivate?: boolean;
    avatar?: string;
  }) => void;
  updateGroup: (
    channelId: string,
    updates: Partial<Omit<Channel, "id" | "type" | "createdAt" | "createdBy">>,
  ) => void;
  addParticipants: (channelId: string, userIds: string[]) => void;
  removeParticipant: (channelId: string, userId: string) => void;
  leaveGroup: (channelId: string) => void;
  // UI State
  activeTab: Tab;
  activeChannel: string | null;

  // Data
  messages: Message[];
  uploads: Upload[];
  snapshots: Snapshot[];
  plugins: Plugin[];
  users: User[];
  channels: Channel[];

  // Actions
  setActiveTab: (tab: Tab) => void;
  setActiveChannel: (channelId: string) => void;
  sendMessage: (text: string, channelId: string) => void;
  addChannel: (
    channel: Omit<Channel, "id" | "unreadCount" | "lastMessage">,
  ) => void;
  markChannelAsRead: (channelId: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // UI State
      activeTab: "chat" as const,
      activeChannel: "general",

      // Mock Data
      users: [
        { id: "user1", name: "You", status: "online" },
        { id: "user2", name: "Alex Chen", status: "online" },
        { id: "user3", name: "Jamie Wilson", status: "away" },
        {
          id: "user4",
          name: "Taylor Smith",
          status: "offline",
          lastSeen: "2h ago",
        },
      ],

      channels: [
        {
          id: "general",
          name: "General",
          type: "project",
          participants: ["user1", "user2", "user3", "user4"],
          unreadCount: 0,
          lastMessage: {
            text: "Welcome to the general channel!",
            timestamp: new Date().toISOString(),
            senderId: "system",
          },
        },
        {
          id: "random",
          name: "Random",
          type: "group",
          participants: ["user1", "user2"],
          unreadCount: 2,
          lastMessage: {
            text: "Check out this new plugin",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            senderId: "user2",
          },
        },
        {
          id: "user2",
          name: "Alex Chen",
          type: "direct",
          participants: ["user1", "user2"],
          unreadCount: 1,
          lastMessage: {
            text: "How about we collab on this track?",
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            senderId: "user2",
          },
        },
      ],

      messages: Array.from({ length: 30 }, (_, i) => ({
        id: i,
        text: `This is a mock message ${i + 1}`,
        sender: i % 3 === 0 ? "user1" : "user2",
        timestamp: new Date(Date.now() - i * 60000).toISOString(),
        channelId: "general",
      })),

      uploads: [
        { id: 1, name: "Drums.zip", progress: 54, status: "uploading" },
        { id: 2, name: "Bass.wav", progress: 100, status: "done" },
      ],

      snapshots: [
        { id: 1, name: "Kick tweak", timestamp: "10 minutes ago" },
        { id: 2, name: "Vocal comp", timestamp: "2 hours ago" },
      ],

      plugins: Array.from({ length: 8 }, (_, i) => ({
        id: i,
        name: `Plugin ${i + 1}`,
        compatible: i % 2 === 0,
      })),

      // Actions
      setActiveTab: (tab: Tab) => set({ activeTab: tab as Tab }),

      setActiveChannel: (channelId) => {
        set((state) => ({
          activeChannel: channelId,
          channels: state.channels.map((channel) =>
            channel.id === channelId ? { ...channel, unreadCount: 0 } : channel,
          ),
        }));
      },

      sendMessage: (text, channelId) => {
        const newMessage = {
          id: Date.now(),
          text,
          sender: "user1", // Current user
          timestamp: new Date().toISOString(),
          channelId,
        };

        set((state) => ({
          messages: [...state.messages, newMessage],
          channels: state.channels.map((channel) =>
            channel.id === channelId
              ? {
                  ...channel,
                  lastMessage: {
                    text,
                    timestamp: newMessage.timestamp,
                    senderId: "user1",
                  },
                  unreadCount:
                    state.activeChannel === channelId
                      ? 0
                      : channel.unreadCount + 1,
                }
              : channel,
          ),
        }));
      },

      addChannel: (channel) => {
        const newChannel = {
          ...channel,
          id: `channel-${Date.now()}`,
          unreadCount: 0,
          lastMessage: undefined,
        };

        set((state) => ({
          channels: [...state.channels, newChannel],
          activeChannel: newChannel.id,
        }));
      },

      markChannelAsRead: (channelId) => {
        set((state) => ({
          channels: state.channels.map((channel) =>
            channel.id === channelId ? { ...channel, unreadCount: 0 } : channel,
          ),
        }));
      },

      createGroup: ({
        name,
        participants,
        description,
        isPrivate = false,
        avatar,
      }) => {
        const currentUserId = "user1"; // In a real app, this would come from auth
        const now = new Date().toISOString();

        const newGroup: Channel = {
          id: `group-${Date.now()}`,
          name,
          description,
          type: "group",
          participants: [...new Set([currentUserId, ...participants])],
          unreadCount: 0,
          isPrivate,
          createdAt: now,
          createdBy: currentUserId,
          avatar,
        };

        set((state) => ({
          channels: [...state.channels, newGroup],
          activeChannel: newGroup.id,
        }));
      },

      updateGroup: (channelId, updates) => {
        set((state) => ({
          channels: state.channels.map((channel) =>
            channel.id === channelId ? { ...channel, ...updates } : channel,
          ),
        }));
      },

      addParticipants: (channelId, userIds) => {
        set((state) => ({
          channels: state.channels.map((channel) => {
            if (channel.id === channelId) {
              return {
                ...channel,
                participants: [
                  ...new Set([...channel.participants, ...userIds]),
                ],
              };
            }
            return channel;
          }),
        }));
      },

      removeParticipant: (channelId, userId) => {
        set((state) => {
          const channel = state.channels.find((c) => c.id === channelId);
          if (!channel) return state;

          const currentUserId = "user1"; // In a real app, this would come from auth
          const isCurrentUser = userId === currentUserId;

          // If current user is being removed or is removing themselves
          if (isCurrentUser) {
            return {
              ...state,
              channels: state.channels.filter((c) => c.id !== channelId),
              activeChannel:
                state.activeChannel === channelId
                  ? "general"
                  : state.activeChannel,
            };
          }

          // Remove the participant
          return {
            ...state,
            channels: state.channels.map((c) =>
              c.id === channelId
                ? {
                    ...c,
                    participants: c.participants.filter((id) => id !== userId),
                  }
                : c,
            ),
          };
        });
      },

      leaveGroup: (channelId) => {
        const { activeChannel, removeParticipant } = get();
        removeParticipant(channelId, "user1"); // 'user1' is the current user

        // If we were viewing the channel we just left, redirect to general
        if (activeChannel === channelId) {
          set({ activeChannel: "general" });
        }
      },
    }),
    {
      name: "rhythm-ui-state",
      partialize: (state) => ({
        // Only persist these parts of the state
        activeTab: state.activeTab,
        activeChannel: state.activeChannel,
        channels: state.channels,
        users: state.users,
      }),
    },
  ),
);
