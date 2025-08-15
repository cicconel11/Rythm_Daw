import { useEffect } from 'react';
import { getSocket } from '@/lib/ws';
import { useHistoryStore } from './useHistoryStore';
import { Activity } from '@/types/activity';

export function useActivitySocket(enable = true) {
  const prepend = useHistoryStore((s) => s.prepend);
  
  useEffect(() => {
    if (!enable) return;
    
    const s = getSocket();
    const onNew = (a: Activity) => prepend(a);
    s.on('activity:new', onNew);
    
    return () => { 
      s.off('activity:new', onNew); 
    };
  }, [enable, prepend]);
}
