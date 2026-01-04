import { BlogPost } from '../lib/blogData';

interface BlogListingStructuredDataProps {
  posts: BlogPost[];
  baseUrl?: string;
}

export default function BlogListingStructuredData({ 
  posts, 
  baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com' 
}: BlogListingStructuredDataProps) {
  // 為部落格列表頁面創建結構化資料
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "SkateInfo 滑板部落格",
    "description": "分享滑板知識、技巧教學和文化故事的專業部落格",
    "url": `${baseUrl}/blog`,
    "inLanguage": "zh-TW",
    "publisher": {
      "@type": "Organization",
      "name": "SkateInfo",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "blogPost": posts.filter(post => post.status === '已發布').slice(0, 10).map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "url": `${baseUrl}/blog/${post.slug}`,
      "datePublished": new Date(post.date).toISOString(),
      "dateModified": post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date(post.date).toISOString(),
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "image": post.coverImage || `${baseUrl}/activity1.png`,
      "articleSection": post.category,
      "keywords": post.tags ? post.tags.join(', ') : post.category,
      "wordCount": post.content ? post.content.length : 0,
      "timeRequired": post.readTime,
      "inLanguage": "zh-TW"
    }))
  };

  // 同時為網站添加 WebSite 結構化資料
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SkateInfo",
    "description": "專業滑板資訊網站，提供滑板教學、裝備指南和社群交流",
    "url": baseUrl,
    "inLanguage": "zh-TW",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/blog?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData, null, 2) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData, null, 2) }}
      />
    </>
  );
}