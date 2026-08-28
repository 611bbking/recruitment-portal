import type { Metadata } from 'next';
import CandidateDashboard from '../../components/CandidateDashboard';
export const metadata: Metadata = { title: '我的投递 | 远大物产 CAREERS', robots: { index: false, follow: false } };
export default function ApplicationsPage() { return <main className="candidate-page"><div className="container"><CandidateDashboard section="applications" /></div></main>; }
