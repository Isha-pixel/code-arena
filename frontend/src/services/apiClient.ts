// frontend/src/services/apiClients.ts
import axios from 'axios';

// DEV: use Vite proxy (/api). PROD: require VITE_API_BASE.
const BASE = import.meta.env.DEV
  ? '/api'
  : (import.meta.env.VITE_API_BASE as string);

if (!import.meta.env.DEV && !import.meta.env.VITE_API_BASE) {
  // fail fast in prod builds if you forgot to set the env on Vercel
  console.error('VITE_API_BASE is missing in production!');
}

export const raw = axios.create({ baseURL: BASE });

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
        const { data } = await raw.post('/token/refresh/', { refresh });
        localStorage.setItem('access', data.access);
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        throw error;
      }
    }
    throw error;
  }
);

export default api;

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
