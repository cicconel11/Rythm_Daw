import { useMutation } from '@tanstack/react-query';
import api from '../lib/api';
import { FileTransferSchema, PresignDto } from '../types';

export const useFileUpload = () => {
  return useMutation({
    mutationFn: async (dto: PresignDto & { file: File }) => {
      // 1. Get presigned URL
      const presign = await api.post('/files/presign', dto);
      // 2. Upload to S3
      await fetch(presign.uploadUrl, { method: 'PUT', body: dto.file });
      // 3. Emit WS init_transfer
      const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL + '/file-transfer');
      ws.onopen = () => {
        ws.send(JSON.stringify({ event: 'init_transfer', data: { ...dto, fileName: dto.file.name, size: dto.file.size, mimeType: dto.file.type, toUserId: dto.toUserId } }));
        ws.close();
      };
      return FileTransferSchema.parse(presign);
    },
  });
};
