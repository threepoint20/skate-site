// 全站圖片管理系統
export interface SiteImage {
  id: string;
  name: string;
  description: string;
  url: string;
  category: 'activity' | 'hero' | 'hero-about' | 'hero-guides' | 'hero-equipment' | 'hero-contact' | 'hero-blog' | 'about' | 'equipment' | 'general';
  alt: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

// 預設圖片配置
export const defaultImages: SiteImage[] = [
  {
    id: 'activity-1',
    name: '活動照片 1',
    description: '滑板活動現場照片',
    url: '/activity1.png',
    category: 'activity',
    alt: '活動照片 1',
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'activity-2',
    name: '活動照片 2',
    description: '滑板活動現場照片',
    url: '/activity2.png',
    category: 'activity',
    alt: '活動照片 2',
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'activity-3',
    name: '活動照片 3',
    description: '滑板活動現場照片',
    url: '/activity3.png',
    category: 'activity',
    alt: '活動照片 3',
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// 圖片分類
export const imageCategories = {
  activity: '活動照片',
  hero: '首頁橫幅',
  'hero-about': '關於我們橫幅',
  'hero-guides': '滑板指南橫幅',
  'hero-equipment': '滑板裝備橫幅',
  'hero-contact': '聯絡我們橫幅',
  'hero-blog': '部落格橫幅',
  about: '關於我們',
  equipment: '裝備介紹',
  general: '一般圖片',
};

// 同一次頁面瀏覽中共用同一個請求，避免每個元件各自呼叫 /api/images
const IMAGE_CACHE_TTL = 60 * 1000;
let imagesPromise: Promise<SiteImage[]> | null = null;
let imagesFetchedAt = 0;

export function invalidateImageCache() {
  imagesPromise = null;
  imagesFetchedAt = 0;
}

async function fetchImages(): Promise<SiteImage[]> {
  try {
    const response = await fetch('/api/images', {
      cache: 'no-store',
      credentials: 'include',
    });

    if (!response.ok) {
      console.warn('Failed to fetch images, using defaults');
      invalidateImageCache();
      return defaultImages;
    }

    const images: SiteImage[] = await response.json();
    // 資料庫尚未建立任何圖片時，前端使用預設圖片（不會寫入資料庫）
    return images.length > 0 ? images : defaultImages;
  } catch (error) {
    console.error('Error fetching images:', error);
    invalidateImageCache();
    return defaultImages;
  }
}

// 獲取所有圖片
export async function getAllImages(options: { fresh?: boolean } = {}): Promise<SiteImage[]> {
  const expired = Date.now() - imagesFetchedAt > IMAGE_CACHE_TTL;
  if (options.fresh || !imagesPromise || expired) {
    imagesFetchedAt = Date.now();
    imagesPromise = fetchImages();
  }
  return imagesPromise;
}

// 根據分類獲取圖片
export async function getImagesByCategory(category: string): Promise<SiteImage[]> {
  const images = await getAllImages();
  return images
    .filter(img => img.category === category)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

// 獲取單張圖片
export async function getImageById(id: string): Promise<SiteImage | null> {
  const images = await getAllImages();
  return images.find(img => img.id === id) || null;
}

// 更新圖片
export async function updateImage(id: string, updates: Partial<SiteImage>): Promise<boolean> {
  try {
    const response = await fetch(`/api/images/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updates),
    });

    invalidateImageCache();
    return response.ok;
  } catch (error) {
    console.error('Error updating image:', error);
    return false;
  }
}

// 新增圖片
export async function addImage(imageData: Omit<SiteImage, 'id' | 'createdAt' | 'updatedAt'>): Promise<SiteImage | null> {
  try {
    const response = await fetch('/api/images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(imageData),
    });

    invalidateImageCache();
    if (response.ok) {
      return await response.json();
    }
    
    return null;
  } catch (error) {
    console.error('Error adding image:', error);
    return null;
  }
}

// 刪除圖片
export async function deleteImage(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/images/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    invalidateImageCache();
    return response.ok;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}