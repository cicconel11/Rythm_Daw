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
      const res = await api.post<FileTransfer>(`/files/${id}/accept`, dto);
      return FileTransferSchema.parse(res.data);
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
      const res = await api.post<FileTransfer>(`/files/${id}/decline`, dto);
      return FileTransferSchema.parse(res.data);
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
      const response = await api.get<{ downloadUrl: string }>(
        `/files/${id}/download`,
      );
      if (response.data?.downloadUrl) {
        window.open(response.data.downloadUrl, "_blank");
      }
    },
  });

  return { accept, decline, download };
};
