import type { Metadata } from 'next';
import CandidateDashboard from '../../components/CandidateDashboard';
export const metadata: Metadata = { title: '账号设置 | 远大物产 CAREERS', robots: { index: false, follow: false } };
export default function AccountPage() { return <main className="candidate-page"><div className="container"><CandidateDashboard section="account" /></div></main>; }
