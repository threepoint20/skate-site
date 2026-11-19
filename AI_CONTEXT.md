# SkateInfo — AI 上下文速查

> 給 AI 助理的快速導覽：看完這份就能開始工作，不需要重新掃整個 repo。
> 最後更新：2026-11-12（NAS 部署改造 session）

## 這是什麼

繁體中文滑板資訊網站（SkateInfo）：首頁、關於、指南、裝備、聯絡 + 部落格 CMS（發文/編輯/草稿/瀏覽數/封面圖）+ 管理員後台（文章管理、全站圖片管理）。

## 技術棧

- **Next.js 16 App Router** + React 19 + Tailwind 4 + TypeScript
- 認證：JWT（jsonwebtoken）+ bcryptjs，HttpOnly cookie `auth-token`，單一管理員（env 設定，無使用者表）
- 文章渲染：marked + isomorphic-dompurify
- Lint：`npm run lint`；建置：`npm run build`；開發：`npm run dev`

## 資料層（重要設計）

`app/lib/database.ts` 是雙模式適配器：

- `DATABASE_URL` 有值 → **Neon PostgreSQL**（drizzle-orm/neon-http，schema 在 `app/lib/schema.ts`，migration 在 `drizzle/`）
- 沒有 → **本地 JSON 檔案**：`data/blog-posts.json`、`data/site-images.json`（自架/NAS 用這個，不需 DB）
- Vercel 環境下 file 模式寫入會 throw（`assertWritableFileStore`）

## 圖片儲存（本次改的）

`app/api/upload/image/route.ts`：

- `STORAGE_DRIVER` env：`blob` | `local` | 未設（自動：有 `BLOB_READ_WRITE_TOKEN` 用 Vercel Blob，否則寫 `public/images/blog/`）
- 上傳驗證：magic bytes 偵測、副檔名白名單、4MB 上限（`app/lib/uploadLimits.ts`）

## 部署模式（兩條路線）

1. **Vercel**：原本設計目標。需設 `DATABASE_URL`（Neon）+ `BLOB_READ_WRITE_TOKEN`。見 `DEPLOYMENT_GUIDE.md`
2. **NAS / 自架 Docker**：見 `NAS_DEPLOYMENT.md`
   - `next.config.ts` 設了 `output: 'standalone'`
   - `Dockerfile` = NAS 上完整 build（NAS CPU 弱，很慢）；`Dockerfile.prebuilt` = 在 Mac `npm run build` 後只打包產物（建議用這個）
   - `docker-compose.yml`：`dockerfile: ${DOCKERFILE:-Dockerfile}`，named volumes `skate-data`（/app/data）、`skate-uploads`（/app/public/images/blog），db 服務（Postgres）被註解可選用

## NAS 部署指令速查

```bash
# Mac 端：產生 .next/standalone 後同步到 NAS 專案目錄
npm run build && rsync -a --delete .next/ <NAS專案>/.next/

# NAS 端：
sed 's/\\\$/$/g' .env.local | sed 's/\$/$$/g' > .env.docker   # $ 跳脫轉換（必要！）
DOCKERFILE=Dockerfile.prebuilt sudo docker compose up -d --build
```

**坑**：docker compose 會插值 env_file 的 `$`；`.env.local` 內 bcrypt hash 是 `\$` 跳脫（Next dotenv-expand 格式），直接餵給 compose 會壞，所以要用 sed 轉出 `.env.docker`。

## 關鍵環境變數

`ADMIN_USERNAME`、`ADMIN_PASSWORD_HASH`（bcrypt，`.env.local` 中 `\$` 跳脫）、`JWT_SECRET`、`NEXT_PUBLIC_SITE_URL`（影響 sitemap/OG/結構化資料）、`STORAGE_DRIVER`、`COOKIE_SECURE`（HTTP 部署必須 `false` 才能登入！）、`ENABLE_DEBUG_API`（production 預設關 debug 路由）

## 2026-11-12 session 改了什麼

| 檔案 | 變更 |
|------|------|
| `app/api/upload/image/route.ts` | production 不再強制 Vercel Blob；新增 `STORAGE_DRIVER`/`hasBlobToken` 自動偵測，NAS 可寫本地 |
| `app/api/auth/login/route.ts` | cookie `secure` 改用 `COOKIE_SECURE` env 可覆寫（預設仍是 production=true）；**移除**會印出 hash 前綴的 debug console.log |
| `app/api/debug/{blob,upload,upload-test}/route.ts` | production 下預設 404（`debugApiDisabled()`），`ENABLE_DEBUG_API=true` 才開 |
| `public/test-upload.html` | 刪除（未認證上傳測試頁，git 歷史可找回） |
| `next.config.ts` | 加 `output: 'standalone'` |
| 新增 | `Dockerfile`、`Dockerfile.prebuilt`、`Dockerfile.prebuilt.dockerignore`、`.dockerignore`、`docker-compose.yml`、`NAS_DEPLOYMENT.md` |
| `.env.example` | 加 NAS 區段（STORAGE_DRIVER、COOKIE_SECURE、ENABLE_DEBUG_API） |
| `README.md` | 部署段落加 NAS 連結 |

驗證過：lint 0 err、build OK、standalone server 啟動後登入/上傳/debug-404 皆正常。

## 2026-11-18 session（頁面內容管理 + 雜項）

- 新增**頁面文字 CMS**：`app/lib/siteContent.ts`（欄位註冊表 CONTENT_FIELDS + 預設值 + client fetch/cache）、`app/lib/contentStore.ts`（file `data/site-content.json` / Neon `site_content` 表 lazy 建表）、`app/api/content/route.ts`（GET 公開 / PUT 管理員，key 白名單）、`/admin/content` 後台頁
- 五個頁面改用 `t('key')` 讀內容：home（hero/mission/區塊標題）、about（hero/story/價值觀×3/團隊×3）、guides/equipment/contact（僅 hero）
- 要加新的可編輯文字 = CONTENT_FIELDS 加一筆 + 頁面換成 `t('key')`
- 移除「閱讀時間」：/blog 卡片、文章頁、相關文章、首頁卡片、發文表單全部拿掉；DB schema 的 read_time notNull 保留（API 仍寫預設 '5 分鐘'）
- 編輯文章模式補齊欄位對齊新增表單：分類、作者、摘要、標籤（`blog/[slug]/page.tsx`）

## 已知問題 / 可做但還沒做

- `getSecurityHeaders()` 的 CSP 很弱（`script-src 'unsafe-inline'`）；`next.config.ts` 有另一組 headers
- 全站用 `<img>` 而非 `next/image`（9 個 lint warning，無心導入 sharp 的負擔）
- Rate limit 是 in-memory Map（單機 OK）
- 一堆 `scripts/test-*.js`、`debug-*.js` 是早期除錯遺留，無測試框架
- 資料夾在 SMB 掛載點上，`npm run dev`/lint 直接跑會很慢；建議複製到本機開發

## 目錄速查

```
app/                 # App Router 頁面 + API routes
  api/               # blog CRUD、images、auth、upload、debug
  lib/               # database.ts（雙模式）、security.ts、blogData.ts、imageManager.ts
  components/        # Navigation、AuthProvider、ImageUpload 等
data/                # file 模式的 JSON 資料（git 有追蹤）
drizzle/             # PG migrations
scripts/             # 雜項 Node 腳本（hash-password.js 有用）
```
