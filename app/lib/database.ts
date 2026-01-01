// 資料庫適配器 - 支援本地檔案系統和 Vercel KV
import { BlogPost } from './blogData';
import fs from 'fs';
import path from 'path';

// 檢查是否在生產環境
const isProduction = process.env.NODE_ENV === 'production';

// 本地檔案路徑
const DATA_FILE = path.join(process.cwd(), 'data', 'blog-posts.json');
const KV_KEY = 'blog-posts';

// Vercel KV 客戶端（僅在生產環境載入）
let kv: any = null;
if (isProduction) {
  try {
    kv = require('@vercel/kv').kv;
  } catch (error) {
    console.warn('Vercel KV not available, falling back to file system');
  }
}

// 確保本地資料目錄存在
function ensureDataDirectory() {
  if (!isProduction) {
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }
}

// 讀取所有文章
export async function getAllPostsFromDB(): Promise<BlogPost[]> {
  try {
    if (isProduction && kv) {
      // 生產環境：使用 Vercel KV
      const posts = await kv.get(KV_KEY);
      return posts || [];
    } else {
      // 開發環境：使用本地檔案
      ensureDataDirectory();
      
      if (!fs.existsSync(DATA_FILE)) {
        return [];
      }
      
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading posts from database:', error);
    return [];
  }
}

// 儲存所有文章
export async function savePostsToDB(posts: BlogPost[]): Promise<boolean> {
  try {
    if (isProduction && kv) {
      // 生產環境：使用 Vercel KV
      await kv.set(KV_KEY, posts);
      return true;
    } else {
      // 開發環境：使用本地檔案
      ensureDataDirectory();
      fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), 'utf8');
      return true;
    }
  } catch (error) {
    console.error('Error saving posts to database:', error);
    return false;
  }
}

// 根據 slug 獲取單篇文章
export async function getPostBySlugFromDB(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await getAllPostsFromDB();
    return posts.find(post => post.slug === slug) || null;
  } catch (error) {
    console.error('Error getting post by slug:', error);
    return null;
  }
}

// 更新單篇文章
export async function updatePostInDB(slug: string, updates: Partial<BlogPost>): Promise<boolean> {
  try {
    const posts = await getAllPostsFromDB();
    const postIndex = posts.findIndex(post => post.slug === slug);
    
    if (postIndex === -1) {
      return false;
    }
    
    posts[postIndex] = { ...posts[postIndex], ...updates };
    return await savePostsToDB(posts);
  } catch (error) {
    console.error('Error updating post:', error);
    return false;
  }
}

// 刪除單篇文章
export async function deletePostFromDB(slug: string): Promise<boolean> {
  try {
    const posts = await getAllPostsFromDB();
    const filteredPosts = posts.filter(post => post.slug !== slug);
    
    if (filteredPosts.length === posts.length) {
      return false; // 文章不存在
    }
    
    return await savePostsToDB(filteredPosts);
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
}

// 資料庫狀態檢查
export async function getDatabaseStatus(): Promise<{
  type: 'file' | 'kv';
  available: boolean;
  postCount: number;
}> {
  try {
    const posts = await getAllPostsFromDB();
    return {
      type: isProduction && kv ? 'kv' : 'file',
      available: true,
      postCount: posts.length
    };
  } catch (error) {
    return {
      type: isProduction && kv ? 'kv' : 'file',
      available: false,
      postCount: 0
    };
  }
}