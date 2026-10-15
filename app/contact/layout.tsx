import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '聯絡我們',
  description: '與 SkateInfo 聯絡：地址、電話與電子郵件資訊。',
  alternates: { canonical: '/contact' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
