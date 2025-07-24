import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api.js';
import { ChatThreadListSchema } from '../types/index.js';
import { useEffect } from 'react';

export const useChatThreads = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['chatThreads'],
    queryFn: async () => {
      const res = await api.get('/chat/threads');
      return ChatThreadListSchema.parse(res.data);
    },
  });

  // Subscribe to WS chat:message and presence events
  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL + '/chat');
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.event === 'chat:message' || msg.event === 'presence:update') {
        queryClient.invalidateQueries({ queryKey: ['chatThreads'] });
      }
    };
    return () => ws.close();
  }, [queryClient]);

  return query;
}; 