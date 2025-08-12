import { z } from "zod";
import {
  PluginSchema,
  ActivitySchema,
  UserSchema,
  FileSchema,
  MessageSchema,
  ConversationSchema,
  FriendRequestSchema,
  FriendSchema,
  DashboardStatsSchema,
  SettingsSchema,
  DeviceStatusSchema,
  type Plugin,
  type Activity,
  type User,
  type File,
  type Message,
  type Conversation,
  type FriendRequest,
  type Friend,
  type DashboardStats,
  type Settings,
  type DeviceStatus,
} from "./types";

// Mock data with Zod validation
export const mockPlugins: Plugin[] = [
  { id: 1, name: "Serum", type: "Synthesizer", version: "1.365", status: "Active", usage: "87%" },
  { id: 2, name: "FabFilter Pro-Q 3", type: "EQ", version: "3.24", status: "Active", usage: "92%" },
  { id: 3, name: "Waves SSL G-Master", type: "Compressor", version: "14.0", status: "Inactive", usage: "45%" },
  { id: 4, name: "Native Instruments Massive X", type: "Synthesizer", version: "1.4.1", status: "Active", usage: "76%" },
  { id: 5, name: "Valhalla VintageVerb", type: "Reverb", version: "3.0.1", status: "Active", usage: "69%" },
  { id: 6, name: "Ozone 10", type: "Mastering Suite", version: "10.0.2", status: "Active", usage: "88%" },
];

export const mockActivities: Activity[] = [
  { id: "1", action: "Plugin Scan Completed", time: "2 minutes ago", type: "system" },
  { id: "2", action: "Added Serum to favorites", time: "15 minutes ago", type: "user" },
  { id: "3", action: "Exported project 'Track_01'", time: "1 hour ago", type: "export" },
  { id: "4", action: "Friend request from BeatMaker99", time: "2 hours ago", type: "social" },
  { id: "5", action: "Uploaded 'Mixdown Final.wav'", time: "3 hours ago", type: "file" },
  { id: "6", action: "Updated FabFilter Pro-Q 3", time: "1 day ago", type: "plugin" },
];

export const mockUsers: User[] = [
  { id: "1", username: "beatmaker99", displayName: "BeatMaker99", status: "online" },
  { id: "2", username: "producerx", displayName: "ProducerX", status: "offline" },
  { id: "3", username: "synthmaster", displayName: "SynthMaster", status: "online" },
  { id: "4", username: "djproducer", displayName: "DJ Producer", status: "away" },
];

export const mockFiles: File[] = [
  { id: "1", name: "Project Alpha.wav", size: 45200000, type: "audio/wav", status: "inbox", owner: "user1" },
  { id: "2", name: "Mixdown Final.mp3", size: 12800000, type: "audio/mp3", status: "sent", owner: "user1" },
  { id: "3", name: "Session Notes.pdf", size: 2100000, type: "application/pdf", status: "processing", owner: "user1" },
  { id: "4", name: "Bass Track.wav", size: 32000000, type: "audio/wav", status: "uploaded", owner: "user1" },
];

export const mockMessages: Message[] = [
  { id: "1", content: "Hey, check out this new track!", sender: "beatmaker99", timestamp: "2024-01-15T10:30:00Z", type: "text" },
  { id: "2", content: "Sounds great! Can you share the project file?", sender: "producerx", timestamp: "2024-01-15T10:35:00Z", type: "text" },
  { id: "3", content: "Project Alpha.wav", sender: "beatmaker99", timestamp: "2024-01-15T10:40:00Z", type: "file", metadata: { fileId: "1" } },
];

export const mockConversations: Conversation[] = [
  {
    id: "1",
    participants: ["user1", "beatmaker99"],
    lastMessage: mockMessages[2],
    unreadCount: 1,
    updatedAt: "2024-01-15T10:40:00Z",
  },
  {
    id: "2",
    participants: ["user1", "producerx"],
    lastMessage: mockMessages[1],
    unreadCount: 0,
    updatedAt: "2024-01-15T10:35:00Z",
  },
];

export const mockFriendRequests: FriendRequest[] = [
  { id: "1", from: "synthmaster", to: "user1", status: "pending", createdAt: "2024-01-15T09:00:00Z", message: "Let's collaborate!" },
  { id: "2", from: "djproducer", to: "user1", status: "accepted", createdAt: "2024-01-14T15:30:00Z" },
];

export const mockFriends: Friend[] = [
  {
    id: "1",
    user: mockUsers[0],
    mutualFriends: ["producerx"],
    compatibility: 85,
    sharedPlugins: ["Serum", "FabFilter Pro-Q 3"],
  },
  {
    id: "2",
    user: mockUsers[2],
    mutualFriends: ["beatmaker99"],
    compatibility: 72,
    sharedPlugins: ["Serum"],
  },
];

export const mockDashboardStats: DashboardStats = {
  plugins: {
    total: mockPlugins.length,
    active: mockPlugins.filter(p => p.status === "Active").length,
    avgUsage: 74,
    updatesAvailable: 3,
  },
  recentActivity: mockActivities,
  installedPlugins: mockPlugins,
};

export const mockSettings: Settings = {
  notifications: {
    email: true,
    push: true,
    sound: false,
  },
  privacy: {
    profileVisibility: "friends",
    showOnlineStatus: true,
    allowFriendRequests: true,
  },
  appearance: {
    theme: "system",
    compactMode: false,
  },
};

export const mockDeviceStatus: DeviceStatus = {
  connected: false,
  lastSeen: "2024-01-15T08:00:00Z",
  deviceType: "plugin",
  os: "macOS",
};

// Validation functions
export function validateMockData() {
  try {
    mockPlugins.forEach(plugin => PluginSchema.parse(plugin));
    mockActivities.forEach(activity => ActivitySchema.parse(activity));
    mockUsers.forEach(user => UserSchema.parse(user));
    mockFiles.forEach(file => FileSchema.parse(file));
    mockMessages.forEach(message => MessageSchema.parse(message));
    mockConversations.forEach(conversation => ConversationSchema.parse(conversation));
    mockFriendRequests.forEach(request => FriendRequestSchema.parse(request));
    mockFriends.forEach(friend => FriendSchema.parse(friend));
    DashboardStatsSchema.parse(mockDashboardStats);
    SettingsSchema.parse(mockSettings);
    DeviceStatusSchema.parse(mockDeviceStatus);
    return true;
  } catch (error) {
    console.error("Mock data validation failed:", error);
    return false;
  }
}

// Mock data getters with validation
export const getMockData = {
  plugins: () => mockPlugins,
  activities: () => mockActivities,
  users: () => mockUsers,
  files: () => mockFiles,
  messages: () => mockMessages,
  conversations: () => mockConversations,
  friendRequests: () => mockFriendRequests,
  friends: () => mockFriends,
  dashboardStats: () => mockDashboardStats,
  settings: () => mockSettings,
  deviceStatus: () => mockDeviceStatus,
};

// Environment check
export const shouldUseMocks = () => {
  return process.env.NEXT_PUBLIC_USE_MOCKS === 'true' || 
         process.env.NODE_ENV === 'test' || 
         typeof window === 'undefined';
};

// Initialize validation on import
if (typeof window !== 'undefined') {
  validateMockData();
}
