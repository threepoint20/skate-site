// 執行資料庫遷移腳本
const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL not found, skipping migration');
    return;
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    
    console.log('🔄 Running database migration...');
    
    // 讀取遷移檔案
    const migrationPath = path.join(process.cwd(), 'drizzle', '0001_add_site_images_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // 分割 SQL 語句（以分號分隔）
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    // 執行每個 SQL 語句
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('🔄 Executing:', statement.substring(0, 50) + '...');
        await sql([statement]);
      }
    }
    
    console.log('✅ Migration completed successfully!');
    
    // 驗證表是否建立成功
    const result = await sql`SELECT COUNT(*) as count FROM site_images`;
    console.log(`ℹ️ Found ${result[0].count} images in the table`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();