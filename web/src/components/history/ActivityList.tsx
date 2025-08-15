import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Activity } from '@/types/activity';
import { ActivityCard } from './ActivityCard';

export function ActivityList({ 
  items, 
  onLoadMore, 
  loadingMore 
}: {
  items: Activity[]; 
  onLoadMore: () => void; 
  loadingMore: boolean;
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const vr = useVirtualizer({
    count: items.length + 1,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 84,
    overscan: 10,
  });

  const vItems = vr.getVirtualItems();
  const last = vItems[vItems.length - 1];
  
  if (last?.index >= items.length - 1 && !loadingMore) {
    onLoadMore();
  }

  return (
    <div ref={parentRef} className="h-[70vh] overflow-auto rounded-2xl border">
      <div style={{ height: vr.getTotalSize(), position: 'relative' }}>
        {vItems.map(vi => {
          const a = items[vi.index];
          return (
            <div 
              key={vi.key} 
              className="absolute left-0 w-full" 
              style={{ transform: `translateY(${vi.start}px)` }}
            >
              {a ? (
                <ActivityCard activity={a}/>
              ) : (
                <div className="p-4 text-sm text-muted-foreground">Loading…</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
