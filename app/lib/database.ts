// 資料庫適配器 - 支援本地檔案系統與 Neon PostgreSQL
import { BlogPost } from './blogData';
import { SiteImage } from './imageManager';
import fs from 'fs';
import path from 'path';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { blogPosts, siteImages } from './schema';

// 本地檔案路徑
const DATA_FILE = path.join(process.cwd(), 'data', 'blog-posts.json');
const IMAGES_FILE = path.join(process.cwd(), 'data', 'site-images.json');

type DatabaseType = 'file' | 'neon';

// 資料庫類型檢測
const getDatabaseType = (): DatabaseType => {
  if (process.env.DATABASE_URL) return 'neon';
  return 'file';
};

// Vercel 的檔案系統是唯讀的，正式環境不能用檔案模式寫入
function assertWritableFileStore() {
  if (process.env.VERCEL) {
    throw new Error('正式環境未設定 DATABASE_URL：Vercel 檔案系統為唯讀，無法寫入資料。請設定 Neon DATABASE_URL。');
  }
}

// Neon 資料庫客戶端
let neonDb: NeonHttpDatabase | null = null;

async function getNeon(): Promise<NeonHttpDatabase> {
  if (!neonDb) {
    const { neon } = await import('@neondatabase/serverless');
    const { drizzle } = await import('drizzle-orm/neon-http');
    neonDb = drizzle(neon(process.env.DATABASE_URL!));
  }
  return neonDb;
}

// 確保本地資料目錄存在
function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

type NeonPostRow = typeof blogPosts.$inferSelect;
type NeonImageRow = typeof siteImages.$inferSelect;

function toIso(value: Date | string | null | undefined): string | undefined {
  if (!value) return undefined;
  const d = value instanceof Date ? value : new Date(value);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

// 轉換 Neon 資料到 BlogPost 格式
function convertNeonToBlogPost(row: NeonPostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    content: row.content,
    excerpt: row.excerpt,
    date: row.date,
    updatedAt: toIso(row.updatedAt),
    category: row.category,
    readTime: row.readTime,
    author: row.author,
    tags: row.tags || [],
    status: row.status as BlogPost['status'],
    views: row.views || 0,
    coverImage: row.coverImage || undefined,
  };
}

// 只挑出允許寫入的欄位（不含 id、slug、updatedAt）
const WRITABLE_POST_FIELDS = [
  'title', 'content', 'excerpt', 'date', 'category', 'readTime',
  'author', 'tags', 'status', 'views', 'coverImage',
] as const;

function pickPostFields(post: Partial<BlogPost>): Partial<NeonPostRow> {
  const out: Record<string, unknown> = {};
  for (const key of WRITABLE_POST_FIELDS) {
    if (post[key] !== undefined) out[key] = post[key];
  }
  if (out.coverImage === '') out.coverImage = null;
  return out as Partial<NeonPostRow>;
}

function readPostsFile(): BlogPost[] {
  ensureDataDirectory();
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

// 讀取所有文章
export async function getAllPostsFromDB(): Promise<BlogPost[]> {
  try {
    if (getDatabaseType() === 'neon') {
      const db = await getNeon();
      const { desc } = await import('drizzle-orm');
      const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.id));
      return posts.map(convertNeonToBlogPost);
    }
    return readPostsFile();
  } catch (error) {
    console.error('Error reading posts from database:', error);
    return [];
  }
}

// 只取已發布文章（給訪客與 sitemap 使用）
export async function getPublishedPostsFromDB(): Promise<BlogPost[]> {
  const posts = await getAllPostsFromDB();
  return posts.filter(post => post.status === '已發布');
}

// 儲存所有文章（僅檔案模式使用）
async function savePostsToDB(posts: BlogPost[]): Promise<boolean> {
  assertWritableFileStore();
  ensureDataDirectory();
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), 'utf8');
  return true;
}

// 根據 slug 獲取單篇文章
export async function getPostBySlugFromDB(slug: string): Promise<BlogPost | null> {
  try {
    if (getDatabaseType() === 'neon') {
      const db = await getNeon();
      const { eq } = await import('drizzle-orm');
      const posts = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
      return posts.length > 0 ? convertNeonToBlogPost(posts[0]) : null;
    }
    const posts = await getAllPostsFromDB();
    return posts.find(post => post.slug === slug) || null;
  } catch (error) {
    console.error('Error getting post by slug:', error);
    return null;
  }
}

// 新增文章
export async function addPostToDB(post: Omit<BlogPost, 'id'>): Promise<BlogPost | null> {
  try {
    if (getDatabaseType() === 'neon') {
      const db = await getNeon();
      const values = { ...pickPostFields(post), slug: post.slug } as typeof blogPosts.$inferInsert;
      const inserted = await db.insert(blogPosts).values(values).returning();
      return inserted.length > 0 ? convertNeonToBlogPost(inserted[0]) : null;
    }
    const posts = await getAllPostsFromDB();
    const now = new Date().toISOString();
    const newPost = { ...post, id: Date.now(), updatedAt: now } as BlogPost;
    posts.unshift(newPost);
    return (await savePostsToDB(posts)) ? newPost : null;
  } catch (error) {
    console.error('Error adding post:', error);
    return null;
  }
}

// 更新單篇文章（不允許修改 id / slug）
export async function updatePostInDB(slug: string, updates: Partial<BlogPost>): Promise<boolean> {
  try {
    const fields = pickPostFields(updates);
    if (getDatabaseType() === 'neon') {
      const db = await getNeon();
      const { eq } = await import('drizzle-orm');
      const result = await db.update(blogPosts)
        .set({ ...fields, updatedAt: new Date() })
        .where(eq(blogPosts.slug, slug))
        .returning({ id: blogPosts.id });
      return result.length > 0;
    }
    const posts = await getAllPostsFromDB();
    const index = posts.findIndex(post => post.slug === slug);
    if (index === -1) return false;
    posts[index] = { ...posts[index], ...(fields as Partial<BlogPost>), updatedAt: new Date().toISOString() };
    return await savePostsToDB(posts);
  } catch (error) {
    console.error('Error updating post:', error);
    return false;
  }
}

// 瀏覽數 +1（只對已發布文章，Neon 使用原子更新）
export async function incrementPostViewsInDB(slug: string): Promise<number | null> {
  try {
    if (getDatabaseType() === 'neon') {
      const db = await getNeon();
      const { eq, and, sql } = await import('drizzle-orm');
      const result = await db.update(blogPosts)
        .set({ views: sql`${blogPosts.views} + 1` })
        .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, '已發布')))
        .returning({ views: blogPosts.views });
      return result.length > 0 ? result[0].views : null;
    }
    const posts = await getAllPostsFromDB();
    const post = posts.find(p => p.slug === slug && p.status === '已發布');
    if (!post) return null;
    post.views = (post.views || 0) + 1;
    await savePostsToDB(posts);
    return post.views;
  } catch (error) {
    console.error('Error incrementing views:', error);
    return null;
  }
}

// 刪除單篇文章
export async function deletePostFromDB(slug: string): Promise<boolean> {
  return (await deletePostsFromDB([slug])) > 0;
}

// 批次刪除文章，回傳實際刪除數量
export async function deletePostsFromDB(slugs: string[]): Promise<number> {
  if (slugs.length === 0) return 0;
  try {
    if (getDatabaseType() === 'neon') {
      const db = await getNeon();
      const { inArray } = await import('drizzle-orm');
      const result = await db.delete(blogPosts)
        .where(inArray(blogPosts.slug, slugs))
        .returning({ id: blogPosts.id });
      return result.length;
    }
    const posts = await getAllPostsFromDB();
    const remaining = posts.filter(post => !slugs.includes(post.slug));
    const deleted = posts.length - remaining.length;
    if (deleted > 0) await savePostsToDB(remaining);
    return deleted;
  } catch (error) {
    console.error('Error deleting posts:', error);
    return 0;
  }
}

// 資料庫狀態檢查（僅管理員 API 使用）
export async function getDatabaseStatus(): Promise<{
  type: DatabaseType;
  available: boolean;
  postCount: number;
}> {
  const type = getDatabaseType();
  try {
    const posts = await getAllPostsFromDB();
    return { type, available: true, postCount: posts.length };
  } catch {
    return { type, available: false, postCount: 0 };
  }
}

// ==================== 圖片管理功能 ====================

function convertNeonToSiteImage(row: NeonImageRow): SiteImage {
  return {
    id: row.imageId,
    name: row.name,
    description: row.description || '',
    url: row.url,
    category: row.category as SiteImage['category'],
    alt: row.alt,
    order: row.alt ? (row.order || 0) : 0,
    createdAt: toIso(row.createdAt) || new Date().toISOString(),
    updatedAt: toIso(row.updatedAt) || new Date().toISOString(),
  };
}

const WRITABLE_IMAGE_FIELDS = ['name', 'description', 'url', 'category', 'alt', 'order'] as const;

// 只挑出有傳入的欄位，避免部分更新時把 order 等欄位覆寫成預設值
function pickImageFields(image: Partial<SiteImage>): Partial<NeonImageRow> {
  const out: Record<string, unknown> = {};
  for (const key of WRITABLE_IMAGE_FIELDS) {
    if (image[key] !== undefined) out[key] = image[key];
  }
  return out as Partial<NeonImageRow>;
}

function readImagesFile(): SiteImage[] {
  ensureDataDirectory();
  if (!fs.existsSync(IMAGES_FILE)) return [];
  return JSON.parse(fs.readFileSync(IMAGES_FILE, 'utf8'));
}

// 讀取所有圖片（失敗時拋出錯誤，由 API 決定回應）
export async function getAllImagesFromDB(): Promise<SiteImage[]> {
  if (getDatabaseType() === 'neon') {
    const db = await getNeon();
    const { desc } = await import('drizzle-orm');
    const images = await db.select().from(siteImages).orderBy(desc(siteImages.id));
    return images.map(convertNeonToSiteImage);
  }
  return readImagesFile();
}

async function saveImagesToDB(images: SiteImage[]): Promise<boolean> {
  assertWritableFileStore();
  ensureDataDirectory();
  fs.writeFileSync(IMAGES_FILE, JSON.stringify(images, null, 2), 'utf8');
  return true;
}

// 根據 ID 獲取單張圖片
export async function getImageByIdFromDB(imageId: string): Promise<SiteImage | null> {
  try {
    if (getDatabaseType() === 'neon') {
      const db = await getNeon();
      const { eq } = await import('drizzle-orm');
      const images = await db.select().from(siteImages).where(eq(siteImages.imageId, imageId));
      return images.length > 0 ? convertNeonToSiteImage(images[0]) : null;
    }
    const images = await getAllImagesFromDB();
    return images.find(image => image.id === imageId) || null;
  } catch (error) {
    console.error('Error getting image by ID:', error);
    return null;
  }
}

// 新增圖片
export async function addImageToDB(image: SiteImage): Promise<SiteImage | null> {
  try {
    if (getDatabaseType() === 'neon') {
      const db = await getNeon();
      const values = { ...pickImageFields(image), imageId: image.id } as typeof siteImages.$inferInsert;
      const inserted = await db.insert(siteImages).values(values).returning();
      return inserted.length > 0 ? convertNeonToSiteImage(inserted[0]) : null;
    }
    const images = await getAllImagesFromDB();
    images.push(image);
    return (await saveImagesToDB(images)) ? image : null;
  } catch (error) {
    console.error('Error adding image:', error);
    return null;
  }
}

// 更新單張圖片（只更新有傳入的欄位）
export async function updateImageInDB(imageId: string, updates: Partial<SiteImage>): Promise<boolean> {
  try {
    const fields = pickImageFields(updates);
    if (getDatabaseType() === 'neon') {
      const db = await getNeon();
      const { eq } = await import('drizzle-orm');
      const result = await db.update(siteImages)
        .set({ ...fields, updatedAt: new Date() })
        .where(eq(siteImages.imageId, imageId))
        .returning({ id: siteImages.id });
      return result.length > 0;
    }
    const images = await getAllImagesFromDB();
    const index = images.findIndex(image => image.id === imageId);
    if (index === -1) return false;
    images[index] = { ...images[index], ...(fields as Partial<SiteImage>), updatedAt: new Date().toISOString() };
    return await saveImagesToDB(images);
  } catch (error) {
    console.error('Error updating image:', error);
    return false;
  }
}

// 刪除單張圖片
export async function deleteImageFromDB(imageId: string): Promise<boolean> {
  try {
    if (getDatabaseType() === 'neon') {
      const db = await getNeon();
      const { eq } = await import('drizzle-orm');
      const result = await db.delete(siteImages)
        .where(eq(siteImages.imageId, imageId))
        .returning({ id: siteImages.id });
      return result.length > 0;
    }
    const images = await getAllImagesFromDB();
    const filtered = images.filter(image => image.id !== imageId);
    if (filtered.length === images.length) return false;
    return await saveImagesToDB(filtered);
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}