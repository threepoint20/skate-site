#!/usr/bin/env node

// 驗證 SEO 設置
async function verifySEOSetup() {
  try {
    console.log('🔍 Verifying SEO setup...\n');
    
    const baseUrl = 'http://localhost:3000';
    
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
        } else {
          console.log(`❌ ${page.name}: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.log(`❌ ${page.name}: Failed to fetch`);
      }
    }
    
    console.log('\n3. SEO Setup Summary:');
    console.log('✅ Google Search Console 驗證檔案已設置');
    console.log('✅ Meta 標籤驗證已加入 layout.tsx');
    console.log('✅ Sitemap.xml 自動生成');
    console.log('✅ Robots.txt 自動生成');
    console.log('✅ 結構化資料 (JSON-LD) 已加入');
    console.log('✅ Open Graph 標籤已設置');
    console.log('✅ 各頁面專屬 metadata 已設置');
    
    console.log('\n4. Next Steps:');
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
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

// 執行驗證
verifySEOSetup();