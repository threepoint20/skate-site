import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestAuth, getSecurityHeaders, checkRateLimit, getClientIP } from '@/app/lib/security';
import { SiteImage } from '@/app/lib/imageManager';
import { getAllImagesFromDB, getImageByIdFromDB, updateImageInDB, deleteImageFromDB } from '@/app/lib/database';

// 獲取單張圖片
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const image = await getImageByIdFromDB(id);
    
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
    
    const success = await updateImageInDB(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    
    if (!success) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }
    
    const updatedImage = await getImageByIdFromDB(id);
    return NextResponse.json(updatedImage, { headers: getSecurityHeaders() });
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
    
    const success = await deleteImageFromDB(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }
    
    return NextResponse.json({ success: true }, { headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}