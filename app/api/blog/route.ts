import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestAuth, getSecurityHeaders, checkRateLimit, getClientIP, validateInput } from '@/app/lib/security';
import { getAllPostsFromDB, addPostToDB } from '@/app/lib/database';

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

// 新增單篇文章 (需要管理員權限)
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

    const postData = await request.json();
    
    // 檢查是否為批量儲存（向後相容）
    if (Array.isArray(postData)) {
      return NextResponse.json(
        { error: '請使用個別文章新增 API' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }
    
    // 驗證文章內容
    if (!validateInput(postData.title, 200) || !validateInput(postData.content, 50000)) {
      return NextResponse.json(
        { error: '文章內容包含無效字符或過長' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }
    
    const newPost = await addPostToDB(postData);
    if (newPost) {
      return NextResponse.json(newPost, { headers: getSecurityHeaders() });
    } else {
      return NextResponse.json(
        { error: '新增文章失敗' },
        { status: 500, headers: getSecurityHeaders() }
      );
    }
  } catch (error) {
    console.error('Error adding blog post:', error);
    return NextResponse.json(
      { error: 'Failed to add blog post' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}