import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestAuth, getSecurityHeaders } from '@/app/lib/security';

export async function POST(request: NextRequest) {
  try {
    // 驗證管理員權限
    const authData = verifyRequestAuth(request);
    if (!authData || authData.role !== 'administrator') {
      return NextResponse.json(
        { error: '需要管理員權限' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'DATABASE_URL not configured' },
        { status: 500, headers: getSecurityHeaders() }
      );
    }

    // 動態導入 Neon
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL);
    
    console.log('🔄 Running site_images table migration...');
    
    // 建立 site_images 表
    await sql`
      CREATE TABLE IF NOT EXISTS "site_images" (
        "id" serial PRIMARY KEY NOT NULL,
        "image_id" text NOT NULL,
        "name" text NOT NULL,
        "description" text,
        "url" text NOT NULL,
        "category" text NOT NULL,
        "alt" text NOT NULL,
        "order" integer DEFAULT 0,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        CONSTRAINT "site_images_image_id_unique" UNIQUE("image_id")
      )
    `;
    
    console.log('✅ site_images table created');
    
    // 檢查是否需要插入預設資料
    const existingImages = await sql`SELECT COUNT(*) as count FROM site_images`;
    const imageCount = parseInt(existingImages[0].count);
    
    if (imageCount === 0) {
      console.log('🔄 Inserting default images...');
      
      await sql`
        INSERT INTO site_images (image_id, name, description, url, category, alt, "order")
        VALUES 
          ('activity-1', '活動照片 1', '滑板活動現場照片', '/activity1.png', 'activity', '活動照片 1', 1),
          ('activity-2', '活動照片 2', '滑板活動現場照片', '/activity2.png', 'activity', '活動照片 2', 2),
          ('activity-3', '活動照片 3', '滑板活動現場照片', '/activity3.png', 'activity', '活動照片 3', 3)
      `;
      
      console.log('✅ Default images inserted');
    }
    
    // 驗證結果
    const finalCount = await sql`SELECT COUNT(*) as count FROM site_images`;
    
    return NextResponse.json(
      {
        success: true,
        message: 'Migration completed successfully',
        imageCount: parseInt(finalCount[0].count),
      },
      { headers: getSecurityHeaders() }
    );
    
  } catch (error: any) {
    console.error('❌ Migration error:', error);
    return NextResponse.json(
      { 
        error: 'Migration failed', 
        details: error.message,
        stack: error.stack 
      },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}