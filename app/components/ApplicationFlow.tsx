'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createMockApplication, getMockCandidate, hasDuplicateApplication, isMockAuthenticated, saveMockResume, updateMockCandidate } from '../lib/mock-store';
import { parseResume } from '../lib/resume-parser';
import type { Application, Job, ParsedResumeData, RecruitmentProject } from '../types/recruitment';

type FlowStep = 'upload' | 'parsing' | 'confirm' | 'position' | 'success';

export default function ApplicationFlow({ job, project }: { job: Job; project?: RecruitmentProject }) {
  const router = useRouter(); const [ready, setReady] = useState(false); const [step, setStep] = useState<FlowStep>('upload'); const [file, setFile] = useState<File | null>(null); const [parsed, setParsed] = useState<ParsedResumeData | null>(null); const [confirmed, setConfirmed] = useState(false); const [error, setError] = useState(''); const [application, setApplication] = useState<Application | null>(null);
  const applyPath = `/apply/${job.job_id}${project ? `?project=${project.project_id}` : ''}`;
  useEffect(() => { const timer = window.setTimeout(() => { if (!isMockAuthenticated()) { router.replace(`/auth?returnTo=${encodeURIComponent(applyPath)}`); return; } setReady(true); }, 0); return () => window.clearTimeout(timer); }, [applyPath, router]);
  if (!ready) return <div className="application-loading">正在检查候选人 Mock 登录状态…</div>;

  async function startParsing() {
    if (!file) { setError('请先选择简历文件'); return; }
    setError(''); setStep('parsing');
    try { const result = await parseResume(file); setParsed(result); setStep('confirm'); } catch (reason) { setError(reason instanceof Error ? reason.message : '简历解析失败'); setStep('upload'); }
  }

  function confirmInformation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); const data: ParsedResumeData = { name: String(form.get('name')), phone: String(form.get('phone')), email: String(form.get('email')), gender: String(form.get('gender')), birth_date: String(form.get('birth_date')), school: String(form.get('school')), degree: String(form.get('degree')), major: String(form.get('major')), graduation_date: String(form.get('graduation_date')), preferred_city: String(form.get('preferred_city')) };
    setParsed(data); updateMockCandidate(data); setStep('position'); window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function submitApplication() {
    const candidate = getMockCandidate(); if (!candidate || !file || !parsed) { setError('申请信息不完整，请返回检查'); return; }
    if (!confirmed) { setError('请确认应聘职位'); return; }
    if (hasDuplicateApplication(candidate.candidate_id, job.job_id, project?.project_id ?? null)) { setError('你已经申请过该职位'); return; }
    saveMockResume(candidate.candidate_id, file, parsed);
    const created = createMockApplication(candidate.candidate_id, job.job_id, project?.project_id ?? null); setApplication(created); setStep('success'); window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const stepIndex = step === 'upload' || step === 'parsing' ? 1 : step === 'confirm' ? 2 : step === 'position' ? 3 : 4;
  return <div className="application-shell"><div className="application-heading"><Link href={`/jobs/${job.job_id}${project ? `?project=${project.project_id}` : ''}`}>← 返回职位详情</Link><p>APPLICATION</p><h1>{step === 'success' ? '投递成功' : `申请 ${job.title}`}</h1>{project && <span>通过项目：{project.project_name}</span>}</div>
    <ol className="application-steps"><li className={stepIndex >= 1 ? 'active' : ''}><span>1</span>上传简历</li><li className={stepIndex >= 2 ? 'active' : ''}><span>2</span>确认信息</li><li className={stepIndex >= 3 ? 'active' : ''}><span>3</span>确认职位</li><li className={stepIndex >= 4 ? 'active' : ''}><span>4</span>完成</li></ol>
    {step === 'upload' && <section className="application-panel"><div className="panel-title"><span>01</span><div><h2>上传你的简历</h2><p>支持 PDF、DOC、DOCX。文件仅用于当前 Mock 流程，不会上传服务器。</p></div></div><label className={`resume-dropzone${file ? ' has-file' : ''}`}><input type="file" accept=".pdf,.doc,.docx" onChange={(event) => { setFile(event.target.files?.[0] ?? null); setError(''); }} /><span>{file ? '✓' : '↑'}</span><strong>{file ? file.name : '选择简历文件'}</strong><small>{file ? '点击可重新选择' : 'PDF / DOC / DOCX'}</small></label>{error && <p className="flow-error">{error}</p>}<div className="panel-actions"><Link className="button button-outline" href={`/jobs/${job.job_id}`}>取消</Link><button className="button button-primary" onClick={startParsing}>上传并开始解析 <span>→</span></button></div></section>}
    {step === 'parsing' && <section className="application-panel parsing-panel"><div className="parser-indicator"><span></span><strong>正在解析简历</strong><p>正在模拟调用 POST /api/resumes/parse</p></div><div className="parser-stages"><span className="done">上传完成</span><span className="active">识别基本信息</span><span>生成解析结果</span></div></section>}
    {step === 'confirm' && parsed && <form className="application-panel parsed-form" onSubmit={confirmInformation}><div className="panel-title"><span>02</span><div><h2>确认解析结果</h2><p>我们已根据你的简历识别以下信息，请确认内容是否准确。</p></div></div><fieldset><legend>基本信息</legend><label><span>姓名</span><input name="name" defaultValue={parsed.name} required /></label><label><span>手机号</span><input name="phone" defaultValue={parsed.phone} required /></label><label><span>邮箱</span><input name="email" type="email" defaultValue={parsed.email} required /></label><label><span>性别</span><select name="gender" defaultValue={parsed.gender}><option value="">请选择</option><option>男</option><option>女</option><option>其他 / 不便透露</option></select></label><label><span>出生年月</span><input name="birth_date" type="month" defaultValue={parsed.birth_date} /></label></fieldset><fieldset><legend>教育信息</legend><label><span>学校</span><input name="school" defaultValue={parsed.school} /></label><label><span>学历</span><select name="degree" defaultValue={parsed.degree}><option>本科</option><option>硕士</option><option>博士</option><option>其他</option></select></label><label><span>专业</span><input name="major" defaultValue={parsed.major} /></label><label><span>毕业时间</span><input name="graduation_date" type="month" defaultValue={parsed.graduation_date} /></label></fieldset><fieldset><legend>求职意向</legend><label><span>意向城市</span><select name="preferred_city" defaultValue={parsed.preferred_city}><option value="">请选择</option><option>宁波</option><option>上海</option><option>杭州</option><option>其他</option></select></label></fieldset><div className="panel-actions"><button type="button" className="button button-outline" onClick={() => setStep('upload')}>重新上传</button><button className="button button-primary" type="submit">确认信息 <span>→</span></button></div></form>}
    {step === 'position' && parsed && <section className="application-panel position-confirm"><div className="panel-title"><span>03</span><div><h2>确认应聘职位</h2><p>应聘职位由你明确选择，不由简历解析结果决定。</p></div></div><div className="position-card"><div><span>{job.recruitment_type} · {job.job_category}</span><h3>{job.title}</h3><p>{job.location} · {job.business_unit}</p>{project && <small>投递来源项目：{project.project_name}</small>}</div><span className="position-check">{confirmed ? '✓' : ''}</span></div><label className="confirm-checkbox"><input type="checkbox" checked={confirmed} onChange={(event) => { setConfirmed(event.target.checked); setError(''); }} /><span>我确认正在申请“{job.title}”职位{project ? `，投递来源为“${project.project_name}”` : ''}。</span></label>{error && <p className="flow-error">{error}</p>}<div className="application-summary"><div><small>候选人</small><strong>{parsed.name}</strong></div><div><small>联系方式</small><strong>{parsed.phone}</strong></div><div><small>简历文件</small><strong>{file?.name}</strong></div></div><div className="panel-actions"><button className="button button-outline" onClick={() => setStep('confirm')}>返回修改</button><button className="button button-primary" onClick={submitApplication}>提交申请 <span>→</span></button></div></section>}
    {step === 'success' && parsed && application && <section className="application-panel success-panel"><div className="success-mark">✓</div><h2>投递成功</h2><p>我们已收到你的申请，后续进展将在候选人中心展示。</p><dl><div><dt>候选人</dt><dd>{parsed.name}</dd></div><div><dt>应聘职位</dt><dd>{job.title}</dd></div>{project && <div><dt>招聘项目</dt><dd>{project.project_name}</dd></div>}<div><dt>投递时间</dt><dd>{new Date(application.applied_at).toLocaleString('zh-CN')}</dd></div></dl><div className="success-actions"><Link className="button button-primary" href="/candidate/applications">查看我的投递</Link><Link className="button button-outline" href="/jobs">继续浏览职位</Link></div></section>}
  </div>;
}
