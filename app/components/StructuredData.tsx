import { getSiteUrl, jsonLd, SITE_NAME } from '../lib/site';

// 全站 Organization 結構化資料
// 注意：目前 public/ 沒有網站 logo，因此不輸出 logo 欄位；有正式 logo 後可加入 "logo"
export default function StructuredData() {
  const baseUrl = getSiteUrl();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE_NAME,
    "description": "推廣滑板文化、社群活動與教育，打造更友善、更包容的滑板環境",
    "url": baseUrl,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+886-912-345-678",
      "contactType": "customer service",
      "availableLanguage": ["zh-TW"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "信義區滑板街123號",
      "addressLocality": "台北市",
      "addressCountry": "TW"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
    />
  );
}
