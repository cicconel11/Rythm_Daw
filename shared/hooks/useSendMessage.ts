import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { ChatMessageSchema } from './useChatMessages';

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ threadId, content }: { threadId: string; content: string }) => {
      const res = await api.post(`/chat/threads/${threadId}/messages`, { content });
      return ChatMessageSchema.parse(res.data);
    },
    onMutate: async ({ threadId, content }) => {
      await queryClient.cancelQueries({ queryKey: ['chatMessages', threadId] });
      const previous = queryClient.getQueryData(['chatMessages', threadId]);
      queryClient.setQueryData(['chatMessages', threadId], (old = []) => [
        ...old,
        {
          id: 'optimistic-' + Math.random(),
          threadId,
          sender: 'me',
          content,
          timestamp: new Date().toISOString(),
        },
      ]);
      return { previous };
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(['chatMessages', vars.threadId], context?.previous);
    },
    onSettled: (data, error, vars) => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages', vars.threadId] });
    },
  });
}; 