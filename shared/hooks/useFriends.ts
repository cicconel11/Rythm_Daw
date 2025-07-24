import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

const FriendSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().optional(),
  isOnline: z.boolean().optional()
});
export type Friend = z.infer<typeof FriendSchema>;

export function useFriends() {
  return useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const res = await fetch('/api/friends', { credentials: 'include' });
      const data = await res.json();
      return z.array(FriendSchema).parse(data);
    },
    staleTime: 60_000
  });
} 