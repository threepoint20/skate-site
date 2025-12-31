'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllPosts, updatePost, deletePost, BlogPost } from '../../lib/blogData';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function ManageBlog() {
  return (
    <ProtectedRoute requiredPermission="manage_posts">
      <ManageBlogContent />
    </ProtectedRoute>
  );
}

function ManageBlogContent() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('date');
  const [filterStatus, setFilterStatus] = useState('全部');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const posts = await getAllPosts();
    setBlogPosts(posts);
    setLoading(false);
  };

  const handleSelectPost = (postId: number) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map(post => post.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedPosts.length === 0) return;
    
    if (confirm(`確定要刪除 ${selectedPosts.length} 篇文章嗎？此操作無法復原。`)) {
      // 將 ID 轉換為 slug 並逐一刪除
      const slugsToDelete = blogPosts
        .filter(post => selectedPosts.includes(post.id))
        .map(post => post.slug);
      
      let deletedCount = 0;
      for (const slug of slugsToDelete) {
        const success = await deletePost(slug);
        if (success) {
          deletedCount++;
        }
      }
      
      setSelectedPosts([]);
      await loadPosts(); // 重新載入資料
      alert(`已刪除 ${deletedCount} 篇文章`);
    }
  };

  const handleStatusChange = async (postSlug: string, newStatus: '已發布' | '草稿') => {
    const success = await updatePost(postSlug, { status: newStatus });
    if (success) {
      await loadPosts(); // 重新載入資料
    }
  };

  const handleDeleteSingle = async (postSlug: string, title: string) => {
    if (confirm(`確定要刪除文章「${title}」嗎？此操作無法復原。`)) {
      const success = await deletePost(postSlug);
      if (success) {
        await loadPosts(); // 重新載入資料
        alert('文章已刪除');
      }
    }
  };

  const filteredPosts = blogPosts
    .filter(post => filterStatus === '全部' || post.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'views':
          return b.views - a.views;
        case 'date':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="px-6 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-black">文章管理</h1>
              <p className="text-gray-600 mt-2">管理所有部落格文章</p>
            </div>
            <Link 
              href="/blog/new"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              + 新增文章
            </Link>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{blogPosts.length}</div>
              <div className="text-sm text-gray-600">總文章數</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {blogPosts.filter(p => p.status === '已發布').length}
              </div>
              <div className="text-sm text-gray-600">已發布</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-orange-600">
                {blogPosts.filter(p => p.status === '草稿').length}
              </div>
              <div className="text-sm text-gray-600">草稿</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600">
                {blogPosts.reduce((sum, post) => sum + post.views, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">總瀏覽數</div>
            </div>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="px-6 py-6 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                  onChange={handleSelectAll}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">
                  {selectedPosts.length > 0 ? `已選擇 ${selectedPosts.length} 篇` : '全選'}
                </span>
              </div>

              {selectedPosts.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                >
                  刪除選中項目
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded text-sm"
              >
                <option value="全部">全部狀態</option>
                <option value="已發布">已發布</option>
                <option value="草稿">草稿</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded text-sm"
              >
                <option value="date">按日期排序</option>
                <option value="title">按標題排序</option>
                <option value="views">按瀏覽數排序</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Table */}
      <section className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {filteredPosts.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                        onChange={handleSelectAll}
                        className="rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      標題
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      分類
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      作者
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      狀態
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      瀏覽數
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      日期
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedPosts.includes(post.id)}
                          onChange={() => handleSelectPost(post.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          <Link 
                            href={`/blog/${post.slug}`}
                            className="hover:text-blue-600"
                          >
                            {post.title}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {post.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={post.status}
                          onChange={(e) => handleStatusChange(post.slug, e.target.value as '已發布' | '草稿')}
                          className={`text-xs px-2 py-1 rounded-full border-0 ${
                            post.status === '已發布' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          <option value="已發布">已發布</option>
                          <option value="草稿">草稿</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {post.views.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            查看
                          </Link>
                          <Link
                            href={`/blog/${post.slug}?edit=true`}
                            className="text-green-600 hover:text-green-900"
                          >
                            編輯
                          </Link>
                          <button
                            onClick={() => handleDeleteSingle(post.slug, post.title)}
                            className="text-red-600 hover:text-red-900"
                          >
                            刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">
                {filterStatus === '全部' ? '還沒有文章' : `沒有${filterStatus}的文章`}
              </h3>
              <p className="text-gray-500 mb-6">開始建立你的第一篇文章吧！</p>
              <Link 
                href="/blog/new"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                + 新增文章
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}