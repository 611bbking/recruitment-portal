import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getJobById, jobs } from '../../data/jobs';
import { getProjectById } from '../../data/projects';

export function generateStaticParams() { return jobs.map((job) => ({ jobId: job.job_id })); }
export async function generateMetadata({ params }: { params: Promise<{ jobId: string }> }): Promise<Metadata> {
  const job = getJobById((await params).jobId); if (!job) return {};
  return { title: `${job.title} | 远大物产 CAREERS`, description: `${job.recruitment_type} · ${job.job_category} · ${job.location}`, openGraph: { title: `${job.title} | 远大物产 CAREERS`, description: job.major_requirement, images: [] }, twitter: { title: `${job.title} | 远大物产 CAREERS`, description: job.major_requirement, images: [] } };
}

export default async function JobDetailPage({ params, searchParams }: { params: Promise<{ jobId: string }>; searchParams: Promise<{ project?: string }> }) {
  const job = getJobById((await params).jobId); if (!job) notFound();
  const projectId = (await searchParams).project; const sourceProject = projectId ? getProjectById(projectId) : undefined;
  const applyHref = `/apply/${job.job_id}${sourceProject ? `?project=${sourceProject.project_id}` : ''}`;
  return <main className="inner-page job-detail-page"><section className="job-detail-hero"><div className="container"><Link className="back-link" href={sourceProject ? sourceProject.detail_href : '/jobs'}>← {sourceProject ? `返回${sourceProject.project_name}` : '返回职位中心'}</Link><div className="job-detail-title"><div><p>{job.recruitment_type} · {job.job_category}</p><h1>{job.title}</h1><div className="job-pills"><span>{job.location}</span><span>{job.education_requirement}</span>{sourceProject && <span>来自：{sourceProject.project_name}</span>}</div></div><Link className="button button-primary" href={applyHref}>立即投递 <span>→</span></Link></div></div></section>
    <section className="section"><div className="container job-detail-grid"><article><section><h2>岗位职责</h2><ul>{job.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></section><section><h2>任职要求</h2><ul>{job.requirements.map((item) => <li key={item}>{item}</li>)}</ul></section></article><aside><div><small>专业要求</small><p>{job.major_requirement}</p></div><div><small>业务 / 部门</small><p>{job.business_unit}<br />{job.department}</p></div>{job.related_project_ids.length > 0 && <div><small>关联招聘项目</small>{job.related_project_ids.map((id) => { const project = getProjectById(id); return project ? <Link key={id} href={project.detail_href}>{project.project_name} ↗</Link> : null; })}</div>}<p className="mock-note">地点、业务和部门为合理 Mock，待业务确认。</p></aside></div></section>
    <div className="mobile-apply-bar"><span><strong>{job.title}</strong>{sourceProject && <small>{sourceProject.project_name}</small>}</span><Link className="button button-primary" href={applyHref}>立即投递</Link></div>
  </main>;
}
