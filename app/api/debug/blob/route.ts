import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestAuth, getSecurityHeaders } from '@/app/lib/security';

// 除錯 API：開發環境預設啟用；production 需明確設 ENABLE_DEBUG_API=true
function debugApiDisabled(): boolean {
  return process.env.NODE_ENV === 'production' && process.env.ENABLE_DEBUG_API !== 'true';
}

export async function GET(request: NextRequest) {
  if (debugApiDisabled()) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }
  try {
    // 驗證管理員權限
    const authData = verifyRequestAuth(request);
    if (!authData || authData.role !== 'administrator') {
      return NextResponse.json(
        { error: '需要管理員權限' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    // 收集環境資訊
    const blobEnvVars = Object.keys(process.env)
      .filter(key => key.includes('BLOB'))
      .reduce((acc, key) => {
        acc[key] = process.env[key] ? `設定 (長度: ${process.env[key]!.length})` : '未設定';
        return acc;
      }, {} as Record<string, string>);

    const debugInfo = {
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      isProduction: process.env.NODE_ENV === 'production',
      blobEnvironmentVariables: blobEnvVars,
      hasMainToken: !!(process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN),
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(debugInfo, { headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Debug blob error:', error);
    return NextResponse.json(
      { error: '診斷過程中發生錯誤' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}