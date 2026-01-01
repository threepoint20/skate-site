// 安全功能測試腳本
const { default: fetch } = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testSecurity() {
  console.log('🔐 開始安全功能測試...\n');

  // 測試 1: 未認證訪問 API
  console.log('📋 測試 1: 未認證訪問 API');
  try {
    const response = await fetch(`${BASE_URL}/api/blog`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([])
    });
    
    if (response.status === 401) {
      console.log('✅ 正確：未認證請求被拒絕 (401)');
    } else {
      console.log('❌ 錯誤：未認證請求應該被拒絕');
    }
  } catch (error) {
    console.log('❌ 測試失敗:', error.message);
  }

  // 測試 2: 錯誤的登入憑證
  console.log('\n📋 測試 2: 錯誤的登入憑證');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'wrong',
        password: 'wrong'
      })
    });
    
    if (response.status === 401) {
      console.log('✅ 正確：錯誤憑證被拒絕 (401)');
    } else {
      console.log('❌ 錯誤：錯誤憑證應該被拒絕');
    }
  } catch (error) {
    console.log('❌ 測試失敗:', error.message);
  }

  // 測試 3: 正確的登入憑證
  console.log('\n📋 測試 3: 正確的登入憑證');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admini',
        password: 'skate2024!'
      })
    });
    
    if (response.status === 200) {
      const data = await response.json();
      console.log('✅ 正確：登入成功');
      console.log('📝 用戶資訊:', data.user);
      
      // 獲取 cookie 用於後續測試
      const cookies = response.headers.get('set-cookie');
      if (cookies) {
        console.log('🍪 收到認證 cookie');
        
        // 測試 4: 使用有效 token 訪問 API
        console.log('\n📋 測試 4: 使用有效 token 訪問 API');
        const authResponse = await fetch(`${BASE_URL}/api/blog`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Cookie': cookies
          },
          body: JSON.stringify([])
        });
        
        if (authResponse.status === 200) {
          console.log('✅ 正確：認證後的請求成功');
        } else {
          console.log('❌ 錯誤：認證後的請求失敗');
        }
      }
    } else {
      console.log('❌ 錯誤：正確憑證登入失敗');
    }
  } catch (error) {
    console.log('❌ 測試失敗:', error.message);
  }

  // 測試 5: 驗證 token
  console.log('\n📋 測試 5: Token 驗證');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/verify`);
    
    if (response.status === 401) {
      console.log('✅ 正確：無 token 時驗證失敗');
    } else {
      console.log('❌ 錯誤：無 token 時應該驗證失敗');
    }
  } catch (error) {
    console.log('❌ 測試失敗:', error.message);
  }

  console.log('\n🎉 安全功能測試完成！');
}

// 檢查伺服器是否運行
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/api/blog`);
    return true;
  } catch (error) {
    console.log('❌ 伺服器未運行，請先執行 npm run dev');
    return false;
  }
}

// 執行測試
checkServer().then(isRunning => {
  if (isRunning) {
    testSecurity();
  }
});