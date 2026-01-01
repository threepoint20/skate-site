// 部落格文章資料管理 - 使用安全的 JWT 認證

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

// 儲存所有文章 (需要管理員權限)
export async function savePosts(posts: BlogPost[]): Promise<boolean> {
  try {
    const response = await fetch('/api/blog', {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(posts),
    });
    
    if (!response.ok) {
      const error = await response.json();
      const errorMessage = error.error || `HTTP ${response.status}`;
      throw new Error(`API 錯誤: ${errorMessage}`);
    }
    
    return true;
  } catch (error: any) {
    console.error('Error saving posts:', error);
    throw new Error(error.message || '儲存文章失敗');
  }
}

// 根據 slug 獲取單篇文章
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`/api/blog/${slug}`, {
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

// 新增文章
export async function addPost(postData: Omit<BlogPost, 'id' | 'slug' | 'views'>): Promise<BlogPost | null> {
  try {
    const posts = await getAllPosts();
    
    const newPost: BlogPost = {
      ...postData,
      id: generateId(),
      slug: generateSlug(postData.title),
      views: 0,
      coverImage: postData.coverImage || '/images/blog/default-cover.png'
    };
    
    posts.unshift(newPost);
    const success = await savePosts(posts);
    
    if (!success) {
      throw new Error('無法儲存文章資料');
    }
    
    return newPost;
  } catch (error: any) {
    console.error('Error adding post:', error);
    throw new Error(error.message || '新增文章失敗');
  }
}

// 更新文章 (需要管理員權限)
export async function updatePost(slug: string, updates: Partial<BlogPost>): Promise<boolean> {
  try {
    const response = await fetch(`/api/blog/${slug}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update post');
    }
    
    return true;
  } catch (error) {
    console.error('Error updating post:', error);
    return false;
  }
}

// 刪除文章 (需要管理員權限)
export async function deletePost(slug: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/blog/${slug}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete post');
    }
    
    return true;
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