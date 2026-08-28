import type { Metadata } from 'next';
import './globals.css';
import AppChrome from './components/AppChrome';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: '远大物产 CAREERS | 招聘门户',
  description: '走进大宗商品的真实世界，探索远大物产校园招聘、社会招聘与重点人才项目。',
  openGraph: {
    title: '远大物产 CAREERS | 招聘门户',
    description: '和优秀的人一起，走进大宗商品的真实世界。',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: '远大物产 CAREERS' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '远大物产 CAREERS | 招聘门户',
    description: '和优秀的人一起，走进大宗商品的真实世界。',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body><AppChrome>{children}</AppChrome></body>
    </html>
  );
}
