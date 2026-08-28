import JobExplorer from './components/JobExplorer';
import Link from 'next/link';
import {
  companyProfile,
  featuredJobs,
  featuredProjects,
  heroContent,
  recruitmentChannels,
  recruitmentProcess,
} from './data/mock-data';

export default function Home() {
  return (
      <main id="top">
        <section className="hero">
          <div className="hero-rail" aria-hidden="true"><span>ENERGY</span><span>METALS</span><span>AGRICULTURE</span><span>GLOBAL TRADE</span></div>
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">{heroContent.eyebrow}</p>
              <h1>{heroContent.title}<span>{heroContent.highlight}</span></h1>
              <p className="hero-description">{heroContent.description}</p>
              <div className="hero-actions">
                <Link className="button button-primary" href="/jobs">查看职位 <span aria-hidden="true">→</span></Link>
                <Link className="button button-outline" href="/projects">探索招聘项目 <span aria-hidden="true">↗</span></Link>
              </div>
              <div className="hero-channels">{heroContent.channels.map((channel) => <span key={channel}>{channel}</span>)}</div>
            </div>
            <div className="hero-industry" aria-hidden="true">
              <div className="market-code">GR / 01</div>
              <div className="industry-orbit orbit-one"></div><div className="industry-orbit orbit-two"></div>
              <div className="industry-core"><span>COMMODITIES</span><strong>产业<br />现场</strong><small>REAL WORLD</small></div>
              <div className="industry-tag tag-energy"><span>01</span>能源化工</div>
              <div className="industry-tag tag-metals"><span>02</span>金属</div>
              <div className="industry-tag tag-agri"><span>03</span>农产品</div>
              <div className="market-ticker"><span>MARKET</span><strong>观察 · 研究 · 交易 · 服务</strong></div>
            </div>
          </div>
        </section>

        <section className="section channels-section" id="channels">
          <div className="container">
            <div className="section-heading compact-heading"><div><p className="section-index">01 / RECRUITMENT</p><h2>选择你的招聘通道</h2></div><p>校招为主、社招为辅，特色人才项目独立呈现。</p></div>
            <div className="channel-grid">
              {recruitmentChannels.map((channel) => (
                <a className={`channel-card channel-${channel.tone}`} href={channel.href} key={channel.id}>
                  <div className="channel-top"><span>{channel.number}</span><span>{channel.label}</span></div>
                  <div><h3>{channel.title}</h3><p>{channel.description}</p></div>
                  <span className="channel-action">{channel.actionLabel} <b aria-hidden="true">→</b></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section jobs-section" id="jobs">
          <div className="container">
            <div className="section-heading"><div><p className="section-index">02 / OPEN POSITIONS</p><h2>正在招聘<br /><span>找到适合你的机会</span></h2></div><p>首页展示部分重点开放职位，职位信息由招聘数据统一维护。</p></div>
            <JobExplorer jobs={featuredJobs} />
            <div className="section-end"><a className="text-link" href="#jobs">进入职位中心 <span aria-hidden="true">→</span></a></div>
          </div>
        </section>

        <section className="section projects-section" id="projects">
          <div className="container">
            <div className="section-heading projects-heading"><div><p className="section-index">03 / SIGNATURE PROGRAMS</p><h2>重点招聘项目</h2></div><p>把长期项目做成品牌入口，让人才更早理解产业、认识远大。</p></div>
            <div className="project-grid">
              {featuredProjects.map((project, index) => (
                <article className={`project-card project-${index + 1}`} key={project.project_id}>
                  <div className="project-topline"><span>{project.project_type}</span><span className="project-status">{project.status_label}</span></div>
                  <div className="project-body">
                    <p className="project-audience">{project.target_group}</p><h3>{project.project_name}</h3><p className="project-summary">{project.description}</p>
                    <dl><div><dt>项目时间</dt><dd>{project.expected_time}</dd></div><div><dt>项目价值</dt><dd>{project.brand_role}</dd></div>{project.partner_organizations.length > 0 && <div><dt>合作机制</dt><dd>{project.partner_organizations.join('、')}</dd></div>}</dl>
                    <a href={project.detail_href} aria-label={`了解${project.project_name}`}>了解项目 <span aria-hidden="true">↗</span></a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section about-section" id="about">
          <div className="container about-shell">
            <div className="about-copy"><p className="section-index">04 / {companyProfile.eyebrow}</p><h2>{companyProfile.title}</h2><p>{companyProfile.description}</p><a className="text-link" href="#about">了解远大 <span aria-hidden="true">↗</span></a></div>
            <div className="company-facts">{companyProfile.facts.map((fact, index) => <div key={fact.label}><span>0{index + 1}</span><small>{fact.label}</small><strong>{fact.value}</strong></div>)}</div>
          </div>
        </section>

        <section className="section process-section" id="process">
          <div className="container process-grid">
            <div><p className="section-index">05 / PROCESS</p><h2>从机会到同行</h2><p className="process-intro">流程可能因职位或项目有所不同，我们会在关键节点与你保持沟通。</p></div>
            <ol className="process-list">{recruitmentProcess.map((step) => <li key={step.id}><span>{step.number}</span><strong>{step.title}</strong><p>{step.description}</p></li>)}</ol>
          </div>
        </section>

        <section className="cta-section"><div className="container cta-content"><p>MAKE YOUR MOVE</p><h2>下一份机会，<br />从真实世界开始</h2><Link className="button button-light" href="/jobs">查看全部职位 <span aria-hidden="true">→</span></Link></div></section>
      </main>
  );
}
