//frontend/services/apiClients.ts
import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api';

// raw client with NO auth header (used for /token and /token/refresh)
export const raw = axios.create({ baseURL: BASE });

// main client that will auto-attach JWTs
const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original: any = error.config || {};
    if (error.response?.status === 401 && !original._retry) {
      const refresh = localStorage.getItem('refresh');
      if (!refresh) throw error;
      original._retry = true;
      try {
        // refresh without sending the (expired) access token
        const { data } = await raw.post('/token/refresh/', { refresh });
        localStorage.setItem('access', data.access);
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        // purge tokens on refresh failure
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        throw error;
      }
    }
    throw error;
  }
);

export default api;

// Optional helpers
export async function login(username: string, password: string) {
  const { data } = await raw.post('/token/', { username, password });
  localStorage.setItem('access', data.access);
  localStorage.setItem('refresh', data.refresh);
  return data;
}

export function logout() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
}
