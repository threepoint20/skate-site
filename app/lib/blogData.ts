// 部落格文章資料管理 - 使用安全的 JWT 認證

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  updatedAt?: string; // 新增更新時間欄位
  category: string;
  readTime: string;
  author: string;
  tags: string[];
  status: '已發布' | '草稿';
  views: number;
  coverImage?: string; 
}

// slug 可能已經被 URL 編碼（例如中文 slug），統一先解碼再編碼，避免重複編碼
export function normalizeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function slugPath(slug: string): string {
  return encodeURIComponent(normalizeSlug(slug));
}

// 生成唯一ID
export function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}

// 生成slug (支援中文與特殊字元轉換)
export function generateSlug(title: string): string {
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 40); // 縮短以留空間給時間戳
  
  // 如果 slug 為空，使用預設值
  if (!slug) {
    slug = 'post';
  }
  
  // 加入時間戳確保唯一性
  const timestamp = Date.now().toString().slice(-6);
  return `${slug}-${timestamp}`;
}

// 獲取認證標頭
function getAuthHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
  };
}

// 獲取所有文章
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch('/api/blog', {
      cache: 'no-store',
      credentials: 'include', // 包含 cookies
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

// 根據 slug 獲取單篇文章
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`/api/blog/${slugPath(slug)}`, {
      cache: 'no-store',
      credentials: 'include',
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// 新增文章（失敗時丟出含伺服器訊息的錯誤）
export async function addPost(postData: Omit<BlogPost, 'id' | 'slug' | 'views'>): Promise<BlogPost> {
  const response = await fetch('/api/blog', {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({
      ...postData,
      slug: generateSlug(postData.title),
      coverImage: postData.coverImage || undefined,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || '新增文章失敗');
  }

  return await response.json();
}

// 更新文章 (需要管理員權限)，失敗時丟出含伺服器訊息的錯誤
export async function updatePost(slug: string, updates: Partial<BlogPost>): Promise<BlogPost> {
  const response = await fetch(`/api/blog/${slugPath(slug)}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || '更新文章失敗');
  }

  return await response.json();
}

// 刪除文章 (需要管理員權限)
export async function deletePost(slug: string): Promise<boolean> {
  return (await deletePosts([slug])) > 0;
}

// 批次刪除文章 (需要管理員權限)，回傳實際刪除數量
export async function deletePosts(slugs: string[]): Promise<number> {
  const response = await fetch('/api/blog/batch-delete', {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({ slugs }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || '刪除文章失敗');
  }

  const result = await response.json();
  return result.deleted || 0;
}

// 增加瀏覽數（公開端點，訪客也會計數）
export async function incrementViews(slug: string): Promise<number | null> {
  try {
    const response = await fetch(`/api/blog/${slugPath(slug)}/views`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) return null;
    const result = await response.json();
    return result.counted ? result.views : null;
  } catch (error) {
    console.error('Error incrementing views:', error);
    return null;
  }
}
