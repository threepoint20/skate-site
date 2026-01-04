# BaseURL 環境變數設定完成

## 🎉 完成項目

### ✅ 環境變數整合
- 所有結構化資料組件現在都使用 `NEXT_PUBLIC_SITE_URL` 環境變數
- 自動回退到預設值，確保在任何環境下都能正常運作
- 支援本地開發、測試和生產環境

### ✅ 更新的組件

1. **ArticleStructuredData.tsx**
   ```typescript
   export default function ArticleStructuredData({ 
     post, 
     baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com' 
   }: ArticleStructuredDataProps)
   ```

2. **BlogListingStructuredData.tsx**
   ```typescript
   export default function BlogListingStructuredData({ 
     posts, 
     baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com' 
   }: BlogListingStructuredDataProps)
   ```

3. **StructuredData.tsx**
   ```typescript
   export default function StructuredData() {
     const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
     // ...
   }
   ```

### ✅ 測試腳本更新
- `scripts/test-structured-data.js` - 載入環境變數進行測試
- `scripts/verify-seo-setup.js` - 使用環境變數進行驗證
- `scripts/setup-vercel-env.js` - Vercel 部署指南

### ✅ 文件更新
- `ENVIRONMENT_SETUP.md` - 完整的環境變數設定指南
- `STRUCTURED_DATA_GUIDE.md` - 更新使用環境變數的說明
- `.env.example` - 包含所有必要的環境變數範例

## 🔧 使用方式

### 本地開發
```bash
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Vercel 部署
```bash
# Vercel Dashboard > Settings > Environment Variables
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

### 自訂網域
```bash
# 當你有自己的網域時
NEXT_PUBLIC_SITE_URL=https://your-custom-domain.com
```

## 🧪 測試驗證

### 1. 測試結構化資料生成
```bash
node scripts/test-structured-data.js
```

### 2. 驗證 SEO 設定
```bash
node scripts/verify-seo-setup.js
```

### 3. Vercel 部署指南
```bash
node scripts/setup-vercel-env.js
```

## 📋 環境變數檢查清單

### 必要變數 (生產環境)
- ✅ `NEXT_PUBLIC_SITE_URL` - 網站 URL
- ✅ `NEXT_PUBLIC_SITE_NAME` - 網站名稱
- ✅ `ADMIN_USERNAME` - 管理員用戶名
- ✅ `ADMIN_PASSWORD_HASH` - 管理員密碼雜湊
- ✅ `JWT_SECRET` - JWT 密鑰
- ✅ `DATABASE_URL` - 資料庫連線字串

### 可選變數
- `JWT_EXPIRES_IN` - JWT 過期時間 (預設: 24h)
- `BCRYPT_ROUNDS` - bcrypt 雜湊輪數 (預設: 12)

## 🌐 不同環境的 URL 範例

| 環境 | NEXT_PUBLIC_SITE_URL | 用途 |
|------|---------------------|------|
| 本地開發 | `http://localhost:3000` | 開發測試 |
| Vercel Preview | `https://your-app-git-branch.vercel.app` | 預覽部署 |
| Vercel Production | `https://your-app.vercel.app` | 生產環境 |
| 自訂網域 | `https://your-domain.com` | 正式網站 |

## 🔍 驗證方法

### 1. 瀏覽器檢查
1. 開啟網站
2. 按 F12 開啟開發者工具
3. 搜尋 `application/ld+json`
4. 檢查 URL 是否正確

### 2. 線上工具
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/

### 3. 結構化資料內容檢查
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "url": "https://your-actual-domain.com/blog/article-slug",
  "publisher": {
    "@type": "Organization",
    "name": "SkateInfo",
    "logo": {
      "@type": "ImageObject",
      "url": "https://your-actual-domain.com/logo.png"
    }
  }
}
```

## ⚠️ 重要注意事項

### 1. 環境變數優先級
```typescript
// 優先級順序：
// 1. 手動傳入的 baseUrl 參數
// 2. NEXT_PUBLIC_SITE_URL 環境變數
// 3. 預設值 'https://your-domain.com'

baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'
```

### 2. 客戶端 vs 伺服器端
- `NEXT_PUBLIC_SITE_URL` 可在客戶端和伺服器端使用
- 沒有 `NEXT_PUBLIC_` 前綴的變數只能在伺服器端使用

### 3. 部署後檢查
- 確保 Vercel 環境變數設定正確
- 重新部署後檢查結構化資料 URL
- 使用 Google Search Console 驗證

## 🎯 下一步

1. **部署到 Vercel**
   - 設定環境變數
   - 部署專案
   - 驗證功能

2. **SEO 優化**
   - 提交 sitemap 到 Google Search Console
   - 測試結構化資料
   - 監控搜尋表現

3. **持續維護**
   - 定期更新環境變數
   - 監控網站效能
   - 更新結構化資料

## 🔗 相關檔案

- `.env.local` - 本地環境變數
- `.env.example` - 環境變數範例
- `app/components/ArticleStructuredData.tsx`
- `app/components/BlogListingStructuredData.tsx`
- `app/components/StructuredData.tsx`
- `scripts/test-structured-data.js`
- `scripts/verify-seo-setup.js`
- `scripts/setup-vercel-env.js`
- `ENVIRONMENT_SETUP.md`
- `STRUCTURED_DATA_GUIDE.md`

---

🎉 **恭喜！你的滑板網站現在已經完全支援環境變數，可以在任何環境下正確運作！**