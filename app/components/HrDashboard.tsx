'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  filterRecruitmentApplications,
  getCandidateProfileStats,
  getJobStats,
  getRecruitmentFunnel,
  getRecruitmentStats,
  getTodoStats,
  type DistributionItem,
  type RecruitmentDashboardFilter,
} from '../lib/recruitment-analytics';
import { getHrApplications, getHrCandidates, getHrInterviews, getManagedJobs } from '../lib/hr-store';
import type { Application, Candidate, Interview, Job } from '../types/recruitment';

const recruitmentTypeLabels = { campus: '校园招聘', social: '社会招聘', project: '招聘项目' } as const;
type JobSort = 'received' | 'resumePassRate' | 'offers';

function DistributionCard({ title, items }: { title: string; items: DistributionItem[] }) {
  return <article className="bg-analysis-card">
    <h3>{title}</h3>
    <div>{items.length ? items.map((item) => <div className="distribution-row" key={item.label}>
      <span>{item.label}</span>
      <div><i style={{ width: `${item.percentage}%` }} /></div>
      <strong>{item.count}</strong>
      <small>{item.percentage}%</small>
    </div>) : <p className="analysis-empty">当前筛选下暂无数据</p>}</div>
  </article>;
}

export default function HrDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<RecruitmentDashboardFilter>({ recruitmentType: '', jobId: '' });
  const [jobSort, setJobSort] = useState<JobSort>('received');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setApplications(getHrApplications());
      setCandidates(getHrCandidates());
      setInterviews(getHrInterviews());
      setJobs(getManagedJobs());
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredApplications = useMemo(() => filterRecruitmentApplications(applications, filter), [applications, filter]);
  const filteredApplicationIds = useMemo(() => new Set(filteredApplications.map((item) => item.application_id)), [filteredApplications]);
  const filteredInterviews = useMemo(() => interviews.filter((item) => filteredApplicationIds.has(item.application_id)), [interviews, filteredApplicationIds]);
  const stats = useMemo(() => getRecruitmentStats(filteredApplications, filteredInterviews), [filteredApplications, filteredInterviews]);
  const funnel = useMemo(() => getRecruitmentFunnel(filteredApplications), [filteredApplications]);
  const todos = useMemo(() => getTodoStats(filteredApplications, filteredInterviews), [filteredApplications, filteredInterviews]);
  const profile = useMemo(() => getCandidateProfileStats(filteredApplications, candidates), [filteredApplications, candidates]);
  const jobStats = useMemo(() => getJobStats(filteredApplications, jobs)
    .filter((item) => !filter.jobId || item.jobId === filter.jobId)
    .sort((a, b) => b[jobSort] - a[jobSort]), [filteredApplications, jobs, filter.jobId, jobSort]);

  if (!ready) return <div className="hr-page-loading">正在计算招聘数据…</div>;

  const metrics = [
    { label: '收到简历', value: stats.received, caption: '有效投递记录', tone: 'red' },
    { label: '通过简历', value: stats.resumePassed, caption: '已达到简历通过及之后', tone: 'blue' },
    { label: '面试人数', value: stats.interviewed, caption: '已进入面试流程', tone: 'violet' },
    { label: 'Offer 人数', value: stats.offers, caption: '已进入 Offer 阶段', tone: 'green' },
    { label: '待处理候选人', value: stats.pending, caption: '当前需 HR 跟进', tone: 'orange' },
  ];

  return <>
    <div className="hr-page-title">
      <div><p>RECRUITING WORKSPACE · V0.4.0</p><h1>招聘工作台</h1><span>指标、漏斗、岗位分析与候选人画像均由 Application Mock 数据实时聚合</span></div>
      <Link className="hr-primary-button" href="/hr/candidates">进入候选人管理 <span>→</span></Link>
    </div>

    <section className="dashboard-global-filter" aria-label="招聘工作台筛选">
      <div><strong>看板筛选</strong><span>所有模块同步刷新</span></div>
      <label><span>招聘类型</span><select value={filter.recruitmentType} onChange={(event) => setFilter((current) => ({ ...current, recruitmentType: event.target.value as RecruitmentDashboardFilter['recruitmentType'] }))}><option value="">全部</option>{Object.entries(recruitmentTypeLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
      <label><span>岗位</span><select value={filter.jobId} onChange={(event) => setFilter((current) => ({ ...current, jobId: event.target.value }))}><option value="">全部岗位</option>{jobs.map((job) => <option value={job.job_id} key={job.job_id}>{job.title}</option>)}</select></label>
      {(filter.recruitmentType || filter.jobId) && <button onClick={() => setFilter({ recruitmentType: '', jobId: '' })}>清除筛选</button>}
    </section>

    <div className="hr-metrics enhanced-metrics">{metrics.map((metric) => <article key={metric.label} className={`metric-${metric.tone}`}><span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.caption}</small></article>)}</div>

    <div className="workspace-primary-grid">
      <section className="hr-panel funnel-panel">
        <div className="hr-panel-title"><div><h2>招聘漏斗</h2><p>阶段人数与环节转化率</p></div><span>{stats.received} 条有效申请</span></div>
        <div className="recruitment-funnel">{funnel.map((item, index) => <div className="funnel-step" key={item.key}>
          {index > 0 && <div className="funnel-conversion"><span>↓</span><strong>{item.conversion}%</strong></div>}
          <div style={{ width: `${Math.max(48, 100 - index * 10)}%` }}><span>{item.label}</span><strong>{item.count}</strong></div>
        </div>)}</div>
      </section>

      <section className="hr-panel todo-panel">
        <div className="hr-panel-title"><div><h2>HR 待办事项</h2><p>点击后自动进入对应候选人筛选</p></div><b>{todos.reduce((sum, item) => sum + item.count, 0)}</b></div>
        <div className="todo-list">{todos.map((item) => {
          const params = new URLSearchParams({ stage: item.stage });
          if (filter.jobId) params.set('jobId', filter.jobId);
          return <Link href={`/hr/candidates?${params.toString()}`} key={item.key}><span>{item.label}<small>查看候选人</small></span><strong>{item.count}</strong><i>→</i></Link>;
        })}</div>
      </section>
    </div>

    <section className="hr-panel job-analysis-panel">
      <div className="hr-panel-title"><div><h2>岗位招聘分析</h2><p>基于 Job ID 聚合，不依赖自由文本岗位名</p></div><label className="analysis-sort"><span>排序</span><select value={jobSort} onChange={(event) => setJobSort(event.target.value as JobSort)}><option value="received">简历数</option><option value="resumePassRate">通过率</option><option value="offers">Offer 数</option></select></label></div>
      <div className="analysis-table-wrap"><table className="analysis-table"><thead><tr><th>岗位</th><th>收到简历</th><th>通过简历</th><th>简历通过率</th><th>面试</th><th>Offer</th></tr></thead><tbody>{jobStats.map((item) => <tr key={item.jobId}><td><strong>{item.jobTitle}</strong><small>{item.jobId}</small></td><td>{item.received}</td><td>{item.resumePassed}</td><td><span className="rate-cell"><i style={{ width: `${item.resumePassRate}%` }} /></span><b>{item.resumePassRate}%</b></td><td>{item.interviews}</td><td>{item.offers}</td></tr>)}</tbody></table></div>
    </section>

    <section className="candidate-bg-section">
      <div className="section-heading-inline"><div><p>CANDIDATE BG ANALYSIS</p><h2>通过简历候选人画像</h2></div><span>分析对象：{profile.total} 位已通过简历筛选的候选人</span></div>
      <div className="bg-analysis-grid">
        <DistributionCard title="学历分布" items={profile.education} />
        <DistributionCard title="学校层级" items={profile.schoolLevel} />
        <DistributionCard title="专业背景" items={profile.major} />
        <DistributionCard title="毕业年份" items={profile.graduationYear} />
        <DistributionCard title="候选人来源" items={profile.source} />
      </div>
    </section>
  </>;
}
