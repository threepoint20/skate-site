'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllPosts, BlogPost } from '../lib/blogData';
import { useAuth } from '../lib/auth';

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAuth();

  const categories = ["全部", "初學者指南", "技巧教學", "裝備指南", "安全指南", "文化歷史", "場地介紹"];

  useEffect(() => {
    // 載入文章資料
    const loadPosts = async () => {
      const posts = await getAllPosts();
      setBlogPosts(posts);
      setLoading(false);
    };
    
    loadPosts();
  }, []);

  const filteredPosts = selectedCategory === "全部" 
    ? blogPosts.filter(post => post.status === '已發布')
    : blogPosts.filter(post => post.category === selectedCategory && post.status === '已發布');

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
      {/* Hero Section */}
      <section className="px-6 py-24 text-center bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          滑板部落格
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto">
          分享滑板知識、技巧教學和文化故事
        </p>
        
        {/* 管理員功能按鈕 */}
        {hasPermission('create_posts') && (
          <div className="mt-8 flex justify-center gap-4">
            <Link 
              href="/blog/new"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              + 新增文章
            </Link>
            <Link 
              href="/blog/manage"
              className="px-6 py-3 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors"
            >
              📊 管理文章
            </Link>
          </div>
        )}
      </section>

      {/* Categories Filter */}
      <section className="px-6 py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full border transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="text-center mt-4 text-gray-600">
            顯示 {filteredPosts.length} 篇文章
            {selectedCategory !== "全部" && ` (分類: ${selectedCategory})`}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="h-48 relative overflow-hidden">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        <span className="text-4xl">🛹</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <div>{post.author}</div>
                        <div>{post.date}</div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          閱讀 →
                        </Link>
                        {hasPermission('edit_posts') && (
                          <Link
                            href={`/blog/${post.slug}?edit=true`}
                            className="text-green-600 hover:text-green-800 font-medium text-sm"
                          >
                            編輯
                          </Link>
                        )}
                      </div>
                    </div>
                    
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{post.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">
                {selectedCategory === "全部" ? "還沒有文章" : `${selectedCategory} 分類中還沒有文章`}
              </h3>
              <p className="text-gray-500 mb-6">
                {selectedCategory === "全部" 
                  ? "開始建立你的第一篇文章吧！" 
                  : "試試其他分類或建立新文章"
                }
              </p>
              {hasPermission('create_posts') && (
                <Link 
                  href="/blog/new"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  + 新增文章
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="px-6 py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">訂閱我們的電子報</h2>
          <p className="text-xl text-gray-300 mb-8">
            獲取最新的滑板資訊、技巧教學和活動通知
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="輸入你的電子郵件"
              className="flex-1 px-4 py-3 rounded-l-lg text-gray-900"
            />
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-r-lg font-semibold transition-colors">
              訂閱
            </button>
          </div>
        </div>
      </section>

      {/* Featured Topics */}
      <section className="px-6 py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-black">熱門主題</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🛹</span>
              </div>
              <h3 className="font-semibold text-black">基礎技巧</h3>
              <p className="text-sm text-gray-600 mt-2">從零開始學滑板</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">⚙️</span>
              </div>
              <h3 className="font-semibold text-black">裝備選擇</h3>
              <p className="text-sm text-gray-600 mt-2">選擇合適的滑板</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🏆</span>
              </div>
              <h3 className="font-semibold text-black">進階技巧</h3>
              <p className="text-sm text-gray-600 mt-2">挑戰高難度動作</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🛡️</span>
              </div>
              <h3 className="font-semibold text-black">安全指南</h3>
              <p className="text-sm text-gray-600 mt-2">安全第一的滑板</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}