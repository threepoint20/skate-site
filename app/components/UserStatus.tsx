'use client';

import { useState } from 'react';
import { User } from '../lib/auth';
import LoginModal from './LoginModal';

interface UserStatusProps {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  onLogin: (username: string, password: string) => boolean;
  onLogout: () => void;
}

export default function UserStatus({ user, loading, isAdmin, onLogin, onLogout }: UserStatusProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        {/* 用戶資訊 */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className="text-sm text-gray-600">
            {user?.username || 'Guest'}
          </span>
          {isAdmin && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              管理員
            </span>
          )}
        </div>

        {/* 用戶選單按鈕 */}
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* 下拉選單 */}
      {showUserMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-500 border-b">
              {user?.role === 'administrator' ? '管理員模式' : '訪客模式'}
            </div>
            
            {!isAdmin && (
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                🔐 管理員登入
              </button>
            )}
            
            {isAdmin && (
              <>
                <a
                  href="/blog/manage"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowUserMenu(false)}
                >
                  📊 文章管理
                </a>
                <a
                  href="/blog/new"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowUserMenu(false)}
                >
                  ✏️ 新增文章
                </a>
                <div className="border-t border-gray-100"></div>
                <button
                  onClick={() => {
                    onLogout();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  🚪 登出
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 點擊外部關閉選單 */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}

      {/* 登入模態框 */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={onLogin}
      />
    </div>
  );
}