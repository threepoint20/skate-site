# ---- 安裝依賴 ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- 建置 ----
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- 執行 ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
# 本地檔案模式的初始資料（volume 掛載時可作為種子資料）
COPY --from=builder /app/data ./data

# 讓掛載的 named volume 可由 nextjs 寫入（bind mount 請參考 NAS_DEPLOYMENT.md 的權限說明）
RUN mkdir -p /app/public/images/blog \
  && chown -R nextjs:nodejs /app/data /app/public/images

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
