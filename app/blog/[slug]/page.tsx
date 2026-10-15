'use client';

import { useState, useEffect, useMemo, useRef, use } from 'react';
import Link from 'next/link';
import { notFound, useSearchParams } from 'next/navigation';
import { getPostBySlug, updatePost, getAllPosts, incrementViews, BlogPost } from '../../lib/blogData';
import { useAuth } from '../../components/AuthProvider';
import ImageUpload from '../../components/ImageUpload';
import Breadcrumb from '../../components/Breadcrumb';
import { renderMarkdown } from '../../lib/content';
import { generateBlogPostBreadcrumbs } from '../../lib/breadcrumbs';

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
  const [editedCoverImage, setEditedCoverImage] = useState('');
  const [loading, setLoading] = useState(true);
  const { hasPermission, loading: authLoading } = useAuth();
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const searchParams = useSearchParams();
  const wantsEdit = searchParams.get('edit') === 'true';
  const canEdit = hasPermission('edit_posts');
  const autoEditApplied = useRef(false);

  // 3. 所有的 useEffect 也必須放在最上方
  useEffect(() => {
    const loadPost = async () => {
      const foundPost = await getPostBySlug(slug);
      if (foundPost) {
        setPost(foundPost);
        setEditedContent(foundPost.content);
        setEditedTitle(foundPost.title);
        setEditedCoverImage(foundPost.coverImage || '');

        // 增加瀏覽數（公開端點；草稿不會計數）
        const views = await incrementViews(slug);
        if (views !== null) {
          setPost(prev => (prev ? { ...prev, views } : prev));
        }
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

  // 從列表的「編輯」連結 (?edit=true) 進入時，管理員自動進入編輯模式
  useEffect(() => {
    if (wantsEdit && !authLoading && canEdit && post && !autoEditApplied.current) {
      autoEditApplied.current = true;
      setIsEditing(true);
    }
  }, [wantsEdit, authLoading, canEdit, post]);

  const renderedContent = useMemo(() => (post ? renderMarkdown(post.content) : ''), [post]);

  // 4. 事件處理函式
  const handleSave = async () => {
    if (!post) return;
    
    try {
      const updated = await updatePost(post.slug, {
        title: editedTitle,
        content: editedContent,
        coverImage: editedCoverImage
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
    if (post) {
      setEditedTitle(post.title);
      setEditedContent(post.content);
      setEditedCoverImage(post.coverImage || '');
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

  // 最終 UI 渲染
  return (
    <>
      {/* Article / Breadcrumb 結構化資料由 app/blog/[slug]/layout.tsx 在伺服器端輸出 */}
      <main className="min-h-screen bg-background text-foreground">
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

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              {post.category}
            </span>
            {post.status === '草稿' && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">草稿（訪客看不到）</span>
            )}
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
    </>
  );
}