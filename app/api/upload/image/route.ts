import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { verifyRequestAuth, getSecurityHeaders, checkRateLimit, getClientIP } from '@/app/lib/security';

// 允許的圖片類型
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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

    // 轉換檔案為 Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 儲存檔案路徑
    const uploadPath = path.join(process.cwd(), 'public', 'images', 'blog', safeFileName);

    // 寫入檔案
    await writeFile(uploadPath, buffer);

    // 返回圖片 URL
    const imageUrl = `/images/blog/${safeFileName}`;

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