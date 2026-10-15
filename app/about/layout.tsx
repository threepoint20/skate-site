import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '關於我們',
  description: '認識 SkateInfo 團隊與我們推廣滑板文化、社群與教育的理念。',
  alternates: { canonical: '/about' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
