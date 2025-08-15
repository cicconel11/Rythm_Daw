export type ActivityType =
  | 'FILE_UPLOAD' | 'FILE_DOWNLOAD' | 'FILE_SHARE' | 'FILE_TRANSFER'
  | 'MESSAGE_SENT' | 'MESSAGE_RECEIVED' | 'CHAT_SESSION'
  | 'FRIEND_REQUEST' | 'FRIEND_CONNECTED' | 'PROFILE_UPDATE'
  | 'PLUGIN_INSTALL' | 'PLUGIN_UNINSTALL' | 'SETTINGS_CHANGE'
  | 'LOGIN' | 'LOGOUT' | 'PROJECT_SHARE' | 'VERSION_UPDATE' | 'COMMENT';

export interface Activity {
  id: string;
  type: ActivityType;
  userId: string;
  actorId?: string;
  projectId?: string;
  createdAt: string;
  payload?: Record<string, unknown>;
}
