import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { FileTransferSchema } from '../types';

export const useTransferActions = () => {
  const queryClient = useQueryClient();

  const accept = useMutation({
    mutationFn: async ({ id, dto }) => {
      const res = await api.post(`/files/${id}/accept`, dto);
      return FileTransferSchema.parse(res);
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries(['transfers']);
      const previous = queryClient.getQueryData(['transfers']);
      queryClient.setQueryData(['transfers'], (old = []) => old.map(t => t.id === id ? { ...t, status: 'accepted' } : t));
      return { previous };
    },
    onError: (err, vars, context) => queryClient.setQueryData(['transfers'], context.previous),
    onSettled: () => queryClient.invalidateQueries(['transfers']),
  });

  const decline = useMutation({
    mutationFn: async ({ id, dto }) => {
      const res = await api.post(`/files/${id}/decline`, dto);
      return FileTransferSchema.parse(res);
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries(['transfers']);
      const previous = queryClient.getQueryData(['transfers']);
      queryClient.setQueryData(['transfers'], (old = []) => old.map(t => t.id === id ? { ...t, status: 'declined' } : t));
      return { previous };
    },
    onError: (err, vars, context) => queryClient.setQueryData(['transfers'], context.previous),
    onSettled: () => queryClient.invalidateQueries(['transfers']),
  });

  const download = useMutation({
    mutationFn: async (id) => {
      const { downloadUrl } = await api.get(`/files/${id}/download`);
      window.open(downloadUrl, '_blank');
    },
  });

  return { accept, decline, download };
};
