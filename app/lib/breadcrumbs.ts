// 導覽標記工具函數

export interface BreadcrumbItem {
  name: string;
  url: string;
}

// 預定義的頁面資訊
const PAGE_INFO = {
  home: { name: '首頁', url: '/' },
  about: { name: '關於我們', url: '/about' },
  guides: { name: '滑板指南', url: '/guides' },
  equipment: { name: '滑板裝備', url: '/equipment' },
  contact: { name: '聯絡我們', url: '/contact' },
  blog: { name: '部落格', url: '/blog' },
  admin: { name: '管理後台', url: '/admin' },
  'admin-images': { name: '圖片管理', url: '/admin/images' },
  'blog-new': { name: '新增文章', url: '/blog/new' },
  'blog-manage': { name: '管理文章', url: '/blog/manage' },
} as const;

// 生成導覽標記的函數
export function generateBreadcrumbs(path: string, customItems?: BreadcrumbItem[]): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [PAGE_INFO.home];

  // 如果有自訂項目，直接使用
  if (customItems) {
    return [PAGE_INFO.home, ...customItems];
  }

  // 根據路徑自動生成
  switch (path) {
    case '/about':
      breadcrumbs.push(PAGE_INFO.about);
      break;
    
    case '/guides':
      breadcrumbs.push(PAGE_INFO.guides);
      break;
    
    case '/equipment':
      breadcrumbs.push(PAGE_INFO.equipment);
      break;
    
    case '/contact':
      breadcrumbs.push(PAGE_INFO.contact);
      break;
    
    case '/blog':
      breadcrumbs.push(PAGE_INFO.blog);
      break;
    
    case '/blog/new':
      breadcrumbs.push(PAGE_INFO.blog, PAGE_INFO['blog-new']);
      break;
    
    case '/blog/manage':
      breadcrumbs.push(PAGE_INFO.blog, PAGE_INFO['blog-manage']);
      break;
    
    case '/admin':
      breadcrumbs.push(PAGE_INFO.admin);
      break;
    
    case '/admin/images':
      breadcrumbs.push(PAGE_INFO.admin, PAGE_INFO['admin-images']);
      break;
    
    default:
      // 處理動態路由，如 /blog/[slug]
      if (path.startsWith('/blog/') && path !== '/blog') {
        breadcrumbs.push(PAGE_INFO.blog);
        // 文章標題會在頁面組件中動態添加
      }
      break;
  }

  return breadcrumbs;
}

// 為部落格文章生成導覽標記
export function generateBlogPostBreadcrumbs(postTitle: string): BreadcrumbItem[] {
  return [
    PAGE_INFO.home,
    PAGE_INFO.blog,
    { name: postTitle, url: '#' } // 當前頁面不需要連結
  ];
}

// 為管理頁面生成導覽標記
export function generateAdminBreadcrumbs(pageName: string, pageUrl?: string): BreadcrumbItem[] {
  const breadcrumbs = [PAGE_INFO.home, PAGE_INFO.admin];
  
  if (pageName && pageUrl) {
    breadcrumbs.push({ name: pageName, url: pageUrl });
  }
  
  return breadcrumbs;
}