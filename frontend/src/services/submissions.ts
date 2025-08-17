// src/services/submissions.ts
import api from './apiClient';

export type Submission = {
  id: number;
  problem: string;        // title (from your serializer)
  user: string;
  language: string;
  verdict: string;        // 'Accepted', 'Wrong Answer', etc.
  execution_time?: number;
  submitted_at: string;
};

export async function fetchMySubmissions(): Promise<Submission[]> {
  const username = localStorage.getItem('username') || localStorage.getItem('oj:username') || '';

  // try common endpoints – whichever works in your backend
  const candidates = ['/submissions/mine/', '/submissions/?mine=1', '/submissions/'];
  for (const path of candidates) {
    try {
      const { data } = await api.get(path);
      const list: Submission[] = Array.isArray(data) ? data : (data?.results ?? []);
      if (!Array.isArray(list)) continue;
      // last fallback: filter on client if we got all submissions
      return path === '/submissions/' && username
        ? list.filter(s => (s.user?.toLowerCase?.() || '') === username.toLowerCase())
        : list;
    } catch {
      // try next
    }
  }
  return [];
}
