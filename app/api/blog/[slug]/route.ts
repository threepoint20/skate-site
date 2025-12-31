import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
  { params }: { params: Promise<{ slug: string }> } // 修改 1: 定義為 Promise
) {
  try {
    const { slug } = await params; // 修改 2: 使用 await 解構

    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    const posts: BlogPost[] = JSON.parse(data);
    
    const post = posts.find(p => p.slug === slug); // 修改 3: 使用 slug
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error reading blog post:', error);
    return NextResponse.json({ error: 'Failed to read blog post' }, { status: 500 });
  }
}

// 更新單篇文章
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> } // 修改 1
) {
  try {
    const { slug } = await params; // 修改 2

    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    const updates = await request.json();
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    const posts: BlogPost[] = JSON.parse(data);
    
    const postIndex = posts.findIndex(p => p.slug === slug); // 修改 3
    
    if (postIndex === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // 更新文章
    posts[postIndex] = { ...posts[postIndex], ...updates };
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), 'utf8');
    
    return NextResponse.json(posts[postIndex]);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

// 刪除單篇文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> } // 修改 1
) {
  try {
    const { slug } = await params; // 修改 2

    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    const posts: BlogPost[] = JSON.parse(data);
    
    const filteredPosts = posts.filter(p => p.slug !== slug); // 修改 3
    
    if (filteredPosts.length === posts.length) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(filteredPosts, null, 2), 'utf8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}