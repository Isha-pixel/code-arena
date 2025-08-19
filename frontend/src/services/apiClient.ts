// // // src/services/apiClient.ts
// // import axios from 'axios';

// // const apiClient = axios.create({
// //   baseURL: 'http://your-ec2-ip/api',
// // });

// // apiClient.interceptors.request.use(config => {
// //   const token = localStorage.getItem('accessToken');
// //   if (token) {
// //     config.headers.Authorization = `Bearer ${token}`;
// //   }
// //   return config;
// // });

// // // Add interceptor for token refresh logic here...

// // import axios from "axios";

// // const api = axios.create({
// //   baseURL: "http://127.0.0.1:8000", // or use import.meta.env.VITE_API_BASE_URL
// //   withCredentials: false,
// // });

// // export default api;


// // // attach token on every request
// // api.interceptors.request.use((config) => {
// //   const token = localStorage.getItem('access'); // saved at login
// //   if (token) config.headers.Authorization = `Bearer ${token}`;
// //   return config;
// // });

// // // optional: auto-refresh on 401
// // api.interceptors.response.use(
// //   (res) => res,
// //   async (error) => {
// //     const original = error.config;
// //     if (error.response?.status === 401 && !original._retry) {
// //       original._retry = true;
// //       const refresh = localStorage.getItem('refresh');
// //       if (refresh) {
// //         const r = await axios.post('http://127.0.0.1:8000/api/token/refresh/', { refresh });
// //         localStorage.setItem('access', r.data.access);
// //         original.headers.Authorization = `Bearer ${r.data.access}`;
// //         return api(original);
// //       }
// //     }
// //     throw error;
// //   }
// // );

// // export default api;

// // // simple helpers
// // export async function login(username: string, password: string) {
// //   const r = await axios.post('http://127.0.0.1:8000/api/token/', { username, password });
// //   localStorage.setItem('access', r.data.access);
// //   localStorage.setItem('refresh', r.data.refresh);
// //   return r.data;
// // }
// // export function logout() {
// //   localStorage.removeItem('access');
// //   localStorage.removeItem('refresh');
// // }

// // // src/services/apiClient.ts
// // import axios, { AxiosError } from "axios";

// // const API_ROOT = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

// // const api = axios.create({
// //   baseURL: API_ROOT,           // <-- keep root; call /api/... in your requests
// //   withCredentials: false,
// //   timeout: 15000,
// // });

// // // Attach access token on every request
// // api.interceptors.request.use((config) => {
// //   const token = localStorage.getItem("access");
// //   if (token) {
// //     if (!config.headers) config.headers = {};
// //     (config.headers as any).Authorization = `Bearer ${token}`;
// //   }
// //   return config;
// // });

// // // Auto-refresh on 401
// // let refreshing = false;
// // let waiters: Array<(t: string) => void> = [];

// // api.interceptors.response.use(
// //   (res) => res,
// //   async (error: AxiosError) => {
// //     const status = error.response?.status;
// //     const original: any = error.config;

// //     if (status === 401 && !original?._retry) {
// //       original._retry = true;
// //       const refresh = localStorage.getItem("refresh");
// //       if (!refresh) throw error;

// //       // If a refresh call is already in-flight, wait for it
// //       if (refreshing) {
// //         const newToken = await new Promise<string>((resolve) => waiters.push(resolve));
// //         if (!original.headers) original.headers = {};
// //         original.headers.Authorization = `Bearer ${newToken}`;
// //         return api(original);
// //       }

// //       refreshing = true;
// //       try {
// //         const r = await axios.post(`${API_ROOT}/api/token/refresh/`, { refresh });
// //         const newToken = r.data.access as string;
// //         localStorage.setItem("access", newToken);
// //         // release queued requests
// //         waiters.forEach((fn) => fn(newToken));
// //         waiters = [];
// //         if (!original.headers) original.headers = {};
// //         original.headers.Authorization = `Bearer ${newToken}`;
// //         return api(original);
// //       } catch (e) {
// //         localStorage.removeItem("access");
// //         localStorage.removeItem("refresh");
// //         throw e;
// //       } finally {
// //         refreshing = false;
// //       }
// //     }

// //     throw error;
// //   }
// // );

// // export default api;

// // // ---- helpers (named exports) ----
// // export async function login(username: string, password: string) {
// //   const r = await axios.post(`${API_ROOT}/api/token/`, { username, password });
// //   localStorage.setItem("access", r.data.access);
// //   localStorage.setItem("refresh", r.data.refresh);
// //   return r.data;
// // }

// // export function logout() {
// //   localStorage.removeItem("access");
// //   localStorage.removeItem("refresh");
// // }




// // src/services/apiClient.ts
// import axios from 'axios';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api",
// });



// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('access');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });



// api.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const original: any = error.config;
//     if (error.response?.status === 401 && !original._retry) {
//       original._retry = true;
//       const refresh = localStorage.getItem('refresh');
//       if (refresh) {
//         const r = await axios.post('http://127.0.0.1:8000/api/token/refresh/', { refresh });
//         localStorage.setItem('access', r.data.access);
//         original.headers.Authorization = `Bearer ${r.data.access}`;
//         return api(original);
//       }
//     }
//     throw error;
//   }
// );

// export default api;

// // Optional helpers:
// export async function login(username: string, password: string) {
//   const r = await axios.post('http://127.0.0.1:8000/api/token/', { username, password });
//   localStorage.setItem('access', r.data.access);
//   localStorage.setItem('refresh', r.data.refresh);
//   return r.data;
// }
// export function logout() {
//   localStorage.removeItem('access');
//   localStorage.removeItem('refresh');
// }









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
