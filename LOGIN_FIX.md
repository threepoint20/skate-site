# 登入問題修復說明

## 問題原因
`.env.local` 中的 `ADMIN_PASSWORD_HASH` 與你的密碼 `skate1234` 不匹配。開發伺服器在啟動時載入環境變數，所以需要重啟才能使用新的密碼雜湊。

## 已完成的修復
✅ 已更新 `.env.local` 中的 `ADMIN_PASSWORD_HASH` 為 `skate1234` 的正確雜湊值
✅ 已驗證密碼雜湊功能正常運作

## 你需要做的事情

### 重啟開發伺服器

1. 在終端機中按 `Ctrl + C` 停止當前的開發伺服器
2. 重新啟動開發伺服器：
   ```bash
   npm run dev
   ```

### 測試登入

重啟後，使用以下帳號登入：
- 用戶名：`admini`
- 密碼：`skate1234`

### 驗證登入功能

你可以執行測試腳本來驗證：
```bash
node scripts/test-login-direct.js
```

如果看到 `✅ 登入成功！`，表示問題已解決。

## 當前設定

```
ADMIN_USERNAME=admini
密碼=skate1234
ADMIN_PASSWORD_HASH=$2b$12$U85KW0TJZOkuTaqkuoXR8.Kcu4LqMnBZNb42oIRMEscZtO8shDEEi
```

## 注意事項

- `.env.local` 檔案不會被提交到 Git
- 如果未來需要更改密碼，使用 `node scripts/hash-password.js <新密碼>` 生成新的雜湊值
- 每次修改 `.env.local` 後都需要重啟開發伺服器

## Vercel 部署設定

在 Vercel 上設定環境變數時，有兩種方式：

### 方式 1：在 Vercel Dashboard 設定（推薦）

1. 進入 Vercel 專案設定 → Settings → Environment Variables
2. 新增 `ADMIN_PASSWORD_HASH` 變數
3. 值直接貼上完整的雜湊（不需要轉義）：
   ```
   $2b$12$U85KW0TJZOkuTaqkuoXR8.Kcu4LqMnBZNb42oIRMEscZtO8shDEEi
   ```
4. Vercel 會自動處理特殊字元，不需要使用 `\$` 轉義

### 方式 2：使用 Vercel CLI

```bash
vercel env add ADMIN_PASSWORD_HASH
# 然後貼上完整的雜湊值（不需要轉義）
```

### 重要差異

- **本地 `.env.local` 檔案**：需要轉義 → `\$2b\$12\$...`
- **Vercel 環境變數**：不需要轉義 → `$2b$12$...`

這是因為本地的 `.env` 檔案會經過 shell 解析，而 Vercel 的環境變數是直接設定的。
