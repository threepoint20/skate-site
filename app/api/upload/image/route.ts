import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getSecurityHeaders, checkRateLimit, getClientIP, isAdminRequest } from '@/app/lib/security';
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_LABEL } from '@/app/lib/uploadLimits';

// Route segment config
export const runtime = 'nodejs';
export const maxDuration = 30;
export const dynamic = 'force-dynamic';

// 允許的圖片類型 → 固定的副檔名（不使用使用者提供的檔名副檔名）
const TYPE_TO_EXTENSION: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// 依檔頭 (magic bytes) 判斷實際的圖片格式；client 傳來的 file.type 可以偽造
function detectImageType(bytes: Uint8Array): string | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47
    && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a) return 'image/png';
  if (bytes.length >= 6 && String.fromCharCode(...bytes.slice(0, 6)).match(/^GIF8[79]a$/)) return 'image/gif';
  if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF'
    && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP') return 'image/webp';
  return null;
}

function hasBlobToken(): boolean {
  return !!(process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN);
}

// 上傳到 Vercel Blob
async function uploadToVercelBlob(data: Buffer, fileName: string, contentType: string): Promise<string> {
  const { put } = await import('@vercel/blob');
  const blob = await put(fileName, data, {
    access: 'public',
    addRandomSuffix: false,
    contentType,
  });
  return blob.url;
}

// 上傳到本地檔案系統 (開發環境)
async function uploadToLocalFileSystem(data: Buffer, fileName: string): Promise<string> {
  const uploadDir = path.join(process.cwd(), 'public', 'images', 'blog');
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), data);
  return `/images/blog/${fileName}`;
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: getSecurityHeaders() });
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) return errorResponse('需要管理員權限', 401);
    if (!checkRateLimit(`upload:${getClientIP(request)}`, 50, 15 * 60 * 1000)) {
      return errorResponse('上傳請求過於頻繁，請稍後再試', 429);
    }

    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > MAX_UPLOAD_BYTES + 64 * 1024) {
      return errorResponse(`圖片檔案過大，請選擇小於 ${MAX_UPLOAD_LABEL} 的圖片`, 413);
    }

    const formData = await request.formData();
    const file = formData.get('image');
    if (!file || typeof file === 'string') return errorResponse('請選擇要上傳的圖片', 400);

    if (file.size > MAX_UPLOAD_BYTES) {
      return errorResponse(`圖片檔案過大，請選擇小於 ${MAX_UPLOAD_LABEL} 的圖片`, 400);
    }

    const originalExtension = path.extname(file.name || '').toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(originalExtension)) {
      return errorResponse('不支援的副檔名，請使用 .jpg、.png、.webp 或 .gif', 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const detectedType = detectImageType(new Uint8Array(buffer.subarray(0, 16)));
    if (!detectedType || !TYPE_TO_EXTENSION[detectedType]) {
      return errorResponse('檔案內容不是有效的 JPG、PNG、WebP 或 GIF 圖片', 400);
    }

    const safeFileName = `blog-cover-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${TYPE_TO_EXTENSION[detectedType]}`;

    let imageUrl: string;
    if (process.env.NODE_ENV === 'production') {
      // 正式環境：使用 Vercel Blob
      if (!hasBlobToken()) {
        return errorResponse('伺服器尚未設定圖片儲存空間（BLOB_READ_WRITE_TOKEN），請聯絡管理員', 500);
      }
      imageUrl = await uploadToVercelBlob(buffer, safeFileName, detectedType);
    } else {
      // 開發環境：寫入 public/images/blog
      imageUrl = await uploadToLocalFileSystem(buffer, safeFileName);
    }

    return NextResponse.json(
      {
        success: true,
        imageUrl,
        fileName: safeFileName,
        size: file.size,
        type: detectedType,
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Error uploading image:', error);
    return errorResponse('圖片上傳失敗，請稍後再試', 500);
  }
}
