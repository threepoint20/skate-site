// 將本地資料遷移到 Neon 資料庫
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const DATA_FILE = path.join(process.cwd(), 'data', 'blog-posts.json');

async function migrateToNeon() {
  console.log('🔄 開始遷移資料到 Neon...\n');

  // 檢查環境變數
  if (!process.env.DATABASE_URL) {
    console.log('❌ 請先設定 DATABASE_URL 環境變數');
    console.log('範例: DATABASE_URL=postgresql://username:password@host/database?sslmode=require');
    return;
  }

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

    // 初始化 Neon 連接
    const { neon } = require('@neondatabase/serverless');
    const { drizzle } = require('drizzle-orm/neon-http');
    
    // 手動定義 schema（避免模組路徑問題）
    const { pgTable, serial, text, integer, timestamp, json } = require('drizzle-orm/pg-core');
    
    const blogPosts = pgTable('blog_posts', {
      id: serial('id').primaryKey(),
      slug: text('slug').notNull().unique(),
      title: text('title').notNull(),
      content: text('content').notNull(),
      excerpt: text('excerpt').notNull(),
      date: text('date').notNull(),
      category: text('category').notNull(),
      readTime: text('read_time').notNull(),
      author: text('author').notNull(),
      tags: json('tags').notNull().default([]),
      status: text('status').notNull().default('已發布'),
      views: integer('views').notNull().default(0),
      coverImage: text('cover_image'),
      createdAt: timestamp('created_at').defaultNow(),
      updatedAt: timestamp('updated_at').defaultNow(),
    });

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    console.log('✅ 已連接到 Neon 資料庫');

    // 遷移每篇文章
    let successCount = 0;
    for (const post of posts) {
      try {
        const neonPost = {
          slug: post.slug,
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          date: post.date,
          category: post.category,
          readTime: post.readTime,
          author: post.author,
          tags: post.tags || [],
          status: post.status || '已發布',
          views: post.views || 0,
          coverImage: post.coverImage,
        };

        await db.insert(blogPosts).values(neonPost);
        console.log(`✅ 已遷移: ${post.title}`);
        successCount++;
      } catch (error) {
        console.log(`❌ 遷移失敗: ${post.title} - ${error.message}`);
      }
    }

    console.log(`\n🎉 遷移完成！成功遷移 ${successCount}/${posts.length} 篇文章`);

    // 驗證遷移結果
    const migratedPosts = await db.select().from(blogPosts);
    console.log(`📊 Neon 資料庫中現有 ${migratedPosts.length} 篇文章`);

  } catch (error) {
    console.error('❌ 遷移過程中發生錯誤:', error.message);
  }
}

migrateToNeon();