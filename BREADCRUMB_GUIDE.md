# 導覽標記 (Breadcrumb) 實作指南

## 🎉 完成項目

### ✅ 組件實作
- **BreadcrumbStructuredData.tsx** - 結構化資料組件
- **Breadcrumb.tsx** - 可視化導覽標記組件
- **breadcrumbs.ts** - 工具函數庫

### ✅ 頁面整合
- 所有主要頁面都已整合導覽標記
- 部落格文章頁面支援動態標題
- 管理頁面支援多層級導覽

## 📋 功能特色

### 1. 雙重功能
```typescript
// 同時提供 SEO 結構化資料和可視化導覽
<Breadcrumb items={breadcrumbs} />
```

### 2. 自動 URL 處理
```typescript
// 自動將相對路徑轉換為絕對 URL
baseUrl + relativePath = 完整 URL
```

### 3. 環境變數支援
```typescript
// 使用 NEXT_PUBLIC_SITE_URL 環境變數
baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'
```

## 🔧 使用方式

### 基本頁面
```typescript
import Breadcrumb from '../components/Breadcrumb';
import { generateBreadcrumbs } from '../lib/breadcrumbs';

export default function About() {
  const breadcrumbs = generateBreadcrumbs('/about');
  
  return (
    <main>
      <Breadcrumb items={breadcrumbs} />
      {/* 頁面內容 */}
    </main>
  );
}
```

### 部落格文章
```typescript
import { generateBlogPostBreadcrumbs } from '../lib/breadcrumbs';

export default function BlogPost({ post }) {
  const breadcrumbs = generateBlogPostBreadcrumbs(post.title);
  
  return (
    <main>
      <Breadcrumb items={breadcrumbs} />
      {/* 文章內容 */}
    </main>
  );
}
```

### 自訂導覽標記
```typescript
const customBreadcrumbs = [
  { name: '首頁', url: '/' },
  { name: '特殊頁面', url: '/special' },
  { name: '子頁面', url: '/special/sub' }
];

<Breadcrumb items={customBreadcrumbs} />
```

## 📊 結構化資料範例

### 生成的 JSON-LD
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "首頁",
      "item": "https://your-domain.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "關於我們",
      "item": "https://your-domain.com/about"
    }
  ]
}
```

## 🎨 視覺效果

### 桌面版顯示
```
首頁 → 關於我們 → 子頁面
```

### 手機版顯示
```
首頁 → 關於我們 → 
子頁面
```

### 樣式特色
- 響應式設計
- 懸停效果
- 無障礙支援
- 語義化 HTML

## 🗺️ 頁面導覽結構

### 主要頁面
```
首頁 (/)
├── 關於我們 (/about)
├── 滑板指南 (/guides)
├── 滑板裝備 (/equipment)
├── 聯絡我們 (/contact)
└── 部落格 (/blog)
    ├── 新增文章 (/blog/new)
    ├── 管理文章 (/blog/manage)
    └── 文章頁面 (/blog/[slug])
```

### 管理頁面
```
首頁 (/)
└── 管理後台 (/admin)
    └── 圖片管理 (/admin/images)
```

## 🔍 SEO 優勢

### 1. 搜尋結果增強
- Google 會在搜尋結果中顯示導覽路徑
- 提升點擊率 (CTR)
- 改善用戶體驗

### 2. 網站結構理解
- 幫助搜尋引擎理解網站層級
- 提升頁面權重分配
- 改善內部連結結構

### 3. 用戶導航
- 清楚顯示當前位置
- 快速返回上層頁面
- 提升網站可用性

## 🧪 測試驗證

### 1. 本地測試
```bash
# 執行導覽標記測試
node scripts/test-breadcrumbs.js
```

### 2. 瀏覽器驗證
1. 開啟任何子頁面
2. 檢查頁面頂部是否顯示導覽標記
3. 點擊導覽標記連結測試功能

### 3. 結構化資料驗證
1. 按 F12 開啟開發者工具
2. 搜尋 `BreadcrumbList`
3. 檢查 JSON-LD 結構是否正確

### 4. 線上工具
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/

## ♿ 無障礙功能

### 1. 語義化標記
```html
<nav aria-label="導覽標記">
  <span aria-current="page">當前頁面</span>
</nav>
```

### 2. 鍵盤導航
- 支援 Tab 鍵導航
- 支援 Enter 鍵啟動連結
- 清楚的焦點指示

### 3. 螢幕閱讀器
- 正確的 ARIA 標籤
- 語義化的 HTML 結構
- 清楚的頁面層級關係

## 🎯 最佳實踐

### 1. 導覽標記設計
- 保持簡潔明瞭
- 使用一致的命名
- 避免過深的層級

### 2. 效能優化
- 結構化資料在伺服器端生成
- 最小化 JavaScript 執行
- 快速的頁面載入

### 3. 維護性
- 集中管理頁面資訊
- 統一的工具函數
- 易於擴展的架構

## 🔧 自訂擴展

### 新增頁面
```typescript
// 在 breadcrumbs.ts 中新增頁面資訊
const PAGE_INFO = {
  // 現有頁面...
  'new-page': { name: '新頁面', url: '/new-page' },
};

// 在 generateBreadcrumbs 函數中新增路由
case '/new-page':
  breadcrumbs.push(PAGE_INFO['new-page']);
  break;
```

### 多語言支援
```typescript
// 可以根據語言設定調整頁面名稱
const getPageName = (key, locale) => {
  const names = {
    'zh-TW': { home: '首頁', about: '關於我們' },
    'en': { home: 'Home', about: 'About Us' }
  };
  return names[locale][key];
};
```

## 📁 相關檔案

- `app/components/Breadcrumb.tsx` - 主要組件
- `app/components/BreadcrumbStructuredData.tsx` - 結構化資料
- `app/lib/breadcrumbs.ts` - 工具函數
- `scripts/test-breadcrumbs.js` - 測試腳本

## 🎉 完成效果

你的滑板網站現在擁有：
- ✅ 完整的導覽標記系統
- ✅ SEO 友善的結構化資料
- ✅ 優秀的用戶體驗
- ✅ 無障礙支援
- ✅ 響應式設計

這將大大提升你網站的 SEO 表現和用戶體驗！🛹✨