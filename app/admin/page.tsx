'use client';

import { useAuth } from '../lib/auth';
import ProtectedRoute from '../components/ProtectedRoute';
import Link from 'next/link';

function AdminDashboardContent() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="px-6 py-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            管理員控制台
          </h1>
          <p className="mt-4 text-lg">
            歡迎回來，{user?.username}！
          </p>
        </div>
      </section>

      {/* Dashboard */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 文章管理 */}
            <Link href="/blog/manage">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-semibold ml-3 text-black">文章管理</h3>
                </div>
                <p className="text-gray-600">
                  管理所有部落格文章，包含編輯、刪除和狀態變更
                </p>
              </div>
            </Link>

            {/* 新增文章 */}
            <Link href="/blog/new">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-2xl">✏️</span>
                  </div>
                  <h3 className="text-xl font-semibold ml-3 text-black">新增文章</h3>
                </div>
                <p className="text-gray-600">
                  建立新的部落格文章，支援 Markdown 格式
                </p>
              </div>
            </Link>

            {/* 部落格首頁 */}
            <Link href="/blog">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-2xl">📝</span>
                  </div>
                  <h3 className="text-xl font-semibold ml-3 text-black">部落格首頁</h3>
                </div>
                <p className="text-gray-600">
                  查看所有已發布的文章和分類
                </p>
              </div>
            </Link>

            {/* 網站首頁 */}
            <Link href="/">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 text-2xl">🏠</span>
                  </div>
                  <h3 className="text-xl font-semibold ml-3 text-black">網站首頁</h3>
                </div>
                <p className="text-gray-600">
                  返回滑板資訊網站首頁
                </p>
              </div>
            </Link>

            {/* 聯絡我們 */}
            <Link href="/contact">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 text-2xl">📞</span>
                  </div>
                  <h3 className="text-xl font-semibold ml-3 text-black">聯絡資訊</h3>
                </div>
                <p className="text-gray-600">
                  查看聯絡表單和相關資訊
                </p>
              </div>
            </Link>

            {/* 權限說明 */}
            <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 text-2xl">🔒</span>
                </div>
                <h3 className="text-xl font-semibold ml-3 text-gray-700">權限說明</h3>
              </div>
              <p className="text-gray-600 text-sm">
                管理員可以新增、編輯、刪除文章。訪客只能閱讀已發布的文章。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 用戶資訊 */}
      <section className="px-6 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-black">當前用戶資訊</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">用戶名稱</label>
                <p className="mt-1 text-lg text-gray-900">{user?.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">權限角色</label>
                <p className="mt-1 text-lg text-gray-900">{user?.role === 'administrator' ? '管理員' : '訪客'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">用戶 ID</label>
                <p className="mt-1 text-lg text-gray-900">{user?.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">登入時間</label>
                <p className="mt-1 text-lg text-gray-900">
                  {user?.loginTime ? new Date(user.loginTime).toLocaleString('zh-TW') : '未知'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredPermission="access_admin">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}