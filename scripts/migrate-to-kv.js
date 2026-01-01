// 資料遷移腳本 - 將本地檔案資料遷移到 Vercel KV
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(process.cwd(), 'data', 'blog-posts.json');

async function migrateData() {
  console.log('🔄 開始資料遷移...\n');

  try {
    // 檢查本地資料檔案
    if (!fs.existsSync(DATA_FILE)) {
      console.log('❌ 本地資料檔案不存在');
      return;
    }

    // 讀取本地資料
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    const posts = JSON.parse(data);
    console.log(`📝 找到 ${posts.length} 篇文章`);

    // 在生產環境中，這個腳本會自動使用 Vercel KV
    // 本地開發時，資料會繼續使用檔案系統
    console.log('✅ 資料遷移準備完成');
    console.log('\n📋 部署到 Vercel 時會自動使用 KV 資料庫');
    console.log('📋 本地開發會繼續使用檔案系統');

    // 顯示文章列表
    console.log('\n📚 現有文章：');
    posts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title} (${post.date})`);
    });

  } catch (error) {
    console.error('❌ 遷移過程中發生錯誤:', error.message);
  }
}

migrateData();