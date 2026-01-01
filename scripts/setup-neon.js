// Neon 資料庫設定和遷移腳本
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(process.cwd(), 'data', 'blog-posts.json');

async function setupNeon() {
  console.log('🐘 Neon PostgreSQL 設定指南\n');

  console.log('📋 步驟 1: 建立 Neon 資料庫');
  console.log('1. 前往 https://neon.tech');
  console.log('2. 註冊或登入帳號');
  console.log('3. 建立新專案');
  console.log('4. 複製資料庫連接字串 (DATABASE_URL)');

  console.log('\n📋 步驟 2: 設定環境變數');
  console.log('在 .env.local 中添加：');
  console.log('DATABASE_URL=postgresql://username:password@host/database?sslmode=require');

  console.log('\n📋 步驟 3: 執行資料庫遷移');
  console.log('npm run db:generate  # 生成遷移檔案');
  console.log('npm run db:migrate   # 執行遷移');

  console.log('\n📋 步驟 4: Vercel 部署設定');
  console.log('在 Vercel 控制台的環境變數中設定：');
  console.log('DATABASE_URL = 你的 Neon 資料庫連接字串');

  // 檢查本地資料
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    const posts = JSON.parse(data);
    console.log(`\n📚 找到 ${posts.length} 篇本地文章，部署後會自動遷移到 Neon`);
    
    console.log('\n現有文章：');
    posts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title} (${post.date})`);
    });
  }

  console.log('\n✅ 設定完成後，應用程式會自動使用 Neon 資料庫');
}

setupNeon();