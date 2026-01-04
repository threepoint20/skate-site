import { BlogPost } from '../lib/blogData';

interface ArticleStructuredDataProps {
  post: BlogPost;
  baseUrl?: string;
}

export default function ArticleStructuredData({ 
  post, 
  baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com' 
}: ArticleStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article", // 使用 Article 而不是 NewsArticle，更適合部落格
    "headline": post.title,
    "description": post.excerpt,
    "image": post.coverImage ? [
      post.coverImage,
      // 如果有封面圖片，可以提供不同尺寸
      post.coverImage
    ] : [
      `${baseUrl}/activity1.png` // 預設圖片
    ],
    "datePublished": new Date(post.date).toISOString(),
    "dateModified": post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date(post.date).toISOString(),
    "author": {
      "@type": "Person",
      "name": post.author,
      // 如果有作者頁面，可以加入 URL
      // "url": `${baseUrl}/author/${post.author.toLowerCase().replace(/\s+/g, '-')}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "SkateInfo",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png` // 請替換為實際 logo URL
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`
    },
    "articleSection": post.category,
    "keywords": post.tags ? post.tags.join(', ') : post.category,
    "wordCount": post.content ? post.content.split(/\s+/).length : 0, // 更準確的字數計算
    "timeRequired": post.readTime,
    "inLanguage": "zh-TW",
    "url": `${baseUrl}/blog/${post.slug}`,
    "isAccessibleForFree": true,
    "genre": "滑板教學",
    "about": {
      "@type": "Thing",
      "name": "滑板",
      "description": "滑板運動相關知識與技巧"
    }
    // 如果文章有評分或評論，可以加入
    // "aggregateRating": {
    //   "@type": "AggregateRating",
    //   "ratingValue": "4.5",
    //   "reviewCount": "10"
    // }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData, null, 2) }}
    />
  );
}