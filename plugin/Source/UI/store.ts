import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

type UserStatus = 'online' | 'offline' | 'away' | 'busy';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: UserStatus;
  lastSeen?: string;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  channelId: string;
  timestamp: number;
  read: boolean;
}

export interface Channel {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'project';
  participants: string[];
  lastMessage?: string;
  unreadCount: number;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Store {
  // Current User
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  updateStatus: (status: UserStatus) => void;
  
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  fetchInitialData: () => void;
  
  // Users
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  
  // Friends
  friends: string[];
  friendRequests: {
    sent: FriendRequest[];
    received: FriendRequest[];
  };
  sendFriendRequest: (receiverId: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  declineFriendRequest: (requestId: string) => void;
  removeFriend: (friendId: string) => void;
  
  // Channels
  channels: Channel[];
  activeChannel: string | null;
  setActiveChannel: (channelId: string | null) => void;
  createChannel: (channel: Omit<Channel, 'id' | 'createdAt' | 'updatedAt' | 'unreadCount'>) => void;
  
  // Messages
  messages: Message[];
  sendMessage: (text: string, channelId: string) => void;
  markAsRead: (messageId: string) => void;
  
  // Projects
  projects: any[]; // Define proper type later
}

const useStore = create<Store>((set, get) => ({
  // Current User
  currentUser: {
    id: 'user1',
    name: 'Current User',
    email: 'current@example.com',
    status: 'online',
  },
  
  // Initialize with mock data
  fetchInitialData: () => {
    set({
      users: [
        {
          id: 'user1',
          name: 'Current User',
          email: 'current@example.com',
          status: 'online',
        },
        {
          id: 'user2',
          name: 'Friend 1',
          email: 'friend1@example.com',
          status: 'online',
        },
        {
          id: 'user3',
          name: 'Friend 2',
          email: 'friend2@example.com',
          status: 'offline',
        },
      ],
      friends: ['user2'],
      friendRequests: { sent: [], received: [] },
      channels: [
        {
          id: 'channel1',
          name: 'general',
          type: 'group',
          participants: ['user1', 'user2'],
          isPrivate: false,
          unreadCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      messages: [],
    });
  },
  setCurrentUser: (user) => set({ currentUser: user }),
  updateStatus: (status) => 
    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, status } : null,
    })),
  
  // Navigation
  activeTab: 'chat',
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  // Users
  users: [
    {
      id: 'user1',
      name: 'Current User',
      email: 'user@example.com',
      status: 'online',
    },
    {
      id: 'user2',
      name: 'John Doe',
      email: 'john@example.com',
      status: 'online',
    },
    {
      id: 'user3',
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'away',
    },
  ],
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  updateUser: (id, updates) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, ...updates } : user
      ),
    })),
  
  // Friends
  friends: [],
  friendRequests: { sent: [], received: [] },
  sendFriendRequest: (receiverId) => {
    const request: FriendRequest = {
      id: uuidv4(),
      senderId: get().currentUser?.id || '',
      receiverId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      friendRequests: {
        ...state.friendRequests,
        sent: [...state.friendRequests.sent, request],
      },
    }));
  },
  acceptFriendRequest: (requestId) => {
    set((state) => {
      const request = state.friendRequests.received.find(r => r.id === requestId);
      if (!request) return state;
      
      return {
        friendRequests: {
          ...state.friendRequests,
          received: state.friendRequests.received.filter(r => r.id !== requestId),
        },
        friends: [...state.friends, request.senderId],
      };
    });
  },
  declineFriendRequest: (requestId) =>
    set((state) => ({
      friendRequests: {
        ...state.friendRequests,
        received: state.friendRequests.received.filter(
          (req) => req.id !== requestId
        ),
      },
    })),
  removeFriend: (friendId) =>
    set((state) => ({
      friends: state.friends.filter((id) => id !== friendId),
    })),
  
  // Channels
  channels: [
    {
      id: 'channel1',
      name: 'general',
      type: 'project',
      participants: ['user1', 'user2', 'user3'],
      unreadCount: 0,
      isPrivate: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  activeChannel: null,
  setActiveChannel: (channelId) => {
    set({ activeChannel: channelId });
    // Mark messages as read when channel is opened
    if (channelId) {
      set((state) => ({
        channels: state.channels.map((channel) =>
          channel.id === channelId ? { ...channel, unreadCount: 0 } : channel
        ),
      }));
    }
  },
  createChannel: (channel) => {
    const newChannel: Channel = {
      ...channel,
      id: uuidv4(),
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({
      channels: [...state.channels, newChannel],
    }));
    return newChannel;
  },
  
  // Messages
  messages: [],
  sendMessage: (text, channelId) => {
    const newMessage: Message = {
      id: uuidv4(),
      text,
      senderId: get().currentUser?.id || '',
      channelId,
      timestamp: Date.now(),
      read: false,
    };
    
    set((state) => ({
      messages: [...state.messages, newMessage],
      channels: state.channels.map((channel) =>
        channel.id === channelId
          ? {
              ...channel,
              lastMessage: text,
              updatedAt: new Date().toISOString(),
              unreadCount:
                channel.id === state.activeChannel ? 0 : channel.unreadCount + 1,
            }
          : channel
      ),
    }));
  },
  markAsRead: (messageId) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId ? { ...msg, read: true } : msg
      ),
    })),
  
  // Projects (to be implemented)
  projects: [],
}));

export default useStore;
