import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestAuth, getSecurityHeaders, checkRateLimit, getClientIP } from '@/app/lib/security';
import { SiteImage, defaultImages } from '@/app/lib/imageManager';
import { getAllImagesFromDB, saveImagesToDB, addImageToDB } from '@/app/lib/database';

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

    let images = await getAllImagesFromDB();
    
    // 如果沒有圖片，初始化預設圖片
    if (images.length === 0) {
      console.log('No images found, initializing with default images');
      for (const defaultImage of defaultImages) {
        await addImageToDB(defaultImage);
      }
      images = await getAllImagesFromDB();
    }
    
    return NextResponse.json(images, { headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Error reading images:', error);
    // 如果資料庫讀取失敗，返回預設圖片
    return NextResponse.json(defaultImages, { headers: getSecurityHeaders() });
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

    const savedImage = await addImageToDB(newImage);
    
    if (savedImage) {
      return NextResponse.json(savedImage, { headers: getSecurityHeaders() });
    } else {
      return NextResponse.json(
        { error: 'Failed to add image' },
        { status: 500, headers: getSecurityHeaders() }
      );
    }
  } catch (error) {
    console.error('Error adding image:', error);
    return NextResponse.json(
      { error: 'Failed to add image' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}