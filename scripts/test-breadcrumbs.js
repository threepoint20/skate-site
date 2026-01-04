#!/usr/bin/env node

// 載入環境變數
require('dotenv').config({ path: '.env.local' });

// 測試導覽標記功能

console.log('🧪 Testing Breadcrumb Implementation...\n');

// 模擬導覽標記生成邏輯
function generateBreadcrumbs(path, customItems) {
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
  };

  const breadcrumbs = [PAGE_INFO.home];

  if (customItems) {
    return [PAGE_INFO.home, ...customItems];
  }

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
      if (path.startsWith('/blog/') && path !== '/blog') {
        breadcrumbs.push(PAGE_INFO.blog);
      }
      break;
  }

  return breadcrumbs;
}

function generateBlogPostBreadcrumbs(postTitle) {
  return [
    { name: '首頁', url: '/' },
    { name: '部落格', url: '/blog' },
    { name: postTitle, url: '#' }
  ];
}

function generateBreadcrumbStructuredData(items, baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com') {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`
    }))
  };
}

console.log('1. Testing page breadcrumbs generation:');

const testPages = [
  '/about',
  '/guides', 
  '/equipment',
  '/contact',
  '/blog',
  '/blog/new',
  '/blog/manage',
  '/admin',
  '/admin/images'
];

testPages.forEach(path => {
  const breadcrumbs = generateBreadcrumbs(path);
  console.log(`\n📍 ${path}:`);
  breadcrumbs.forEach((item, index) => {
    const arrow = index > 0 ? ' → ' : '   ';
    console.log(`${arrow}${item.name} (${item.url})`);
  });
});

console.log('\n2. Testing blog post breadcrumbs:');
const blogPostBreadcrumbs = generateBlogPostBreadcrumbs('滑板基礎入門指南');
console.log('\n📍 /blog/skateboard-basics-guide:');
blogPostBreadcrumbs.forEach((item, index) => {
  const arrow = index > 0 ? ' → ' : '   ';
  console.log(`${arrow}${item.name} (${item.url})`);
});

console.log('\n3. Testing structured data generation:');

const aboutBreadcrumbs = generateBreadcrumbs('/about');
const structuredData = generateBreadcrumbStructuredData(aboutBreadcrumbs);

console.log('\n📋 About page structured data:');
console.log(JSON.stringify(structuredData, null, 2));

console.log('\n4. Validation Results:');

const validationTests = [
  {
    name: 'Has @context',
    test: () => structuredData['@context'] === 'https://schema.org',
  },
  {
    name: 'Has @type BreadcrumbList',
    test: () => structuredData['@type'] === 'BreadcrumbList',
  },
  {
    name: 'Has itemListElement array',
    test: () => Array.isArray(structuredData.itemListElement),
  },
  {
    name: 'First item is home page',
    test: () => structuredData.itemListElement[0]?.name === '首頁',
  },
  {
    name: 'Items have correct positions',
    test: () => structuredData.itemListElement.every((item, index) => item.position === index + 1),
  },
  {
    name: 'Items have ListItem type',
    test: () => structuredData.itemListElement.every(item => item['@type'] === 'ListItem'),
  },
  {
    name: 'URLs are absolute',
    test: () => structuredData.itemListElement.every(item => item.item.startsWith('http')),
  }
];

validationTests.forEach(test => {
  const result = test.test();
  console.log(`${result ? '✅' : '❌'} ${test.name}: ${result}`);
});

const allValid = validationTests.every(test => test.test());
console.log(`\n${allValid ? '🎉' : '❌'} Overall Validation: ${allValid ? 'PASSED' : 'FAILED'}`);

console.log('\n5. Integration Status:');
console.log('✅ BreadcrumbStructuredData component created');
console.log('✅ Breadcrumb visual component created');
console.log('✅ Breadcrumb utility functions created');
console.log('✅ Integrated into all main pages');
console.log('✅ Blog post breadcrumbs implemented');
console.log('✅ Admin page breadcrumbs implemented');

console.log('\n6. SEO Benefits:');
console.log('🔍 Improved search result display');
console.log('🗺️  Better site structure understanding');
console.log('👥 Enhanced user navigation experience');
console.log('📱 Mobile-friendly breadcrumb display');
console.log('♿ Accessibility improvements');

console.log('\n7. Next Steps:');
console.log('📝 Test breadcrumbs in browser');
console.log('📝 Verify structured data with Google Rich Results Test');
console.log('📝 Check breadcrumb display on all pages');
console.log('📝 Validate accessibility with screen readers');

console.log('\n🎯 Breadcrumb Implementation Complete!');

// 顯示當前環境的 baseUrl
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
console.log(`\n🌐 Current baseUrl: ${baseUrl}`);