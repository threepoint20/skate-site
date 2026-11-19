import { NextRequest, NextResponse } from 'next/server';
import { getSecurityHeaders, checkRateLimit, getClientIP, isAdminRequest, validateText } from '@/app/lib/security';
import { getAllContentFromDB, upsertContentInDB } from '@/app/lib/contentStore';
import { CONTENT_KEYS } from '@/app/lib/siteContent';

// GET：公開讀取所有內容覆寫（僅回傳資料庫存的覆寫值，預設值由前端合併）
export async function GET(request: NextRequest) {
  try {
    if (!checkRateLimit(`content-read:${getClientIP(request)}`, 300, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: '請求過於頻繁，請稍後再試' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const content = await getAllContentFromDB();
    return NextResponse.json(content, {
      headers: { ...getSecurityHeaders(), 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Error reading site content:', error);
    return NextResponse.json({ error: '讀取內容失敗' }, { status: 500, headers: getSecurityHeaders() });
  }
}

// PUT：批次更新內容（需要管理員權限）
// body: { updates: { 'page.section.field': '新文字', ... } }
export async function PUT(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: '需要管理員權限' }, { status: 401, headers: getSecurityHeaders() });
    }
    if (!checkRateLimit(`content-write:${getClientIP(request)}`, 100, 15 * 60 * 1000)) {
      return NextResponse.json({ error: '請求過於頻繁，請稍後再試' }, { status: 429, headers: getSecurityHeaders() });
    }

    const body = await request.json();
    const updates = body?.updates;
    if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
      return NextResponse.json({ error: '請提供有效的更新資料' }, { status: 400, headers: getSecurityHeaders() });
    }

    // 只允許註冊表中的 key，且值必須是合理長度的字串
    for (const [key, value] of Object.entries(updates)) {
      if (!CONTENT_KEYS.has(key)) {
        return NextResponse.json({ error: `不允許的欄位：${key}` }, { status: 400, headers: getSecurityHeaders() });
      }
      if (!validateText(value, 5000, false)) {
        return NextResponse.json({ error: `欄位 ${key} 的內容格式不正確` }, { status: 400, headers: getSecurityHeaders() });
      }
    }

    const success = await upsertContentInDB(updates as Record<string, string>);
    if (!success) {
      return NextResponse.json({ error: '儲存失敗' }, { status: 500, headers: getSecurityHeaders() });
    }

    return NextResponse.json({ success: true }, { headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Error updating site content:', error);
    return NextResponse.json({ error: '更新內容失敗' }, { status: 500, headers: getSecurityHeaders() });
  }
}
