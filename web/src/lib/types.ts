import { z } from "zod";

// Plugin schemas
export const PluginSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  version: z.string(),
  status: z.enum(["Active", "Inactive", "Updating"]),
  usage: z.string(),
  lastUsed: z.string().optional(),
  size: z.number().optional(),
});

export const PluginStatsSchema = z.object({
  total: z.number(),
  active: z.number(),
  avgUsage: z.number(),
  updatesAvailable: z.number(),
});

// Activity schemas
export const ActivitySchema = z.object({
  id: z.string(),
  action: z.string(),
  time: z.string(),
  type: z.enum(["system", "user", "export", "social", "plugin", "file"]),
  metadata: z.record(z.any()).optional(),
});

// User schemas
export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  displayName: z.string(),
  avatar: z.string().optional(),
  status: z.enum(["online", "offline", "away"]),
  lastSeen: z.string().optional(),
});

export const UserProfileSchema = z.object({
  id: z.string(),
  username: z.string(),
  displayName: z.string(),
  email: z.string().email(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// File schemas
export const FileSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number(),
  type: z.string(),
  status: z.enum(["uploading", "uploaded", "downloading", "downloaded", "error", "inbox", "sent", "processing"]),
  progress: z.number().min(0).max(100).optional(),
  uploadedAt: z.string().optional(),
  sharedWith: z.array(z.string()).optional(),
  owner: z.string(),
});

// Chat schemas
export const MessageSchema = z.object({
  id: z.string(),
  content: z.string(),
  sender: z.string(),
  timestamp: z.string(),
  type: z.enum(["text", "file", "system"]),
  metadata: z.record(z.any()).optional(),
});

export const ConversationSchema = z.object({
  id: z.string(),
  participants: z.array(z.string()),
  lastMessage: MessageSchema.optional(),
  unreadCount: z.number(),
  updatedAt: z.string(),
});

// Friend schemas
export const FriendRequestSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  status: z.enum(["pending", "accepted", "rejected"]),
  createdAt: z.string(),
  message: z.string().optional(),
});

export const FriendSchema = z.object({
  id: z.string(),
  user: UserSchema,
  mutualFriends: z.array(z.string()),
  compatibility: z.number().min(0).max(100),
  sharedPlugins: z.array(z.string()),
});

// Dashboard schemas
export const DashboardStatsSchema = z.object({
  plugins: PluginStatsSchema,
  recentActivity: z.array(ActivitySchema),
  installedPlugins: z.array(PluginSchema),
});

// Settings schemas
export const SettingsSchema = z.object({
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sound: z.boolean(),
  }),
  privacy: z.object({
    profileVisibility: z.enum(["public", "friends", "private"]),
    showOnlineStatus: z.boolean(),
    allowFriendRequests: z.boolean(),
  }),
  appearance: z.object({
    theme: z.enum(["light", "dark", "system"]),
    compactMode: z.boolean(),
  }),
});

// Device schemas
export const DeviceStatusSchema = z.object({
  connected: z.boolean(),
  lastSeen: z.string().optional(),
  deviceType: z.enum(["plugin", "mobile", "desktop"]).optional(),
  os: z.enum(["macOS", "Windows", "Linux", "Other"]).optional(),
});

// API Response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any(),
  message: z.string().optional(),
  error: z.string().optional(),
});

// Type exports
export type Plugin = z.infer<typeof PluginSchema>;
export type PluginStats = z.infer<typeof PluginStatsSchema>;
export type Activity = z.infer<typeof ActivitySchema>;
export type User = z.infer<typeof UserSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type File = z.infer<typeof FileSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Conversation = z.infer<typeof ConversationSchema>;
export type FriendRequest = z.infer<typeof FriendRequestSchema>;
export type Friend = z.infer<typeof FriendSchema>;
export type DashboardStats = z.infer<typeof DashboardStatsSchema>;
export type Settings = z.infer<typeof SettingsSchema>;
export type DeviceStatus = z.infer<typeof DeviceStatusSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
