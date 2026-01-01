import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestAuth, getSecurityHeaders } from '@/app/lib/security';

export async function GET(request: NextRequest) {
  try {
    const authData = verifyRequestAuth(request);

    if (!authData) {
      return NextResponse.json(
        { error: '未授權' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: authData.userId,
          username: authData.username,
          role: authData.role,
        },
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { error: '驗證過程中發生錯誤' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}