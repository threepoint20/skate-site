// 密碼雜湊工具 - 用於生成管理員密碼的 bcrypt hash
const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  const rounds = 12; // 安全的雜湊輪數
  const hash = await bcrypt.hash(password, rounds);
  console.log(`原始密碼: ${password}`);
  console.log(`雜湊結果: ${hash}`);
  console.log('\n請將雜湊結果複製到 .env.local 的 ADMIN_PASSWORD_HASH 變數中');
}

// 從命令列參數獲取密碼
const password = process.argv[2];

if (!password) {
  console.log('使用方法: node scripts/hash-password.js \'你的密碼\'');
  console.log('範例: node scripts/hash-password.js \'mySecurePassword123!\'');
  console.log('注意：在 macOS/Linux 中，包含特殊字符的密碼請使用單引號');
  process.exit(1);
}

hashPassword(password).catch(console.error);