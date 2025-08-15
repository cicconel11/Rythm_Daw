import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { FileTransfer, FileTransferSchema, FileTransferStatus } from "../types";

interface TransferActionDTO {
  id: string;
  dto?: Record<string, unknown>;
}

interface PreviousTransfers {
  previous: FileTransfer[] | undefined;
}

export const useTransferActions = () => {
  const queryClient = useQueryClient();

  const accept = useMutation<
    FileTransfer,
    Error,
    TransferActionDTO,
    PreviousTransfers
  >({
    mutationFn: async ({ id, dto }) => {
      const ws = new WebSocket(
        (process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000") + "/file-transfer",
      );
      
      return new Promise<FileTransfer>((resolve, reject) => {
        ws.onopen = () => {
          ws.send(JSON.stringify({
            event: "accept_transfer",
            data: { transferId: id },
          }));
        };
        
        ws.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.event === "transfer-status" && msg.status === "accepted") {
            ws.close();
            // Return a mock transfer object since we don't get the full transfer back
            resolve(FileTransferSchema.parse({
              id,
              file: { id, name: "", size: 0, type: "", lastModified: Date.now() },
              status: "accepted",
              progress: 100,
              timestamp: new Date().toISOString(),
              direction: "received",
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
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["transfers"] });
      const previous = queryClient.getQueryData<FileTransfer[]>(["transfers"]);

      queryClient.setQueryData<FileTransfer[]>(["transfers"], (old) =>
        (old || []).map((t) =>
          t.id === id ? { ...t, status: "accepted" as FileTransferStatus } : t,
        ),
      );

      return { previous };
    },
    onError: (err, vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["transfers"], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["transfers"] }),
  });

  const decline = useMutation<
    FileTransfer,
    Error,
    TransferActionDTO,
    PreviousTransfers
  >({
    mutationFn: async ({ id, dto }) => {
      const ws = new WebSocket(
        (process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000") + "/file-transfer",
      );
      
      return new Promise<FileTransfer>((resolve, reject) => {
        ws.onopen = () => {
          ws.send(JSON.stringify({
            event: "decline_transfer",
            data: { transferId: id },
          }));
        };
        
        ws.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.event === "transfer-status" && msg.status === "declined") {
            ws.close();
            // Return a mock transfer object since we don't get the full transfer back
            resolve(FileTransferSchema.parse({
              id,
              file: { id, name: "", size: 0, type: "", lastModified: Date.now() },
              status: "declined",
              progress: 0,
              timestamp: new Date().toISOString(),
              direction: "received",
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
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["transfers"] });
      const previous = queryClient.getQueryData<FileTransfer[]>(["transfers"]);

      queryClient.setQueryData<FileTransfer[]>(["transfers"], (old) =>
        (old || []).map((t) =>
          t.id === id ? { ...t, status: "declined" as FileTransferStatus } : t,
        ),
      );

      return { previous };
    },
    onError: (err, vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["transfers"], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["transfers"] }),
  });

  const download = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.get<{ url: string }>(
        `/files/${id}/download`,
      );
      if (response.data?.url) {
        window.open(response.data.url, "_blank");
      }
    },
  });

  return { accept, decline, download };
};
