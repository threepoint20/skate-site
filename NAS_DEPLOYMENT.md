# 🏠 NAS 部署指南（Docker）

本指南以 Synology DSM 7.x（Container Manager）為例，但任何能跑 Docker 的 NAS（QNAP、TrueNAS、UNRAID 等）步驟都相同。

## 架構說明

自架部署時不需要任何雲端服務：

| 元件 | 儲存方式 |
|------|----------|
| 文章 / 圖片中繼資料 | JSON 檔案（`data/` 目錄，volume 持久化） |
| 上傳的圖片 | 本地檔案系統（`public/images/blog/`，volume 持久化） |
| 資料庫（可選） | docker-compose 內附註解掉的 PostgreSQL 服務，或繼續用 Neon |

## 前置需求

- NAS 支援 Docker（Synology：套件中心安裝 **Container Manager**；DSM 7.1 以前叫 Docker）
- 專案原始碼已在 NAS 上（例如透過 SMB 放到 `/volume1/homes/<你>/app/skate-site-main`，或 `git clone`）

## 步驟

### 1. 建立 `.env.local`

```bash
cp .env.example .env.local
```

必填項目：

```ini
ADMIN_USERNAME=admin
# 用本地 Node 產生：node scripts/hash-password.js '你的密碼'
# 注意 .env.local 中 $ 要寫成 \$
ADMIN_PASSWORD_HASH=\$2b\$12\$xxxxx...
JWT_SECRET=隨機至少32字元的字串
NEXT_PUBLIC_SITE_URL=http://192.168.x.x:3000   # 你的 NAS IP 或網域
STORAGE_DRIVER=local
COOKIE_SECURE=false   # 純 HTTP 存取時必須為 false，有 HTTPS 才設 true
```

### 2. 建置並啟動

```bash
sudo docker compose up -d --build
```

#### NAS 建置太慢？改用預建置模式（建議）

低功耗 NAS 跑 `npm ci` + `next build` 可能要數十分鐘。可以先在 Mac 上編譯，NAS 只打包：

```bash
# 在 Mac（專案目錄）：
cd /Volumes/homes/threepoint20/app/skate-site-main
npm run build        # 產生 .next/standalone

# 在 NAS（專案目錄）：
DOCKERFILE=Dockerfile.prebuilt sudo docker compose up -d --build
```

`.next` 目錄在 NAS 的同一個資料夾就能直接用（經由 SMB 共用），
打包過程只需 1-2 分鐘。本專案依賴皆為純 JS，macOS 產出的 standalone 可跨平台執行。

或在 Synology Container Manager：**專案 → 新增**，選擇專案目錄，使用現有的 `docker-compose.yml` 建立。

### 3. 驗證

- 瀏覽 `http://<NAS_IP>:3000`
- 用管理員帳號登入，測試發文與圖片上傳

## 資料持久化

`docker-compose.yml` 使用兩個 named volume：

- `skate-data` → `/app/data`（`blog-posts.json`、`site-images.json`）
- `skate-uploads` → `/app/public/images/blog`（上傳的圖片）

首次建立 named volume 時，Docker 會用 image 內建的 `data/` 作為初始內容（含範例文章）。
備份方式：`docker run --rm -v skate-data:/data -v $(pwd):/backup alpine tar czf /backup/data.tar.gz -C /data .`

### 改用 bind mount（想直接看到檔案時）

```yaml
volumes:
  - ./data:/app/data
  - ./uploads:/app/public/images/blog
```

容器以 `nextjs`（uid 1001）執行，bind mount 目錄需要可寫權限：

```bash
mkdir -p data uploads
sudo chown -R 1001:1001 data uploads
```

## 對外存取與 HTTPS

### 僅區網使用
`http://<NAS_IP>:3000`，保持 `COOKIE_SECURE=false`。

### 對外 + HTTPS（建議）
1. Synology **控制台 → 登入入口 → 反向代理伺服器**：來源 `https://skate.你的網域` → 目的地 `http://localhost:3000`
2. 用 DSM 內建 Let's Encrypt 申請憑證
3. `.env.local` 改為：
   ```ini
   NEXT_PUBLIC_SITE_URL=https://skate.你的網域
   COOKIE_SECURE=true
   ```
4. `docker compose up -d` 重建容器

也可以用 Cloudflare Tunnel / Tailscale Funnel 取代反向代理，同樣記得開 `COOKIE_SECURE=true`。

## 改用 PostgreSQL（可選）

文章量變大或想要真正的資料庫時：

1. 取消 `docker-compose.yml` 中 `db` 服務與 `skate-db` volume 的註解
2. `.env.local` 加入 `DATABASE_URL=postgresql://postgres:<密碼>@db:5432/skate`
3. 執行 migration（schema 在 `drizzle/`）：
   ```bash
   docker compose exec skate-site npx drizzle-kit migrate
   ```
   （或在本地 `npm run db:migrate`，`drizzle.config.ts` 指向同一個 `DATABASE_URL`）
4. `docker compose up -d` 重啟

## 更新部署

```bash
git pull
docker compose up -d --build
```

volume 中的資料不受重建影響。

## 常見問題

| 問題 | 原因 / 解法 |
|------|------------|
| 登入後一直跳回登入 | HTTP 環境下 `COOKIE_SECURE` 不是 `false`；或瀏覽器拒收 Secure cookie |
| 圖片上傳 500 | 確認 `STORAGE_DRIVER=local` 且 `skate-uploads` volume 已掛載 |
| 重啟後文章消失 | 用了 bind mount 但掛到空目錄；改用 named volume 或先把 `data/*.json` 放進去 |
| 寫入 data 失敗 | bind mount 權限問題，`chown -R 1001:1000`（`docker exec` 可用 `id nextjs` 確認 uid） |
