import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/lib/api";
import { FriendRequestSchema } from '@shared/types';

export const useFriendRequests = () =>
  useQuery({
    queryKey: ["friend-requests"],
    queryFn: async () => {
      const res = await api.get("/friends/requests");
      return FriendRequestSchema.array().parse(res.data);
    },
    staleTime: 1000 * 30, // 30 s cache
  });

export const useAcceptRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/friends/${id}/accept`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["friend-requests"] }),
  });
};
