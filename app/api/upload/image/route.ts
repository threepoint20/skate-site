import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { verifyRequestAuth, getSecurityHeaders, checkRateLimit, getClientIP } from '@/app/lib/security';

// 允許的圖片類型
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// 檢查是否在生產環境
const isProduction = process.env.NODE_ENV === 'production';

// 上傳到 Vercel Blob (生產環境)
async function uploadToVercelBlob(file: File, fileName: string) {
  try {
    // 動態導入 Vercel Blob
    const { put } = await import('@vercel/blob');
    
    const blob = await put(fileName, file, {
      access: 'public',
      addRandomSuffix: false,
    });
    
    return blob.url;
  } catch (error) {
    console.error('Vercel Blob upload failed:', error);
    throw new Error('雲端儲存上傳失敗');
  }
}

// 上傳到本地檔案系統 (開發環境)
async function uploadToLocalFileSystem(file: File, fileName: string) {
  try {
    // 確保目錄存在
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'blog');
    await mkdir(uploadDir, { recursive: true });
    
    // 轉換檔案為 Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // 儲存檔案
    const uploadPath = path.join(uploadDir, fileName);
    await writeFile(uploadPath, buffer);
    
    return `/images/blog/${fileName}`;
  } catch (error) {
    console.error('Local file system upload failed:', error);
    throw new Error('本地儲存上傳失敗');
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(`upload:${clientIP}`, 10, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: '上傳請求過於頻繁，請稍後再試' },
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

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: '請選擇要上傳的圖片' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // 驗證檔案類型
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: '不支援的圖片格式，請使用 JPG、PNG、WebP 或 GIF' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // 驗證檔案大小
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: '圖片檔案過大，請選擇小於 5MB 的圖片' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // 生成安全的檔案名稱
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = path.extname(file.name).toLowerCase();
    const safeFileName = `blog-cover-${timestamp}-${randomString}${fileExtension}`;

    // 根據環境選擇上傳方式
    let imageUrl: string;
    
    if (isProduction) {
      // 生產環境：使用 Vercel Blob
      imageUrl = await uploadToVercelBlob(file, safeFileName);
    } else {
      // 開發環境：使用本地檔案系統
      imageUrl = await uploadToLocalFileSystem(file, safeFileName);
    }

    return NextResponse.json(
      {
        success: true,
        imageUrl,
        fileName: safeFileName,
        originalName: file.name,
        size: file.size,
        type: file.type
      },
      { headers: getSecurityHeaders() }
    );

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: '圖片上傳失敗，請稍後再試' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}