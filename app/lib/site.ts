// 全站共用的網址、名稱與結構化資料工具函式

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'SkateInfo';

// 取得網站根網址（去除結尾斜線）
export function getSiteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000');
  return url.replace(/\/+$/, '');
}

// 將相對路徑轉為完整網址
export function toAbsoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return getSiteUrl();
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = getSiteUrl();
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}

// 安全序列化 JSON-LD（避免 </script> 注入）
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

// 計算文章字數（中文字按字計、英文按單字計）
export function countWords(content: string): number {
  if (!content) return 0;
  const text = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/[#*_>`\[\]()!|-]/g, ' ');
  const cjk = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const words = text
    .replace(/[\u4e00-\u9fff]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return cjk + words;
}

// 全站共用的聯絡與地址資訊（修改此處即可同步更新 Footer、Contact 頁面與 SEO 結構化資料）
export const SITE_CONTACT = {
  email: 'threepoint20@gmail.com',
  phone: '+886-912-345-678',
  city: '新竹市',
  streetAddress: '滑板街123號',
  fullAddress: '新竹市滑板街123號',
  centerName: 'SkateInfo 滑板資訊中心',
  weekdayHours: '週一至週五：9:00 - 21:00',
  weekendHours: '週六至週日：10:00 - 22:00',
  phoneHours: '週一至週五 9:00-18:00',
} as const;