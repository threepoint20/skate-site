import { NextResponse } from 'next/server';
import { getDatabaseStatus } from '@/app/lib/database';
import { getSecurityHeaders } from '@/app/lib/security';

export async function GET() {
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