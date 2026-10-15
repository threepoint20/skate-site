import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '新增文章',
  description: '管理員新增部落格文章',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
