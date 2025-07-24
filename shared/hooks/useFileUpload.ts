import { useMutation } from "@tanstack/react-query";
import { PresignDto } from "../types"; // assuming in types
import api from "../lib/api";

export const useFileUpload = () => {
  return useMutation({
    mutationFn: async (dto: PresignDto & { file: File }) => {
      const { uploadUrl } = await api.post("/files/presign", dto);
      await fetch(uploadUrl, { method: "PUT", body: dto.file });
      return { status: "uploaded" };
    },
  });
};
