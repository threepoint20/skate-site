// 部落格文章資料管理 - 使用檔案系統儲存

export interface BlogPost {
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
  // 💡 新增：文章封面圖路徑 (選填，為了相容舊資料)
  coverImage?: string; 
}

// 生成唯一ID
export function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}

// 生成slug (支援中文與特殊字元轉換)
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

// 獲取所有文章
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    // 呼叫我們自己的 API 路由 (/app/api/blog/route.ts)
    const response = await fetch('/api/blog', {
      cache: 'no-store' 
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

// 儲存所有文章 (透過 POST API)
export async function savePosts(posts: BlogPost[]): Promise<boolean> {
  try {
    const response = await fetch('/api/blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(posts),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error saving posts:', error);
    return false;
  }
}

// 根據 slug 獲取單篇文章
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`/api/blog/${slug}`, {
      cache: 'no-store'
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

// 新增文章
export async function addPost(postData: Omit<BlogPost, 'id' | 'slug' | 'views'>): Promise<BlogPost | null> {
  try {
    const posts = await getAllPosts();
    
    const newPost: BlogPost = {
      ...postData,
      id: generateId(),
      slug: generateSlug(postData.title),
      views: 0,
      // 💡 確保封面圖有值，若沒傳入則給予預設佔位圖
      coverImage: postData.coverImage || '/images/blog/default-cover.png'
    };
    
    posts.unshift(newPost); // 新文章放在最前面
    const success = await savePosts(posts);
    
    return success ? newPost : null;
  } catch (error) {
    console.error('Error adding post:', error);
    return null;
  }
}

// 更新文章 (Partial 代表可以只更新部分欄位)
export async function updatePost(slug: string, updates: Partial<BlogPost>): Promise<boolean> {
  try {
    const response = await fetch(`/api/blog/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error updating post:', error);
    return false;
  }
}

// 刪除文章
export async function deletePost(slug: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/blog/${slug}`, {
      method: 'DELETE',
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
}

// 增加瀏覽數
export async function incrementViews(slug: string): Promise<void> {
  try {
    const post = await getPostBySlug(slug);
    if (post) {
      await updatePost(slug, { views: (post.views || 0) + 1 });
    }
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
}