'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { updatePost, getAllPosts, incrementViews, BlogPost } from '../../lib/blogData';
import { useAuth } from '../../components/AuthProvider';
import ImageUpload from '../../components/ImageUpload';
import Breadcrumb from '../../components/Breadcrumb';
import { renderMarkdown } from '../../lib/content';
import { generateBlogPostBreadcrumbs } from '../../lib/breadcrumbs';

// 文章本體由伺服器端渲染（page.tsx），這個元件只負責互動：瀏覽數、編輯模式
export default function BlogPostClient({ initialPost }: { initialPost: BlogPost }) {
  const [post, setPost] = useState<BlogPost>(initialPost);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(initialPost.content);
  const [editedTitle, setEditedTitle] = useState(initialPost.title);
  const [editedCoverImage, setEditedCoverImage] = useState(initialPost.coverImage || '');
  const [editedCategory, setEditedCategory] = useState(initialPost.category);
  const [editedAuthor, setEditedAuthor] = useState(initialPost.author);
  const [editedExcerpt, setEditedExcerpt] = useState(initialPost.excerpt);
  const [editedTags, setEditedTags] = useState(initialPost.tags?.join(', ') || '');
  const { hasPermission, loading: authLoading } = useAuth();
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const searchParams = useSearchParams();
  const wantsEdit = searchParams.get('edit') === 'true';
  const canEdit = hasPermission('edit_posts');
  const autoEditApplied = useRef(false);

  const categories = [
    "初學者指南",
    "技巧教學",
    "裝備指南",
    "安全指南",
    "文化歷史",
    "場地介紹"
  ];

  // 增加瀏覽數（公開端點；草稿不會計數）
  useEffect(() => {
    const countView = async () => {
      const views = await incrementViews(initialPost.slug);
      if (views !== null) {
        setPost(prev => (prev ? { ...prev, views } : prev));
      }
    };
    countView();
  }, [initialPost.slug]);

  useEffect(() => {
    const loadRelatedPosts = async () => {
      const allPosts = await getAllPosts();
      const related = allPosts
        .filter(p => p.id !== post.id && p.category === post.category && p.status === '已發布')
        .slice(0, 3);
      setRelatedPosts(related);
    };

    loadRelatedPosts();
  }, [post]);

  // 從列表的「編輯」連結 (?edit=true) 進入時，管理員自動進入編輯模式
  useEffect(() => {
    if (wantsEdit && !authLoading && canEdit && !autoEditApplied.current) {
      autoEditApplied.current = true;
      setIsEditing(true);
    }
  }, [wantsEdit, authLoading, canEdit]);

  const renderedContent = useMemo(() => renderMarkdown(post.content), [post]);

  const handleSave = async () => {
    try {
      const updated = await updatePost(post.slug, {
        title: editedTitle,
        content: editedContent,
        coverImage: editedCoverImage,
        category: editedCategory,
        author: editedAuthor || '匿名作者',
        // 摘要留空時保留原值（不覆寫），與新增文章的「留空自動產生」行為等價
        ...(editedExcerpt.trim() ? { excerpt: editedExcerpt } : {}),
        tags: editedTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      });
      setPost(updated);
      setIsEditing(false);
      alert('文章已儲存！');
    } catch (error) {
      console.error('Error saving post:', error);
      alert(`儲存失敗：${error instanceof Error ? error.message : '請稍後再試'}`);
    }
  };

  const handleCancel = () => {
    setEditedTitle(post.title);
    setEditedContent(post.content);
    setEditedCoverImage(post.coverImage || '');
    setEditedCategory(post.category);
    setEditedAuthor(post.author);
    setEditedExcerpt(post.excerpt);
    setEditedTags(post.tags?.join(', ') || '');
    setIsEditing(false);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <article>
      {/* Header */}
      <section className="px-6 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← 返回部落格
          </Link>

          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb items={generateBlogPostBreadcrumbs(post.title, post.slug)} withStructuredData={false} />
          </div>

          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-4xl font-bold w-full p-2 border rounded text-black"
                />
              ) : (
                <h1 className="text-4xl md:text-5xl font-bold text-black">{post.title}</h1>
              )}
            </div>

            <div className="ml-4 flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    儲存
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    取消
                  </button>
                </>
              ) : (
                canEdit && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    編輯文章
                  </button>
                )
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-2">
                  分類 *
                </label>
                <select
                  id="edit-category"
                  value={editedCategory}
                  onChange={(e) => setEditedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">選擇分類</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="edit-author" className="block text-sm font-medium text-gray-700 mb-2">
                  作者
                </label>
                <input
                  type="text"
                  id="edit-author"
                  value={editedAuthor}
                  onChange={(e) => setEditedAuthor(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="作者姓名"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                {post.category}
              </span>
              {post.status === '草稿' && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">草稿（訪客看不到）</span>
              )}
              <span>作者：{post.author}</span>
              <span>
                發布日期：<time dateTime={post.date}>{post.date}</time>
              </span>
              <span>瀏覽數：{post.views}</span>
            </div>
          )}

          {!isEditing && post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag: string) => (
                <span key={tag} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cover Image */}
      {(post.coverImage || isEditing) && (
        <section className="px-6">
          <div className="max-w-4xl mx-auto">
            {isEditing ? (
              <div className="mb-6">
                <ImageUpload
                  currentImage={editedCoverImage}
                  onImageUploaded={(imageUrl) => {
                    setEditedCoverImage(imageUrl);
                  }}
                  onImageRemoved={() => {
                    setEditedCoverImage('');
                  }}
                />
              </div>
            ) : (
              post.coverImage && (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full max-h-96 object-cover rounded-lg shadow-lg"
                />
              )
            )}
          </div>
        </section>
      )}

      {/* Content */}
      <section className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {isEditing ? (
            <div className="space-y-6">
              <div>
                <label htmlFor="edit-excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                  文章摘要
                </label>
                <textarea
                  id="edit-excerpt"
                  value={editedExcerpt}
                  onChange={(e) => setEditedExcerpt(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="簡短描述文章內容..."
                />
              </div>
              <div>
                <label htmlFor="edit-tags" className="block text-sm font-medium text-gray-700 mb-2">
                  標籤
                </label>
                <input
                  type="text"
                  id="edit-tags"
                  value={editedTags}
                  onChange={(e) => setEditedTags(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="用逗號分隔，例：初學者, 基礎技巧, 安全"
                />
                <p className="text-sm text-gray-500 mt-1">用逗號分隔多個標籤</p>
              </div>
              <div>
                <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700 mb-2">
                  文章內容 *（支援 Markdown）
                </label>
                <textarea
                  id="edit-content"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={20}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  placeholder="在此輸入文章內容，支援 Markdown 語法..."
                />
              </div>
              <div className="text-sm text-gray-500">
                提示：支援 Markdown 語法（# 標題、**粗體**、*斜體*、- 清單、[連結](https://...)），影片僅允許 YouTube 嵌入 iframe
              </div>
            </div>
          ) : (
            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />
          )}
        </div>
      </section>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="px-6 py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-black">相關文章</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {relatedPost.category}
                    </span>
                    <h3 className="text-lg font-semibold mt-3 mb-2 text-black">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{relatedPost.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
