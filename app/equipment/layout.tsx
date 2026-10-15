import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '滑板裝備',
  description: '滑板構造、板面、輪子硬度與保養維護的完整裝備指南。',
  alternates: { canonical: '/equipment' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
