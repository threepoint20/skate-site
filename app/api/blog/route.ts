import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyRequestAuth, getSecurityHeaders, checkRateLimit, getClientIP, validateInput } from '@/app/lib/security';

const DATA_FILE = path.join(process.cwd(), 'data', 'blog-posts.json');

// 確保資料目錄存在
function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

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

    ensureDataDirectory();
    
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json([], { headers: getSecurityHeaders() });
    }
    
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    const posts = JSON.parse(data);
    
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

    ensureDataDirectory();
    
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
    
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), 'utf8');
      return NextResponse.json({ success: true }, { headers: getSecurityHeaders() });
    } catch (writeError) {
      console.error('Write error (expected in Vercel):', writeError);
      return NextResponse.json(
        { error: 'File system is read-only in production. Consider using a database.' },
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