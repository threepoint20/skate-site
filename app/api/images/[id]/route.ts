import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestAuth, getSecurityHeaders, checkRateLimit, getClientIP } from '@/app/lib/security';
import { SiteImage } from '@/app/lib/imageManager';
import fs from 'fs/promises';
import path from 'path';

// 圖片資料檔案路徑
const IMAGES_FILE = path.join(process.cwd(), 'data', 'site-images.json');

// 讀取圖片資料
async function loadImages(): Promise<SiteImage[]> {
  try {
    const data = await fs.readFile(IMAGES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// 儲存圖片資料
async function saveImages(images: SiteImage[]): Promise<void> {
  const dataDir = path.dirname(IMAGES_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  await fs.writeFile(IMAGES_FILE, JSON.stringify(images, null, 2), 'utf8');
}

// 獲取單張圖片
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const images = await loadImages();
    const image = images.find(img => img.id === id);
    
    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }
    
    return NextResponse.json(image, { headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Error reading image:', error);
    return NextResponse.json(
      { error: 'Failed to read image' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// 更新圖片
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const updates = await request.json();
    
    const images = await loadImages();
    const imageIndex = images.findIndex(img => img.id === id);
    
    if (imageIndex === -1) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }
    
    // 更新圖片資料
    images[imageIndex] = {
      ...images[imageIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await saveImages(images);
    
    return NextResponse.json(images[imageIndex], { headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// 刪除圖片
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    
    const images = await loadImages();
    const filteredImages = images.filter(img => img.id !== id);
    
    if (filteredImages.length === images.length) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }
    
    await saveImages(filteredImages);
    
    return NextResponse.json({ success: true }, { headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}