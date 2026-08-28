import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ApplicationFlow from '../../components/ApplicationFlow';
import { getJobById } from '../../data/jobs';
import { getProjectById } from '../../data/projects';

export const metadata: Metadata = { title: '提交职位申请 | 远大物产 CAREERS', robots: { index: false, follow: false } };

export default async function ApplyPage({ params, searchParams }: { params: Promise<{ jobId: string }>; searchParams: Promise<{ project?: string }> }) {
  const job = getJobById((await params).jobId); if (!job) notFound(); const projectId = (await searchParams).project; const project = projectId ? getProjectById(projectId) : undefined;
  if (projectId && (!project || !job.related_project_ids.includes(projectId))) notFound();
  return <main className="apply-page"><div className="container"><ApplicationFlow job={job} project={project} /></div></main>;
}
