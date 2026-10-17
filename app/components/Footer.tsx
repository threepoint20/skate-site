import Link from 'next/link';
import { SITE_CONTACT } from '../lib/site';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">🛹</span>
              </div>
              <span className="text-xl font-bold">SkateInfo</span>
            </div>
            <p className="text-gray-400 text-sm">
              推廣滑板文化，建立友善包容的滑板社群
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">快速連結</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  關於我們
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-gray-400 hover:text-white transition-colors">
                  滑板指南
                </Link>
              </li>
              <li>
                <Link href="/equipment" className="text-gray-400 hover:text-white transition-colors">
                  裝備介紹
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  部落格
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">學習資源</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/guides" className="text-gray-400 hover:text-white transition-colors">
                  初學者指南
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-gray-400 hover:text-white transition-colors">
                  基本技巧
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-gray-400 hover:text-white transition-colors">
                  安全須知
                </Link>
              </li>
              <li>
                <Link href="/equipment" className="text-gray-400 hover:text-white transition-colors">
                  裝備選擇
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">聯絡我們</h3>
            <ul className="space-y-2 text-gray-400">
              <li>📧 {SITE_CONTACT.email}</li>
              <li>📱 {SITE_CONTACT.phone}</li>
              <li>📍 {SITE_CONTACT.fullAddress}</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2026 SkateInfo. 版權所有。
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
              聯絡我們
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}