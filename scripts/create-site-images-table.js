#!/usr/bin/env node

// 建立 site_images 表的獨立腳本
require('dotenv').config({ path: '.env.local' });

async function createSiteImagesTable() {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL not found in environment variables');
      process.exit(1);
    }

    console.log('🔄 Connecting to Neon database...');
    
    // 動態導入 Neon
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL);
    
    console.log('🔄 Creating site_images table...');
    
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
    
    console.log('✅ site_images table created successfully');
    
    // 檢查是否需要插入預設資料
    const existingImages = await sql`SELECT COUNT(*) as count FROM site_images`;
    const imageCount = parseInt(existingImages[0].count);
    
    console.log(`📊 Current image count: ${imageCount}`);
    
    if (imageCount === 0) {
      console.log('🔄 Inserting default activity images...');
      
      await sql`
        INSERT INTO site_images (image_id, name, description, url, category, alt, "order")
        VALUES 
          ('activity-1', '活動照片 1', '滑板活動現場照片', '/activity1.png', 'activity', '活動照片 1', 1),
          ('activity-2', '活動照片 2', '滑板活動現場照片', '/activity2.png', 'activity', '活動照片 2', 2),
          ('activity-3', '活動照片 3', '滑板活動現場照片', '/activity3.png', 'activity', '活動照片 3', 3)
        ON CONFLICT (image_id) DO NOTHING
      `;
      
      console.log('✅ Default images inserted');
    } else {
      console.log('ℹ️ Images already exist, skipping default data insertion');
    }
    
    // 驗證結果
    const finalCount = await sql`SELECT COUNT(*) as count FROM site_images`;
    const finalImageCount = parseInt(finalCount[0].count);
    
    console.log(`✅ Migration completed successfully!`);
    console.log(`📊 Total images in database: ${finalImageCount}`);
    
    // 顯示現有圖片
    const images = await sql`SELECT image_id, name, category FROM site_images ORDER BY "order"`;
    console.log('\n📋 Current images:');
    images.forEach(img => {
      console.log(`  - ${img.image_id}: ${img.name} (${img.category})`);
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// 執行遷移
createSiteImagesTable();