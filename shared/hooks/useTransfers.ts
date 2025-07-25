import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FileTransferSchema } from "../types";
import { DownloadUrlSchema } from "../types";
import api from "../lib/api";
import { useEffect } from "react";

export const useTransfers = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["transfers"],
    queryFn: async () => {
      const data = await api.get("/files/transfers");
      return data.map((item: unknown) => FileTransferSchema.parse(item));
    },
  });

  // Subscribe to WS transfer_status events
  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL + "/file-transfer");
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.event === "transfer_status") {
        queryClient.invalidateQueries(["transfers"]);
      }
    };
    return () => ws.close();
  }, [queryClient]);

  // Download URL helper
  const downloadUrl = async (fileId: string) => {
    const res = await api.get(`/files/${fileId}/download`);
    return DownloadUrlSchema.parse(res.data).url;
  };

  return { ...query, downloadUrl };
};
