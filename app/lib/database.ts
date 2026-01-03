// 資料庫適配器 - 支援本地檔案系統、Vercel KV 和 Neon PostgreSQL
import { BlogPost } from './blogData';
import { SiteImage } from './imageManager';
import fs from 'fs';
import path from 'path';

// 檢查是否在生產環境
const isProduction = process.env.NODE_ENV === 'production';

// 本地檔案路徑
const DATA_FILE = path.join(process.cwd(), 'data', 'blog-posts.json');
const IMAGES_FILE = path.join(process.cwd(), 'data', 'site-images.json');

// 資料庫類型檢測
const getDatabaseType = () => {
  if (process.env.DATABASE_URL) return 'neon';
  if (isProduction && process.env.KV_REST_API_URL) return 'kv';
  return 'file';
};

// Neon 資料庫客戶端
let neonDb: any = null;
let blogPostsTable: any = null;

// Vercel KV 客戶端
let kv: any = null;
const KV_KEY = 'blog-posts';

// 初始化資料庫連接
async function initDatabase() {
  const dbType = getDatabaseType();
  
  if (dbType === 'neon' && !neonDb) {
    try {
      const { neon } = await import('@neondatabase/serverless');
      const { drizzle } = await import('drizzle-orm/neon-http');
      const { blogPosts } = await import('./schema');
      
      const sql = neon(process.env.DATABASE_URL!);
      neonDb = drizzle(sql);
      blogPostsTable = blogPosts;
      
      console.log('✅ Neon database connected');
    } catch (error) {
      console.error('❌ Failed to connect to Neon:', error);
      throw error;
    }
  } else if (dbType === 'kv' && !kv) {
    try {
      kv = (await import('@vercel/kv')).kv;
      console.log('✅ Vercel KV connected');
    } catch (error) {
      console.warn('⚠️ Vercel KV not available, falling back to file system');
    }
  }
}

// 確保本地資料目錄存在
function ensureDataDirectory() {
  if (getDatabaseType() === 'file') {
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }
}

// 轉換 Neon 資料到 BlogPost 格式
function convertNeonToBlogPost(neonPost: any): BlogPost {
  return {
    id: neonPost.id,
    slug: neonPost.slug,
    title: neonPost.title,
    content: neonPost.content,
    excerpt: neonPost.excerpt,
    date: neonPost.date,
    category: neonPost.category,
    readTime: neonPost.readTime,
    author: neonPost.author,
    tags: neonPost.tags || [],
    status: neonPost.status as '已發布' | '草稿',
    views: neonPost.views || 0,
    coverImage: neonPost.coverImage,
  };
}

// 轉換 BlogPost 到 Neon 格式
function convertBlogPostToNeon(post: BlogPost): any {
  return {
    slug: post.slug,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    date: post.date,
    category: post.category,
    readTime: post.readTime,
    author: post.author,
    tags: post.tags,
    status: post.status,
    views: post.views,
    coverImage: post.coverImage,
  };
}

// 讀取所有文章
export async function getAllPostsFromDB(): Promise<BlogPost[]> {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'neon') {
      await initDatabase();
      const { desc } = await import('drizzle-orm');
      
      const posts = await neonDb.select().from(blogPostsTable).orderBy(desc(blogPostsTable.id));
      return posts.map(convertNeonToBlogPost);
    } else if (dbType === 'kv') {
      await initDatabase();
      const posts = await kv.get(KV_KEY);
      return posts || [];
    } else {
      // 檔案系統
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
    const dbType = getDatabaseType();
    
    if (dbType === 'neon') {
      // Neon 不支援批量替換，需要個別處理
      // 這個函數主要用於從檔案系統遷移，生產環境建議使用個別的 CRUD 操作
      console.warn('Neon database: Use individual CRUD operations instead of bulk save');
      return true;
    } else if (dbType === 'kv') {
      await initDatabase();
      await kv.set(KV_KEY, posts);
      return true;
    } else {
      // 檔案系統
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
    const dbType = getDatabaseType();
    
    if (dbType === 'neon') {
      await initDatabase();
      const { eq } = await import('drizzle-orm');
      
      const posts = await neonDb.select().from(blogPostsTable).where(eq(blogPostsTable.slug, slug));
      return posts.length > 0 ? convertNeonToBlogPost(posts[0]) : null;
    } else {
      const posts = await getAllPostsFromDB();
      return posts.find(post => post.slug === slug) || null;
    }
  } catch (error) {
    console.error('Error getting post by slug:', error);
    return null;
  }
}

// 新增文章
export async function addPostToDB(post: Omit<BlogPost, 'id'>): Promise<BlogPost | null> {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'neon') {
      await initDatabase();
      
      const newPostData = convertBlogPostToNeon(post as BlogPost);
      const insertedPosts = await neonDb.insert(blogPostsTable).values(newPostData).returning();
      
      return insertedPosts.length > 0 ? convertNeonToBlogPost(insertedPosts[0]) : null;
    } else {
      // KV 或檔案系統：使用現有邏輯
      const posts = await getAllPostsFromDB();
      const newPost = { ...post, id: Date.now() } as BlogPost;
      posts.unshift(newPost);
      const success = await savePostsToDB(posts);
      return success ? newPost : null;
    }
  } catch (error) {
    console.error('Error adding post:', error);
    return null;
  }
}

// 更新單篇文章
export async function updatePostInDB(slug: string, updates: Partial<BlogPost>): Promise<boolean> {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'neon') {
      await initDatabase();
      const { eq } = await import('drizzle-orm');
      
      const updateData = convertBlogPostToNeon(updates as BlogPost);
      delete updateData.slug; // 不更新 slug
      
      const result = await neonDb.update(blogPostsTable)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(blogPostsTable.slug, slug));
      
      return result.rowCount > 0;
    } else {
      const posts = await getAllPostsFromDB();
      const postIndex = posts.findIndex(post => post.slug === slug);
      
      if (postIndex === -1) {
        return false;
      }
      
      posts[postIndex] = { ...posts[postIndex], ...updates };
      return await savePostsToDB(posts);
    }
  } catch (error) {
    console.error('Error updating post:', error);
    return false;
  }
}

// 刪除單篇文章
export async function deletePostFromDB(slug: string): Promise<boolean> {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'neon') {
      await initDatabase();
      const { eq } = await import('drizzle-orm');
      
      const result = await neonDb.delete(blogPostsTable).where(eq(blogPostsTable.slug, slug));
      return result.rowCount > 0;
    } else {
      const posts = await getAllPostsFromDB();
      const filteredPosts = posts.filter(post => post.slug !== slug);
      
      if (filteredPosts.length === posts.length) {
        return false; // 文章不存在
      }
      
      return await savePostsToDB(filteredPosts);
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
}

// 資料庫狀態檢查
export async function getDatabaseStatus(): Promise<{
  type: 'file' | 'kv' | 'neon';
  available: boolean;
  postCount: number;
  url?: string;
}> {
  try {
    const dbType = getDatabaseType();
    const posts = await getAllPostsFromDB();
    
    return {
      type: dbType as 'file' | 'kv' | 'neon',
      available: true,
      postCount: posts.length,
      url: dbType === 'neon' ? process.env.DATABASE_URL?.replace(/\/\/.*@/, '//***@') : undefined
    };
  } catch (error) {
    return {
      type: getDatabaseType() as 'file' | 'kv' | 'neon',
      available: false,
      postCount: 0
    };
  }
}

// ==================== 圖片管理功能 ====================

// 轉換 Neon 圖片資料到 SiteImage 格式
function convertNeonToSiteImage(neonImage: any): SiteImage {
  return {
    id: neonImage.imageId,
    name: neonImage.name,
    description: neonImage.description || '',
    url: neonImage.url,
    category: neonImage.category,
    alt: neonImage.alt,
    order: neonImage.order || 0,
    createdAt: neonImage.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: neonImage.updatedAt?.toISOString() || new Date().toISOString(),
  };
}

// 轉換 SiteImage 到 Neon 格式
function convertSiteImageToNeon(image: SiteImage): any {
  return {
    imageId: image.id,
    name: image.name,
    description: image.description,
    url: image.url,
    category: image.category,
    alt: image.alt,
    order: image.order || 0,
  };
}

// 讀取所有圖片
export async function getAllImagesFromDB(): Promise<SiteImage[]> {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'neon') {
      await initDatabase();
      const { desc } = await import('drizzle-orm');
      const { siteImages } = await import('./schema');
      
      const images = await neonDb.select().from(siteImages).orderBy(desc(siteImages.id));
      return images.map(convertNeonToSiteImage);
    } else if (dbType === 'kv') {
      await initDatabase();
      const images = await kv.get('site-images');
      return images || [];
    } else {
      // 檔案系統
      ensureDataDirectory();
      
      if (!fs.existsSync(IMAGES_FILE)) {
        return [];
      }
      
      const data = fs.readFileSync(IMAGES_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading images from database:', error);
    return [];
  }
}

// 儲存所有圖片
export async function saveImagesToDB(images: SiteImage[]): Promise<boolean> {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'neon') {
      // Neon 不支援批量替換，需要個別處理
      console.warn('Neon database: Use individual CRUD operations instead of bulk save');
      return true;
    } else if (dbType === 'kv') {
      await initDatabase();
      await kv.set('site-images', images);
      return true;
    } else {
      // 檔案系統
      ensureDataDirectory();
      fs.writeFileSync(IMAGES_FILE, JSON.stringify(images, null, 2), 'utf8');
      return true;
    }
  } catch (error) {
    console.error('Error saving images to database:', error);
    return false;
  }
}

// 根據 ID 獲取單張圖片
export async function getImageByIdFromDB(imageId: string): Promise<SiteImage | null> {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'neon') {
      await initDatabase();
      const { eq } = await import('drizzle-orm');
      const { siteImages } = await import('./schema');
      
      const images = await neonDb.select().from(siteImages).where(eq(siteImages.imageId, imageId));
      return images.length > 0 ? convertNeonToSiteImage(images[0]) : null;
    } else {
      const images = await getAllImagesFromDB();
      return images.find(image => image.id === imageId) || null;
    }
  } catch (error) {
    console.error('Error getting image by ID:', error);
    return null;
  }
}

// 新增圖片
export async function addImageToDB(image: SiteImage): Promise<SiteImage | null> {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'neon') {
      await initDatabase();
      const { siteImages } = await import('./schema');
      
      const newImageData = convertSiteImageToNeon(image);
      const insertedImages = await neonDb.insert(siteImages).values(newImageData).returning();
      
      return insertedImages.length > 0 ? convertNeonToSiteImage(insertedImages[0]) : null;
    } else {
      // KV 或檔案系統：使用現有邏輯
      const images = await getAllImagesFromDB();
      images.push(image);
      const success = await saveImagesToDB(images);
      return success ? image : null;
    }
  } catch (error) {
    console.error('Error adding image:', error);
    return null;
  }
}

// 更新單張圖片
export async function updateImageInDB(imageId: string, updates: Partial<SiteImage>): Promise<boolean> {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'neon') {
      await initDatabase();
      const { eq } = await import('drizzle-orm');
      const { siteImages } = await import('./schema');
      
      const updateData = convertSiteImageToNeon(updates as SiteImage);
      delete updateData.imageId; // 不更新 imageId
      
      const result = await neonDb.update(siteImages)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(siteImages.imageId, imageId));
      
      return result.rowCount > 0;
    } else {
      const images = await getAllImagesFromDB();
      const imageIndex = images.findIndex(image => image.id === imageId);
      
      if (imageIndex === -1) {
        return false;
      }
      
      images[imageIndex] = { ...images[imageIndex], ...updates, updatedAt: new Date().toISOString() };
      return await saveImagesToDB(images);
    }
  } catch (error) {
    console.error('Error updating image:', error);
    return false;
  }
}

// 刪除單張圖片
export async function deleteImageFromDB(imageId: string): Promise<boolean> {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'neon') {
      await initDatabase();
      const { eq } = await import('drizzle-orm');
      const { siteImages } = await import('./schema');
      
      const result = await neonDb.delete(siteImages).where(eq(siteImages.imageId, imageId));
      return result.rowCount > 0;
    } else {
      const images = await getAllImagesFromDB();
      const filteredImages = images.filter(image => image.id !== imageId);
      
      if (filteredImages.length === images.length) {
        return false; // 圖片不存在
      }
      
      return await saveImagesToDB(filteredImages);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}