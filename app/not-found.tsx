import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '找不到頁面 (404)',
  description: '您尋找的頁面不存在或已移動。',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-[75vh] bg-background text-foreground flex items-center justify-center px-6 py-24">
      <div className="max-w-lg mx-auto text-center">
        <div className="text-7xl mb-6">🛹💥</div>
        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-mono rounded-full mb-4">
          ERROR 404
        </span>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Oops! 這個動作失敗了
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          你尋找的頁面可能已經被移除、更改了網址，或者是一篇尚未公開的草稿文章。
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:opacity-80 transition"
          >
            返回首頁
          </Link>
          <Link
            href="/blog"
            className="px-6 py-3 border border-black text-black rounded-lg font-semibold hover:bg-black hover:text-white transition"
          >
            瀏覽滑板部落格
          </Link>
          <Link
            href="/guides"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            查看滑板指南
          </Link>
        </div>
      </div>
    </main>
  );
}