'use client';

import { useMemo, useState } from 'react';
import type { Job } from '../types/recruitment';

export default function JobExplorer({ jobs }: { jobs: Job[] }) {
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('全部类型');
  const [direction, setDirection] = useState('全部方向');
  const [location, setLocation] = useState('全部地点');

  const directions = [...new Set(jobs.map((job) => job.job_category))];
  const locations = [...new Set(jobs.flatMap((job) => job.location.split(' / ')))];
  const filteredJobs = useMemo(() => jobs.filter((job) => {
    const text = `${job.title}${job.business_unit}${job.department}${job.job_category}`.toLowerCase();
    return (!keyword || text.includes(keyword.toLowerCase()))
      && (type === '全部类型' || job.recruitment_type === type)
      && (direction === '全部方向' || job.job_category === direction)
      && (location === '全部地点' || job.location.includes(location));
  }).slice(0, 4), [jobs, keyword, type, direction, location]);

  return (
    <>
      <div className="job-filters" role="search" aria-label="筛选首页职位">
        <label className="search-field"><span aria-hidden="true">⌕</span><input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索职位或业务方向" aria-label="搜索职位" /></label>
        <label><span>招聘类型</span><select value={type} onChange={(event) => setType(event.target.value)}><option>全部类型</option><option>校园招聘</option><option>社会招聘</option><option>实习招聘</option></select></label>
        <label><span>岗位方向</span><select value={direction} onChange={(event) => setDirection(event.target.value)}><option>全部方向</option>{directions.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span>工作地点</span><select value={location} onChange={(event) => setLocation(event.target.value)}><option>全部地点</option>{locations.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      <div className="job-list" aria-live="polite">
        {filteredJobs.length ? filteredJobs.map((job) => (
          <article className="job-row" key={job.job_id}>
            <div className="job-title"><span>{job.recruitment_type} · {job.job_category}</span><h3>{job.title}</h3></div>
            <div className="job-meta"><span>{job.location}</span><span>{job.business_unit} / {job.department}</span></div>
            <a href={`/jobs/${job.job_id}`} aria-label={`查看${job.title}`}>查看职位 <span aria-hidden="true">↗</span></a>
          </article>
        )) : <div className="empty-jobs"><strong>暂未找到匹配职位</strong><p>调整关键词或筛选条件后再试试。</p></div>}
      </div>
    </>
  );
}
