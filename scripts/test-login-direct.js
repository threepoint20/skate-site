// 直接測試登入 API
const { default: fetch } = require('node-fetch');

async function testLogin() {
  console.log('🔐 測試登入 API\n');
  
  const credentials = {
    username: 'admini',
    password: 'skate1234'
  };
  
  console.log('使用帳號:', credentials.username);
  console.log('使用密碼:', credentials.password);
  console.log('');
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    console.log('HTTP 狀態碼:', response.status);
    console.log('');
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ 登入成功！');
      console.log('用戶資訊:', JSON.stringify(data.user, null, 2));
      console.log('');
      console.log('Token:', data.token ? '已生成' : '未生成');
      
      // 檢查 cookies
      const cookies = response.headers.get('set-cookie');
      console.log('Cookies:', cookies ? '已設定' : '未設定');
      if (cookies) {
        console.log('Cookie 內容:', cookies);
      }
    } else {
      console.log('❌ 登入失敗');
      console.log('錯誤訊息:', data.error);
      console.log('完整回應:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ 請求失敗:', error.message);
  }
}

testLogin();
