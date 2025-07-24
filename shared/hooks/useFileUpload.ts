import { useMutation } from '@tanstack/react-query';
import { useFileTransferWS } from './useFileTransferWS';

export function useFileUpload() {
  const ws = useFileTransferWS();

  return useMutation(async ({ file, toUserId }: { file: File; toUserId: string }) => {
    // 1. Presign
    const presignRes = await fetch('/api/files/presign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: file.name, size: file.size, type: file.type }),
    });
    const { uploadUrl, fileKey } = await presignRes.json();

    // 2. Upload to S3
    await fetch(uploadUrl, { method: 'PUT', body: file });

    // 3. Notify via WS
    ws.send({
      event: 'init-transfer',
      data: { fileKey, toUserId, meta: { name: file.name, size: file.size, type: file.type } }
    });

    // 4. Optimistic UI update (handled by React Query cache)
    return { fileKey, status: 'pending' };
  });
} 