import { NextRequest, NextResponse } from 'next/server';
import { getSecurityHeaders, checkRateLimit, getClientIP, isAdminRequest } from '@/app/lib/security';
import { SiteImage } from '@/app/lib/imageManager';
import { validateImageInput } from '@/app/lib/imageValidation';
import { getAllImagesFromDB, addImageToDB } from '@/app/lib/database';

// 獲取所有圖片（公開、唯讀）
export async function GET(request: NextRequest) {
  const clientIP = getClientIP(request);
  if (!checkRateLimit(`images-read:${clientIP}`, 300, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: '請求過於頻繁，請稍後再試' },
      { status: 429, headers: getSecurityHeaders() }
    );
  }

  try {
    const images = await getAllImagesFromDB();
    return NextResponse.json(images, { headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Error reading images:', error);
    return NextResponse.json(
      { error: 'Failed to read images' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// 新增圖片 (需要管理員權限)
export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: '需要管理員權限' }, { status: 401, headers: getSecurityHeaders() });
    }
    if (!checkRateLimit(`images-write:${getClientIP(request)}`, 200, 15 * 60 * 1000)) {
      return NextResponse.json({ error: '請求過於頻繁，請稍後再試' }, { status: 429, headers: getSecurityHeaders() });
    }

    const imageData = await request.json();
    const validationError = validateImageInput(imageData, false);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400, headers: getSecurityHeaders() });
    }

    const now = new Date().toISOString();
    const newImage: SiteImage = {
      name: imageData.name,
      description: imageData.description || '',
      url: imageData.url,
      category: imageData.category,
      alt: imageData.alt,
      order: imageData.order ?? 0,
      id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      createdAt: now,
      updatedAt: now,
    };

    const savedImage = await addImageToDB(newImage);
    if (savedImage) {
      return NextResponse.json(savedImage, { headers: getSecurityHeaders() });
    }
    return NextResponse.json({ error: 'Failed to add image' }, { status: 500, headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Error adding image:', error);
    return NextResponse.json({ error: 'Failed to add image' }, { status: 500, headers: getSecurityHeaders() });
  }
}
