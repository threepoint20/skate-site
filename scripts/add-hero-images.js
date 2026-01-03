#!/usr/bin/env node

// 新增各頁面橫幅圖片到資料庫
require('dotenv').config({ path: '.env.local' });

async function addHeroImages() {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL not found');
      process.exit(1);
    }

    console.log('🔄 Adding hero images for all pages...');
    
    // 動態導入 Neon
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL);
    
    // 要新增的橫幅圖片
    const heroImages = [
      // 關於我們橫幅
      {
        image_id: 'hero-about-main',
        name: '關於我們橫幅',
        description: '關於我們頁面的背景橫幅圖片',
        url: '/activity2.png', // 暫時使用現有圖片
        category: 'hero-about',
        alt: '關於我們頁面橫幅',
        order: 1
      },
      
      // 滑板指南橫幅
      {
        image_id: 'hero-guides-main',
        name: '滑板指南橫幅',
        description: '滑板指南頁面的背景橫幅圖片',
        url: '/activity3.png', // 暫時使用現有圖片
        category: 'hero-guides',
        alt: '滑板指南頁面橫幅',
        order: 1
      },
      
      // 滑板裝備橫幅
      {
        image_id: 'hero-equipment-main',
        name: '滑板裝備橫幅',
        description: '滑板裝備頁面的背景橫幅圖片',
        url: '/activity1.png', // 暫時使用現有圖片
        category: 'hero-equipment',
        alt: '滑板裝備頁面橫幅',
        order: 1
      },
      
      // 聯絡我們橫幅
      {
        image_id: 'hero-contact-main',
        name: '聯絡我們橫幅',
        description: '聯絡我們頁面的背景橫幅圖片',
        url: '/activity2.png', // 暫時使用現有圖片
        category: 'hero-contact',
        alt: '聯絡我們頁面橫幅',
        order: 1
      },
      
      // 部落格橫幅
      {
        image_id: 'hero-blog-main',
        name: '部落格橫幅',
        description: '部落格頁面的背景橫幅圖片',
        url: '/activity3.png', // 暫時使用現有圖片
        category: 'hero-blog',
        alt: '部落格頁面橫幅',
        order: 1
      }
    ];
    
    // 檢查現有圖片數量
    const existingImages = await sql`SELECT COUNT(*) as count FROM site_images`;
    const currentCount = parseInt(existingImages[0].count);
    console.log(`📊 Current image count: ${currentCount}`);
    
    // 批量插入橫幅圖片
    for (const image of heroImages) {
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
    
    console.log('\n🎉 Hero images setup completed!');
    console.log('\n📝 管理員使用指南:');
    console.log('1. 登入管理員帳號');
    console.log('2. 前往 /admin/images');
    console.log('3. 選擇對應的橫幅分類:');
    console.log('   - hero-about: 關於我們橫幅');
    console.log('   - hero-guides: 滑板指南橫幅');
    console.log('   - hero-equipment: 滑板裝備橫幅');
    console.log('   - hero-contact: 聯絡我們橫幅');
    console.log('   - hero-blog: 部落格橫幅');
    console.log('4. 上傳新圖片，會自動替換頁面橫幅背景');
    
  } catch (error) {
    console.error('❌ Failed to add hero images:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// 執行腳本
addHeroImages();