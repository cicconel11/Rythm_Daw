import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

/* ---------- shared DTO ---------- */
export type FriendRequest = {
  id: string;
  name: string;
  status?: string;
  reason?: string;
  plugins: string[];
};

/* ---------- queries ------------- */
export const useFriendRequests = () =>
  useQuery({
    queryKey: ['friend-requests'],
    queryFn : async () => (await api.get<FriendRequest[]>('/friends/requests')).data,
    staleTime: 1000 * 30,           // 30 s cache
  });

/* ---------- mutations ----------- */
export const useAcceptRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn : (id: string) => api.post(`/friends/${id}/accept`),
    onSuccess  : () => qc.invalidateQueries({ queryKey: ['friend-requests'] }),
  });
}; 