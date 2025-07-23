const BASE = process.env.NEXT_PUBLIC_API_URL!;
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { credentials: 'include', ...init });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
} 