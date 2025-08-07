import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";
import { FileTransferSchema } from "../types";

interface PresignDto {
  filename: string;
  filetype: string;
  filesize: number;
  path: string;
  toUserId?: string;
}

interface PresignResponse {
  uploadUrl: string;
  fileId: string;
  path: string;
}

export const useFileUpload = () => {
  return useMutation({
    mutationFn: async (dto: PresignDto & { file: File }) => {
      // 1. Get presigned URL
      const { data: presign } = await api.post<PresignResponse>("/files/presign", dto);
      // 2. Upload to S3
      await fetch(presign.uploadUrl, { method: "PUT", body: dto.file });
      // 3. Emit WS init_transfer
      const ws = new WebSocket(
        process.env.NEXT_PUBLIC_WS_URL + "/file-transfer",
      );
      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            event: "init_transfer",
            data: {
              ...dto,
              fileName: dto.filename,
              size: dto.filesize,
              mimeType: dto.filetype,
              toUserId: dto.toUserId,
            },
          }),
        );
        ws.close();
      };
      return FileTransferSchema.parse({
        ...presign,
        status: 'completed',
        progress: 100,
        timestamp: new Date().toISOString()
      });
    },
  });
};
