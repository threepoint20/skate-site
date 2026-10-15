import { BlogPost } from '../lib/blogData';
import { countWords, getSiteUrl, jsonLd, SITE_NAME, toAbsoluteUrl } from '../lib/site';

interface ArticleStructuredDataProps {
  post: BlogPost;
}

function toIsoDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

export default function ArticleStructuredData({ post }: ArticleStructuredDataProps) {
  const baseUrl = getSiteUrl();
  const url = `${baseUrl}/blog/${encodeURIComponent(post.slug)}`;
  const published = toIsoDate(post.date);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": [toAbsoluteUrl(post.coverImage || '/activity1.png')],
    "datePublished": published,
    "dateModified": toIsoDate(post.updatedAt) || published,
    "author": {
      "@type": "Person",
      "name": post.author,
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": baseUrl,
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "articleSection": post.category,
    "keywords": post.tags && post.tags.length > 0 ? post.tags.join(', ') : post.category,
    "wordCount": countWords(post.content),
    "inLanguage": "zh-TW",
    "url": url,
    "isAccessibleForFree": true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
    />
  );
}
