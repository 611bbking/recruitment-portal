'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockLogin, mockRegister } from '../lib/mock-store';

type AuthMode = 'login' | 'register' | 'forgot';

export default function AuthPanel({ initialMode, returnTo }: { initialMode: AuthMode; returnTo: string }) {
  const router = useRouter(); const [mode, setMode] = useState<AuthMode>(initialMode); const [identifier, setIdentifier] = useState('13800000000'); const [code, setCode] = useState('123456'); const [name, setName] = useState('王晨'); const [email, setEmail] = useState('wangchen@example.com'); const [notice, setNotice] = useState('');
  const safeReturnTo = returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/candidate/applications';

  function submit(event: FormEvent) {
    event.preventDefault(); setNotice('');
    if (code !== '123456') { setNotice('Mock 验证码为 123456'); return; }
    if (mode === 'forgot') { setNotice('账号验证成功。正式环境将在这里进入安全的身份恢复流程。'); return; }
    if (mode === 'register') mockRegister(name, identifier, email); else mockLogin(identifier);
    router.push(safeReturnTo); router.refresh();
  }

  return <div className="auth-card"><div className="auth-tabs"><button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>登录</button><button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>注册</button></div>
    <div className="auth-intro"><p>{mode === 'forgot' ? '找回账号' : mode === 'register' ? '创建候选人账号' : '欢迎回来'}</p><h1>{mode === 'forgot' ? '验证你的身份' : '进入候选人中心'}</h1><span>当前为前端 Mock，不保存密码，也不发送真实验证码。</span></div>
    <form onSubmit={submit}>
      {mode === 'register' && <label><span>姓名</span><input value={name} onChange={(event) => setName(event.target.value)} required /></label>}
      <label><span>{mode === 'register' ? '手机号' : '手机号或邮箱'}</span><input value={identifier} onChange={(event) => setIdentifier(event.target.value)} required /></label>
      {mode === 'register' && <label><span>邮箱</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>}
      <label><span>验证码</span><div className="code-field"><input value={code} onChange={(event) => setCode(event.target.value)} inputMode="numeric" required /><button type="button" onClick={() => setNotice('Mock 验证码：123456')}>获取验证码</button></div></label>
      {notice && <p className="form-notice">{notice}</p>}
      <button className="button button-primary auth-submit" type="submit">{mode === 'forgot' ? '验证身份' : mode === 'register' ? '注册并继续' : '登录并继续'} <span>→</span></button>
    </form>
    <div className="auth-footer">{mode === 'login' ? <button onClick={() => setMode('forgot')}>忘记密码？</button> : <button onClick={() => setMode('login')}>返回登录</button>}<Link href="/jobs">暂不登录，浏览职位</Link></div>
  </div>;
}
