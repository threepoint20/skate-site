import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyRequestAuth, getSecurityHeaders, checkRateLimit, getClientIP, validateInput } from '@/app/lib/security';

const DATA_FILE = path.join(process.cwd(), 'data', 'blog-posts.json');

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  author: string;
  tags: string[];
  status: '已發布' | '草稿';
  views: number;
}

// 讀取單篇文章
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(`blog-read:${clientIP}`, 100, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: '請求過於頻繁，請稍後再試' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const { slug } = await params;

    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }
    
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    const posts: BlogPost[] = JSON.parse(data);
    
    const post = posts.find(p => p.slug === slug);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }
    
    return NextResponse.json(post, { headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Error reading blog post:', error);
    return NextResponse.json(
      { error: 'Failed to read blog post' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// 更新單篇文章 (需要管理員權限)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
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

    const { slug } = await params;

    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }
    
    const updates = await request.json();
    
    // 驗證輸入
    if (updates.title && !validateInput(updates.title, 200)) {
      return NextResponse.json(
        { error: '標題包含無效字符或過長' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }
    
    if (updates.content && !validateInput(updates.content, 50000)) {
      return NextResponse.json(
        { error: '內容包含無效字符或過長' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }
    
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    const posts: BlogPost[] = JSON.parse(data);
    
    const postIndex = posts.findIndex(p => p.slug === slug);
    
    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }
    
    // 更新文章
    posts[postIndex] = { ...posts[postIndex], ...updates };
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), 'utf8');
    
    return NextResponse.json(posts[postIndex], { headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// 刪除單篇文章 (需要管理員權限)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
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

    const { slug } = await params;

    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }
    
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    const posts: BlogPost[] = JSON.parse(data);
    
    const filteredPosts = posts.filter(p => p.slug !== slug);
    
    if (filteredPosts.length === posts.length) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(filteredPosts, null, 2), 'utf8');
    
    return NextResponse.json({ success: true }, { headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}