'use client';

import { usePathname } from 'next/navigation';
import { SiteFooter, SiteHeader } from './SiteChrome';

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith('/hr')) return children;
  return <><SiteHeader />{children}<SiteFooter /></>;
}
