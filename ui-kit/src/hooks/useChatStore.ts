
import { create } from 'zustand';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'plugin' | 'file';
}

interface Friend {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline';
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
}

interface ChatState {
  friends: Friend[];
  messages: Record<string, Message[]>;
  activeFriend: string | null;
  setActiveFriend: (friendId: string) => void;
  sendMessage: (friendId: string, content: string) => void;
  markAsRead: (friendId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  friends: [
    {
      id: '1',
      username: 'BeatMaker99',
      avatar: 'BM',
      status: 'online',
      lastMessage: 'Check out this new beat!',
      lastMessageTime: new Date(Date.now() - 2 * 60 * 1000),
      unreadCount: 2,
    },
    {
      id: '2',
      username: 'ProducerX',
      avatar: 'PX',
      status: 'offline',
      lastMessage: 'What DAW are you using?',
      lastMessageTime: new Date(Date.now() - 60 * 60 * 1000),
      unreadCount: 0,
    },
    {
      id: '3',
      username: 'SynthWave2024',
      avatar: 'SW',
      status: 'online',
      lastMessage: 'Thanks for the plugin recommendation!',
      lastMessageTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
      unreadCount: 1,
    },
  ],
  messages: {
    '1': [
      {
        id: 'm1',
        senderId: '1',
        content: 'Hey! Check out this new beat I made',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        type: 'text',
      },
      {
        id: 'm2',
        senderId: 'me',
        content: 'That sounds amazing! What plugins did you use?',
        timestamp: new Date(Date.now() - 28 * 60 * 1000),
        type: 'text',
      },
      {
        id: 'm3',
        senderId: '1',
        content: 'Mostly Serum for the lead and some FabFilter for EQ',
        timestamp: new Date(Date.now() - 27 * 60 * 1000),
        type: 'text',
      },
    ],
  },
  activeFriend: null,
  setActiveFriend: (friendId) => {
    set({ activeFriend: friendId });
    get().markAsRead(friendId);
  },
  sendMessage: (friendId, content) => {
    const message: Message = {
      id: `m${Date.now()}`,
      senderId: 'me',
      content,
      timestamp: new Date(),
      type: 'text',
    };
    
    set((state) => ({
      messages: {
        ...state.messages,
        [friendId]: [...(state.messages[friendId] || []), message],
      },
    }));
  },
  markAsRead: (friendId) => {
    set((state) => ({
      friends: state.friends.map((friend) =>
        friend.id === friendId ? { ...friend, unreadCount: 0 } : friend
      ),
    }));
  },
}));
