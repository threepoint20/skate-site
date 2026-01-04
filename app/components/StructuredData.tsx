export default function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SkateInfo",
    "description": "推廣滑板文化、社群活動與教育，打造更友善、更包容的滑板環境",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "sameAs": [
      // 如果有社群媒體，可以加入
      // "https://www.facebook.com/your-page",
      // "https://www.instagram.com/your-account",
      // "https://www.youtube.com/your-channel"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+886-912-345-678",
      "contactType": "customer service",
      "availableLanguage": ["Chinese", "zh-TW"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "滑板街123號",
      "addressLocality": "台北市",
      "addressRegion": "信義區",
      "addressCountry": "TW"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}