# 🚀 Vercel 部署指南

## 📋 部署前檢查清單

### ✅ GitHub 上傳完成
- [x] 程式碼已推送到 GitHub
- [x] 最新 commit: `feat: 完整整合結構化資料和環境變數支援`
- [x] 倉庫地址: https://github.com/threepoint20/skate-site.git

### ✅ 必要檔案確認
- [x] `package.json` - 專案依賴
- [x] `next.config.ts` - Next.js 設定
- [x] `.env.example` - 環境變數範例
- [x] `.gitignore` - 忽略敏感檔案

## 🌐 Vercel 部署步驟

### 1. 登入 Vercel
1. 前往 https://vercel.com
2. 使用 GitHub 帳號登入
3. 授權 Vercel 存取你的 GitHub 倉庫

### 2. 匯入專案
1. 點擊 "New Project"
2. 選擇 "Import Git Repository"
3. 找到 `threepoint20/skate-site` 倉庫
4. 點擊 "Import"

### 3. 專案設定
```
Project Name: skate-site (或你想要的名稱)
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### 4. 環境變數設定
在 "Environment Variables" 區域新增以下變數：

#### 🔴 必要變數

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` | Production, Preview |
| `NEXT_PUBLIC_SITE_NAME` | `SkateInfo` | Production, Preview |
| `ADMIN_USERNAME` | `admin` | Production, Preview |
| `ADMIN_PASSWORD_HASH` | `你的bcrypt雜湊（不需轉義）` | Production, Preview |
| `JWT_SECRET` | `至少32字元的密鑰` | Production, Preview |
| `JWT_EXPIRES_IN` | `24h` | Production, Preview |
| `DATABASE_URL` | `你的Neon資料庫URL` | Production, Preview |

#### 🟡 可選變數

| Name | Value | Environment |
|------|-------|-------------|
| `BCRYPT_ROUNDS` | `12` | Production, Preview |
| `RATE_LIMIT_MAX` | `100` | Production, Preview |
| `RATE_LIMIT_WINDOW` | `900000` | Production, Preview |

### 5. 部署
1. 確認所有設定正確
2. 點擊 "Deploy"
3. 等待部署完成 (通常 2-5 分鐘)

## 🔧 部署後設定

### 1. 更新網站 URL
部署完成後，Vercel 會給你一個 URL，例如：
```
https://skate-site-abc123.vercel.app
```

回到 Vercel Dashboard：
1. 進入專案設定
2. 點擊 "Environment Variables"
3. 編輯 `NEXT_PUBLIC_SITE_URL`
4. 更新為實際的 Vercel URL
5. 重新部署專案

### 2. 自訂網域 (可選)
如果你有自己的網域：
1. 在 Vercel Dashboard 點擊 "Domains"
2. 新增你的網域
3. 按照指示設定 DNS
4. 更新 `NEXT_PUBLIC_SITE_URL` 為你的網域

## 🧪 部署後驗證

### 1. 基本功能測試
- [ ] 網站可以正常訪問
- [ ] 所有頁面都能載入
- [ ] 圖片顯示正常
- [ ] 導航功能正常

### 2. 管理員功能測試
- [ ] 管理員登入功能
- [ ] 部落格文章管理
- [ ] 圖片上傳功能
- [ ] 權限控制正常

### 3. SEO 功能驗證
```bash
# 檢查 SEO 端點
curl https://your-app.vercel.app/sitemap.xml
curl https://your-app.vercel.app/robots.txt
curl https://your-app.vercel.app/google336cbb77b6f46dc6.html
```

### 4. 結構化資料驗證
1. 開啟網站
2. 按 F12 開啟開發者工具
3. 搜尋 `application/ld+json`
4. 檢查 URL 是否正確

### 5. 線上工具測試
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/

## 🔍 常見問題排除

### Q: 部署失敗怎麼辦？
A: 檢查：
1. `package.json` 中的依賴是否正確
2. 環境變數是否都設定了
3. 查看 Vercel 的建置日誌

### Q: 網站可以訪問但功能異常？
A: 檢查：
1. 環境變數設定是否正確
2. 資料庫連線是否正常
3. 瀏覽器控制台是否有錯誤

### Q: 結構化資料 URL 不正確？
A: 確認：
1. `NEXT_PUBLIC_SITE_URL` 設定正確
2. 重新部署專案
3. 清除瀏覽器快取

### Q: 管理員無法登入？
A: 檢查：
1. `ADMIN_USERNAME` 和 `ADMIN_PASSWORD_HASH` 設定
2. `JWT_SECRET` 是否設定
3. 使用正確的密碼
4. **重要**：在 Vercel 設定 `ADMIN_PASSWORD_HASH` 時，直接貼上完整雜湊值（如 `$2b$12$xxx...`），不需要使用 `\$` 轉義。轉義只在本地 `.env.local` 檔案中需要。

## 🎯 部署後的下一步

### 1. Google Search Console 設定
1. 前往 https://search.google.com/search-console
2. 新增你的網站
3. 驗證網站所有權
4. 提交 sitemap.xml

### 2. 效能監控
- 設定 Vercel Analytics
- 監控網站載入速度
- 檢查 Core Web Vitals

### 3. 內容管理
- 新增更多部落格文章
- 上傳活動照片
- 更新網站內容

### 4. SEO 優化
- 定期檢查結構化資料
- 監控搜尋排名
- 優化頁面內容

## 📞 需要幫助？

如果遇到任何問題，可以：
1. 檢查 Vercel 的建置日誌
2. 查看瀏覽器控制台錯誤
3. 參考相關文件：
   - `ENVIRONMENT_SETUP.md`
   - `STRUCTURED_DATA_GUIDE.md`
   - `BASEURL_ENVIRONMENT_SETUP.md`

---

🎉 **恭喜！你的滑板網站即將上線！**