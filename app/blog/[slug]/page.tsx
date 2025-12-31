'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, updatePost, getAllPosts, incrementViews, BlogPost } from '../../lib/blogData';
import { useAuth } from '../../lib/auth';

interface BlogPostPageProps {
  // Next.js 15 中 params 是 Promise
  params: Promise<{
    slug: string;
  }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  // 1. 必須在最上方解開 Promise
  const { slug } = use(params);

  // 2. 所有的 useState 必須放在任何 return (例如 if (loading)) 之前
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAuth();
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  // 3. 所有的 useEffect 也必須放在最上方
  useEffect(() => {
    const loadPost = async () => {
      const foundPost = await getPostBySlug(slug);
      if (foundPost) {
        setPost(foundPost);
        setEditedContent(foundPost.content);
        setEditedTitle(foundPost.title);
        
        // 增加瀏覽數
        await incrementViews(slug);
      }
      setLoading(false);
    };
    
    loadPost();
  }, [slug]);

  useEffect(() => {
    const loadRelatedPosts = async () => {
      if (post) {
        const allPosts = await getAllPosts();
        const related = allPosts
          .filter(p => p.id !== post.id && p.category === post.category && p.status === '已發布')
          .slice(0, 3);
        setRelatedPosts(related);
      }
    };
    
    loadRelatedPosts();
  }, [post]);

  // 4. 事件處理函式
  const handleSave = async () => {
    if (!post) return;
    
    try {
      const success = await updatePost(post.slug, {
        title: editedTitle,
        content: editedContent
      });
      
      if (success) {
        setPost({
          ...post,
          title: editedTitle,
          content: editedContent
        });
        setIsEditing(false);
        alert('文章已儲存！');
      } else {
        alert('儲存失敗，請稍後再試');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('儲存時發生錯誤');
    }
  };

  const handleCancel = () => {
    if (post) {
      setEditedTitle(post.title);
      setEditedContent(post.content);
    }
    setIsEditing(false);
  };

  // 5. 條件式渲染 (Early Returns) 必須放在所有 Hook 之後
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

  if (!post) {
    notFound();
  }

  // 6. 最終 UI 渲染
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="px-6 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← 返回部落格
          </Link>
          
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
                hasPermission('edit_posts') && (
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

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              {post.category}
            </span>
            <span>作者：{post.author}</span>
            <span>發布日期：{post.date}</span>
            <span>閱讀時間：{post.readTime}</span>
            <span>瀏覽數：{post.views}</span>
          </div>

          {post.tags && post.tags.length > 0 && (
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

      {/* Content */}
      <section className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  文章內容 (支援 Markdown)
                </label>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full h-96 p-4 border rounded-lg font-mono text-sm"
                  placeholder="在此輸入文章內容..."
                />
              </div>
              <div className="text-sm text-gray-500">
                提示：支援 Markdown 語法，如 # 標題、**粗體**、*斜體* 等
              </div>
            </div>
          ) : (
            <div className="prose prose-lg max-w-none">
              <div 
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ 
                  __html: post.content
                    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
                    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mt-6 mb-3">$1</h2>')
                    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-medium mt-4 mb-2">$1</h3>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
                    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4">$1</li>')
                    .replace(/\n\n/g, '</p><p class="mb-4">')
                    .replace(/^(?!<[h|l])/gm, '<p class="mb-4">')
                }}
              />
            </div>
          )}
        </div>
      </section>

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
                      <span>{relatedPost.readTime}</span>
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