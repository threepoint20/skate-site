// 進階權限管理系統 - 使用 JWT 認證
import React from 'react';

export type UserRole = 'guest' | 'administrator';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  loginTime?: string;
}

// 檢查是否為管理員
export function isAdmin(user: User | null): boolean {
  return user?.role === 'administrator';
}

// 檢查是否為訪客
export function isGuest(user: User | null): boolean {
  return user?.role === 'guest' || user === null;
}

// 獲取當前用戶 (從 API 驗證)
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch('/api/auth/verify', {
      credentials: 'include', // 包含 cookies
    });

    if (response.ok) {
      const data = await response.json();
      return data.user;
    }
  } catch (error) {
    console.error('Error verifying user:', error);
  }
  
  return null;
}

// 登入驗證 (使用 API)
export async function authenticateUser(username: string, password: string): Promise<User | null> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.user;
    } else {
      const error = await response.json();
      throw new Error(error.error || '登入失敗');
    }
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

// 登出 (使用 API)
export async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// 創建訪客用戶
export function createGuestUser(): User {
  return {
    id: `guest-${Date.now()}`,
    username: 'Guest',
    role: 'guest',
    loginTime: new Date().toISOString()
  };
}

// 權限檢查函數
export function hasPermission(user: User | null, action: string): boolean {
  if (!user) return false;
  
  switch (action) {
    case 'read_posts':
      return true; // 所有用戶都可以閱讀文章
    
    case 'create_posts':
    case 'edit_posts':
    case 'delete_posts':
    case 'manage_posts':
      return isAdmin(user); // 只有管理員可以管理文章
    
    case 'access_admin':
      return isAdmin(user); // 只有管理員可以訪問管理功能
    
    default:
      return false;
  }
}

// 權限中間件 Hook
export function useAuth() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser || createGuestUser());
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(createGuestUser());
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const authenticatedUser = await authenticateUser(username, password);
      if (authenticatedUser) {
        setUser(authenticatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
      setUser(createGuestUser());
    } catch (error) {
      console.error('Logout failed:', error);
      // 即使 API 失敗，也要清除本地狀態
      setUser(createGuestUser());
    }
  };

  return {
    user,
    loading,
    login,
    logout: logoutUser,
    isAdmin: isAdmin(user),
    isGuest: isGuest(user),
    hasPermission: (action: string) => hasPermission(user, action)
  };
}