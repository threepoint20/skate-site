import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '管理後台',
  description: '管理員專用控制台',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
