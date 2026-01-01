'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addPost } from '../../lib/blogData';
import ProtectedRoute from '../../components/ProtectedRoute';
import ImageUpload from '../../components/ImageUpload';

export default function NewBlogPost() {
  return (
    <ProtectedRoute requiredPermission="create_posts">
      <NewBlogPostContent />
    </ProtectedRoute>
  );
}

function NewBlogPostContent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    author: '',
    tags: '',
    readTime: '',
    coverImage: ''
  });

  const categories = [
    "初學者指南",
    "技巧教學", 
    "裝備指南",
    "安全指南",
    "文化歷史",
    "場地介紹"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 基本驗證
    if (!formData.title || !formData.content || !formData.category) {
      alert('請填寫必要欄位：標題、內容和分類');
      return;
    }

    try {
      // 使用資料管理系統新增文章
      const newPost = await addPost({
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || formData.content.substring(0, 100) + '...',
        category: formData.category,
        author: formData.author || '匿名作者',
        readTime: formData.readTime || '5 分鐘',
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        date: new Date().toISOString().split('T')[0],
        status: '已發布',
        coverImage: formData.coverImage
      });

      if (newPost) {
        alert('文章已成功建立！');
        router.push(`/blog/${newPost.slug}`);
      } else {
        alert('建立文章時發生錯誤，請稍後再試');
      }
    } catch (error: any) {
      console.error('Error creating post:', error);
      const errorMessage = error.message || '建立文章時發生錯誤，請稍後再試';
      alert(`錯誤：${errorMessage}`);
    }
  };

  const handlePreview = () => {
    // 簡單的預覽功能
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
          <head>
            <title>預覽: ${formData.title}</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
              h1 { color: #333; }
              .meta { color: #666; margin-bottom: 20px; }
              .content { line-height: 1.6; }
            </style>
          </head>
          <body>
            <h1>${formData.title}</h1>
            <div class="meta">
              分類: ${formData.category} | 作者: ${formData.author} | 閱讀時間: ${formData.readTime}
            </div>
            <div class="content">
              ${formData.content.replace(/\n/g, '<br>')}
            </div>
          </body>
        </html>
      `);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="px-6 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← 返回部落格
          </Link>
          <h1 className="text-4xl font-bold text-black">新增文章</h1>
          <p className="text-gray-600 mt-2">建立一篇新的滑板相關文章</p>
        </div>
      </section>

      {/* Form */}
      <section className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                文章標題 *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="輸入文章標題..."
              />
            </div>

            {/* Meta Information */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  分類 *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">選擇分類</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                  作者
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="作者姓名"
                />
              </div>

              <div>
                <label htmlFor="readTime" className="block text-sm font-medium text-gray-700 mb-2">
                  閱讀時間
                </label>
                <input
                  type="text"
                  id="readTime"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例：5 分鐘"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                文章摘要
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="簡短描述文章內容..."
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                標籤
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="用逗號分隔，例：初學者, 基礎技巧, 安全"
              />
              <p className="text-sm text-gray-500 mt-1">用逗號分隔多個標籤</p>
            </div>

            {/* Cover Image */}
            <ImageUpload
              currentImage={formData.coverImage}
              onImageUploaded={(imageUrl) => {
                setFormData(prev => ({ ...prev, coverImage: imageUrl }));
              }}
              onImageRemoved={() => {
                setFormData(prev => ({ ...prev, coverImage: '' }));
              }}
            />

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                文章內容 *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={20}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                placeholder="在此輸入文章內容，支援 Markdown 語法..."
              />
              <div className="mt-2 text-sm text-gray-500">
                <p>支援 Markdown 語法：</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li># 大標題、## 中標題、### 小標題</li>
                  <li>**粗體文字**、*斜體文字*</li>
                  <li>- 項目列表、1. 數字列表</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                發布文章
              </button>
              
              <button
                type="button"
                onClick={handlePreview}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                預覽文章
              </button>
              
              <button
                type="button"
                onClick={() => {
                  if (confirm('確定要取消嗎？未儲存的內容將會遺失。')) {
                    router.push('/blog');
                  }
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Writing Tips */}
      <section className="px-6 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-black">寫作小貼士</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-black">內容建議</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 使用清晰的標題結構</li>
                <li>• 加入實用的技巧和建議</li>
                <li>• 分享個人經驗和故事</li>
                <li>• 包含安全提醒</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-black">格式建議</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 使用項目列表增加可讀性</li>
                <li>• 適當使用粗體強調重點</li>
                <li>• 段落不要太長</li>
                <li>• 加入相關的標籤</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}