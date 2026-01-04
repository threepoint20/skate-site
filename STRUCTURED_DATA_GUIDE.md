# 結構化資料 (Structured Data) 使用指南

## 概述

本專案已完整整合 JSON-LD 結構化資料，符合 Schema.org 標準，有助於提升 SEO 效果和搜尋引擎理解度。

## 已實作的結構化資料類型

### 1. 組織資料 (Organization)
- **位置**: 所有頁面的 `layout.tsx`
- **用途**: 描述網站組織資訊
- **包含**: 公司名稱、描述、聯絡資訊、地址

### 2. 文章資料 (Article)
- **位置**: 個別部落格文章頁面 (`/blog/[slug]`)
- **組件**: `ArticleStructuredData.tsx`
- **包含**: 標題、作者、發布日期、內容摘要、關鍵字、字數等

### 3. 部落格資料 (Blog)
- **位置**: 部落格列表頁面 (`/blog`)
- **組件**: `BlogListingStructuredData.tsx`
- **包含**: 部落格資訊和最新文章列表

### 4. 網站資料 (WebSite)
- **位置**: 部落格列表頁面 (`/blog`)
- **組件**: `BlogListingStructuredData.tsx`
- **包含**: 網站搜尋功能和基本資訊

## 組件說明

### ArticleStructuredData 組件

```typescript
interface ArticleStructuredDataProps {
  post: BlogPost;
  baseUrl?: string;
}
```

**功能**:
- 為個別文章生成 Article 類型的結構化資料
- 包含完整的文章 metadata
- 支援多語言 (zh-TW)
- 自動計算字數和閱讀時間

**使用方式**:
```tsx
// 自動使用環境變數
<ArticleStructuredData post={post} />

// 或手動指定 baseUrl
<ArticleStructuredData post={post} baseUrl="https://your-domain.com" />
```

### BlogListingStructuredData 組件

```typescript
interface BlogListingStructuredDataProps {
  posts: BlogPost[];
  baseUrl?: string;
}
```

**功能**:
- 為部落格頁面生成 Blog 和 WebSite 類型的結構化資料
- 包含最新文章列表 (最多 10 篇)
- 提供網站搜尋功能描述

**使用方式**:
```tsx
// 自動使用環境變數
<BlogListingStructuredData posts={posts} />

// 或手動指定 baseUrl
<BlogListingStructuredData posts={posts} baseUrl="https://your-domain.com" />
```

## 資料結構

### BlogPost 介面更新

```typescript
export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  updatedAt?: string; // 新增：文章更新時間
  category: string;
  readTime: string;
  author: string;
  tags: string[];
  status: '已發布' | '草稿';
  views: number;
  coverImage?: string;
}
```

## 驗證方法

### 1. 本地驗證

```bash
# 執行結構化資料測試
node scripts/test-structured-data.js

# 執行 SEO 驗證
node scripts/verify-seo-setup.js
```

### 2. 瀏覽器驗證

1. 開啟網站頁面
2. 按 F12 開啟開發者工具
3. 在 Elements 標籤中搜尋 `application/ld+json`
4. 檢查 JSON-LD 內容是否正確

### 3. 線上工具驗證

- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Schema.org Validator**: https://validator.schema.org/
- **Google Search Console**: https://search.google.com/search-console

## 注意事項

### 客戶端渲染
- 部落格頁面使用客戶端渲染
- 結構化資料會在資料載入後動態生成
- 需要等待頁面完全載入才能看到結構化資料

### 設定更新
- 使用環境變數 `NEXT_PUBLIC_SITE_URL` 設定 baseUrl
- 本地開發：`http://localhost:3000`
- Vercel 部署：`https://your-domain.vercel.app`
- 自訂網域：`https://your-custom-domain.com`
- 確保 logo 圖片路徑正確
- 檢查聯絡資訊是否正確

### SEO 最佳實踐
- 確保所有必要欄位都有值
- 保持資料的一致性和準確性
- 定期檢查結構化資料的有效性

## 範例輸出

### Article 結構化資料範例

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "滑板基礎入門指南",
  "description": "滑板基礎入門指南，包含選板建議、基本站姿、推進技巧和安全提醒",
  "author": {
    "@type": "Person",
    "name": "滑板教練"
  },
  "datePublished": "2024-12-31T00:00:00.000Z",
  "publisher": {
    "@type": "Organization",
    "name": "SkateInfo"
  },
  "inLanguage": "zh-TW"
}
```

### Blog 結構化資料範例

```json
{
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "SkateInfo 滑板部落格",
  "description": "分享滑板知識、技巧教學和文化故事的專業部落格",
  "url": "https://your-domain.com/blog",
  "inLanguage": "zh-TW",
  "blogPost": [...]
}
```

## 故障排除

### 常見問題

1. **結構化資料未顯示**
   - 檢查頁面是否完全載入
   - 確認資料是否正確傳入組件
   - 檢查瀏覽器控制台是否有錯誤

2. **驗證工具報錯**
   - 檢查必要欄位是否缺失
   - 確認日期格式是否正確
   - 驗證 URL 是否有效

3. **搜尋引擎未識別**
   - 等待搜尋引擎重新索引
   - 在 Google Search Console 提交 sitemap
   - 檢查 robots.txt 設定

## 未來擴展

可考慮新增的結構化資料類型：
- **Person**: 作者頁面
- **Course**: 教學課程
- **Event**: 滑板活動
- **Product**: 滑板裝備
- **Review**: 產品評論

## 相關檔案

- `app/components/ArticleStructuredData.tsx`
- `app/components/BlogListingStructuredData.tsx`
- `app/components/StructuredData.tsx`
- `app/lib/blogData.ts`
- `scripts/test-structured-data.js`
- `scripts/verify-seo-setup.js`