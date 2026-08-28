'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockHrLogin } from '../lib/hr-store';

export default function HrLogin({ returnTo }: { returnTo: string }) {
  const router = useRouter(); const [hrId, setHrId] = useState('hr-zhang'); const [code, setCode] = useState('123456'); const [error, setError] = useState(''); const safeReturnTo = returnTo.startsWith('/hr') && !returnTo.startsWith('//') ? returnTo : '/hr';
  function submit(event: FormEvent) { event.preventDefault(); if (code !== '123456') { setError('Mock 验证码为 123456'); return; } mockHrLogin(hrId); router.push(safeReturnTo); router.refresh(); }
  return <form className="hr-login-card" onSubmit={submit}><div><p>GRAND RESOURCES · INTERNAL</p><h1>HR 招聘管理后台</h1><span>当前为内部流程 Mock 原型，不接入正式员工账号或权限系统。</span></div><label><span>Mock HR 用户</span><select value={hrId} onChange={(event) => setHrId(event.target.value)}><option value="hr-zhang">HR 张老师</option><option value="hr-li">HR 李老师</option></select></label><label><span>验证码</span><div><input value={code} onChange={(event) => setCode(event.target.value)} /><button type="button" onClick={() => setError('Mock 验证码：123456')}>获取验证码</button></div></label>{error && <p className="hr-login-notice">{error}</p>}<button className="hr-primary-button" type="submit">进入招聘后台 <span>→</span></button><small>候选人账号与 HR 账号为两个独立 Mock 角色。</small></form>;
}
