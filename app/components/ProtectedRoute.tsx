'use client';

import { useAuth } from '../lib/auth';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission: string;
  fallback?: ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  requiredPermission, 
  fallback 
}: ProtectedRouteProps) {
  const { user, loading, hasPermission } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (!hasPermission(requiredPermission)) {
    return fallback || (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold mb-4">權限不足</h1>
          <p className="text-gray-600 mb-6">
            您需要管理員權限才能訪問此頁面
          </p>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              當前身份：{user?.role === 'administrator' ? '管理員' : '訪客'}
            </p>
            <a
              href="/blog"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              返回部落格
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}