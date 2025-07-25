/**
 * Client to Server event types
 */
export const ClientEvents = {
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  TRACK_UPDATE: 'track_update',
  PRESENCE_UPDATE: 'presence_update',
  SIGNAL: 'signal',
  PING: 'ping',
} as const;

export type ClientEvent = typeof ClientEvents[keyof typeof ClientEvents];

/**
 * Server to Client event types
 */
export const ServerEvents = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  ROOM_JOINED: 'room_joined',
  USER_JOINED: 'user_joined',
  USER_LEFT: 'user_left',
  TRACK_UPDATE: 'track_update',
  PRESENCE_UPDATE: 'presence_update',
  PONG: 'pong',
  SIGNAL: 'signal',
} as const;

export type ServerEvent = typeof ServerEvents[keyof typeof ServerEvents];

/**
 * User information that will be attached to the WebSocket connection
 */
export interface UserInfo {
  userId: string;
  email: string;
  name?: string;
  avatar?: string;
  isAdmin?: boolean;
  isOnline?: boolean;
  lastSeen?: Date;
}

/**
 * Room information for collaborative sessions
 */
export interface RoomInfo {
  id: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  isPublic?: boolean;
  maxParticipants?: number;
  currentParticipants: number;
  participants: string[]; // Array of user IDs
}

/**
 * Track update payload for real-time collaboration
 */
export interface TrackUpdate {
  roomId: string;
  trackId: string;
  type: 'audio' | 'midi' | 'automation' | 'effect';
  action: 'add' | 'update' | 'remove' | 'mute' | 'solo' | 'volume' | 'pan' | 'effect';
  data: unknown;
  userId?: string;
  timestamp?: number;
  version: number; // For conflict resolution
  previousVersion?: number; // For conflict resolution
}

/**
 * User presence status types
 */
export type PresenceStatus = 'online' | 'away' | 'offline' | 'busy';

/**
 * User device information
 */
export interface DeviceInfo {
  type?: 'desktop' | 'mobile' | 'tablet';
  os?: string;
  browser?: string;
  ip?: string;
}

/**
 * User presence information
 */
export interface PresenceUpdate {
  userId: string;
  status: PresenceStatus;
  lastSeen?: Date;
  deviceInfo?: DeviceInfo;
  currentRoom?: string;
}

/**
 * WebRTC signaling messages for peer-to-peer connections
 */
export interface SignalingMessage {
  to: string; // Recipient user ID
  from?: string; // Sender user ID (auto-filled by server)
  type: 'offer' | 'answer' | 'candidate' | 'reject' | 'close' | 'busy';
  payload: unknown;
  roomId?: string;
  metadata?: {
    sdpType?: string;
    candidate?: unknown;
  };
}

/**
 * Error response structure for WebSocket errors
 */
export interface WsErrorResponse {
  status: 'error' | 'ws_error' | 'auth_error' | 'validation_error';
  timestamp: string;
  message: string | object;
  error: string;
  code?: string;
  details?: unknown;
}
