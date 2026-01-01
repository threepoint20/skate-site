import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { verifyRequestAuth, getSecurityHeaders, checkRateLimit, getClientIP } from '@/app/lib/security';

// 允許的圖片類型
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// 檢查是否在生產環境
const isProduction = process.env.NODE_ENV === 'production';

// 檢查 Vercel Blob 是否可用
function isVercelBlobAvailable(): boolean {
  const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN;
  console.log('Vercel Blob availability check:', {
    hasToken: !!token,
    tokenLength: token?.length || 0,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    allBlobEnvVars: Object.keys(process.env).filter(key => key.includes('BLOB'))
  });
  return !!token;
}

// 上傳到 Vercel Blob (生產環境)
async function uploadToVercelBlob(file: File, fileName: string) {
  try {
    console.log('Attempting Vercel Blob upload:', {
      fileName,
      fileSize: file.size,
      fileType: file.type,
      hasToken: isVercelBlobAvailable()
    });
    
    // 檢查 token 是否可用
    if (!isVercelBlobAvailable()) {
      throw new Error('Vercel Blob token not configured');
    }
    
    // 動態導入 Vercel Blob
    const { put } = await import('@vercel/blob');
    
    // 嘗試上傳，不指定 token（讓 SDK 自動使用環境變數）
    const blob = await put(fileName, file, {
      access: 'public',
      addRandomSuffix: false,
    });
    
    console.log('Vercel Blob upload successful:', {
      url: blob.url,
      downloadUrl: blob.downloadUrl
    });
    
    return blob.url;
  } catch (error: any) {
    console.error('Vercel Blob upload failed:', {
      error: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // 提供更具體的錯誤訊息
    if (error.message?.includes('No token found')) {
      throw new Error('Vercel Blob token 未正確設定。請檢查 BLOB_READ_WRITE_TOKEN 環境變數。');
    } else if (error.message?.includes('unauthorized')) {
      throw new Error('Vercel Blob token 無效或已過期。請重新設定 token。');
    } else {
      throw new Error(`雲端儲存上傳失敗: ${error.message}`);
    }
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

// 智慧上傳：根據環境和可用性選擇最佳方案
async function smartUpload(file: File, fileName: string): Promise<string> {
  console.log('Smart upload starting:', {
    isProduction,
    blobAvailable: isVercelBlobAvailable(),
    fileName,
    fileSize: file.size
  });

  if (isProduction) {
    if (isVercelBlobAvailable()) {
      // 生產環境且 Vercel Blob 可用
      try {
        return await uploadToVercelBlob(file, fileName);
      } catch (error: any) {
        console.error('Vercel Blob failed in production:', error);
        
        // 如果是 token 問題，提供具體指導
        if (error.message?.includes('token') || error.message?.includes('unauthorized')) {
          throw new Error(`
            Vercel Blob 配置問題：${error.message}
            
            請檢查以下步驟：
            1. 確認在 Vercel 控制台已設定 BLOB_READ_WRITE_TOKEN
            2. 重新部署專案以載入新的環境變數
            3. 確認 token 沒有過期或被撤銷
          `);
        }
        
        throw error;
      }
    } else {
      // 生產環境但 Vercel Blob 不可用
      throw new Error(`
        生產環境需要配置 Vercel Blob 儲存。
        
        請在 Vercel 控制台設定以下環境變數：
        - BLOB_READ_WRITE_TOKEN
        
        然後重新部署專案。
      `);
    }
  } else {
    // 開發環境：使用本地檔案系統
    console.log('Using local file system for development');
    return await uploadToLocalFileSystem(file, fileName);
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

    // 根據環境和可用性智慧選擇上傳方式
    let imageUrl: string;
    
    try {
      imageUrl = await smartUpload(file, safeFileName);
    } catch (error: any) {
      console.error('Smart upload failed:', error);
      return NextResponse.json(
        { error: error.message || '圖片上傳失敗，請稍後再試' },
        { status: 500, headers: getSecurityHeaders() }
      );
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