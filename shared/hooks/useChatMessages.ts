import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { z } from 'zod';
import { useEffect } from 'react';

export const ChatMessageSchema = z.object({
  id: z.string(),
  threadId: z.string(),
  sender: z.string(),
  content: z.string(),
  timestamp: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

const ChatMessageListSchema = z.array(ChatMessageSchema);

export const useChatMessages = (threadId: string) => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['chatMessages', threadId],
    queryFn: async () => {
      const res = await api.get(`/chat/threads/${threadId}/messages`);
      return ChatMessageListSchema.parse(res.data);
    },
    enabled: !!threadId,
  });

  useEffect(() => {
    if (!threadId) return;
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL + '/chat');
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.event === 'chat:message' && msg.data.threadId === threadId) {
        queryClient.invalidateQueries({ queryKey: ['chatMessages', threadId] });
      }
    };
    return () => ws.close();
  }, [threadId, queryClient]);

  return query;
}; 