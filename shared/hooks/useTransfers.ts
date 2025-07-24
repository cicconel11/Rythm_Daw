import { useQuery } from "@tanstack/react-query";
import { FileTransferSchema } from "../types";
import api from "../lib/api";

export const useTransfers = () => {
  return useQuery({
    queryKey: ["transfers"],
    queryFn: async () => {
      const data = await api.get("/files/transfers");
      return data.map((item) => FileTransferSchema.parse(item));
    },
  });
};
