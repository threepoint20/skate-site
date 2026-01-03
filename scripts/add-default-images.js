#!/usr/bin/env node

// 新增預設圖片到各個分類
require('dotenv').config({ path: '.env.local' });

async function addDefaultImages() {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL not found');
      process.exit(1);
    }

    console.log('🔄 Adding default images to all categories...');
    
    // 動態導入 Neon
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL);
    
    // 檢查現有圖片數量
    const existingImages = await sql`SELECT COUNT(*) as count FROM site_images`;
    const currentCount = parseInt(existingImages[0].count);
    console.log(`📊 Current image count: ${currentCount}`);
    
    // 要新增的預設圖片
    const defaultImages = [
      // Hero 分類 - 首頁橫幅
      {
        image_id: 'hero-main',
        name: '首頁主橫幅',
        description: '網站首頁的主要背景圖片',
        url: '/activity1.png', // 暫時使用現有圖片
        category: 'hero',
        alt: '滑板首頁橫幅',
        order: 1
      },
      
      // About 分類 - 關於我們
      {
        image_id: 'team-alex',
        name: 'Alex Chen 創辦人',
        description: '創辦人兼主教練的照片',
        url: '/activity2.png', // 暫時使用現有圖片
        category: 'about',
        alt: 'Alex Chen 創辦人照片',
        order: 1
      },
      {
        image_id: 'team-sarah',
        name: 'Sarah Lin 活動策劃',
        description: '活動策劃負責人的照片',
        url: '/activity3.png', // 暫時使用現有圖片
        category: 'about',
        alt: 'Sarah Lin 活動策劃照片',
        order: 2
      },
      {
        image_id: 'team-mike',
        name: 'Mike Wang 技術指導',
        description: '技術指導的照片',
        url: '/activity1.png', // 暫時使用現有圖片
        category: 'about',
        alt: 'Mike Wang 技術指導照片',
        order: 3
      },
      
      // Equipment 分類 - 裝備介紹
      {
        image_id: 'skateboard-anatomy',
        name: '滑板構造圖',
        description: '詳細的滑板各部件構造說明圖',
        url: '/activity2.png', // 暫時使用現有圖片
        category: 'equipment',
        alt: '滑板構造說明圖',
        order: 1
      },
      {
        image_id: 'deck-types',
        name: '板面類型',
        description: '不同類型的滑板板面展示',
        url: '/activity3.png', // 暫時使用現有圖片
        category: 'equipment',
        alt: '滑板板面類型展示',
        order: 2
      },
      {
        image_id: 'wheels-bearings',
        name: '輪子與軸承',
        description: '滑板輪子和軸承的詳細介紹',
        url: '/activity1.png', // 暫時使用現有圖片
        category: 'equipment',
        alt: '滑板輪子與軸承',
        order: 3
      },
      
      // General 分類 - 一般圖片
      {
        image_id: 'ollie-tutorial',
        name: 'Ollie 教學',
        description: 'Ollie 技巧的步驟教學圖',
        url: '/activity2.png', // 暫時使用現有圖片
        category: 'general',
        alt: 'Ollie 技巧教學',
        order: 1
      },
      {
        image_id: 'kickflip-demo',
        name: 'Kickflip 示範',
        description: 'Kickflip 技巧的動作示範',
        url: '/activity3.png', // 暫時使用現有圖片
        category: 'general',
        alt: 'Kickflip 技巧示範',
        order: 2
      },
      {
        image_id: 'safety-gear',
        name: '安全裝備',
        description: '滑板安全防護裝備展示',
        url: '/activity1.png', // 暫時使用現有圖片
        category: 'general',
        alt: '滑板安全裝備',
        order: 3
      }
    ];
    
    // 批量插入圖片
    for (const image of defaultImages) {
      try {
        await sql`
          INSERT INTO site_images (image_id, name, description, url, category, alt, "order")
          VALUES (${image.image_id}, ${image.name}, ${image.description}, ${image.url}, ${image.category}, ${image.alt}, ${image.order})
          ON CONFLICT (image_id) DO NOTHING
        `;
        console.log(`✅ Added: ${image.name} (${image.category})`);
      } catch (error) {
        console.warn(`⚠️ Skipped: ${image.name} (already exists or error)`);
      }
    }
    
    // 最終統計
    const finalImages = await sql`SELECT COUNT(*) as count FROM site_images`;
    const finalCount = parseInt(finalImages[0].count);
    const addedCount = finalCount - currentCount;
    
    console.log(`\n📊 Final Statistics:`);
    console.log(`- Total images: ${finalCount}`);
    console.log(`- Added images: ${addedCount}`);
    
    // 按分類顯示統計
    const categoryStats = await sql`
      SELECT category, COUNT(*) as count 
      FROM site_images 
      GROUP BY category 
      ORDER BY category
    `;
    
    console.log('\n📋 Images by category:');
    categoryStats.forEach(stat => {
      console.log(`  - ${stat.category}: ${stat.count} images`);
    });
    
    console.log('\n🎉 Default images setup completed!');
    
  } catch (error) {
    console.error('❌ Failed to add default images:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// 執行腳本
addDefaultImages();