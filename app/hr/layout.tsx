import type { Metadata } from 'next';
import HrShell from '../components/HrShell';

export const metadata: Metadata = { title: 'HR 招聘管理后台 | 远大物产', robots: { index: false, follow: false } };
export default function HrLayout({ children }: { children: React.ReactNode }) { return <HrShell>{children}</HrShell>; }
