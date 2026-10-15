import { NextRequest, NextResponse } from 'next/server';
import { getSecurityHeaders, checkRateLimit, getClientIP, isAdminRequest } from '@/app/lib/security';
import { getAllPostsFromDB, getPublishedPostsFromDB, addPostToDB } from '@/app/lib/database';
import { validatePostInput } from '@/app/lib/postValidation';
import { generateSlug } from '@/app/lib/blogData';

// 讀取文章：管理員可看到全部（含草稿），訪客只會拿到已發布文章
export async function GET(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    if (!checkRateLimit(`blog-read:${clientIP}`, 300, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: '請求過於頻繁，請稍後再試' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const posts = isAdminRequest(request) ? await getAllPostsFromDB() : await getPublishedPostsFromDB();
    return NextResponse.json(posts, { headers: { ...getSecurityHeaders(), 'Cache-Control': 'no-store' } });
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
    if (!isAdminRequest(request)) {
      return NextResponse.json(
        { error: '需要管理員權限' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const clientIP = getClientIP(request);
    if (!checkRateLimit(`blog-write:${clientIP}`, 200, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: '請求過於頻繁，請稍後再試' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const postData = await request.json();
    const validationError = validatePostInput(postData, false);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400, headers: getSecurityHeaders() });
    }

    const newPost = await addPostToDB({
      slug: typeof postData.slug === 'string' && /^[\w\u4e00-\u9fa5-]{1,80}$/.test(postData.slug)
        ? postData.slug
        : generateSlug(postData.title),
      title: postData.title,
      content: postData.content,
      excerpt: postData.excerpt || postData.content.substring(0, 100),
      date: postData.date || new Date().toISOString().split('T')[0],
      category: postData.category,
      readTime: postData.readTime || '5 分鐘',
      author: postData.author || '匿名作者',
      tags: postData.tags || [],
      status: postData.status || '已發布',
      views: 0,
      coverImage: postData.coverImage || undefined,
    });

    if (newPost) {
      return NextResponse.json(newPost, { headers: getSecurityHeaders() });
    }
    return NextResponse.json(
      { error: '新增文章失敗' },
      { status: 500, headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Error adding blog post:', error);
    return NextResponse.json(
      { error: 'Failed to add blog post' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
