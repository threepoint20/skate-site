import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '文章管理',
  description: '管理員文章管理',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
