# 環境變數設定指南

## 概述

本專案使用環境變數來管理不同環境的設定，確保程式碼的靈活性和安全性。

## 環境變數列表

### 網站設定

```bash
# 網站名稱
NEXT_PUBLIC_SITE_NAME=SkateInfo

# 網站 URL (重要：用於 SEO 和結構化資料)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 管理員設定

```bash
# 管理員用戶名
ADMIN_USERNAME=admin

# 管理員密碼雜湊 (使用 bcrypt)
ADMIN_PASSWORD_HASH=your_bcrypt_hashed_password_here
```

### JWT 安全設定

```bash
# JWT 密鑰 (至少 32 字元)
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long

# JWT 過期時間
JWT_EXPIRES_IN=24h
```

### 資料庫設定

```bash
# Neon PostgreSQL 資料庫 (主要)
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# Vercel KV 資料庫 (備用，生產環境自動設定)
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token
```

### 檔案儲存設定

```bash
# Vercel Blob 儲存 (圖片上傳，生產環境自動設定)
BLOB_READ_WRITE_TOKEN=your_blob_token_here
```

## 不同環境的設定

### 本地開發環境

在 `.env.local` 檔案中：

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_USERNAME=admin
# ... 其他設定
```

### Vercel 生產環境

在 Vercel Dashboard 的 Environment Variables 中設定：

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
ADMIN_USERNAME=admin
# ... 其他設定
```

### 自訂網域

如果你有自己的網域：

```bash
NEXT_PUBLIC_SITE_URL=https://your-custom-domain.com
```

## 設定步驟

### 1. 複製範例檔案

```bash
cp .env.example .env.local
```

### 2. 編輯 .env.local

根據你的環境修改相應的值：

```bash
# 本地開發
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 或生產環境
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

### 3. Vercel 部署設定

在 Vercel Dashboard 中：

1. 進入你的專案
2. 點擊 "Settings" 標籤
3. 點擊 "Environment Variables"
4. 新增以下變數：

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` | Production, Preview |
| `ADMIN_USERNAME` | `your_admin_username` | Production, Preview |
| `ADMIN_PASSWORD_HASH` | `your_bcrypt_hash` | Production, Preview |
| `JWT_SECRET` | `your_jwt_secret` | Production, Preview |
| `DATABASE_URL` | `your_neon_db_url` | Production, Preview |

## 環境變數的使用

### 在組件中使用

```typescript
// 客戶端組件中使用 (需要 NEXT_PUBLIC_ 前綴)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

// 伺服器端組件或 API 路由中使用
const jwtSecret = process.env.JWT_SECRET;
```

### 在結構化資料中使用

```typescript
// ArticleStructuredData.tsx
export default function ArticleStructuredData({ 
  post, 
  baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com' 
}: ArticleStructuredDataProps) {
  // ...
}
```

## 安全注意事項

### 1. 公開變數 (NEXT_PUBLIC_)

- 只有 `NEXT_PUBLIC_` 前綴的變數會暴露給客戶端
- 不要在 `NEXT_PUBLIC_` 變數中放敏感資訊

### 2. 私有變數

- 沒有 `NEXT_PUBLIC_` 前綴的變數只在伺服器端可用
- 適合放置 API 密鑰、資料庫連線字串等敏感資訊

### 3. .env.local 檔案

- 此檔案已加入 `.gitignore`，不會被提交到版本控制
- 包含敏感資訊，請妥善保管

## 驗證設定

### 1. 檢查環境變數

```bash
# 執行測試腳本
node scripts/test-structured-data.js
node scripts/verify-seo-setup.js
```

### 2. 檢查結構化資料

在瀏覽器中：
1. 開啟網站
2. 按 F12 開啟開發者工具
3. 搜尋 `application/ld+json`
4. 檢查 URL 是否正確

## 常見問題

### Q: 為什麼我的 baseUrl 還是顯示 localhost？

A: 確保：
1. `.env.local` 檔案中有正確的 `NEXT_PUBLIC_SITE_URL`
2. 重新啟動開發伺服器
3. 清除瀏覽器快取

### Q: Vercel 部署後 URL 不正確？

A: 檢查：
1. Vercel Dashboard 中的環境變數設定
2. 確保變數名稱正確 (`NEXT_PUBLIC_SITE_URL`)
3. 重新部署專案

### Q: 如何生成 bcrypt 密碼雜湊？

A: 使用提供的腳本：

```bash
node scripts/hash-password.js
```

## 最佳實踐

1. **使用環境變數**：不要在程式碼中寫死 URL 或敏感資訊
2. **分環境設定**：本地、測試、生產環境使用不同的設定
3. **定期更新**：定期更新 JWT 密鑰和密碼
4. **備份設定**：將生產環境的設定備份到安全的地方
5. **文件化**：記錄所有環境變數的用途和設定方法

## 相關檔案

- `.env.local` - 本地環境變數 (不提交到 Git)
- `.env.example` - 環境變數範例檔案
- `app/components/ArticleStructuredData.tsx` - 使用 baseUrl 的組件
- `app/components/BlogListingStructuredData.tsx` - 使用 baseUrl 的組件
- `app/components/StructuredData.tsx` - 使用 baseUrl 的組件