import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '滑板指南',
  description: '從初學者到進階的滑板教學：基本姿勢、Ollie 等技巧與安全注意事項。',
  alternates: { canonical: '/guides' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
