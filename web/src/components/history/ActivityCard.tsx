import { useState } from 'react';
import { Activity, ActivityType } from '@/types/activity';

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case 'FILE_UPLOAD':
    case 'FILE_DOWNLOAD':
    case 'FILE_SHARE':
    case 'FILE_TRANSFER':
      return '📁';
    case 'MESSAGE_SENT':
    case 'MESSAGE_RECEIVED':
    case 'CHAT_SESSION':
      return '💬';
    case 'FRIEND_REQUEST':
    case 'FRIEND_CONNECTED':
      return '👥';
    case 'PROFILE_UPDATE':
      return '👤';
    case 'PLUGIN_INSTALL':
    case 'PLUGIN_UNINSTALL':
      return '🔌';
    case 'SETTINGS_CHANGE':
      return '⚙️';
    case 'LOGIN':
    case 'LOGOUT':
      return '🔐';
    case 'PROJECT_SHARE':
      return '📂';
    case 'VERSION_UPDATE':
      return '🔄';
    case 'COMMENT':
      return '💭';
    default:
      return '📝';
  }
};

const getActivityTitle = (type: ActivityType, payload?: Record<string, unknown>) => {
  switch (type) {
    case 'FILE_UPLOAD':
      return `Uploaded ${payload?.fileName || 'file'}`;
    case 'FILE_DOWNLOAD':
      return `Downloaded ${payload?.fileName || 'file'}`;
    case 'FILE_SHARE':
      return `Shared ${payload?.fileName || 'file'}`;
    case 'FILE_TRANSFER':
      return `Transferred ${payload?.fileName || 'file'}`;
    case 'MESSAGE_SENT':
      return 'Sent message';
    case 'MESSAGE_RECEIVED':
      return 'Received message';
    case 'CHAT_SESSION':
      return 'Chat session';
    case 'FRIEND_REQUEST':
      return 'Friend request';
    case 'FRIEND_CONNECTED':
      return 'Friend connected';
    case 'PROFILE_UPDATE':
      return 'Profile updated';
    case 'PLUGIN_INSTALL':
      return `Installed ${payload?.pluginName || 'plugin'}`;
    case 'PLUGIN_UNINSTALL':
      return `Uninstalled ${payload?.pluginName || 'plugin'}`;
    case 'SETTINGS_CHANGE':
      return 'Settings changed';
    case 'LOGIN':
      return 'Logged in';
    case 'LOGOUT':
      return 'Logged out';
    case 'PROJECT_SHARE':
      return 'Project shared';
    case 'VERSION_UPDATE':
      return 'Version updated';
    case 'COMMENT':
      return 'Comment added';
    default:
      return type.replace(/_/g, ' ').toLowerCase();
  }
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-4 border-b hover:bg-gray-50 transition-colors">
      <div className="flex items-start gap-3">
        <div className="text-2xl">{getActivityIcon(activity.type)}</div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 truncate">
              {getActivityTitle(activity.type, activity.payload)}
            </h3>
            <span className="text-sm text-gray-500 whitespace-nowrap ml-2">
              {formatTimeAgo(activity.createdAt)}
            </span>
          </div>
          
          {activity.actorId && (
            <p className="text-sm text-gray-600 mt-1">
              Actor: {activity.actorId}
            </p>
          )}
          
          {activity.projectId && (
            <p className="text-sm text-gray-600">
              Project: {activity.projectId}
            </p>
          )}
          
          {activity.payload && Object.keys(activity.payload).length > 0 && (
            <div className="mt-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {expanded ? 'Hide details' : 'Show details'}
              </button>
              
              {expanded && (
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(activity.payload, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
