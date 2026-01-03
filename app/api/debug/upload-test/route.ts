import { NextRequest, NextResponse } from 'next/server';

// Route segment config - 設定檔案上傳限制
export const runtime = 'nodejs';
export const maxDuration = 30;
export const dynamic = 'force-dynamic';

// 測試用的上傳端點 - 不需要認證，僅用於診斷
export async function POST(request: NextRequest) {
  try {
    console.log('=== Upload Test Debug API Called ===');
    
    // 檢查請求頭
    const contentType = request.headers.get('content-type');
    const contentLength = request.headers.get('content-length');
    
    console.log('Request info:', {
      method: request.method,
      url: request.url,
      contentType,
      contentLength: contentLength ? parseInt(contentLength) : null,
      userAgent: request.headers.get('user-agent'),
    });

    // 嘗試解析 FormData
    let formDataInfo = {};
    let parseError = null;
    
    try {
      console.log('Attempting to parse FormData...');
      const formData = await request.formData();
      console.log('FormData parsed successfully');
      
      const file = formData.get('image') as File;
      
      if (file) {
        formDataInfo = {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          lastModified: file.lastModified,
          sizeInMB: (file.size / 1024 / 1024).toFixed(2),
        };
        console.log('File info:', formDataInfo);
        
        // 檢查檔案大小限制
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_SIZE) {
          console.warn('File exceeds size limit:', file.size, 'bytes');
        }
        
        // 檢查檔案類型
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          console.warn('Invalid file type:', file.type);
        }
        
      } else {
        console.log('No file found in FormData');
        formDataInfo = { error: 'No file found in FormData' };
      }
    } catch (error: any) {
      console.error('FormData parsing error:', error);
      parseError = {
        message: error.message,
        name: error.name,
        stack: error.stack,
      };
    }

    // 環境檢查
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      platform: process.platform,
      nodeVersion: process.version,
      hasBlobToken: !!(process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN),
    };

    return NextResponse.json({
      success: !parseError,
      timestamp: new Date().toISOString(),
      request: {
        contentType,
        contentLength: contentLength ? parseInt(contentLength) : null,
        hasFormData: !parseError,
      },
      file: formDataInfo,
      parseError,
      environment: envInfo,
      limits: {
        maxFileSize: '5MB (5,242,880 bytes)',
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
      },
      diagnosis: {
        likely413Causes: [
          'File size exceeds server limit',
          'Next.js body parser limit (default ~1MB for API routes)',
          'Vercel function payload limit (6MB for Hobby, 50MB for Pro)',
          'Network timeout or connection issues',
        ],
        recommendations: [
          'Check file size is under 5MB',
          'Verify Next.js configuration',
          'Check Vercel function limits',
          'Try with smaller test file',
        ],
      },
    });

  } catch (error: any) {
    console.error('Debug test API error:', error);
    return NextResponse.json({
      success: false,
      error: {
        message: error.message,
        name: error.name,
        stack: error.stack,
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Upload test debug endpoint',
    usage: 'POST with FormData containing "image" field',
    note: 'This endpoint does not require authentication and is for debugging only',
  });
}