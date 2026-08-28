'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getMockHrUser, isMockHrAuthenticated, mockHrLogout } from '../lib/hr-store';

const navItems = [{ href: '/hr', label: '招聘工作台', icon: '▦' }, { href: '/hr/candidates', label: '候选人', icon: '◎' }, { href: '/hr/jobs', label: '职位管理', icon: '▤' }, { href: '/hr/projects', label: '招聘项目', icon: '◇' }, { href: '/hr/interviews', label: '面试管理', icon: '◷' }];

export default function HrShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); const router = useRouter(); const [ready, setReady] = useState(pathname === '/hr/login'); const [userName, setUserName] = useState('');
  useEffect(() => { if (pathname === '/hr/login') return; const timer = window.setTimeout(() => { if (!isMockHrAuthenticated()) { router.replace(`/hr/login?returnTo=${encodeURIComponent(pathname)}`); return; } setUserName(getMockHrUser()?.name ?? 'Mock HR'); setReady(true); }, 0); return () => window.clearTimeout(timer); }, [pathname, router]);
  if (pathname === '/hr/login') return children;
  if (!ready) return <div className="hr-guard-loading">正在验证 HR Mock 登录状态…</div>;
  return <div className="hr-app"><aside className="hr-sidebar"><Link className="hr-brand" href="/hr"><Image src="/grand-resources-logo.png" width={2380} height={668} alt="远大物产" /><span>RECRUITING</span></Link><nav>{navItems.map((item) => <Link className={pathname === item.href || (item.href !== '/hr' && pathname.startsWith(item.href)) ? 'active' : ''} href={item.href} key={item.href}><i>{item.icon}</i><span>{item.label}</span></Link>)}</nav><Link className="hr-portal-link" href="/">↗ 返回招聘门户</Link></aside><div className="hr-main"><header className="hr-topbar"><div><span>INTERNAL RECRUITING SYSTEM</span></div><div className="hr-user"><span>{userName.slice(-3, -2) || 'H'}</span><strong>{userName}</strong><button onClick={() => { mockHrLogout(); router.push('/hr/login'); }}>退出</button></div></header><div className="hr-content">{children}</div></div></div>;
}
