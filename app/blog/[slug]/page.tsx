import { notFound } from 'next/navigation';
import { getPostBySlugFromDB } from '../../lib/database';
import { normalizeSlug } from '../../lib/blogData';
import BlogPostClient from './BlogPostClient';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 伺服器端渲染：文章內容直接出現在 HTML 中，讓搜尋引擎不需要執行 JS 就能讀到全文。
// 草稿與不存在文章的可見性由 layout.tsx 把關（非管理員存取草稿會先 notFound）。
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlugFromDB(normalizeSlug(slug));

  if (!post) {
    notFound();
  }

  return <BlogPostClient initialPost={post} />;
}
