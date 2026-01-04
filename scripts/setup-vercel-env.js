#!/usr/bin/env node

// 載入環境變數
require('dotenv').config({ path: '.env.local' });

// Vercel 環境變數設定指南腳本

console.log('🚀 Vercel 環境變數設定指南\n');

console.log('📋 必要的環境變數列表:\n');

const envVars = [
  {
    name: 'NEXT_PUBLIC_SITE_URL',
    description: '網站 URL (用於 SEO 和結構化資料)',
    example: 'https://your-domain.vercel.app',
    required: true,
    public: true
  },
  {
    name: 'NEXT_PUBLIC_SITE_NAME',
    description: '網站名稱',
    example: 'SkateInfo',
    required: true,
    public: true
  },
  {
    name: 'ADMIN_USERNAME',
    description: '管理員用戶名',
    example: 'admin',
    required: true,
    public: false
  },
  {
    name: 'ADMIN_PASSWORD_HASH',
    description: '管理員密碼雜湊 (使用 bcrypt)',
    example: '$2b$12$...',
    required: true,
    public: false
  },
  {
    name: 'JWT_SECRET',
    description: 'JWT 密鑰 (至少 32 字元)',
    example: 'your_super_secret_jwt_key_at_least_32_characters_long',
    required: true,
    public: false
  },
  {
    name: 'JWT_EXPIRES_IN',
    description: 'JWT 過期時間',
    example: '24h',
    required: true,
    public: false
  },
  {
    name: 'DATABASE_URL',
    description: 'Neon PostgreSQL 資料庫連線字串',
    example: 'postgresql://username:password@host/database?sslmode=require',
    required: true,
    public: false
  },
  {
    name: 'BCRYPT_ROUNDS',
    description: 'bcrypt 雜湊輪數',
    example: '12',
    required: false,
    public: false
  }
];

envVars.forEach((envVar, index) => {
  const icon = envVar.required ? '🔴' : '🟡';
  const visibility = envVar.public ? '(公開)' : '(私有)';
  
  console.log(`${icon} ${envVar.name} ${visibility}`);
  console.log(`   描述: ${envVar.description}`);
  console.log(`   範例: ${envVar.example}`);
  console.log(`   必要: ${envVar.required ? '是' : '否'}\n`);
});

console.log('🔧 Vercel Dashboard 設定步驟:\n');

console.log('1. 登入 Vercel Dashboard (https://vercel.com/dashboard)');
console.log('2. 選擇你的專案');
console.log('3. 點擊 "Settings" 標籤');
console.log('4. 點擊 "Environment Variables"');
console.log('5. 新增上述環境變數');

console.log('\n📝 設定範例:\n');

console.log('Name: NEXT_PUBLIC_SITE_URL');
console.log('Value: https://your-domain.vercel.app');
console.log('Environment: Production, Preview\n');

console.log('Name: ADMIN_USERNAME');
console.log('Value: admin');
console.log('Environment: Production, Preview\n');

console.log('Name: JWT_SECRET');
console.log('Value: your_super_secret_jwt_key_at_least_32_characters_long');
console.log('Environment: Production, Preview\n');

console.log('⚠️  重要注意事項:\n');

console.log('• 🔐 私有變數 (沒有 NEXT_PUBLIC_ 前綴) 只在伺服器端可用');
console.log('• 🌐 公開變數 (NEXT_PUBLIC_ 前綴) 會暴露給客戶端');
console.log('• 🔄 設定完成後需要重新部署專案');
console.log('• 💾 建議將設定備份到安全的地方');
console.log('• 🔑 定期更新 JWT_SECRET 和密碼雜湊');

console.log('\n🛠️  實用工具:\n');

console.log('• 生成密碼雜湊: node scripts/hash-password.js');
console.log('• 測試結構化資料: node scripts/test-structured-data.js');
console.log('• 驗證 SEO 設定: node scripts/verify-seo-setup.js');

console.log('\n🎯 部署後驗證:\n');

console.log('1. 檢查網站是否正常運作');
console.log('2. 測試管理員登入功能');
console.log('3. 驗證結構化資料 URL 是否正確');
console.log('4. 使用 Google Rich Results Test 測試');
console.log('5. 在 Google Search Console 提交 sitemap');

console.log('\n✅ 設定完成！你的滑板網站已準備好部署到 Vercel！');

// 檢查本地環境變數
console.log('\n🔍 本地環境變數檢查:\n');

const localEnvVars = [
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_SITE_NAME',
  'ADMIN_USERNAME',
  'JWT_SECRET',
  'DATABASE_URL'
];

localEnvVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '❌';
  const displayValue = value ? (varName.startsWith('NEXT_PUBLIC_') ? value : '***') : '未設定';
  
  console.log(`${status} ${varName}: ${displayValue}`);
});

if (process.env.NEXT_PUBLIC_SITE_URL) {
  console.log(`\n🌐 當前 baseUrl: ${process.env.NEXT_PUBLIC_SITE_URL}`);
} else {
  console.log('\n⚠️  NEXT_PUBLIC_SITE_URL 未設定，將使用預設值');
}