import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

export const useTransferActions = () => {
  const queryClient = useQueryClient();

  const accept = useMutation({
    mutationFn: ({ id, dto }) => api.post(`/files/${id}/accept`, dto),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries(["transfers"]);
      const previous = queryClient.getQueryData(["transfers"]);
      queryClient.setQueryData(["transfers"], (old) =>
        old.map((t) => (t.id === id ? { ...t, status: "accepted" } : t)),
      );
      return { previous };
    },
    onError: (err, vars, context) =>
      queryClient.setQueryData(["transfers"], context.previous),
    onSettled: () => queryClient.invalidateQueries(["transfers"]),
  });

  const decline = useMutation({
    mutationFn: ({ id, dto }) => api.post(`/files/${id}/decline`, dto),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries(["transfers"]);
      const previous = queryClient.getQueryData(["transfers"]);
      queryClient.setQueryData(["transfers"], (old) =>
        old.map((t) => (t.id === id ? { ...t, status: "declined" } : t)),
      );
      return { previous };
    },
    onError: (err, vars, context) =>
      queryClient.setQueryData(["transfers"], context.previous),
    onSettled: () => queryClient.invalidateQueries(["transfers"]),
  });

  const download = useMutation({
    mutationFn: (id) => api.get(`/files/${id}/download`),
  });

  return { accept, decline, download };
};
