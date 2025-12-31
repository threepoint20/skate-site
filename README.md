# SkateInfo - 滑板資訊網站

一個專為滑板愛好者打造的綜合資訊網站，提供完整的滑板學習資源、裝備指南、社群資訊和具備權限管理的部落格系統。

## 🛹 網站特色

- **完整的滑板指南** - 從初學者到進階技巧的詳細教學
- **裝備選擇指南** - 專業的滑板裝備介紹和選購建議
- **權限管理系統** - 完整的用戶權限控制和管理功能
- **部落格系統** - 支援 Markdown 的文章管理和編輯功能
- **社群文化** - 推廣包容友善的滑板文化
- **響應式設計** - 支援各種裝置的最佳瀏覽體驗
- **中文化介面** - 完全繁體中文的使用者介面

## 📱 網站頁面

### 主要頁面
- **首頁** (`/`) - 網站介紹和最新活動
- **關於我們** (`/about`) - 團隊介紹和價值觀
- **滑板指南** (`/guides`) - 完整的學習教程
- **裝備介紹** (`/equipment`) - 滑板裝備詳細說明
- **聯絡我們** (`/contact`) - 聯絡表單和資訊

### 部落格系統
- **部落格首頁** (`/blog`) - 文章列表和分類篩選
- **文章詳細頁** (`/blog/[slug]`) - 完整文章內容和即時編輯
- **新增文章** (`/blog/new`) - 文章建立表單 (需管理員權限)
- **文章管理** (`/blog/manage`) - 後台管理介面 (需管理員權限)

### 管理系統
- **管理控制台** (`/admin`) - 管理員專用控制面板 (需管理員權限)

## 🔐 權限系統

### 用戶角色
- **Guest (訪客)** - 預設角色，只能閱讀已發布內容
- **Administrator (管理員)** - 完整管理權限

### 登入資訊
```
管理員帳號: 請查看 ADMIN_SETUP.md 設定指南
管理員密碼: 請設定環境變數 ADMIN_PASSWORD
```

> 💡 **安全提醒**: 密碼已移至環境變數管理，請參考 `ADMIN_SETUP.md` 進行設定。

### 權限對照表
| 功能 | 訪客 | 管理員 |
|------|------|--------|
| 閱讀文章 | ✅ | ✅ |
| 瀏覽網站 | ✅ | ✅ |
| 新增文章 | ❌ | ✅ |
| 編輯文章 | ❌ | ✅ |
| 刪除文章 | ❌ | ✅ |
| 管理文章狀態 | ❌ | ✅ |
| 訪問管理功能 | ❌ | ✅ |
| 批量操作 | ❌ | ✅ |

## 🚀 技術架構

### 前端技術
- **框架**: Next.js 14 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **字體**: Geist Sans & Geist Mono
- **狀態管理**: React Hooks + Context
- **權限控制**: 自訂權限系統

### 後端架構
- **API**: Next.js API Routes
- **資料儲存**: JSON 檔案系統
- **檔案操作**: Node.js fs 模組
- **資料管理**: 自訂資料管理層
- **權限驗證**: 基於角色的訪問控制 (RBAC)

### 權限系統架構
- **認證方式**: 簡單帳密驗證
- **會話管理**: localStorage 儲存
- **權限檢查**: 組件級和頁面級保護
- **路由保護**: ProtectedRoute 組件

### 部落格系統
- **資料格式**: JSON
- **儲存位置**: `data/blog-posts.json`
- **API 端點**: RESTful API 設計
- **功能**: CRUD 操作、分類篩選、標籤系統、權限控制

## 🛠️ 開發指南

### 環境需求
- Node.js 18+ 
- npm 或 yarn
- 現代瀏覽器

### 安裝依賴
```bash
npm install
```

### 開發模式
```bash
npm run dev
```
開啟 [http://localhost:3000](http://localhost:3000) 查看網站

### 建置專案
```bash
npm run build
```

### 啟動生產版本
```bash
npm start
```

### 程式碼檢查
```bash
npm run lint
```

## 📁 專案結構

```
skate-site/
├── app/                    # Next.js App Router
│   ├── components/         # 共用元件
│   │   ├── Navigation.tsx  # 導航列 (含權限控制)
│   │   ├── Footer.tsx      # 頁尾
│   │   ├── LoginModal.tsx  # 登入模態框
│   │   ├── UserStatus.tsx  # 用戶狀態顯示
│   │   └── ProtectedRoute.tsx # 權限保護組件
│   ├── lib/               # 工具函式
│   │   ├── blogData.ts    # 部落格資料管理
│   │   └── auth.ts        # 權限管理系統
│   ├── api/               # API 路由
│   │   └── blog/          # 部落格 API
│   │       ├── route.ts   # 文章列表 API
│   │       └── [slug]/    # 單篇文章 API
│   ├── admin/             # 管理系統
│   │   └── page.tsx       # 管理控制台
│   ├── about/             # 關於我們頁面
│   ├── guides/            # 滑板指南頁面
│   ├── equipment/         # 裝備介紹頁面
│   ├── contact/           # 聯絡我們頁面
│   ├── blog/              # 部落格系統
│   │   ├── page.tsx       # 部落格首頁 (含權限控制)
│   │   ├── new/           # 新增文章頁面 (需管理員權限)
│   │   ├── manage/        # 管理頁面 (需管理員權限)
│   │   └── [slug]/        # 動態文章頁面 (含編輯權限)
│   ├── globals.css        # 全域樣式
│   ├── layout.tsx         # 根佈局
│   └── page.tsx           # 首頁
├── data/                  # 資料儲存
│   ├── blog-posts.json    # 部落格文章資料
│   └── README.md          # 資料說明文件
├── public/                # 靜態資源
│   ├── activity1.png      # 活動照片
│   ├── activity2.png
│   ├── activity3.png
│   └── *.svg              # 圖標檔案
├── package.json           # 專案配置
├── tailwind.config.ts     # Tailwind 配置
├── tsconfig.json          # TypeScript 配置
└── README.md              # 專案說明
```

## 🎨 設計特色

- **現代化設計** - 簡潔美觀的使用者介面
- **漸層背景** - 各頁面使用不同色彩主題
- **互動效果** - 流暢的 hover 和 transition 效果
- **卡片佈局** - 清晰的資訊組織方式
- **圖標系統** - 豐富的 emoji 和 SVG 圖標
- **響應式佈局** - 支援桌面、平板、手機各種裝置
- **權限指示** - 清楚的權限狀態和角色顯示

## 📝 部落格系統功能

### 文章管理
- **新增文章** - 支援 Markdown 語法的編輯器 (管理員)
- **即時編輯** - 在文章頁面直接編輯內容 (管理員)
- **分類系統** - 6個預設分類，支援篩選
- **標籤系統** - 多標籤支援，增強搜尋性
- **狀態管理** - 已發布/草稿狀態切換 (管理員)
- **權限控制** - 基於角色的功能訪問控制

### 管理功能
- **批量操作** - 選擇多篇文章進行批量刪除 (管理員)
- **排序功能** - 按日期、標題、瀏覽數排序
- **篩選功能** - 按狀態篩選文章
- **統計資訊** - 即時顯示文章數量和瀏覽統計
- **瀏覽追蹤** - 自動記錄文章瀏覽數
- **管理控制台** - 專用的管理員操作介面

### 權限保護
- **頁面級保護** - 敏感頁面需要相應權限
- **組件級保護** - 功能按鈕根據權限顯示/隱藏
- **API 保護** - 後端 API 可擴展權限驗證
- **用戶狀態** - 即時顯示當前用戶角色和權限

### API 端點
```
GET    /api/blog           # 獲取所有文章
POST   /api/blog           # 儲存所有文章
GET    /api/blog/[slug]    # 獲取單篇文章
PUT    /api/blog/[slug]    # 更新單篇文章
DELETE /api/blog/[slug]    # 刪除單篇文章
```

## 🔐 權限管理詳細說明

### 認證流程
1. **預設狀態** - 自動創建訪客用戶
2. **管理員登入** - 使用帳密驗證
3. **權限檢查** - 每個操作都會驗證權限
4. **會話管理** - localStorage 儲存用戶狀態

### 權限檢查機制
```typescript
// 權限檢查函數
hasPermission(user, 'create_posts')  // 新增文章
hasPermission(user, 'edit_posts')    // 編輯文章
hasPermission(user, 'delete_posts')  // 刪除文章
hasPermission(user, 'manage_posts')  // 管理文章
hasPermission(user, 'access_admin')  // 訪問管理功能
```

### 組件保護範例
```typescript
// 條件渲染
{hasPermission('create_posts') && (
  <CreatePostButton />
)}

// 頁面保護
<ProtectedRoute requiredPermission="access_admin">
  <AdminPanel />
</ProtectedRoute>
```

## 💾 資料管理

### 儲存方式
- **位置**: `data/blog-posts.json`
- **格式**: JSON 陣列
- **版本控制**: 包含在 Git 版本控制中
- **備份**: 每次 commit 都是一個備份點
- **用戶資料**: localStorage (瀏覽器本地)

### 資料結構
```typescript
interface BlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  author: string;
  tags: string[];
  status: '已發布' | '草稿';
  views: number;
}

interface User {
  id: string;
  username: string;
  role: 'guest' | 'administrator';
  loginTime?: string;
}
```

### 資料操作
- **自動備份** - 每次修改都會寫入檔案
- **即時同步** - 前端操作立即反映到檔案
- **錯誤處理** - 完整的錯誤處理機制
- **資料驗證** - API 層面的資料格式驗證
- **權限驗證** - 所有寫入操作都需要相應權限

## 🌟 內容特色

### 滑板指南
- 初學者完整教程
- 基本技巧詳解  
- 進階動作教學
- 安全注意事項

### 裝備介紹
- 滑板構造說明
- 板面選擇指南
- 輪子硬度介紹
- 保養維護建議

### 社群功能
- 活動照片展示
- 部落格文章系統
- 電子報訂閱
- 社群媒體整合

## 🚀 部署指南

### Vercel 部署 (推薦)
1. 將專案推送到 GitHub
2. 在 Vercel 中匯入專案
3. 自動部署完成
4. 資料檔案會一起部署

### 其他平台
- **Netlify**: 支援 Next.js 部署
- **Railway**: 支援 Node.js 應用
- **自架伺服器**: 使用 PM2 管理程序

### 部署注意事項
- 確保 `data/` 目錄包含在部署中
- 檢查檔案系統權限 (寫入權限)
- 考慮使用環境變數管理敏感資訊
- 生產環境建議使用更安全的認證方式

## 🔧 開發工具

### 推薦 VS Code 擴充功能
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Prettier - Code formatter
- Auto Rename Tag

### 程式碼品質
- **ESLint**: 程式碼檢查
- **Prettier**: 程式碼格式化
- **TypeScript**: 型別檢查
- **Tailwind**: CSS 工具類別

## 🔒 安全性考量

### 當前實作
- 簡單帳密驗證 (適合展示和開發)
- localStorage 會話管理
- 前端權限檢查

### 生產環境建議
- 使用 JWT 或 OAuth 認證
- 實作後端權限驗證
- 密碼加密和雜湊
- HTTPS 強制使用
- 會話過期機制
- 防止 CSRF 攻擊

## 📞 聯絡資訊

- **電子郵件**: info@skateinfo.com
- **電話**: +886-912-345-678
- **地址**: 台北市信義區滑板街123號

## 📄 授權

本專案採用 MIT 授權條款。

## 🤝 貢獻指南

歡迎提交 Issue 和 Pull Request 來改善這個專案！

### 開發流程
1. Fork 專案
2. 建立功能分支
3. 提交變更
4. 發送 Pull Request

### 程式碼規範
- 使用 TypeScript
- 遵循 ESLint 規則
- 保持程式碼簡潔
- 添加適當註解
- 權限相關功能需要測試

## 🎯 未來規劃

### 短期目標
- [ ] 後端權限驗證強化
- [ ] 密碼加密機制
- [ ] 會話過期處理
- [ ] 更多用戶角色 (編輯者、審核者)

### 長期目標
- [ ] 資料庫整合 (PostgreSQL/MongoDB)
- [ ] 檔案上傳功能
- [ ] 評論系統
- [ ] 社群論壇
- [ ] 多語言支援
- [ ] 行動 App
- [ ] OAuth 第三方登入
