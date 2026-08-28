import type { Metadata } from 'next';
import Link from 'next/link';
import { recruitmentProjects } from '../data/projects';

export const metadata: Metadata = { title: '招聘项目 | 远大物产 CAREERS', description: '探索暑期探索营、鲲鹏班及其他长期人才项目。' };

export default function ProjectsPage() {
  return <main className="inner-page"><section className="page-hero project-list-hero"><div className="container"><p className="section-index">SIGNATURE PROGRAMS</p><h1>招聘项目</h1><p>从真实产业课题到行业联合培养，在项目中更早发现彼此。</p></div></section><section className="section"><div className="container project-list-grid">{recruitmentProjects.map((project, index) => <article className={`project-list-card list-project-${index + 1}`} key={project.project_id}><div><span>{project.project_type}</span><small>{project.status_label}</small></div><h2>{project.project_name}</h2><p>{project.description}</p><dl><div><dt>适用对象</dt><dd>{project.target_group}</dd></div><div><dt>项目时间</dt><dd>{project.expected_time}</dd></div></dl><Link href={project.detail_href}>查看项目详情 <span>↗</span></Link></article>)}</div></section></main>;
}
