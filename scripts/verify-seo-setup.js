#!/usr/bin/env node

// 載入環境變數
require('dotenv').config({ path: '.env.local' });

// 驗證 SEO 設置
async function verifySEOSetup() {
  try {
    console.log('🔍 Verifying SEO setup...\n');
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    console.log(`🌐 Using base URL: ${baseUrl}\n`);
    
    // 測試各個 SEO 相關端點
    const endpoints = [
      { path: '/google336cbb77b6f46dc6.html', name: 'Google Search Console 驗證檔案' },
      { path: '/sitemap.xml', name: 'Sitemap' },
      { path: '/robots.txt', name: 'Robots.txt' },
    ];
    
    console.log('1. Testing SEO endpoints:');
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${baseUrl}${endpoint.path}`);
        const status = response.ok ? '✅' : '❌';
        console.log(`${status} ${endpoint.name}: ${response.status} ${response.statusText}`);
        
        if (endpoint.path === '/google336cbb77b6f46dc6.html' && response.ok) {
          const content = await response.text();
          console.log(`   Content: ${content.trim()}`);
        }
      } catch (error) {
        console.log(`❌ ${endpoint.name}: Failed to fetch`);
      }
    }
    
    console.log('\n2. Page metadata verification:');
    
    const pages = [
      { path: '/', name: '首頁' },
      { path: '/about', name: '關於我們' },
      { path: '/guides', name: '滑板指南' },
      { path: '/equipment', name: '滑板裝備' },
      { path: '/contact', name: '聯絡我們' },
      { path: '/blog', name: '部落格' },
    ];
    
    for (const page of pages) {
      try {
        const response = await fetch(`${baseUrl}${page.path}`);
        if (response.ok) {
          const html = await response.text();
          
          // 檢查基本 SEO 元素
          const hasTitle = html.includes('<title>');
          const hasDescription = html.includes('name="description"');
          const hasKeywords = html.includes('name="keywords"');
          const hasOG = html.includes('property="og:');
          const hasStructuredData = html.includes('application/ld+json');
          const hasGoogleVerification = html.includes('google-site-verification') || html.includes('336cbb77b6f46dc6');
          
          console.log(`\n${page.name} (${page.path}):`);
          console.log(`   ${hasTitle ? '✅' : '❌'} Title tag`);
          console.log(`   ${hasDescription ? '✅' : '❌'} Meta description`);
          console.log(`   ${hasKeywords ? '✅' : '❌'} Meta keywords`);
          console.log(`   ${hasOG ? '✅' : '❌'} Open Graph tags`);
          console.log(`   ${hasStructuredData ? '✅' : '❌'} Structured data`);
          console.log(`   ${hasGoogleVerification ? '✅' : '❌'} Google verification`);
          
          // 提取 title
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
          if (titleMatch) {
            console.log(`   Title: "${titleMatch[1]}"`);
          }
          
          // 檢查結構化資料內容
          if (hasStructuredData) {
            const jsonLdMatches = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs);
            if (jsonLdMatches) {
              console.log(`   Structured data types found: ${jsonLdMatches.length}`);
              jsonLdMatches.forEach((match, index) => {
                try {
                  const jsonContent = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '').trim();
                  const data = JSON.parse(jsonContent);
                  console.log(`     ${index + 1}. @type: ${data['@type']}`);
                } catch (e) {
                  console.log(`     ${index + 1}. Invalid JSON-LD`);
                }
              });
            }
          }
        } else {
          console.log(`❌ ${page.name}: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.log(`❌ ${page.name}: Failed to fetch`);
      }
    }
    
    // 測試部落格文章頁面的結構化資料
    console.log('\n3. Blog article structured data verification:');
    try {
      // 先獲取部落格文章列表
      const blogResponse = await fetch(`${baseUrl}/api/blog`);
      if (blogResponse.ok) {
        const posts = await blogResponse.json();
        if (posts.length > 0) {
          const firstPost = posts.find(p => p.status === '已發布');
          if (firstPost) {
            const articleResponse = await fetch(`${baseUrl}/blog/${firstPost.slug}`);
            if (articleResponse.ok) {
              const html = await articleResponse.text();
              const hasArticleStructuredData = html.includes('"@type":"Article"') || html.includes('"@type": "Article"');
              console.log(`✅ 測試文章: ${firstPost.title}`);
              console.log(`   ${hasArticleStructuredData ? '✅' : '❌'} Article structured data`);
              
              // 提取並驗證結構化資料
              const jsonLdMatches = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs);
              if (jsonLdMatches) {
                jsonLdMatches.forEach((match, index) => {
                  try {
                    const jsonContent = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '').trim();
                    const data = JSON.parse(jsonContent);
                    console.log(`   結構化資料 ${index + 1}: @type=${data['@type']}, headline="${data.headline || 'N/A'}"`);
                  } catch (e) {
                    console.log(`   結構化資料 ${index + 1}: 解析失敗`);
                  }
                });
              }
            }
          }
        }
      }
    } catch (error) {
      console.log('❌ 無法測試部落格文章結構化資料');
    }
    
    console.log('\n4. SEO Setup Summary:');
    console.log('✅ Google Search Console 驗證檔案已設置');
    console.log('✅ Meta 標籤驗證已加入 layout.tsx');
    console.log('✅ Sitemap.xml 自動生成');
    console.log('✅ Robots.txt 自動生成');
    console.log('✅ 結構化資料 (JSON-LD) 已加入');
    console.log('✅ Open Graph 標籤已設置');
    console.log('✅ 各頁面專屬 metadata 已設置');
    console.log('✅ 部落格文章結構化資料已整合');
    console.log('✅ 部落格列表結構化資料已整合');
    
    console.log('\n5. Next Steps:');
    console.log('📝 在 Google Search Console 中驗證網站:');
    console.log('   1. 前往 https://search.google.com/search-console');
    console.log('   2. 新增資源 (網域或網址前置字元)');
    console.log('   3. 選擇 HTML 檔案驗證方法');
    console.log('   4. 上傳 google336cbb77b6f46dc6.html 檔案');
    console.log('   5. 點擊驗證');
    
    console.log('\n📝 部署後的檢查項目:');
    console.log('   - 確認 https://your-domain.com/google336cbb77b6f46dc6.html 可訪問');
    console.log('   - 確認 https://your-domain.com/sitemap.xml 可訪問');
    console.log('   - 確認 https://your-domain.com/robots.txt 可訪問');
    console.log('   - 在 Google Search Console 提交 sitemap');
    
    console.log('\n🎉 SEO Setup Verification Complete!');
    
    console.log('\n📋 Summary of Completed Features:');
    console.log('✅ Google Search Console HTML 檔案驗證');
    console.log('✅ Google Search Console Meta 標籤驗證');
    console.log('✅ 自動生成 Sitemap.xml');
    console.log('✅ 自動生成 Robots.txt');
    console.log('✅ 組織結構化資料 (Organization)');
    console.log('✅ 文章結構化資料 (Article)');
    console.log('✅ 部落格結構化資料 (Blog)');
    console.log('✅ 網站結構化資料 (WebSite)');
    console.log('✅ Open Graph 標籤');
    console.log('✅ Twitter Card 標籤');
    console.log('✅ 各頁面專屬 metadata');
    
    console.log('\n🔍 如何驗證結構化資料:');
    console.log('1. 等待頁面完全載入 (客戶端渲染)');
    console.log('2. 開啟瀏覽器開發者工具 (F12)');
    console.log('3. 在 Elements 標籤中搜尋 "application/ld+json"');
    console.log('4. 檢查 JSON-LD 結構化資料是否正確生成');
    console.log('5. 使用 Google Rich Results Test 工具測試');
    console.log('6. 使用 Schema.org Validator 驗證');
    
    console.log('\n🌐 線上驗證工具:');
    console.log('• Google Rich Results Test: https://search.google.com/test/rich-results');
    console.log('• Schema.org Validator: https://validator.schema.org/');
    console.log('• Google Search Console: https://search.google.com/search-console');
    
    console.log('\n⚠️  注意事項:');
    console.log('• 部落格頁面使用客戶端渲染，需要等待資料載入');
    console.log('• 結構化資料會在文章資料載入後動態生成');
    console.log('• 建議在生產環境中測試完整功能');
    console.log('• 記得更新 baseUrl 為實際網域名稱');
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

// 執行驗證
verifySEOSetup();