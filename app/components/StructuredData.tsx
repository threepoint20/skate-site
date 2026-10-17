import { getSiteUrl, jsonLd, SITE_NAME, SITE_CONTACT } from '../lib/site';

// 全站 Organization 結構化資料
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
      "telephone": SITE_CONTACT.phone,
      "email": SITE_CONTACT.email,
      "contactType": "customer service",
      "availableLanguage": ["zh-TW"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": SITE_CONTACT.streetAddress,
      "addressLocality": SITE_CONTACT.city,
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