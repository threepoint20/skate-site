// 網站基本設定（伺服器端與前端共用）
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'SkateInfo';

// 正式網址：請在 Vercel 設定 NEXT_PUBLIC_SITE_URL（例如 https://your-domain.vercel.app）。
// 未設定時，next.config.ts 會在建置時改用 Vercel 的正式網域，確保伺服器與瀏覽器得到相同的值。
export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');
}

// 將站內相對路徑轉成完整網址（結構化資料、sitemap 需要絕對網址）
export function toAbsoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${getSiteUrl()}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

// 安全地輸出 JSON-LD：跳脫 < 避免內容中的 </script> 提前結束標籤
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

// 中文以字元計算字數（去除空白與 Markdown 符號）
export function countWords(content: string): number {
  return (content || '').replace(/[\s#*_>`\-\[\]()!]/g, '').length;
}
