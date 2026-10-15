import { NextRequest, NextResponse } from 'next/server';
import { getSecurityHeaders, checkRateLimit, getClientIP } from '@/app/lib/security';
import { incrementPostViewsInDB } from '@/app/lib/database';

// 公開的瀏覽數 +1 端點（只對已發布文章有效）
export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const clientIP = getClientIP(request);

  // 同一 IP 對同一篇文章每 10 分鐘最多計 1 次，避免灌水
  if (!checkRateLimit(`views:${clientIP}:${slug}`, 1, 10 * 60 * 1000)) {
    return NextResponse.json({ counted: false }, { headers: getSecurityHeaders() });
  }

  const views = await incrementPostViewsInDB(slug);
  if (views === null) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404, headers: getSecurityHeaders() });
  }
  return NextResponse.json({ counted: true, views }, { headers: getSecurityHeaders() });
}
