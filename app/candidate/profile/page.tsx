import type { Metadata } from 'next';
import CandidateDashboard from '../../components/CandidateDashboard';
export const metadata: Metadata = { title: '个人资料 | 远大物产 CAREERS', robots: { index: false, follow: false } };
export default function ProfilePage() { return <main className="candidate-page"><div className="container"><CandidateDashboard section="profile" /></div></main>; }
