# Vercel 環境變數設定指南

## 🔑 管理員密碼設定的重要差異

### 本地開發 vs Vercel 部署

在設定 `ADMIN_PASSWORD_HASH` 時，本地和 Vercel 的格式不同：

#### 本地 `.env.local` 檔案
```bash
# 需要用 \$ 轉義 $ 符號
ADMIN_PASSWORD_HASH=\$2b\$12\$U85KW0TJZOkuTaqkuoXR8.Kcu4LqMnBZNb42oIRMEscZtO8shDEEi
```

#### Vercel 環境變數
```bash
# 不需要轉義，直接貼上完整雜湊
$2b$12$U85KW0TJZOkuTaqkuoXR8.Kcu4LqMnBZNb42oIRMEscZtO8shDEEi
```

## 為什麼會有這個差異？

- **本地**：`.env` 檔案會經過 shell 解析，`$` 符號會被當作變數展開，所以需要轉義
- **Vercel**：環境變數是直接設定在系統中，不經過 shell 解析，所以不需要轉義

## 📝 設定步驟

### 1. 生成密碼雜湊

```bash
node scripts/hash-password.js skate1234
```

輸出範例：
```
原始密碼: skate1234
雜湊結果: $2b$12$U85KW0TJZOkuTaqkuoXR8.Kcu4LqMnBZNb42oIRMEscZtO8shDEEi
```

### 2. 本地設定

在 `.env.local` 中：
```bash
ADMIN_USERNAME=admini
ADMIN_PASSWORD_HASH=\$2b\$12\$U85KW0TJZOkuTaqkuoXR8.Kcu4LqMnBZNb42oIRMEscZtO8shDEEi
```

### 3. Vercel 設定

在 Vercel Dashboard → Settings → Environment Variables：

| Variable Name | Value |
|--------------|-------|
| `ADMIN_USERNAME` | `admini` |
| `ADMIN_PASSWORD_HASH` | `$2b$12$U85KW0TJZOkuTaqkuoXR8.Kcu4LqMnBZNb42oIRMEscZtO8shDEEi` |

**注意**：直接複製貼上，不要加 `\` 轉義！

## 🧪 驗證設定

### 本地驗證
```bash
# 重啟開發伺服器
npm run dev

# 測試登入
node scripts/test-login-direct.js
```

### Vercel 驗證
部署後，在瀏覽器中測試登入功能。

## ⚠️ 常見錯誤

### 錯誤 1：在 Vercel 使用轉義
```bash
# ❌ 錯誤
\$2b\$12\$xxx...

# ✅ 正確
$2b$12$xxx...
```

### 錯誤 2：在本地不使用轉義
```bash
# ❌ 錯誤（會被截斷）
ADMIN_PASSWORD_HASH=$2b$12$xxx...

# ✅ 正確
ADMIN_PASSWORD_HASH=\$2b\$12\$xxx...
```

### 錯誤 3：使用單引號或雙引號
```bash
# ❌ 錯誤（引號會被當作值的一部分）
ADMIN_PASSWORD_HASH='$2b$12$xxx...'
ADMIN_PASSWORD_HASH="$2b$12$xxx..."

# ✅ 正確
ADMIN_PASSWORD_HASH=\$2b\$12\$xxx...
```

## 📚 相關文件

- `LOGIN_FIX.md` - 登入問題修復說明
- `DEPLOYMENT_GUIDE.md` - 完整部署指南
- `ENVIRONMENT_SETUP.md` - 環境變數設定
- `.env.example` - 環境變數範例

## 🎯 快速檢查清單

- [ ] 使用 `hash-password.js` 生成雜湊
- [ ] 本地 `.env.local` 使用 `\$` 轉義
- [ ] Vercel 環境變數不使用轉義
- [ ] 重啟開發伺服器測試本地
- [ ] 部署到 Vercel 後測試線上
