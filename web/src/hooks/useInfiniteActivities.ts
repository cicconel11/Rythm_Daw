import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchActivities } from '@/api/activities';
import { useHistoryStore } from './useHistoryStore';

export function useInfiniteActivities(userId: string) {
  const { filters } = useHistoryStore();
  
  return useInfiniteQuery({
    queryKey: ['activities', userId, filters],
    queryFn: ({ pageParam }) =>
      fetchActivities({
        cursor: pageParam as string | undefined,
        take: 40,
        types: filters.types.length ? filters.types : undefined,
        userId: filters.user ?? userId,
        actorId: filters.actor,
        projectId: filters.projectId,
        start: filters.dateRange.start?.toISOString(),
        end: filters.dateRange.end?.toISOString(),
        q: filters.q,
      }),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    staleTime: 10_000,
    refetchInterval: 30_000,
  });
}
