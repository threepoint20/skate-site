import { NextRequest, NextResponse } from 'next/server';
import { getSecurityHeaders, checkRateLimit, getClientIP, isAdminRequest } from '@/app/lib/security';
import { getPostBySlugFromDB, updatePostInDB, deletePostFromDB } from '@/app/lib/database';
import { validatePostInput } from '@/app/lib/postValidation';

type Params = { params: Promise<{ slug: string }> };

function unauthorized() {
  return NextResponse.json({ error: '需要管理員權限' }, { status: 401, headers: getSecurityHeaders() });
}

function tooManyRequests() {
  return NextResponse.json({ error: '請求過於頻繁，請稍後再試' }, { status: 429, headers: getSecurityHeaders() });
}

function notFound() {
  return NextResponse.json({ error: 'Post not found' }, { status: 404, headers: getSecurityHeaders() });
}

// 讀取單篇文章：草稿只有管理員看得到
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const clientIP = getClientIP(request);
    if (!checkRateLimit(`blog-read:${clientIP}`, 300, 15 * 60 * 1000)) return tooManyRequests();

    const { slug } = await params;
    const post = await getPostBySlugFromDB(slug);
    if (!post || (post.status !== '已發布' && !isAdminRequest(request))) return notFound();

    return NextResponse.json(post, { headers: { ...getSecurityHeaders(), 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Error reading blog post:', error);
    return NextResponse.json({ error: 'Failed to read blog post' }, { status: 500, headers: getSecurityHeaders() });
  }
}

// 更新單篇文章 (需要管理員權限)
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    if (!isAdminRequest(request)) return unauthorized();
    if (!checkRateLimit(`blog-write:${getClientIP(request)}`, 200, 15 * 60 * 1000)) return tooManyRequests();

    const { slug } = await params;
    const updates = await request.json();
    const validationError = validatePostInput(updates, true);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400, headers: getSecurityHeaders() });
    }

    const success = await updatePostInDB(slug, updates);
    if (!success) return notFound();

    const updatedPost = await getPostBySlugFromDB(slug);
    return NextResponse.json(updatedPost, { headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500, headers: getSecurityHeaders() });
  }
}

// 刪除單篇文章 (需要管理員權限)
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    if (!isAdminRequest(request)) return unauthorized();
    if (!checkRateLimit(`blog-write:${getClientIP(request)}`, 200, 15 * 60 * 1000)) return tooManyRequests();

    const { slug } = await params;
    const success = await deletePostFromDB(slug);
    if (!success) return notFound();

    return NextResponse.json({ success: true }, { headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500, headers: getSecurityHeaders() });
  }
}
