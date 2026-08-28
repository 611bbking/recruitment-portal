import Image from 'next/image';
import Link from 'next/link';
import HrEntry from './HrEntry';

export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <Link className={`brand${footer ? ' footer-brand' : ''}`} href="/" aria-label="远大物产招聘首页">
      <Image src="/grand-resources-logo.png" width={2380} height={668} alt="远大物产 GRAND RESOURCES" priority={!footer} />
      <span>CAREERS</span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Brand />
        <nav className="desktop-nav" aria-label="主导航">
          <Link href="/">首页</Link><Link href="/jobs">职位机会</Link><Link href="/jobs?type=校园招聘">校园招聘</Link><Link href="/projects">招聘项目</Link><Link href="/jobs?type=社会招聘">社会招聘</Link>
        </nav>
        <HrEntry /><Link className="candidate-entry" href="/candidate/applications">候选人中心</Link>
        <Link className="button button-small button-primary desktop-action" href="/jobs">查看职位 <span aria-hidden="true">→</span></Link>
        <details className="mobile-menu">
          <summary aria-label="打开导航"><span></span><span></span></summary>
          <nav aria-label="移动端导航"><Link href="/">首页</Link><Link className="mobile-job-link" href="/jobs">职位机会</Link><Link href="/projects">招聘项目</Link><Link href="/candidate/applications">候选人中心</Link></nav>
        </details>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-main"><Brand footer /><div className="footer-links"><div><strong>招聘机会</strong><Link href="/jobs">职位机会</Link><Link href="/jobs?type=校园招聘">校园招聘</Link><Link href="/jobs?type=社会招聘">社会招聘</Link><Link href="/projects">招聘项目</Link></div><div><strong>候选人服务</strong><Link href="/candidate/applications">我的投递</Link><Link href="/candidate/profile">个人资料</Link><Link href="/auth">登录 / 注册</Link></div></div></div>
      <div className="container footer-bottom"><span>© 远大物产集团有限公司</span><span>GRAND RESOURCES · CAREERS</span></div>
    </footer>
  );
}
