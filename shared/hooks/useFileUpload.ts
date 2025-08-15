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
    mutationFn: async (dto: PresignDto & { file: File; toUserId: string }) => {
      // 1. Get presigned URL
      const { data: presign } = await api.post<PresignResponse>("/files/presign", {
        name: dto.filename,
        mime: dto.filetype,
        size: dto.filesize,
      });
      
      // 2. Upload to S3
      await fetch(presign.uploadUrl, { method: "PUT", body: dto.file });
      
      // 3. Emit WS init_transfer
      const ws = new WebSocket(
        (process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000") + "/file-transfer",
      );
      
      return new Promise((resolve, reject) => {
        ws.onopen = () => {
          ws.send(
            JSON.stringify({
              event: "init_transfer",
              data: {
                fileName: dto.filename,
                size: dto.filesize,
                mimeType: dto.filetype,
                toUserId: dto.toUserId,
              },
            }),
          );
        };
        
        ws.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.event === "transfer-initiated") {
            ws.close();
            resolve(FileTransferSchema.parse({
              id: msg.transferId,
              file: {
                id: msg.transferId,
                name: dto.filename,
                size: dto.filesize,
                type: dto.filetype,
                lastModified: Date.now(),
              },
              status: 'uploading',
              progress: 0,
              timestamp: new Date().toISOString(),
              direction: 'sent',
            }));
          } else if (msg.event === "transfer-error") {
            ws.close();
            reject(new Error(msg.data.message));
          }
        };
        
        ws.onerror = (error) => {
          ws.close();
          reject(error);
        };
      });
    },
  });
};
