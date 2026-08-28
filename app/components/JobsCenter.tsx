'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Job, RecruitmentProject } from '../types/recruitment';

export default function JobsCenter({ jobs, projects, initialType = '', initialProject = '' }: { jobs: Job[]; projects: RecruitmentProject[]; initialType?: string; initialProject?: string }) {
  const [keyword, setKeyword] = useState(''); const [type, setType] = useState(initialType); const [category, setCategory] = useState(''); const [location, setLocation] = useState(''); const [project, setProject] = useState(initialProject);
  const categories = [...new Set(jobs.map((job) => job.job_category))]; const locations = [...new Set(jobs.map((job) => job.location))];
  const results = useMemo(() => jobs.filter((job) => {
    const text = `${job.title}${job.job_category}${job.department}${job.business_unit}`.toLowerCase();
    return (!keyword || text.includes(keyword.toLowerCase())) && (!type || job.recruitment_type === type) && (!category || job.job_category === category) && (!location || job.location === location) && (!project || job.related_project_ids.includes(project));
  }), [jobs, keyword, type, category, location, project]);

  return <>
    <div className="jobs-center-filters">
      <label className="wide-filter"><span>职位关键词</span><input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索职位名称或方向" /></label>
      <label><span>招聘类型</span><select value={type} onChange={(event) => setType(event.target.value)}><option value="">全部类型</option><option>校园招聘</option><option>社会招聘</option><option>招聘项目</option></select></label>
      <label><span>岗位方向</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">全部方向</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>工作地点</span><select value={location} onChange={(event) => setLocation(event.target.value)}><option value="">全部地点</option>{locations.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>招聘项目</span><select value={project} onChange={(event) => setProject(event.target.value)}><option value="">全部项目</option>{projects.map((item) => <option key={item.project_id} value={item.project_id}>{item.project_name}</option>)}</select></label>
    </div>
    <div className="results-bar"><strong>{results.length}</strong> 个开放职位 <button type="button" onClick={() => { setKeyword(''); setType(''); setCategory(''); setLocation(''); setProject(''); }}>清除筛选</button></div>
    <div className="jobs-card-grid">
      {results.map((job) => <article className="job-card" key={job.job_id}>
        <div className="job-card-top"><span>{job.recruitment_type}</span>{job.is_mock && <small>部分信息为 Mock</small>}</div><h2>{job.title}</h2><p>{job.job_category}</p>
        <dl><div><dt>地点</dt><dd>{job.location}</dd></div><div><dt>业务 / 部门</dt><dd>{job.business_unit}<br />{job.department}</dd></div><div><dt>学历</dt><dd>{job.education_requirement}</dd></div></dl>
        <Link href={`/jobs/${job.job_id}`}>查看职位 <span aria-hidden="true">↗</span></Link>
      </article>)}
      {!results.length && <div className="empty-jobs center-empty"><strong>暂未找到匹配职位</strong><p>请调整搜索条件。</p></div>}
    </div>
  </>;
}
