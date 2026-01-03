// 建立圖片表的遷移腳本
const { neon } = require('@neondatabase/serverless');

async function createImagesTable() {
  if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL not found, skipping images table creation');
    return;
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    
    console.log('🔄 Creating site_images table...');
    
    // 建立圖片表
    await sql`
      CREATE TABLE IF NOT EXISTS site_images (
        id SERIAL PRIMARY KEY,
        image_id TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        url TEXT NOT NULL,
        category TEXT NOT NULL,
        alt TEXT NOT NULL,
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    console.log('✅ site_images table created successfully');
    
    // 檢查是否需要插入預設圖片
    const existingImages = await sql`SELECT COUNT(*) as count FROM site_images`;
    const imageCount = parseInt(existingImages[0].count);
    
    if (imageCount === 0) {
      console.log('🔄 Inserting default images...');
      
      // 插入預設活動照片
      await sql`
        INSERT INTO site_images (image_id, name, description, url, category, alt, "order")
        VALUES 
          ('activity-1', '活動照片 1', '滑板活動現場照片', '/activity1.png', 'activity', '活動照片 1', 1),
          ('activity-2', '活動照片 2', '滑板活動現場照片', '/activity2.png', 'activity', '活動照片 2', 2),
          ('activity-3', '活動照片 3', '滑板活動現場照片', '/activity3.png', 'activity', '活動照片 3', 3)
      `;
      
      console.log('✅ Default images inserted successfully');
    } else {
      console.log(`ℹ️ Found ${imageCount} existing images, skipping default insertion`);
    }
    
    console.log('🎉 Images table setup completed!');
    
  } catch (error) {
    console.error('❌ Error creating images table:', error);
    process.exit(1);
  }
}

createImagesTable();