import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { verifyToken } from '../../lib/security';
import { getPostBySlugFromDB } from '../../lib/database';
import { normalizeSlug } from '../../lib/blogData';
import { generateBlogPostBreadcrumbs } from '../../lib/breadcrumbs';
import { toAbsoluteUrl } from '../../lib/site';
import ArticleStructuredData from '../../components/ArticleStructuredData';
import BreadcrumbStructuredData from '../../components/BreadcrumbStructuredData';

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

// 只有已發布文章會在伺服器端輸出 metadata 與結構化資料
async function getPublishedPost(slug: string) {
  const post = await getPostBySlugFromDB(normalizeSlug(slug));
  return post && post.status === '已發布' ? post : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) {
    return { title: '找不到文章', robots: { index: false, follow: false } };
  }

  const url = `/blog/${encodeURIComponent(post.slug)}`;
  const image = toAbsoluteUrl(post.coverImage || '/activity1.png');
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [image],
    },
  };
}

async function isAdminViewer(): Promise<boolean> {
  const token = (await cookies()).get('auth-token')?.value;
  return !!token && verifyToken(token)?.role === 'administrator';
}

export default async function BlogPostLayout({ children, params }: Props) {
  const { slug } = await params;
  const anyPost = await getPostBySlugFromDB(normalizeSlug(slug));
  // 不存在的文章回傳真正的 404；草稿只有管理員可以開啟
  if (!anyPost || (anyPost.status !== '已發布' && !(await isAdminViewer()))) {
    notFound();
  }
  const post = anyPost.status === '已發布' ? anyPost : null;

  return (
    <>
      {post && (
        <>
          <ArticleStructuredData post={post} />
          <BreadcrumbStructuredData items={generateBlogPostBreadcrumbs(post.title, post.slug)} />
        </>
      )}
      {children}
    </>
  );
}
