'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getHrApplications, getManagedJobs, getManagedProjects, saveManagedProjects } from '../lib/hr-store';
import type { Job, RecruitmentProject } from '../types/recruitment';

export default function HrProjects() {
  const [projects, setProjects] = useState<RecruitmentProject[]>([]); const [jobs, setJobs] = useState<Job[]>([]); const [counts, setCounts] = useState<Record<string, number>>({});
  useEffect(() => { const timer = window.setTimeout(() => { const next = getManagedProjects(); setProjects(next); setJobs(getManagedJobs()); const applications = getHrApplications(); setCounts(Object.fromEntries(next.map((project) => [project.project_id, applications.filter((item) => item.project_id === project.project_id).length]))); }, 0); return () => window.clearTimeout(timer); }, []);
  function changeStatus(projectId: string, status: RecruitmentProject['status']) { const next = projects.map((project) => project.project_id === projectId ? { ...project, status, status_label: status === 'open' ? '报名中' : status === 'ongoing' ? '进行中' : status === 'closed' ? '已结束' : status === 'coming_soon' ? '即将开始' : '长期关注' } : project); setProjects(next); saveManagedProjects(next); }
  return <><div className="hr-page-title"><div><p>PROGRAM MANAGEMENT</p><h1>招聘项目</h1><span>查看项目状态、关联职位与候选人来源</span></div></div><div className="project-management-list">{projects.map((project) => <article key={project.project_id}><div className="project-management-main"><div><span>{project.project_type}</span><h2>{project.project_name}</h2><p>{project.description}</p></div><select value={project.status} onChange={(event) => changeStatus(project.project_id, event.target.value as RecruitmentProject['status'])}><option value="coming_soon">即将开始</option><option value="open">报名中</option><option value="ongoing">进行中</option><option value="closed">已结束</option><option value="following">长期关注</option></select></div><div className="project-management-meta"><div><small>项目时间</small><strong>{project.expected_time}</strong></div><div><small>关联职位</small><strong>{project.related_job_ids.map((id) => jobs.find((job) => job.job_id === id)?.title ?? id).join('、') || '暂无'}</strong></div><div><small>候选人数</small><strong>{counts[project.project_id] ?? 0}</strong></div><Link href={project.detail_href}>门户预览 ↗</Link></div></article>)}</div></>;
}
