// 權限管理系統

export type UserRole = 'guest' | 'administrator';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  loginTime?: string;
}

// 預設管理員帳號 (實際應用中應該使用更安全的方式)
const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123', // 實際應用中應該使用加密密碼
  role: 'administrator' as UserRole
};

// 檢查是否為管理員
export function isAdmin(user: User | null): boolean {
  return user?.role === 'administrator';
}

// 檢查是否為訪客
export function isGuest(user: User | null): boolean {
  return user?.role === 'guest' || user === null;
}

// 獲取當前用戶 (從 localStorage)
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      return JSON.parse(userData);
    }
  } catch (error) {
    console.error('Error loading user data:', error);
  }
  
  return null;
}

// 儲存當前用戶
export function setCurrentUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  
  try {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}

// 登入驗證
export function authenticateUser(username: string, password: string): User | null {
  // 檢查管理員帳號
  if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
    const user: User = {
      id: 'admin-001',
      username: DEFAULT_ADMIN.username,
      role: DEFAULT_ADMIN.role,
      loginTime: new Date().toISOString()
    };
    
    setCurrentUser(user);
    return user;
  }
  
  return null;
}

// 登出
export function logout(): void {
  setCurrentUser(null);
}

// 創建訪客用戶
export function createGuestUser(): User {
  const guestUser: User = {
    id: `guest-${Date.now()}`,
    username: 'Guest',
    role: 'guest',
    loginTime: new Date().toISOString()
  };
  
  setCurrentUser(guestUser);
  return guestUser;
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
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      // 如果沒有用戶，自動創建訪客
      const guest = createGuestUser();
      setUser(guest);
    }
    setLoading(false);
  }, []);
  
  const login = (username: string, password: string): boolean => {
    const authenticatedUser = authenticateUser(username, password);
    if (authenticatedUser) {
      setUser(authenticatedUser);
      return true;
    }
    return false;
  };
  
  const logoutUser = () => {
    logout();
    const guest = createGuestUser();
    setUser(guest);
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

// React import (需要在使用的組件中導入)
import React from 'react';