import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { Friend } from './useFriends';

const FileItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number(),
  type: z.string(),
  lastModified: z.number()
});

const FriendSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().optional(),
  isOnline: z.boolean().optional()
});

const FileTransferSchema = z.object({
  id: z.string(),
  file: FileItemSchema,
  fromUser: FriendSchema.optional(),
  toUser: FriendSchema.optional(),
  status: z.enum(['pending', 'uploading', 'sent', 'received', 'failed', 'declined']),
  progress: z.number(),
  timestamp: z.string().transform(s => new Date(s)),
  direction: z.enum(['sent', 'received'])
});
export type FileTransfer = z.infer<typeof FileTransferSchema>;

export function useTransfers() {
  return useQuery({
    queryKey: ['file-transfers'],
    queryFn: async () => {
      const res = await fetch('/api/files/transfers', { credentials: 'include' });
      const data = await res.json();
      return z.array(FileTransferSchema).parse(data);
    },
    staleTime: 10_000
  });
} 