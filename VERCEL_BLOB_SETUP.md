# Vercel Blob 儲存設定指南

## 問題說明
如果你在生產環境中看到以下錯誤：
```
Vercel Blob: No token found. Either configure the `BLOB_READ_WRITE_TOKEN` environment variable, or pass a `token` option to your calls.
```

這表示需要在 Vercel 中設定 Blob 儲存服務。

## 解決方案

### 方法 1：使用 Vercel Blob (推薦)

1. **登入 Vercel 控制台**
   - 前往 [vercel.com](https://vercel.com)
   - 登入你的帳號

2. **進入專案設定**
   - 選擇你的 `skate-site` 專案
   - 點擊 "Settings" 標籤

3. **設定 Blob 儲存**
   - 在左側選單點擊 "Storage"
   - 點擊 "Create Database"
   - 選擇 "Blob" 選項
   - 輸入資料庫名稱（例如：`skate-images`）
   - 點擊 "Create"

4. **連接到專案**
   - 建立後，點擊 "Connect Project"
   - 選擇你的專案
   - 點擊 "Connect"

5. **驗證環境變數**
   - 前往 "Settings" > "Environment Variables"
   - 確認已自動新增 `BLOB_READ_WRITE_TOKEN`

### 方法 2：手動設定環境變數

如果自動設定沒有成功，可以手動設定：

1. **獲取 Blob Token**
   - 在 Vercel 控制台的 Storage 頁面
   - 找到你的 Blob 儲存
   - 複製 Read/Write Token

2. **設定環境變數**
   - 前往專案的 "Settings" > "Environment Variables"
   - 新增變數：
     - Name: `BLOB_READ_WRITE_TOKEN`
     - Value: 你的 token
     - Environment: Production (和 Preview 如果需要)

3. **重新部署**
   - 前往 "Deployments" 標籤
   - 點擊最新部署旁的三個點
   - 選擇 "Redeploy"

## 驗證設定

設定完成後：

1. **檢查環境變數**
   - 在 Vercel 控制台確認 `BLOB_READ_WRITE_TOKEN` 已設定

2. **測試上傳功能**
   - 登入你的網站管理員帳號
   - 嘗試建立新文章並上傳封面圖片
   - 或編輯現有文章並更新封面圖片

3. **檢查錯誤日誌**
   - 如果仍有問題，在 Vercel 控制台查看 "Functions" 標籤的日誌

## 費用說明

- Vercel Blob 有免費額度
- 免費方案包含：1GB 儲存空間和 100GB 頻寬
- 超過免費額度後按使用量計費
- 詳細費用請參考 [Vercel Pricing](https://vercel.com/pricing)

## 故障排除

### 常見問題

1. **Token 未生效**
   - 確保重新部署專案
   - 檢查環境變數是否正確設定

2. **上傳仍然失敗**
   - 檢查檔案大小是否超過 5MB
   - 確認檔案格式是否支援（JPG, PNG, WebP, GIF）

3. **圖片無法顯示**
   - Blob URL 可能需要幾分鐘才能生效
   - 檢查瀏覽器控制台是否有 CORS 錯誤

### 聯絡支援

如果問題持續存在：
- 檢查 Vercel 控制台的錯誤日誌
- 參考 [Vercel Blob 文件](https://vercel.com/docs/storage/vercel-blob)
- 聯絡 Vercel 支援團隊

## 開發環境

開發環境不需要設定 Vercel Blob，系統會自動使用本地檔案儲存。