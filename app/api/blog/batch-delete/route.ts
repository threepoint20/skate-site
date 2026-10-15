import { NextRequest, NextResponse } from 'next/server';
import { getSecurityHeaders, checkRateLimit, getClientIP, isAdminRequest } from '@/app/lib/security';
import { deletePostsFromDB } from '@/app/lib/database';

// 批次刪除文章 (需要管理員權限)，一次請求只計一次寫入限流
export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: '需要管理員權限' }, { status: 401, headers: getSecurityHeaders() });
    }
    if (!checkRateLimit(`blog-write:${getClientIP(request)}`, 200, 15 * 60 * 1000)) {
      return NextResponse.json({ error: '請求過於頻繁，請稍後再試' }, { status: 429, headers: getSecurityHeaders() });
    }

    const body = await request.json();
    const slugs: unknown = body?.slugs;
    if (!Array.isArray(slugs) || slugs.length === 0 || slugs.length > 500 || slugs.some(s => typeof s !== 'string')) {
      return NextResponse.json({ error: '請提供要刪除的文章 slug 陣列' }, { status: 400, headers: getSecurityHeaders() });
    }

    const deleted = await deletePostsFromDB(slugs as string[]);
    return NextResponse.json({ success: true, deleted }, { headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Error batch deleting posts:', error);
    return NextResponse.json({ error: '批次刪除失敗' }, { status: 500, headers: getSecurityHeaders() });
  }
}
