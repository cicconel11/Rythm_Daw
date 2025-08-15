import { Activity, ActivityType } from '@/types/activity';

export interface ListResponse { 
  items: Activity[]; 
  nextCursor: string | null; 
}

export async function fetchActivities(params: {
  cursor?: string; 
  take?: number; 
  types?: ActivityType[];
  userId?: string; 
  actorId?: string; 
  projectId?: string;
  start?: string; 
  end?: string; 
  q?: string;
}): Promise<ListResponse> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v == null) return;
    if (Array.isArray(v)) v.forEach(x => qs.append(k, String(x)));
    else qs.set(k, String(v));
  });
  const r = await fetch(`/api/activities?${qs.toString()}`, { credentials: 'include' });
  if (!r.ok) throw new Error('Failed to fetch activities');
  return r.json();
}

export async function postActivity(data: {
  type: ActivityType; 
  userId: string; 
  actorId?: string; 
  projectId?: string; 
  payload?: Record<string, unknown>;
}) {
  const r = await fetch('/api/activities', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error('Failed to create activity');
  return r.json();
}
