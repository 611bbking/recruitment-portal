import type { Metadata } from 'next';
import JobsCenter from '../components/JobsCenter';
import { jobs } from '../data/jobs';
import { recruitmentProjects } from '../data/projects';

export const metadata: Metadata = { title: '职位机会 | 远大物产 CAREERS', description: '搜索并筛选远大物产当前开放职位。' };

export default async function JobsPage({ searchParams }: { searchParams: Promise<{ type?: string; project?: string }> }) {
  const query = await searchParams;
  return <main className="inner-page"><section className="page-hero"><div className="container"><p className="section-index">OPEN POSITIONS</p><h1>职位机会</h1><p>找到与你的能力、兴趣和职业方向相匹配的真实机会。</p></div></section><section className="section jobs-center-section"><div className="container"><JobsCenter jobs={jobs.filter((job) => job.status === 'open')} projects={recruitmentProjects} initialType={query.type ?? ''} initialProject={query.project ?? ''} /></div></section></main>;
}
