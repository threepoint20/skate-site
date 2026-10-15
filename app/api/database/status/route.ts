import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseStatus } from '@/app/lib/database';
import { getSecurityHeaders, isAdminRequest } from '@/app/lib/security';

// 資料庫狀態（僅管理員）
export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: '需要管理員權限' }, { status: 401, headers: getSecurityHeaders() });
  }
  try {
    const status = await getDatabaseStatus();
    return NextResponse.json(status, { headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Error getting database status:', error);
    return NextResponse.json(
      { error: 'Failed to get database status' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
