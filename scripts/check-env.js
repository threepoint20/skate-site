// 檢查環境變數
require('dotenv').config({ path: '.env.local' });

console.log('環境變數檢查：\n');
console.log('ADMIN_USERNAME:', process.env.ADMIN_USERNAME);
console.log('ADMIN_PASSWORD_HASH:', process.env.ADMIN_PASSWORD_HASH);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '已設定' : '未設定');
console.log('');

// 測試密碼驗證
const bcrypt = require('bcryptjs');

async function testHash() {
  const password = 'skate1234';
  const hash = process.env.ADMIN_PASSWORD_HASH;
  
  console.log('測試密碼驗證：');
  console.log('密碼:', password);
  console.log('雜湊:', hash);
  
  const isValid = await bcrypt.compare(password, hash);
  console.log('驗證結果:', isValid ? '✅ 成功' : '❌ 失敗');
}

testHash();
