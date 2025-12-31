'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../lib/auth';
import UserStatus from './UserStatus';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, login, logout, isAdmin, hasPermission } = useAuth();

  const navItems = [
    { href: '/', label: '首頁' },
    { href: '/about', label: '關於我們' },
    { href: '/guides', label: '滑板指南' },
    { href: '/equipment', label: '裝備介紹' },
    { href: '/blog', label: '部落格' },
    { href: '/contact', label: '聯絡我們' },
  ];

    // 管理員專用選單項目
    const adminNavItems = [
      { href: '/admin', label: '控制台', permission: 'access_admin' },
      { href: '/blog/manage', label: '管理', permission: 'access_admin' },
    ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🛹</span>
              </div>
              <span className="text-xl font-bold text-gray-900">SkateInfo</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
            
            {/* 管理員專用選單 */}
            {adminNavItems.map((item) => (
              hasPermission(item.permission) && (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.label}
                </Link>
              )
            ))}

            {/* 用戶狀態 */}
            <UserStatus
              user={user}
              loading={loading}
              isAdmin={isAdmin}
              onLogin={login}
              onLogout={logout}
            />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* 移動端用戶狀態 */}
            <UserStatus
              user={user}
              loading={loading}
              isAdmin={isAdmin}
              onLogin={login}
              onLogout={logout}
            />
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-black focus:outline-none focus:text-black"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-black block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* 移動端管理員選單 */}
              {adminNavItems.map((item) => (
                hasPermission(item.permission) && (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-blue-600 hover:text-blue-800 block px-3 py-2 rounded-md text-base font-medium transition-colors border-t border-gray-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}