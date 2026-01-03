import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestAuth, getSecurityHeaders, checkRateLimit, getClientIP } from '@/app/lib/security';
import { SiteImage, defaultImages } from '@/app/lib/imageManager';
import fs from 'fs/promises';
import path from 'path';

// 圖片資料檔案路徑
const IMAGES_FILE = path.join(process.cwd(), 'data', 'site-images.json');

// 確保資料目錄存在
async function ensureDataDirectory() {
  const dataDir = path.dirname(IMAGES_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// 讀取圖片資料
async function loadImages(): Promise<SiteImage[]> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(IMAGES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // 如果檔案不存在，建立預設資料
    await saveImages(defaultImages);
    return defaultImages;
  }
}

// 儲存圖片資料
async function saveImages(images: SiteImage[]): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(IMAGES_FILE, JSON.stringify(images, null, 2), 'utf8');
}

// 獲取所有圖片
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(`images-read:${clientIP}`, 100, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: '請求過於頻繁，請稍後再試' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const images = await loadImages();
    return NextResponse.json(images, { headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Error reading images:', error);
    return NextResponse.json(
      { error: 'Failed to read images' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// 新增圖片
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(`images-write:${clientIP}`, 10, 15 * 60 * 1000)) {
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

    const imageData = await request.json();
    
    // 生成唯一 ID
    const newImage: SiteImage = {
      ...imageData,
      id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const images = await loadImages();
    images.push(newImage);
    await saveImages(images);

    return NextResponse.json(newImage, { headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Error adding image:', error);
    return NextResponse.json(
      { error: 'Failed to add image' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}