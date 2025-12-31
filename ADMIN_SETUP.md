# 管理員帳號設定指南

## 🔐 密碼設定

### 本地開發環境

1. **複製環境變數檔案**
   ```bash
   cp .env.example .env.local
   ```

2. **編輯 `.env.local` 檔案**
   ```bash
   # 管理員帳號設定
   NEXT_PUBLIC_ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_secure_password_here
   ```

3. **重新啟動開發伺服器**
   ```bash
   npm run dev
   ```

### 生產環境 (Vercel)

1. **前往 Vercel 控制台**
   - 選擇你的專案
   - 點擊 "Settings" 標籤
   - 選擇 "Environment Variables"

2. **添加環境變數**
   ```
   Name: NEXT_PUBLIC_ADMIN_USERNAME
   Value: admin (或你想要的用戶名)
   Environment: Production, Preview, Development
   
   Name: ADMIN_PASSWORD  
   Value: your_secure_password_here
   Environment: Production, Preview, Development
   ```

3. **重新部署**
   - 推送代碼到 GitHub 觸發自動部署
   - 或在 Vercel 控制台手動觸發部署

## 🛡️ 密碼安全建議

### 強密碼要求
- 至少 12 個字符
- 包含大小寫字母
- 包含數字和特殊符號
- 避免使用常見詞彙

### 範例強密碼
```
SkateBoard2024!@#
MySecure$kateP@ss
Sk8Board#2024$
```

### 密碼管理
- 使用密碼管理器生成和儲存密碼
- 定期更換密碼
- 不要在多個服務使用相同密碼

## 🔄 更改密碼

### 本地環境
1. 編輯 `.env.local` 檔案
2. 修改 `ADMIN_PASSWORD` 的值
3. 重新啟動開發伺服器

### 生產環境
1. 在 Vercel 控制台更新 `ADMIN_PASSWORD` 環境變數
2. 觸發重新部署

## 🚨 安全注意事項

### ⚠️ 重要提醒
- **絕對不要**將 `.env.local` 檔案提交到 Git
- **絕對不要**在程式碼中硬編碼密碼
- **絕對不要**在公開場所分享密碼

### 檔案權限
```bash
# 設定環境變數檔案權限 (僅限 Unix/Linux/macOS)
chmod 600 .env.local
```

### 備份與恢復
- 將密碼安全地儲存在密碼管理器中
- 記錄密碼更改的日期和原因
- 確保團隊成員都知道如何獲取最新密碼

## 🔍 故障排除

### 登入失敗
1. 檢查環境變數是否正確設定
2. 確認密碼沒有多餘的空格
3. 檢查大小寫是否正確
4. 重新啟動開發伺服器

### 環境變數未生效
1. 確認檔案名稱為 `.env.local`
2. 檢查變數名稱是否正確
3. 重新啟動 Next.js 應用程式
4. 清除瀏覽器快取

### Vercel 部署問題
1. 確認環境變數已在 Vercel 控制台設定
2. 檢查變數是否套用到正確的環境
3. 觸發重新部署
4. 檢查部署日誌是否有錯誤

## 📞 支援

如果遇到問題，請檢查：
1. 環境變數設定是否正確
2. 密碼是否符合安全要求
3. 部署環境是否正常

需要協助請聯絡系統管理員。