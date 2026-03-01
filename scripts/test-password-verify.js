// 測試密碼驗證
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function testPasswordVerify() {
  const password = 'skate1234';
  const hash = process.env.ADMIN_PASSWORD_HASH;
  
  console.log('測試密碼:', password);
  console.log('環境變數中的雜湊:', hash);
  console.log('');
  
  try {
    const isValid = await bcrypt.compare(password, hash);
    console.log('密碼驗證結果:', isValid ? '✅ 成功' : '❌ 失敗');
    
    // 生成新的雜湊來比對
    console.log('\n生成新的雜湊值:');
    const newHash = await bcrypt.hash(password, 12);
    console.log(newHash);
    
    // 測試新雜湊
    const testNew = await bcrypt.compare(password, newHash);
    console.log('新雜湊驗證:', testNew ? '✅ 成功' : '❌ 失敗');
  } catch (error) {
    console.error('錯誤:', error);
  }
}

testPasswordVerify();
