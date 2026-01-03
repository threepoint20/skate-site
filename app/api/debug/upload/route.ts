import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestAuth, getSecurityHeaders } from '@/app/lib/security';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Upload Debug API Called ===');
    
    // 檢查認證
    const authData = verifyRequestAuth(request);
    console.log('Auth data:', authData);
    
    if (!authData || authData.role !== 'administrator') {
      return NextResponse.json(
        { error: '需要管理員權限' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    // 檢查請求頭
    const contentType = request.headers.get('content-type');
    const contentLength = request.headers.get('content-length');
    
    console.log('Request headers:', {
      contentType,
      contentLength,
      userAgent: request.headers.get('user-agent'),
      origin: request.headers.get('origin'),
    });

    // 環境變數檢查
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      hasBlobToken: !!(process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN),
      blobTokenLength: (process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN)?.length || 0,
      allBlobEnvVars: Object.keys(process.env).filter(key => key.includes('BLOB')),
    };
    
    console.log('Environment check:', envCheck);

    // 嘗試解析 FormData
    let formDataInfo = {};
    try {
      const formData = await request.formData();
      const file = formData.get('image') as File;
      
      if (file) {
        formDataInfo = {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          lastModified: file.lastModified,
        };
        console.log('File info:', formDataInfo);
      } else {
        console.log('No file found in FormData');
        formDataInfo = { error: 'No file found' };
      }
    } catch (formError: any) {
      console.error('FormData parsing error:', formError);
      formDataInfo = { 
        error: 'FormData parsing failed', 
        message: formError.message,
        stack: formError.stack 
      };
    }

    // 檢查 Vercel Blob 可用性
    let blobCheck = {};
    try {
      const { put } = await import('@vercel/blob');
      blobCheck = { 
        importSuccess: true,
        putFunction: typeof put === 'function'
      };
    } catch (blobError: any) {
      blobCheck = { 
        importSuccess: false, 
        error: blobError.message 
      };
    }

    return NextResponse.json({
      success: true,
      debug: {
        timestamp: new Date().toISOString(),
        environment: envCheck,
        request: {
          method: request.method,
          url: request.url,
          contentType,
          contentLength: contentLength ? parseInt(contentLength) : null,
        },
        formData: formDataInfo,
        vercelBlob: blobCheck,
        limits: {
          maxFileSize: '5MB',
          allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
        }
      }
    }, { headers: getSecurityHeaders() });

  } catch (error: any) {
    console.error('Debug API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      debug: {
        timestamp: new Date().toISOString(),
        errorType: error.constructor.name,
      }
    }, { 
      status: 500, 
      headers: getSecurityHeaders() 
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    // 檢查認證
    const authData = verifyRequestAuth(request);
    if (!authData || authData.role !== 'administrator') {
      return NextResponse.json(
        { error: '需要管理員權限' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    // 基本環境檢查
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      platform: process.platform,
      nodeVersion: process.version,
      hasBlobToken: !!(process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN),
      blobEnvVars: Object.keys(process.env).filter(key => key.includes('BLOB')),
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Upload debug endpoint is working',
      environment: envInfo,
      instructions: {
        testUpload: 'POST to this endpoint with FormData containing an "image" field',
        maxFileSize: '5MB',
        supportedFormats: ['JPEG', 'PNG', 'WebP', 'GIF'],
      }
    }, { headers: getSecurityHeaders() });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { 
      status: 500, 
      headers: getSecurityHeaders() 
    });
  }
}