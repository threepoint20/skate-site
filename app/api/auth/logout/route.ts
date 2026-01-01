import { NextResponse } from 'next/server';
import { getSecurityHeaders } from '@/app/lib/security';

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true, message: '已成功登出' },
      { headers: getSecurityHeaders() }
    );

    // 清除 auth cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // 改為 lax 以支援 Vercel 的不同部署域名
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: '登出過程中發生錯誤' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}