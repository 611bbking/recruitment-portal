import type { Metadata } from 'next';
import AuthPanel from '../components/AuthPanel';

export const metadata: Metadata = { title: '候选人登录 | 远大物产 CAREERS', description: '登录或注册候选人账号。', robots: { index: false, follow: false } };

export default async function AuthPage({ searchParams }: { searchParams: Promise<{ mode?: string; returnTo?: string }> }) {
  const query = await searchParams; const mode = query.mode === 'register' || query.mode === 'forgot' ? query.mode : 'login';
  return <main className="auth-page"><section><div className="auth-brand-copy"><p>GRAND RESOURCES · CAREERS</p><h2>让每一次申请，<br />都有清晰的起点</h2><span>登录后可继续投递、确认个人资料并查看申请记录。</span></div></section><section><AuthPanel initialMode={mode} returnTo={query.returnTo ?? '/candidate/applications'} /></section></main>;
}
