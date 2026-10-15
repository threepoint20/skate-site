import { BlogPost } from '../lib/blogData';
import { countWords, getSiteUrl, jsonLd, SITE_NAME, toAbsoluteUrl } from '../lib/site';

interface BlogListingStructuredDataProps {
  posts: BlogPost[];
}

function toIsoDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

// 部落格列表的 Blog 結構化資料（只列出已發布文章）
// 網站目前沒有搜尋功能，因此不輸出 WebSite SearchAction
export default function BlogListingStructuredData({ posts }: BlogListingStructuredDataProps) {
  const baseUrl = getSiteUrl();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": `${SITE_NAME} 滑板部落格`,
    "description": "分享滑板知識、技巧教學和文化故事的專業部落格",
    "url": `${baseUrl}/blog`,
    "inLanguage": "zh-TW",
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": baseUrl,
    },
    "blogPost": posts.filter(post => post.status === '已發布').slice(0, 10).map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "url": `${baseUrl}/blog/${encodeURIComponent(post.slug)}`,
      "datePublished": toIsoDate(post.date),
      "dateModified": toIsoDate(post.updatedAt) || toIsoDate(post.date),
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "image": toAbsoluteUrl(post.coverImage || '/activity1.png'),
      "articleSection": post.category,
      "keywords": post.tags && post.tags.length > 0 ? post.tags.join(', ') : post.category,
      "wordCount": countWords(post.content),
      "inLanguage": "zh-TW"
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
    />
  );
}
