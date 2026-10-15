import type { Metadata } from 'next';
import BlogClient from './BlogClient';
import BlogListingStructuredData from '../components/BlogListingStructuredData';
import { getPublishedPostsFromDB } from '../lib/database';

export const revalidate = 300;

export const metadata: Metadata = {
  title: '滑板部落格',
  description: '分享滑板知識、技巧教學和文化故事的 SkateInfo 部落格。',
  alternates: { canonical: '/blog' },
};

export default async function BlogPage() {
  const posts = await getPublishedPostsFromDB();

  return (
    <>
      {/* SEO 結構化資料（伺服器端輸出，只含已發布文章） */}
      <BlogListingStructuredData posts={posts} />
      <BlogClient initialPosts={posts} />
    </>
  );
}
