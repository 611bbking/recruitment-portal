'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  applicationStageLabels,
  batchStageOptions,
  bulkRejectApplications,
  bulkUpdateApplicationStage,
  getHrApplications,
  getHrCandidates,
  getManagedJobs,
  getManagedProjects,
  rejectionReasons,
  softDeleteApplications,
} from '../lib/hr-store';
import type { Application, ApplicationStage, Candidate, Job, RecruitmentProject } from '../types/recruitment';

type BatchDialog = 'advance' | 'reject' | 'delete' | null;

export default function HrCandidates() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [projects, setProjects] = useState<RecruitmentProject[]>([]);
  const [keyword, setKeyword] = useState('');
  const [jobId, setJobId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [stage, setStage] = useState('');
  const [owner, setOwner] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dialog, setDialog] = useState<BatchDialog>(null);
  const [targetStage, setTargetStage] = useState<ApplicationStage>('screening');
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionNote, setRejectionNote] = useState('');
  const [feedback, setFeedback] = useState('');

  const load = useCallback(() => {
    setApplications(getHrApplications());
    setCandidates(getHrCandidates());
    setJobs(getManagedJobs());
    setProjects(getManagedProjects());
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      setStage(params.get('stage') ?? '');
      setJobId(params.get('jobId') ?? '');
      load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const rows = useMemo(() => applications
    .filter((application) => !application.is_deleted)
    .map((application) => ({
      application,
      candidate: candidates.find((item) => item.candidate_id === application.candidate_id),
      job: jobs.find((item) => item.job_id === application.job_id),
      project: projects.find((item) => item.project_id === application.project_id),
    }))
    .filter((row) => {
      const text = `${row.candidate?.name}${row.candidate?.phone}${row.candidate?.email}${row.candidate?.school}`.toLowerCase();
      return (!keyword || text.includes(keyword.toLowerCase()))
        && (!jobId || row.application.job_id === jobId)
        && (!projectId || row.application.project_id === projectId)
        && (!stage || row.application.status === stage)
        && (!owner || row.application.owner_name === owner);
    }), [applications, candidates, jobs, projects, keyword, jobId, projectId, stage, owner]);

  const owners = [...new Set(applications.map((item) => item.owner_name))];
  const allVisibleSelected = rows.length > 0 && rows.every((row) => selected.has(row.application.application_id));
  const selectedIds = [...selected];

  function toggleOne(applicationId: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(applicationId)) next.delete(applicationId);
      else next.add(applicationId);
      return next;
    });
  }

  function toggleAllVisible() {
    setSelected((current) => {
      const next = new Set(current);
      rows.forEach((row) => {
        if (allVisibleSelected) next.delete(row.application.application_id);
        else next.add(row.application.application_id);
      });
      return next;
    });
  }

  function completeBatch(message: string) {
    setDialog(null);
    setSelected(new Set());
    setRejectionReason('');
    setRejectionNote('');
    setFeedback(message);
    load();
    window.setTimeout(() => setFeedback(''), 2600);
  }

  function confirmAdvance() {
    const count = bulkUpdateApplicationStage(selectedIds, targetStage);
    completeBatch(`已将 ${count} 条申请推进至「${applicationStageLabels[targetStage]}」`);
  }

  function confirmReject() {
    if (!rejectionReason) return;
    const count = bulkRejectApplications(selectedIds, rejectionReason, rejectionNote.trim());
    completeBatch(`已淘汰 ${count} 名候选人`);
  }

  function confirmDelete() {
    const count = softDeleteApplications(selectedIds);
    completeBatch(`已将 ${count} 条申请移出正常候选人列表`);
  }

  return <>
    <div className="hr-page-title">
      <div><p>APPLICATION PIPELINE</p><h1>候选人</h1><span>列表以 Application 为业务行，同一候选人的不同职位申请独立展示</span></div>
      <strong className="hr-record-count">{rows.length} 条申请</strong>
    </div>

    <div className="hr-filter-bar">
      <label className="hr-search"><span>⌕</span><input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索姓名、手机号、邮箱、学校" /></label>
      <label><span>职位</span><select value={jobId} onChange={(event) => setJobId(event.target.value)}><option value="">全部</option>{jobs.map((item) => <option value={item.job_id} key={item.job_id}>{item.title}</option>)}</select></label>
      <label><span>招聘项目</span><select value={projectId} onChange={(event) => setProjectId(event.target.value)}><option value="">全部</option>{projects.map((item) => <option value={item.project_id} key={item.project_id}>{item.project_name}</option>)}</select></label>
      <label><span>招聘阶段</span><select value={stage} onChange={(event) => setStage(event.target.value)}><option value="">全部</option>{Object.entries(applicationStageLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
      <label><span>负责人</span><select value={owner} onChange={(event) => setOwner(event.target.value)}><option value="">全部</option>{owners.map((item) => <option key={item}>{item}</option>)}</select></label>
    </div>

    <div className={`hr-batch-bar ${selected.size ? 'visible' : ''}`} aria-live="polite">
      <strong>已选择 {selected.size} 人</strong>
      <div>
        <button className="hr-secondary-button" disabled={!selected.size} onClick={() => setDialog('advance')}>推进阶段</button>
        <button className="hr-secondary-button danger-outline" disabled={!selected.size} onClick={() => setDialog('reject')}>批量淘汰</button>
        <button className="hr-secondary-button" disabled={!selected.size} onClick={() => setDialog('delete')}>删除</button>
        <button className="hr-clear-selection" disabled={!selected.size} onClick={() => setSelected(new Set())}>取消全选</button>
      </div>
    </div>

    <div className="hr-table-wrap">
      <table className="hr-table candidate-table">
        <thead><tr><th className="selection-cell"><input type="checkbox" aria-label="全选当前列表" checked={allVisibleSelected} onChange={toggleAllVisible} /></th><th>候选人</th><th>教育背景</th><th>应聘职位</th><th>招聘项目</th><th>当前阶段</th><th>投递 / 更新</th><th>负责人</th><th></th></tr></thead>
        <tbody>{rows.map(({ application, candidate, job, project }) => <tr key={application.application_id} className={selected.has(application.application_id) ? 'selected-row' : ''}>
          <td className="selection-cell"><input type="checkbox" aria-label={`选择 ${candidate?.name ?? '候选人'} 的申请`} checked={selected.has(application.application_id)} onChange={() => toggleOne(application.application_id)} /></td>
          <td><strong>{candidate?.name}</strong><small>{candidate?.phone}</small></td>
          <td><span>{candidate?.school}</span><small>{candidate?.highest_degree} · {candidate?.major}</small></td>
          <td><strong>{job?.title}</strong><small>{job?.job_category}</small></td>
          <td>{project?.project_name ?? (application.recruitment_type === 'social' ? '社会招聘' : '普通校园招聘')}</td>
          <td><span className={`hr-stage stage-${application.status}`}>{applicationStageLabels[application.status]}</span></td>
          <td><span>{new Date(application.applied_at).toLocaleDateString('zh-CN')}</span><small>{new Date(application.updated_at).toLocaleString('zh-CN')}</small></td>
          <td>{application.owner_name}</td>
          <td><Link href={`/hr/candidates/${application.application_id}`}>查看 ↗</Link></td>
        </tr>)}</tbody>
      </table>
      {!rows.length && <div className="hr-empty">暂无匹配的 Application</div>}
    </div>

    {feedback && <div className="hr-toast" role="status">✓ {feedback}</div>}

    {dialog && <div className="hr-modal-backdrop" onMouseDown={() => setDialog(null)}>
      <section className="hr-modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <button className="drawer-close" aria-label="关闭" onClick={() => setDialog(null)}>×</button>
        {dialog === 'advance' && <>
          <div className="drawer-title"><p>BATCH ACTION</p><h2>批量推进招聘阶段</h2><span>已选择 {selected.size} 名候选人</span></div>
          <label className="hr-modal-field"><span>推进至</span><select value={targetStage} onChange={(event) => setTargetStage(event.target.value as ApplicationStage)}>{batchStageOptions.filter((item) => item !== 'rejected').map((item) => <option value={item} key={item}>{applicationStageLabels[item]}</option>)}</select></label>
          <div className="hr-modal-actions"><button className="hr-secondary-button" onClick={() => setDialog(null)}>取消</button><button className="hr-primary-button" onClick={confirmAdvance}>确认推进</button></div>
        </>}
        {dialog === 'reject' && <>
          <div className="drawer-title"><p>BATCH REJECTION</p><h2>淘汰候选人</h2><span>已选择 {selected.size} 人，操作将记录原因、备注、时间和 Mock HR。</span></div>
          <div className="rejection-options">{rejectionReasons.map((item) => <label key={item}><input type="radio" name="rejection-reason" checked={rejectionReason === item} onChange={() => setRejectionReason(item)} /><span>{item}</span></label>)}</div>
          <label className="hr-modal-field"><span>备注（可选）</span><textarea value={rejectionNote} onChange={(event) => setRejectionNote(event.target.value)} placeholder="补充淘汰说明" /></label>
          <div className="hr-modal-actions"><button className="hr-secondary-button" onClick={() => setDialog(null)}>取消</button><button className="hr-danger-button" disabled={!rejectionReason} onClick={confirmReject}>确认淘汰</button></div>
        </>}
        {dialog === 'delete' && <>
          <div className="drawer-title"><p>SOFT DELETE</p><h2>确定删除已选择的 {selected.size} 名候选人吗？</h2><span>删除后候选人将不再出现在正常候选人列表中。Mock 数据不会被永久删除。</span></div>
          <div className="hr-modal-actions"><button className="hr-secondary-button" onClick={() => setDialog(null)}>取消</button><button className="hr-danger-button" onClick={confirmDelete}>确认删除</button></div>
        </>}
      </section>
    </div>}
  </>;
}
