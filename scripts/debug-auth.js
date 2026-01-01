// 調試認證狀態
const { default: fetch } = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function debugAuth() {
  console.log('🔍 調試認證狀態...\n');

  try {
    // 1. 先登入獲取 cookie
    console.log('📋 步驟 1: 登入獲取認證');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admini',
        password: 'skate2024!'
      })
    });

    if (loginResponse.status === 200) {
      const loginData = await loginResponse.json();
      console.log('✅ 登入成功');
      console.log('📝 用戶資訊:', loginData.user);
      
      // 獲取 cookies
      const cookies = loginResponse.headers.get('set-cookie');
      console.log('🍪 收到 cookies:', cookies ? '是' : '否');

      if (cookies) {
        // 2. 使用 cookie 測試 API 訪問
        console.log('\n📋 步驟 2: 使用 cookie 測試 API 訪問');
        const apiResponse = await fetch(`${BASE_URL}/api/blog`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Cookie': cookies
          },
          body: JSON.stringify([])
        });

        console.log('API 回應狀態:', apiResponse.status);
        if (apiResponse.status === 200) {
          console.log('✅ API 訪問成功');
        } else {
          const error = await apiResponse.json();
          console.log('❌ API 訪問失敗:', error);
        }

        // 3. 測試驗證端點
        console.log('\n📋 步驟 3: 測試 token 驗證');
        const verifyResponse = await fetch(`${BASE_URL}/api/auth/verify`, {
          headers: { 'Cookie': cookies }
        });

        console.log('驗證回應狀態:', verifyResponse.status);
        if (verifyResponse.status === 200) {
          const verifyData = await verifyResponse.json();
          console.log('✅ Token 驗證成功:', verifyData.user);
        } else {
          const error = await verifyResponse.json();
          console.log('❌ Token 驗證失敗:', error);
        }
      }
    } else {
      const error = await loginResponse.json();
      console.log('❌ 登入失敗:', error);
    }

  } catch (error) {
    console.log('❌ 調試過程中發生錯誤:', error.message);
  }
}

debugAuth();