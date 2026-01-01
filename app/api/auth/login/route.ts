import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, generateToken, checkRateLimit, getClientIP, getSecurityHeaders } from '@/app/lib/security';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(`login:${clientIP}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: '登入嘗試次數過多，請稍後再試' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const { username, password } = await request.json();

    // 輸入驗證
    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: '請提供有效的用戶名和密碼' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // 獲取管理員憑證
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminPasswordHash) {
      console.error('ADMIN_PASSWORD_HASH not configured');
      return NextResponse.json(
        { error: '伺服器配置錯誤' },
        { status: 500, headers: getSecurityHeaders() }
      );
    }

    // 驗證用戶名
    if (username !== adminUsername) {
      return NextResponse.json(
        { error: '用戶名或密碼錯誤' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    // 驗證密碼
    const isValidPassword = await verifyPassword(password, adminPasswordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: '用戶名或密碼錯誤' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    // 生成 JWT token
    const token = generateToken({
      userId: 'admin-001',
      username: adminUsername,
      role: 'administrator',
    });

    // 設定安全的 cookie
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: 'admin-001',
          username: adminUsername,
          role: 'administrator',
          loginTime: new Date().toISOString(),
        },
        token,
      },
      { headers: getSecurityHeaders() }
    );

    // 設定 HttpOnly cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // 改為 lax 以支援 Vercel 的不同部署域名
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '登入過程中發生錯誤' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}