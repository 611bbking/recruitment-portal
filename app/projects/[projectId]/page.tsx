import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { jobs } from '../../data/jobs';
import { getProjectById, recruitmentProjects } from '../../data/projects';

export function generateStaticParams() { return recruitmentProjects.map((project) => ({ projectId: project.project_id })); }
export async function generateMetadata({ params }: { params: Promise<{ projectId: string }> }): Promise<Metadata> {
  const project = getProjectById((await params).projectId); if (!project) return {};
  return { title: `${project.project_name} | 远大物产 CAREERS`, description: project.description, openGraph: { title: `${project.project_name} | 远大物产 CAREERS`, description: project.description, images: [] }, twitter: { title: `${project.project_name} | 远大物产 CAREERS`, description: project.description, images: [] } };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const project = getProjectById((await params).projectId); if (!project) notFound();
  const relatedJobs = jobs.filter((job) => job.related_project_ids.includes(project.project_id));
  return <main className="inner-page project-detail-page"><section className="project-detail-hero"><div className="container"><Link className="back-link" href="/projects">← 返回招聘项目</Link><p className="section-index">{project.project_type}</p><div className="project-detail-title"><div><h1>{project.project_name}</h1><p>{project.description}</p></div><span>{project.status_label}</span></div><div className="project-keyfacts"><div><small>适用对象</small><strong>{project.target_group}</strong></div><div><small>项目时间</small><strong>{project.expected_time}</strong></div><div><small>项目定位</small><strong>{project.brand_role}</strong></div></div></div></section>
    <section className="section project-story"><div className="container project-story-grid"><div><p className="section-index">ABOUT THE PROGRAM</p><h2>在项目里，走进真实产业</h2></div><div><p>{project.description}</p><p>项目本身不设置独立报名，候选人需要在下方开放职位中选择具体岗位，再进入统一投递流程。</p>{project.partner_organizations.length > 0 && <div className="partner-box"><small>合作方展示（Mock）</small><strong>{project.partner_organizations.join('、')}</strong></div>}</div></div></section>
    <section className="section related-jobs-section"><div className="container"><div className="section-heading"><div><p className="section-index">OPEN POSITIONS</p><h2>本项目开放职位</h2></div><p>选择具体职位查看职责与要求，项目来源会随投递一并记录。</p></div>{relatedJobs.length ? <div className="related-job-list">{relatedJobs.map((job) => <article key={job.job_id}><div><span>{job.job_category}</span><h3>{job.title}</h3></div><div><span>{job.location}</span><span>{job.education_requirement}</span></div><Link href={`/jobs/${job.job_id}?project=${project.project_id}`}>查看职位 <span>↗</span></Link></article>)}</div> : <div className="empty-jobs"><strong>当前暂无开放职位</strong><p>请持续关注项目更新。</p></div>}</div></section>
  </main>;
}
