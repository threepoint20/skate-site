// 測試新增文章流程
const { default: fetch } = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testAddPost() {
  console.log('🧪 測試新增文章流程...\n');

  try {
    // 1. 登入獲取認證
    console.log('📋 步驟 1: 登入');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admini',
        password: 'skate2024!'
      })
    });

    if (loginResponse.status !== 200) {
      const error = await loginResponse.json();
      console.log('❌ 登入失敗:', error);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ 登入成功:', loginData.user.username);

    // 獲取 cookies
    const cookies = loginResponse.headers.get('set-cookie');

    // 2. 獲取現有文章
    console.log('\n📋 步驟 2: 獲取現有文章');
    const getResponse = await fetch(`${BASE_URL}/api/blog`, {
      headers: { 'Cookie': cookies }
    });

    const existingPosts = await getResponse.json();
    console.log('📝 現有文章數量:', existingPosts.length);

    // 3. 新增測試文章
    console.log('\n📋 步驟 3: 新增測試文章');
    const testPost = {
      title: '測試文章 - ' + new Date().toLocaleString(),
      content: '這是一篇測試文章的內容。\n\n包含多行文字和基本格式。',
      excerpt: '這是測試文章的摘要',
      category: '測試分類',
      author: '測試作者',
      readTime: '3 分鐘',
      tags: ['測試', '文章'],
      date: new Date().toISOString().split('T')[0],
      status: '已發布'
    };

    // 生成新的文章列表
    const newPost = {
      ...testPost,
      id: Date.now(),
      slug: testPost.title.toLowerCase().replace(/\s+/g, '-'),
      views: 0,
      coverImage: '/images/blog/default-cover.png'
    };

    const updatedPosts = [newPost, ...existingPosts];

    const saveResponse = await fetch(`${BASE_URL}/api/blog`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': cookies
      },
      body: JSON.stringify(updatedPosts)
    });

    console.log('儲存回應狀態:', saveResponse.status);

    if (saveResponse.status === 200) {
      console.log('✅ 文章新增成功');
      
      // 4. 驗證文章已新增
      console.log('\n📋 步驟 4: 驗證文章已新增');
      const verifyResponse = await fetch(`${BASE_URL}/api/blog`);
      const updatedPostsList = await verifyResponse.json();
      console.log('📝 更新後文章數量:', updatedPostsList.length);
      
      if (updatedPostsList.length > existingPosts.length) {
        console.log('✅ 文章數量增加，新增成功');
      } else {
        console.log('❌ 文章數量未增加');
      }
    } else {
      const error = await saveResponse.json();
      console.log('❌ 文章新增失敗:', error);
    }

  } catch (error) {
    console.log('❌ 測試過程中發生錯誤:', error.message);
  }
}

testAddPost();