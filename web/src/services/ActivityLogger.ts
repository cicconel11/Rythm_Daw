import { postActivity } from '@/api/activities';
import { ActivityType } from '@/types/activity';

export const ActivityLogger = {
  fileUpload: (userId: string, actorId: string, projectId: string | undefined, m: {
    fileName: string; size: number; s3Key: string; checksum?: string; targetUserId?: string;
  }) => postActivity({ type: 'FILE_UPLOAD', userId, actorId, projectId, payload: m }),

  fileDownload: (userId: string, actorId: string, projectId: string | undefined, m: {
    fileName: string; size?: number; s3Key?: string; sourceUserId?: string;
  }) => postActivity({ type: 'FILE_DOWNLOAD', userId, actorId, projectId, payload: m }),

  messageSent: (userId: string, actorId: string, projectId: string | undefined, m: {
    messageId: string; text: string; recipientId?: string; roomId?: string;
  }) => postActivity({ type: 'MESSAGE_SENT', userId, actorId, projectId, payload: m }),

  pluginInstall: (userId: string, actorId: string, pluginName: string) =>
    postActivity({ type: 'PLUGIN_INSTALL', userId, actorId, payload: { pluginName } }),
};
