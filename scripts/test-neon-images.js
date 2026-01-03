#!/usr/bin/env node

// 直接測試 Neon 資料庫的圖片功能
require('dotenv').config({ path: '.env.local' });

async function testNeonImages() {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL not found');
      process.exit(1);
    }

    console.log('🔄 Testing Neon database image operations...');
    
    // 動態導入 Neon
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL);
    
    // 測試讀取所有圖片
    console.log('\n1. Reading all images...');
    const images = await sql`SELECT * FROM site_images ORDER BY "order"`;
    console.log(`✅ Found ${images.length} images:`);
    images.forEach(img => {
      console.log(`  - ${img.image_id}: ${img.name} (${img.category})`);
    });
    
    // 測試新增圖片
    console.log('\n2. Adding test image...');
    const testImageId = 'test-' + Date.now();
    await sql`
      INSERT INTO site_images (image_id, name, description, url, category, alt, "order")
      VALUES (${testImageId}, '測試圖片', '這是測試圖片', '/test.jpg', 'general', '測試圖片', 99)
    `;
    console.log(`✅ Added test image: ${testImageId}`);
    
    // 測試更新圖片
    console.log('\n3. Updating test image...');
    await sql`
      UPDATE site_images 
      SET name = '更新後的測試圖片', description = '更新後的描述', updated_at = now()
      WHERE image_id = ${testImageId}
    `;
    console.log(`✅ Updated test image`);
    
    // 驗證更新
    const updatedImage = await sql`SELECT * FROM site_images WHERE image_id = ${testImageId}`;
    console.log(`✅ Updated image name: ${updatedImage[0].name}`);
    
    // 測試刪除圖片
    console.log('\n4. Deleting test image...');
    await sql`DELETE FROM site_images WHERE image_id = ${testImageId}`;
    console.log(`✅ Deleted test image`);
    
    // 最終檢查
    console.log('\n5. Final image count...');
    const finalImages = await sql`SELECT COUNT(*) as count FROM site_images`;
    console.log(`✅ Final count: ${finalImages[0].count}`);
    
    console.log('\n🎉 All database operations successful!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// 執行測試
testNeonImages();