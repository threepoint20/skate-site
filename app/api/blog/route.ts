import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestAuth, getSecurityHeaders, checkRateLimit, getClientIP, validateInput } from '@/app/lib/security';
import { getAllPostsFromDB, savePostsToDB } from '@/app/lib/database';

// 讀取所有文章
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(`blog-read:${clientIP}`, 100, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: '請求過於頻繁，請稍後再試' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const posts = await getAllPostsFromDB();
    return NextResponse.json(posts, { headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to read blog posts' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// 儲存所有文章 (需要管理員權限)
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(`blog-write:${clientIP}`, 10, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: '請求過於頻繁，請稍後再試' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    // 驗證認證
    const authData = verifyRequestAuth(request);
    if (!authData || authData.role !== 'administrator') {
      return NextResponse.json(
        { error: '需要管理員權限' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const posts = await request.json();
    
    // 驗證資料格式
    if (!Array.isArray(posts)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // 驗證每篇文章的內容
    for (const post of posts) {
      if (!validateInput(post.title, 200) || !validateInput(post.content, 50000)) {
        return NextResponse.json(
          { error: '文章內容包含無效字符或過長' },
          { status: 400, headers: getSecurityHeaders() }
        );
      }
    }
    
    const success = await savePostsToDB(posts);
    if (success) {
      return NextResponse.json({ success: true }, { headers: getSecurityHeaders() });
    } else {
      return NextResponse.json(
        { error: '儲存文章失敗' },
        { status: 500, headers: getSecurityHeaders() }
      );
    }
  } catch (error) {
    console.error('Error saving blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to save blog posts' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}