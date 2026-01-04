import Link from 'next/link';
import BreadcrumbStructuredData from './BreadcrumbStructuredData';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <>
      {/* SEO 結構化資料 */}
      <BreadcrumbStructuredData items={items} />
      
      {/* 可視化導覽標記 */}
      <nav className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`} aria-label="導覽標記">
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <svg 
                className="w-4 h-4 mx-2 text-gray-400" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
            
            {index === items.length - 1 ? (
              // 最後一項不需要連結
              <span className="font-medium text-gray-900" aria-current="page">
                {item.name}
              </span>
            ) : (
              // 其他項目都是連結
              <Link 
                href={item.url}
                className="hover:text-blue-600 transition-colors"
              >
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}