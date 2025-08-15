import { useMemo } from 'react';
import { useInfiniteActivities } from '@/hooks/useInfiniteActivities';
import { useHistoryStore } from '@/hooks/useHistoryStore';
import { useActivitySocket } from '@/hooks/useActivitySocket';
import { ActivityList } from '@/components/history/ActivityList';
import { HistoryFilters } from '@/components/history/HistoryFilters';
import { ExportMenu } from '@/components/history/ExportMenu';

export default function HistoryPage() {
  // TODO: Get userId from auth/session - for now using a placeholder
  const userId = 'current-user-id';
  
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteActivities(userId);
  useActivitySocket(true);

  const hot = useHistoryStore((s) => s.activities);
  const serverItems = useMemo(() => data?.pages.flatMap(p => p.items) ?? [], [data]);
  
  const items = useMemo(
    () => [...hot, ...serverItems].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [hot, serverItems]
  );

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Activity History</h1>
        <ExportMenu items={items} />
      </div>
      
      <HistoryFilters />
      
      <ActivityList
        items={items}
        onLoadMore={() => hasNextPage && fetchNextPage()}
        loadingMore={isFetchingNextPage}
      />
      
      {isFetchingNextPage && (
        <div className="text-center py-4 text-gray-600">
          Loading more activities...
        </div>
      )}
      
      {!hasNextPage && items.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          No more activities to load
        </div>
      )}
      
      {items.length === 0 && !data?.pages[0]?.items.length && (
        <div className="text-center py-8 text-gray-500">
          No activities found. Try adjusting your filters or create some activities.
        </div>
      )}
    </div>
  );
}
