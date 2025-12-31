import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'blog-posts.json');

// 確保資料目錄存在
function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// 讀取所有文章
export async function GET() {
  try {
    ensureDataDirectory();
    
    if (!fs.existsSync(DATA_FILE)) {
      // 如果檔案不存在，返回空陣列
      return NextResponse.json([]);
    }
    
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    const posts = JSON.parse(data);
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return NextResponse.json({ error: 'Failed to read blog posts' }, { status: 500 });
  }
}

// 儲存所有文章
export async function POST(request: NextRequest) {
  try {
    ensureDataDirectory();
    
    const posts = await request.json();
    
    // 驗證資料格式
    if (!Array.isArray(posts)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    
    // 在 Vercel 上，檔案系統是唯讀的，但我們可以嘗試寫入
    // 實際上在生產環境中，這可能會失敗
    // 建議使用資料庫或外部儲存服務
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), 'utf8');
      return NextResponse.json({ success: true });
    } catch (writeError) {
      console.error('Write error (expected in Vercel):', writeError);
      // 在 Vercel 上檔案系統是唯讀的，返回錯誤但不影響讀取
      return NextResponse.json({ 
        error: 'File system is read-only in production. Consider using a database.' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error saving blog posts:', error);
    return NextResponse.json({ error: 'Failed to save blog posts' }, { status: 500 });
  }
}