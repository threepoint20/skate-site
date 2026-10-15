'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import {
  User,
  getCurrentUser,
  authenticateUser,
  logout as apiLogout,
  createGuestUser,
  isAdmin as checkIsAdmin,
  isGuest as checkIsGuest,
  hasPermission as checkPermission,
} from '../lib/auth';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isGuest: boolean;
  hasPermission: (action: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// 全站共用的登入狀態：在 layout 中包住所有頁面，登入/登出後所有元件會同步更新
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getCurrentUser()
      .then(currentUser => {
        if (!cancelled) setUser(currentUser || createGuestUser());
      })
      .catch(() => {
        if (!cancelled) setUser(createGuestUser());
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // 登入失敗時會丟出錯誤（含伺服器回傳的訊息，例如嘗試次數過多），由呼叫端顯示
  const login = useCallback(async (username: string, password: string) => {
    const authenticatedUser = await authenticateUser(username, password);
    if (authenticatedUser) {
      setUser(authenticatedUser);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      setUser(createGuestUser());
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    login,
    logout,
    isAdmin: checkIsAdmin(user),
    isGuest: checkIsGuest(user),
    hasPermission: (action: string) => checkPermission(user, action),
  }), [user, loading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within <AuthProvider>');
  }
  return context;
}
