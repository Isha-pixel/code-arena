// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import api from '../services/apiClient';

type User = {
  id: number;
  username: string;
  email?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
};

const readUser = (): User | null => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

export default function useAuth() {
  const [access, setAccess] = useState<string | null>(localStorage.getItem('access'));
  const [user, setUserState] = useState<User | null>(readUser());

  const authed = !!access;
  const isAdmin = !!(user?.is_staff || user?.is_superuser);

  // Keep axios auth header in sync
  useEffect(() => {
    if (access) {
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [access]);

  // Sync across tabs/windows
  useEffect(() => {
    const onStorage = () => {
      setAccess(localStorage.getItem('access'));
      setUserState(readUser());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = (newAccess: string, refresh?: string, userObj?: User) => {
    localStorage.setItem('access', newAccess);
    if (refresh) localStorage.setItem('refresh', refresh);
    setAccess(newAccess);
    api.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;

    if (userObj) {
      localStorage.setItem('user', JSON.stringify(userObj));
      setUserState(userObj);
    }
  };

  const setUser = (u: User | null) => {
    if (u) localStorage.setItem('user', JSON.stringify(u));
    else localStorage.removeItem('user');
    setUserState(u);
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    setAccess(null);
    setUserState(null);
    delete api.defaults.headers.common['Authorization'];
  };

  return { authed, user, isAdmin, login, setUser, logout };
}
