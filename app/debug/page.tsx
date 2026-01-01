'use client';

import { useAuth } from '../lib/auth';

export default function DebugPage() {
  const { user, loading, isAdmin, hasPermission } = useAuth();

  if (loading) {
    return <div className="p-8">載入中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">認證狀態調試</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">用戶資訊</h2>
          <div className="space-y-2">
            <p><strong>載入狀態:</strong> {loading ? '載入中' : '已載入'}</p>
            <p><strong>用戶 ID:</strong> {user?.id || '無'}</p>
            <p><strong>用戶名:</strong> {user?.username || '無'}</p>
            <p><strong>角色:</strong> {user?.role || '無'}</p>
            <p><strong>登入時間:</strong> {user?.loginTime || '無'}</p>
            <p><strong>是否管理員:</strong> {isAdmin ? '是' : '否'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">權限檢查</h2>
          <div className="space-y-2">
            <p><strong>讀取文章:</strong> {hasPermission('read_posts') ? '✅ 允許' : '❌ 拒絕'}</p>
            <p><strong>建立文章:</strong> {hasPermission('create_posts') ? '✅ 允許' : '❌ 拒絕'}</p>
            <p><strong>編輯文章:</strong> {hasPermission('edit_posts') ? '✅ 允許' : '❌ 拒絕'}</p>
            <p><strong>刪除文章:</strong> {hasPermission('delete_posts') ? '✅ 允許' : '❌ 拒絕'}</p>
            <p><strong>管理文章:</strong> {hasPermission('manage_posts') ? '✅ 允許' : '❌ 拒絕'}</p>
            <p><strong>訪問管理:</strong> {hasPermission('access_admin') ? '✅ 允許' : '❌ 拒絕'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">測試 API 呼叫</h2>
          <div className="space-y-4">
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/auth/verify', {
                    credentials: 'include'
                  });
                  const data = await response.json();
                  alert(`API 回應: ${JSON.stringify(data, null, 2)}`);
                } catch (error: any) {
                  alert(`API 錯誤: ${error.message}`);
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-4"
            >
              測試驗證 API
            </button>
            
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/blog', {
                    credentials: 'include'
                  });
                  const data = await response.json();
                  alert(`文章數量: ${data.length}`);
                } catch (error: any) {
                  alert(`API 錯誤: ${error.message}`);
                }
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-4"
            >
              測試文章 API
            </button>

            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/database/status');
                  const data = await response.json();
                  alert(`資料庫狀態: ${JSON.stringify(data, null, 2)}`);
                } catch (error: any) {
                  alert(`API 錯誤: ${error.message}`);
                }
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              檢查資料庫狀態
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}