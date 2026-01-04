import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://your-domain.com' // 請替換為你的實際域名
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/debug/',
          '/_next/',
          '/test-upload.html',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}