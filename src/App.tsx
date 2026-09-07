import { CSSProperties, FormEvent, ReactNode, useEffect, useRef, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { banks, copy, insights, Lang, worlds } from './site-content'

const partnerTechnology = [
  { name: 'INFO-Z', logo: '/partners/infoz.png' },
  { name: 'TMI', logo: '/partners/image4.png' },
  { name: 'Oradist', logo: '/partners/oradist.svg' },
  { name: 'TUNISYS', logo: '/partners/tunisys.png' },
  { name: 'GAC', logo: '/partners/gac.jpg' },
]

function assetPath(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

function Arrow() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
}

function DiagramIcon({ type = 0 }: { type?: number }) {
  const icons = [
    <><circle cx="12" cy="12" r="3" /><path d="M12 3v6m0 6v6M3 12h6m6 0h6" /></>,
    <><path d="m5 12 4 4L19 6" /><path d="M4 4h16v16H4z" /></>,
    <><path d="M4 17 9 12l3 3 8-9" /><path d="M15 6h5v5" /></>,
    <><circle cx="8" cy="12" r="4" /><circle cx="17" cy="7" r="3" /><circle cx="17" cy="17" r="3" /><path d="m11 10 3-2m-3 6 3 2" /></>,
    <><path d="M4 12h4l2-5 4 10 2-5h4" /><circle cx="12" cy="12" r="9" /></>,
    <><path d="M5 7h14M5 12h9M5 17h14" /><circle cx="17" cy="12" r="2" /></>,
  ]
  return <svg className="diagram-icon" viewBox="0 0 24 24" aria-hidden="true">{icons[type % icons.length]}</svg>
}

function ChevronDown() {
  return <svg className="chevron-down" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
}

function Logo({ footer = false }: { footer?: boolean }) {
  return <img className={`brand-logo${footer ? ' brand-logo-footer' : ''}`} src={assetPath('/logo.png')} alt="SMI" />
}

function langFrom(value?: string): Lang { return value === 'en' ? 'en' : 'fr' }
function useLang() { const { lang } = useParams(); return langFrom(lang) }

function track(event: string, details: Record<string, string> = {}) {
  const analyticsWindow = window as Window & { dataLayer?: Array<Record<string, string>> }
  analyticsWindow.dataLayer?.push({ event, ...details })
}

function LocalLink({ to, className, children, onClick, ariaLabel }: { to: string; className?: string; children: ReactNode; onClick?: () => void; ariaLabel?: string }) {
  const lang = useLang()
  return <Link to={`/${lang}/${to}`.replace(/\/$/, '')} className={className} onClick={onClick} aria-label={ariaLabel}>{children}</Link>
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function ScrollReveal() {
  const { pathname } = useLocation()

  useEffect(() => {
    const selector = [
      '.hero-copy > *',
      '.message-visual',
      '.trust-strip',
      '.section-heading',
      '.strip-label',
      '.logo-rail',
      '.world-card',
      '.product-card',
      '.iso-grid > *',
      '.reason-grid article',
      '.value-node',
      '.people-grid > *',
      '.commitment-row > div',
      '.commitment-node',
      '.insight-card',
      '.final-cta > *',
      '.page-hero-inner > *',
      '.capability-grid article',
      '.capability-map article',
      '.process-flow > div',
      '.process-node',
      '.canonical > *',
      '.routing-note > *',
      '.integration-map > *',
      '.info-card',
      '.expertise-list article',
      '.story-grid article',
      '.transformation-story',
      '.contact-grid > *',
    ].join(',')
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    elements.forEach((element, index) => {
      element.classList.add('scroll-reveal')
      element.style.setProperty('--reveal-delay', `${(index % 4) * 65}ms`)
    })

    if (reducedMotion) {
      elements.forEach(element => element.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -7% 0px' })

    elements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [pathname])

  return null
}

function Seo({ title, description }: { title: string; description: string }) {
  const lang = useLang()
  const location = useLocation()
  useEffect(() => {
    document.title = title
    document.documentElement.lang = lang
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (meta) meta.content = description
    document.querySelectorAll('link[data-smi-locale]').forEach(link => link.remove())
    ;(['fr', 'en'] as const).forEach(locale => {
      const link = document.createElement('link')
      link.rel = 'alternate'
      link.hreflang = locale
      link.href = `https://www.societelemondeinformatique.com${location.pathname.replace(/^\/(fr|en)/, `/${locale}`)}`
      link.dataset.smiLocale = locale
      document.head.appendChild(link)
    })
    track('page_view', { path: location.pathname, locale: lang })
  }, [description, lang, location.pathname, title])
  return null
}

function Header() {
  const lang = useLang()
  const t = copy[lang]
  const location = useLocation()
  const [mobile, setMobile] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)
  const [mobileSolutions, setMobileSolutions] = useState(false)
  const solutionsRef = useRef<HTMLDivElement>(null)
  const otherLang = lang === 'fr' ? 'en' : 'fr'
  const switched = location.pathname.replace(/^\/(fr|en)/, `/${otherLang}`)
  const close = () => {
    setMobile(false)
    setSolutionsOpen(false)
    setMobileSolutions(false)
  }
  const nav = [['expertise', t.nav.expertise], ['why-smi', t.nav.why], ['customer-success', t.nav.success], ['insights', t.nav.insights], ['careers', t.nav.careers]]

  useEffect(() => {
    setMobile(false)
    setSolutionsOpen(false)
    setMobileSolutions(false)
  }, [location.pathname])

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!solutionsRef.current?.contains(event.target as Node)) setSolutionsOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSolutionsOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <header className="site-header">
      <div className="header-inner">
        <LocalLink to="" className="brand" onClick={close} ariaLabel={lang === 'fr' ? 'SMI — Retour à l’accueil' : 'SMI — Back to home'}><Logo /></LocalLink>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <div className={`nav-solutions${solutionsOpen ? ' is-open' : ''}`} ref={solutionsRef}>
            <button className="nav-link nav-trigger" type="button" aria-expanded={solutionsOpen} aria-controls="desktop-solutions-menu" onClick={() => setSolutionsOpen(open => !open)}><span>{t.nav.solutions}</span><ChevronDown /></button>
            <div className="solutions-menu" id="desktop-solutions-menu" aria-hidden={!solutionsOpen}>
              <LocalLink to="solutions/ibansys" onClick={close}><strong>IBANSYS</strong><span>Trade & International Banking Platform</span></LocalLink>
              <LocalLink to="solutions/swift-plus" onClick={close}><strong>SWIFT+ Messaging Hub</strong><span>Financial Messaging Backbone</span></LocalLink>
              <LocalLink to="banking-transformation" onClick={close}><strong>{lang === 'fr' ? 'Transformation bancaire' : 'Banking Transformation'}</strong><span>Legacy Modernisation & Integration</span></LocalLink>
            </div>
          </div>
          {nav.map(([path, label]) => <LocalLink key={path} to={path} className="nav-link">{label}</LocalLink>)}
        </nav>
        <div className="header-actions">
          <Link className="language-switch" to={switched} onClick={() => track('language_selection', { locale: otherLang })}>{otherLang.toUpperCase()}</Link>
          <LocalLink to="contact" className="button button-ghost header-expert">{t.nav.expert}</LocalLink>
          <LocalLink to="contact?intent=demo" className="button button-primary header-demo">{t.nav.demo}</LocalLink>
          <button className={`menu-button${mobile ? ' is-open' : ''}`} onClick={() => setMobile(!mobile)} aria-expanded={mobile} aria-label="Menu"><span /><span /><span /></button>
        </div>
      </div>
      {mobile && <nav className="mobile-nav" aria-label="Mobile navigation">
        <button className="mobile-solutions-trigger" type="button" aria-expanded={mobileSolutions} onClick={() => setMobileSolutions(open => !open)}><span>{t.nav.solutions}</span><ChevronDown /></button>
        {mobileSolutions && <div className="mobile-solutions-panel">
          <LocalLink to="solutions/ibansys" onClick={close}>IBANSYS</LocalLink>
          <LocalLink to="solutions/swift-plus" onClick={close}>SWIFT+ Messaging Hub</LocalLink>
          <LocalLink to="banking-transformation" onClick={close}>{lang === 'fr' ? 'Transformation bancaire' : 'Banking Transformation'}</LocalLink>
        </div>}
        {nav.map(([path, label]) => <LocalLink key={path} to={path} onClick={close}>{label}</LocalLink>)}
        <div className="mobile-actions"><LocalLink to="contact" className="button button-dark" onClick={close}>{t.nav.expert}</LocalLink><LocalLink to="contact?intent=demo" className="button button-primary" onClick={close}>{t.nav.demo}</LocalLink></div>
      </nav>}
    </header>
  )
}

function Footer() {
  const lang = useLang(); const t = copy[lang]
  const columns = [
    { title: t.nav.solutions, items: [['solutions/ibansys', 'IBANSYS'], ['solutions/swift-plus', 'SWIFT+ Messaging Hub'], ['banking-transformation', lang === 'fr' ? 'Transformation bancaire' : 'Banking Transformation']] },
    { title: t.nav.expertise, items: [['expertise', 'Trade Finance'], ['expertise', 'SWIFT & ISO 20022'], ['expertise', lang === 'fr' ? 'Intégration bancaire' : 'Banking Integration']] },
    { title: lang === 'fr' ? 'Entreprise' : 'Company', items: [['why-smi', t.nav.why], ['customer-success', t.nav.success], ['insights', t.nav.insights], ['careers', t.nav.careers]] },
  ]
  return <footer className="site-footer">
    <div className="footer-grid">
      <div className="footer-brand"><div className="footer-logo-box"><Logo footer /></div><p>Banking Technology.<br />Built on Expertise.</p><span>{t.common.since}</span></div>
      {columns.map(column => <div key={column.title} className="footer-column"><h3>{column.title}</h3>{column.items.map(([path, label]) => <LocalLink key={`${path}-${label}`} to={path}>{label}</LocalLink>)}</div>)}
      <div className="footer-column"><h3>{lang === 'fr' ? 'Échanger' : 'Connect'}</h3><LocalLink to="contact">{t.nav.expert}</LocalLink><LocalLink to="contact?intent=demo">{t.nav.demo}</LocalLink><a href="mailto:contact@societelemondeinformatique.com">contact@societelemondeinformatique.com</a><a href="tel:+21653928121">+216 53 928 121</a></div>
    </div>
    <div className="footer-bottom"><span>© 2026 SMI — Société Le Monde Informatique. {lang === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}</span><div><LocalLink to="privacy">{lang === 'fr' ? 'Confidentialité' : 'Privacy'}</LocalLink><LocalLink to="legal">{lang === 'fr' ? 'Mentions légales' : 'Legal Notice'}</LocalLink><Link to={`/${lang === 'fr' ? 'en' : 'fr'}`}>{lang === 'fr' ? 'EN' : 'FR'}</Link></div></div>
  </footer>
}

function Layout({ children }: { children: ReactNode }) { return <><ScrollToTop /><ScrollReveal /><Header /><main>{children}</main><Footer /></> }

function CtaPair({ primary, secondary }: { primary?: string; secondary?: string }) {
  const lang = useLang(); const t = copy[lang]
  return <div className="cta-pair"><LocalLink to="contact?intent=demo" className="button button-primary" onClick={() => track('request_demo_click', { locale: lang })}>{primary || t.common.requestDemo}<Arrow /></LocalLink><LocalLink to="contact" className="button button-outline" onClick={() => track('talk_to_expert_click', { locale: lang })}>{secondary || t.common.talk}</LocalLink></div>
}

function PartnerStrip({ technology = false }: { technology?: boolean }) {
  const items = technology ? partnerTechnology : banks; const loop = [...items, ...items]
  return <div className="logo-rail"><div className={`logo-track${technology ? ' logo-track-reverse' : ''}`}>{loop.map((item, index) => <div className="logo-card" data-partner={item.name.toLowerCase()} key={`${item.name}-${index}`}><img src={assetPath(item.logo)} alt={`${item.name} logo`} loading="lazy" /><span>{item.name}</span></div>)}</div></div>
}

function SectionHeading({ eyebrow, title, body, light = false }: { eyebrow: string; title: string; body?: string; light?: boolean }) {
  return <div className={`section-heading${light ? ' section-heading-light' : ''}`}><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{body && <p className="section-lead">{body}</p>}</div>
}

function ValuesJourney({ items }: { items: string[][] }) {
  const [active, setActive] = useState(0)
  return <div className="values-journey" aria-label="SMI values">
    <svg className="values-connectors" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">
      <path d="M165 125H500H835M165 375H500H835M165 125C165 250 380 250 500 250M835 125C835 250 620 250 500 250M165 375C165 250 380 250 500 250M835 375C835 250 620 250 500 250" />
      <path className="values-signal" d="M165 125H500C620 125 620 250 500 250C380 250 380 375 500 375H835" />
    </svg>
    <div className="values-core" aria-hidden="true"><Logo /><span>PRINCIPES<br />SMI</span></div>
    <div className="values-grid">
      {items.map(([title, body], index) => <button className={`value-node${active === index ? ' is-active' : ''}`} type="button" key={title} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}>
        <span className="value-node-top"><span className="value-number">{String(index + 1).padStart(2, '0')}</span><DiagramIcon type={index} /></span>
        <strong>{title}</strong><span className="value-description">{body}</span>
      </button>)}
    </div>
  </div>
}

function CommitmentJourney({ items }: { items: readonly string[] }) {
  return <div className="commitment-journey">
    <div className="commitment-line" aria-hidden="true"><span /></div>
    {items.map((item, index) => <div className="commitment-node" key={item}><span className="commitment-marker"><b>{String(index + 1).padStart(2, '0')}</b></span><DiagramIcon type={index + 1} /><p>{item}</p></div>)}
  </div>
}

function CapabilityMatrix({ items }: { items: readonly string[] }) {
  return <div className="capability-map">{items.map((item, index) => <article key={item}><span className="capability-index">{String(index + 1).padStart(2, '0')}</span><DiagramIcon type={index} /><h3>{item}</h3><span className="capability-corner" aria-hidden="true" /></article>)}</div>
}

function ProcessJourney({ steps }: { steps: readonly string[] }) {
  const [active, setActive] = useState(0)
  return <div className="process-journey" style={{ '--process-progress': `${steps.length > 1 ? active / (steps.length - 1) * 100 : 0}%` } as CSSProperties}>
    <div className="process-track" aria-hidden="true"><span /></div>
    {steps.map((step, index) => <button type="button" className={`process-node${index <= active ? ' is-complete' : ''}${index === active ? ' is-active' : ''}`} key={step} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}>
      <span>{String(index + 1).padStart(2, '0')}</span><DiagramIcon type={index} /><strong>{step}</strong>
    </button>)}
  </div>
}

function TransformationStories({ stories, lang }: { stories: string[][]; lang: Lang }) {
  const labels = lang === 'fr' ? ['Défi', 'Approche SMI', 'Résultat'] : ['Challenge', 'SMI approach', 'Outcome']
  return <div className="transformation-stories">{stories.map(([title, challenge, approach, outcome], storyIndex) => <article className="transformation-story" key={title}>
    <div className="story-heading"><span>{String(storyIndex + 1).padStart(2, '0')}</span><h3>{title}</h3></div>
    <div className="story-route">{[challenge, approach, outcome].map((text, index) => <div className={`story-stage story-stage-${index + 1}`} key={labels[index]}><span><DiagramIcon type={index + storyIndex} /></span><small>{labels[index]}</small><p>{text}</p></div>)}</div>
  </article>)}</div>
}

function HomePage() {
  const lang = useLang(); const t = copy[lang]
  const reasons = lang === 'fr' ? [['35 ans', 'Une expertise bancaire développée depuis 1991.'], ['ADN bancaire', 'Le métier guide chaque choix technologique.'], ['Partenariats durables', 'Une relation qui continue après la mise en production.'], ['Support personnalisé', 'Une réponse adaptée à chaque banque.'], ['Équipes dédiées', 'Des profils métier et techniques réunis.'], ['Capacité à délivrer', 'Des transitions critiques conduites dans des délais exigeants.']] : [['35 years', 'Banking expertise developed since 1991.'], ['Banking DNA', 'Business reality guides every technology choice.'], ['Long-term partnerships', 'A relationship that continues after go-live.'], ['Personalised support', 'An approach adapted to each bank.'], ['Dedicated teams', 'Business and technical profiles working together.'], ['Proven delivery', 'Critical transitions delivered to demanding timelines.']]
  const roles = lang === 'fr' ? ['Experts Trade Finance', 'Spécialistes SWIFT & ISO 20022', 'Business Analysts', 'Architectes solutions', 'Ingénieurs logiciels', 'Équipes projet & delivery'] : ['Trade Finance Experts', 'SWIFT & ISO 20022 Specialists', 'Business Analysts', 'Solution Architects', 'Software Engineers', 'Project & Delivery Teams']
  const commitments = lang === 'fr' ? ['Comprendre avant de construire', 'Accompagner de façon personnalisée', 'Être présent dans la durée', 'Faire évoluer sans fragiliser'] : ['Understand before building', 'Support each bank personally', 'Stay for the long term', 'Evolve without disruption']
  return <Layout>
    <Seo title="SMI | Banking Technology, Trade Finance & Financial Messaging" description={t.home.body} />
    <section className="hero"><div className="hero-grid"><div className="hero-copy"><p className="eyebrow">{t.home.eyebrow}</p><h1>{t.home.title}</h1><p className="hero-body">{t.home.body}</p><CtaPair primary={lang === 'fr' ? 'Découvrir nos solutions' : 'Discover Our Solutions'} /></div><div className="message-visual" aria-label={lang === 'fr' ? 'Architecture technologique bancaire' : 'Banking technology architecture'}><div className="visual-label visual-label-top">{lang === 'fr' ? 'FINANCEMENT DU COMMERCE' : 'TRADE FINANCE'}</div><div className="visual-label visual-label-left">{lang === 'fr' ? 'SYSTÈME CENTRAL' : 'CORE BANKING'}</div><div className="visual-label visual-label-right">{lang === 'fr' ? 'PAIEMENTS' : 'PAYMENTS'}</div><div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" /><div className="visual-hub"><Logo /><span>{lang === 'fr' ? <>La technologie bancaire<br />au service du métier.</> : <>Banking technology<br />built around the business.</>}</span></div><span className="data-dot dot-one" /><span className="data-dot dot-two" /><span className="data-dot dot-three" /></div></div><div className="trust-strip">{t.home.trust.map(item => <span key={item}>{item}</span>)}</div></section>
    <section className="partner-intro section-pad"><div className="content"><SectionHeading eyebrow={lang === 'fr' ? 'CONFIANCE' : 'TRUST'} title={lang === 'fr' ? 'Une expertise construite dans la durée.' : 'Expertise built over time.'} body={lang === 'fr' ? 'Des partenariats bancaires de longue date. Un accompagnement personnalisé. Des équipes dédiées.' : 'Long-standing banking partnerships. Personalised support. Dedicated teams.'} /><p className="strip-label">{lang === 'fr' ? 'PARTENAIRES BANCAIRES' : 'BANKING PARTNERS'}</p></div><PartnerStrip /><div className="content"><p className="strip-label strip-label-secondary">{lang === 'fr' ? 'PARTENAIRES TECHNOLOGIQUES' : 'TECHNOLOGY PARTNERS'}</p></div><PartnerStrip technology /></section>
    <section className="section-pad content"><SectionHeading eyebrow={lang === 'fr' ? 'NOS DOMAINES' : 'OUR DOMAINS'} title={t.home.worldsTitle} /><div className="world-grid">{worlds[lang].map((world, index) => <article className="world-card" key={world.id}><span className="card-number">0{index + 1}</span><p className="eyebrow">{world.label}</p><h3>{world.title}</h3><p>{world.text}</p><div className="tag-list">{world.tags.map(tag => <span key={tag}>{tag}</span>)}</div><LocalLink to={world.href} className="text-link">{t.common.explore} <Arrow /></LocalLink></article>)}</div></section>
    <section className="solutions-showcase section-pad"><div className="content"><SectionHeading eyebrow={lang === 'fr' ? 'SOLUTIONS PHARES' : 'FLAGSHIP SOLUTIONS'} title={t.home.solutionsTitle} light /><div className="product-grid"><ProductCard name="IBANSYS" subtitle="Trade & International Banking Platform" tags={['Trade Finance', 'Documentary Credits', 'Guarantees', 'International Payments', 'Core Banking Integration']} href="solutions/ibansys" /><ProductCard name="SWIFT+" subtitle="The Financial Messaging Backbone for Modern Banking" tags={['MT / MX', 'ISO 20022', 'CBPR+', 'Validation', 'Routing', 'Monitoring']} href="solutions/swift-plus" /></div></div></section>
    <section className="iso-section section-pad"><div className="content iso-grid"><div><p className="eyebrow">SWIFT • ISO 20022 • CBPR+</p><h2>{t.home.isoTitle}</h2><p>{t.home.isoBody}</p><LocalLink to="solutions/swift-plus" className="text-link text-link-light">{lang === 'fr' ? 'Explorer SWIFT+ Messaging Hub' : 'Explore SWIFT+ Messaging Hub'} <Arrow /></LocalLink></div><MessageFlow /></div></section>
    <section className="section-pad content"><SectionHeading eyebrow={lang === 'fr' ? 'POURQUOI SMI' : 'WHY SMI'} title={t.home.whyTitle} /><ValuesJourney items={reasons} /></section>
    <section className="people section-pad"><div className="content people-grid"><SectionHeading eyebrow={lang === 'fr' ? 'NOS ÉQUIPES' : 'OUR PEOPLE'} title={t.home.peopleTitle} body={lang === 'fr' ? 'L’expertise bancaire se construit avec le temps, la transmission et des équipes pluridisciplinaires.' : 'Banking expertise grows through time, knowledge sharing and multidisciplinary teams.'} /><div className="role-list">{roles.map(role => <div key={role}><span /><p>{role}</p></div>)}</div></div></section>
    <section className="section-pad content commitments"><SectionHeading eyebrow={lang === 'fr' ? 'NOS ENGAGEMENTS' : 'OUR COMMITMENTS'} title={t.home.commitmentsTitle} /><CommitmentJourney items={commitments} /></section>
    <section className="section-pad content"><SectionHeading eyebrow="INSIGHTS" title={lang === 'fr' ? 'Comprendre ce qui transforme la banque.' : 'Understand what is transforming banking.'} /><div className="insight-grid">{insights[lang].map(item => <InsightCard key={item.title} {...item} />)}</div><LocalLink to="insights" className="button button-outline section-action">{t.common.all}</LocalLink></section>
    <FinalCta title={t.home.finalTitle} />
  </Layout>
}

function ProductCard({ name, subtitle, tags, href }: { name: string; subtitle: string; tags: readonly string[]; href: string }) { const lang = useLang(); return <article className="product-card"><div><p className="eyebrow">SMI SOLUTION</p><h3>{name}</h3><p>{subtitle}</p></div><div className="tag-list">{tags.map(tag => <span key={tag}>{tag}</span>)}</div><LocalLink to={href} className="text-link">{lang === 'fr' ? `Explorer ${name}` : `Explore ${name}`} <Arrow /></LocalLink></article> }
function MessageFlow() {
  const lang = useLang()
  const stages = lang === 'fr' ? ['Applications bancaires', 'Préparer', 'Valider', 'Router', 'Réseau financier'] : ['Banking applications', 'Prepare', 'Validate', 'Route', 'Financial network']
  return <div className="message-flow-chart" aria-label={lang === 'fr' ? 'Cycle de vie d’un message financier' : 'Financial message lifecycle'}>
    <div className="message-flow-track" aria-hidden="true"><span className="message-packet packet-one" /><span className="message-packet packet-two" /></div>
    <div className="message-source"><DiagramIcon type={0} /><strong>{stages[0]}</strong><small>Core • Trade • Payments</small></div>
    <div className="message-hub">
      <span className="hub-kicker">SWIFT+</span><strong>Messaging Hub</strong>
      <div className="hub-stages">{stages.slice(1, 4).map((stage, index) => <span key={stage}><b>{index + 1}</b>{stage}</span>)}</div>
    </div>
    <div className="message-target"><DiagramIcon type={2} /><strong>{stages[4]}</strong><small>MT • MX • ISO 20022</small></div>
    <div className="message-monitor"><span className="monitor-pulse" /><strong>{lang === 'fr' ? 'Supervision continue' : 'Continuous monitoring'}</strong><span>{lang === 'fr' ? 'Contrôler • Tracer • Investiguer' : 'Control • Trace • Investigate'}</span></div>
  </div>
}
function slugify(value: string) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
function InsightCard({ category, title, summary }: { category: string; title: string; summary: string }) { const lang = useLang(); return <article className="insight-card"><p className="eyebrow">{category}</p><h3>{title}</h3><p>{summary}</p><LocalLink to={`insights/${slugify(title)}`} className="text-link">{copy[lang].common.read} <Arrow /></LocalLink></article> }
function FinalCta({ title }: { title: string }) { const lang = useLang(); return <section className="final-cta"><div><p className="eyebrow">LET’S TALK BANKING</p><h2>{title}</h2><CtaPair /></div><p className="signature">SMI — Banking Technology. Built on Expertise.<br /><span>{copy[lang].common.since}.</span></p></section> }

const extraInsights = {
  fr: [
    { category: 'Financial Messaging', title: 'Pourquoi les banques ont besoin d’un Messaging Hub', summary: 'Rationaliser les intégrations et gouverner le cycle de vie des messages.' },
    { category: 'Architecture', title: 'Modèle canonique et messagerie financière', summary: 'Réduire les mappings point à point et isoler les évolutions de format.' },
    { category: 'Modernisation', title: 'Remplacer, moderniser ou intégrer un système legacy ?', summary: 'Choisir une trajectoire adaptée à la valeur métier et au risque.' },
  ],
  en: [
    { category: 'Financial Messaging', title: 'Why Banks Need a Financial Messaging Hub', summary: 'Rationalise integrations and govern the full message lifecycle.' },
    { category: 'Architecture', title: 'Canonical Models in Financial Messaging', summary: 'Reduce point-to-point mappings and isolate format evolution.' },
    { category: 'Modernisation', title: 'Replace, Modernise or Integrate a Legacy System?', summary: 'Choose a path based on business value and risk.' },
  ],
} as const

const productData = {
  ibansys: { title: 'IBANSYS', subtitle: 'Trade & International Banking Platform', eyebrow: 'TRADE FINANCE • INTERNATIONAL BANKING', heroFr: 'Digitaliser le Trade Finance sans perdre la maîtrise du métier.', heroEn: 'Digitise Trade Finance without losing control of the business.', bodyFr: 'Une plateforme conçue pour digitaliser, intégrer et contrôler les opérations de Trade Finance et de banque internationale.', bodyEn: 'A platform designed to digitise, integrate and control Trade Finance and international banking operations.', capabilities: ['Documentary Credits', 'Documentary Collections', 'International Guarantees', 'International Payments', 'Trade Financing', 'Correspondent Banking'], flow: ['Initiation', 'Business Controls', 'Approval Workflow', 'Compliance Controls', 'Financial Messaging', 'Settlement', 'Monitoring'] },
  swift: { title: 'SWIFT+ Messaging Hub', subtitle: 'One Bank. One Messaging Backbone.', eyebrow: 'MT • MX • ISO 20022 • CBPR+', heroFr: 'Unifiez votre messagerie financière. Préparez votre banque aux standards de demain.', heroEn: 'Unify Financial Messaging. Be Ready for What Comes Next.', bodyFr: 'Le socle central pour gérer, transformer, contrôler, router, superviser et tracer les messages financiers à l’échelle de la banque.', bodyEn: 'The central backbone for managing, transforming, controlling, routing, monitoring and tracing financial messages across the bank.', capabilities: ['Message Generation', 'Normalisation', 'Transformation', 'Validation', 'Functional Routing', 'Monitoring & Investigation', 'Archive'], flow: ['Create', 'Normalize', 'Transform', 'Validate', 'Route', 'Send / Receive', 'Monitor', 'Investigate', 'Archive'] },
} as const

function ProductPage({ kind }: { kind: 'ibansys' | 'swift' }) {
  const lang = useLang(); const data = productData[kind]; const isSwift = kind === 'swift'; const hero = lang === 'fr' ? data.heroFr : data.heroEn; const body = lang === 'fr' ? data.bodyFr : data.bodyEn
  const capabilities = lang === 'fr' ? (isSwift ? ['Génération de messages', 'Normalisation', 'Transformation', 'Validation', 'Routage fonctionnel', 'Supervision & investigation', 'Archivage'] : ['Crédits documentaires', 'Remises documentaires', 'Garanties internationales', 'Paiements internationaux', 'Financement du commerce', 'Banque correspondante']) : data.capabilities
  const flow = lang === 'fr' ? (isSwift ? ['Créer', 'Normaliser', 'Transformer', 'Valider', 'Router', 'Envoyer / Recevoir', 'Superviser', 'Investiguer', 'Archiver'] : ['Initiation', 'Contrôles métier', 'Circuit d’approbation', 'Contrôles de conformité', 'Messagerie financière', 'Règlement', 'Supervision']) : data.flow
  return <Layout><Seo title={`${data.title} | ${isSwift ? 'ISO 20022 & Financial Messaging' : 'Trade Finance & International Banking Platform'}`} description={body} /><PageHero eyebrow={data.eyebrow} title={hero} body={body} label={data.title} note={lang === 'fr' ? '35 ans d’expertise bancaire au service de la technologie.' : 'Built on 35 years of banking expertise.'} /><section className="section-pad content"><SectionHeading eyebrow={lang === 'fr' ? 'VISION UNIFIÉE' : 'UNIFIED VISION'} title={isSwift ? (lang === 'fr' ? 'Le point de référence de votre messagerie financière.' : 'The reference point for financial messaging.') : (lang === 'fr' ? 'Une vision unifiée du Trade et de la banque internationale.' : 'A unified view of Trade and international banking.')} /><CapabilityMatrix items={capabilities} /></section><section className="process-section section-pad"><div className="content"><SectionHeading eyebrow={lang === 'fr' ? 'DE BOUT EN BOUT' : 'END TO END'} title={isSwift ? (lang === 'fr' ? 'Chaque message. Chaque étape. Un seul cycle de vie.' : 'Every message. Every stage. One lifecycle.') : (lang === 'fr' ? 'De l’initiation au règlement. Entièrement traçable.' : 'From initiation to settlement. Fully traceable.')} /><ProcessJourney steps={flow} /></div></section>{isSwift ? <SwiftArchitecture /> : <IbansysIntegration />}<section className="section-pad content"><SectionHeading eyebrow={lang === 'fr' ? 'POURQUOI SMI' : 'WHY SMI'} title={lang === 'fr' ? 'Une expertise métier au cœur de la solution.' : 'Banking expertise at the heart of the solution.'} /><div className="three-up"><InfoCard title={lang === 'fr' ? '35 ans' : '35 Years'} body={lang === 'fr' ? 'Une connaissance bancaire développée depuis 1991.' : 'Banking knowledge developed since 1991.'} /><InfoCard title={lang === 'fr' ? 'Équipe dédiée' : 'Dedicated Team'} body={lang === 'fr' ? 'Des profils fonctionnels et techniques tout au long du projet.' : 'Functional and technical specialists throughout the project.'} /><InfoCard title={lang === 'fr' ? 'Évolution continue' : 'Continuous Evolution'} body={lang === 'fr' ? 'Une architecture conçue pour intégrer les évolutions futures.' : 'An architecture designed to absorb future change.'} /></div></section><FinalCta title={isSwift ? (lang === 'fr' ? 'Votre prochaine évolution SWIFT ne devrait pas déclencher une refonte de votre SI.' : 'Your next SWIFT evolution should not trigger another architecture overhaul.') : (lang === 'fr' ? 'Votre activité Trade mérite une plateforme à la hauteur de sa complexité.' : 'Your Trade business deserves a platform equal to its complexity.')} /></Layout>
}

function PageHero({ eyebrow, title, body, label }: { eyebrow: string; title: string; body: string; label?: string; note?: string }) {
  return <section className="page-hero"><div className="page-hero-inner"><div>{label && <span className="product-label">{label}</span>}<p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{body}</p><CtaPair /></div></div></section>
}

function SwiftArchitecture() { const lang = useLang(); return <section className="architecture section-pad"><div className="content"><SectionHeading eyebrow="CANONICAL DATA MODEL" title={lang === 'fr' ? 'Normaliser une fois. Évoluer en continu.' : 'Normalize once. Evolve continuously.'} body={lang === 'fr' ? 'Le modèle pivot isole les applications des changements de format et simplifie la coexistence MT/MX.' : 'The canonical model isolates applications from format changes and simplifies MT/MX coexistence.'} light /><div className="canonical-chart"><svg viewBox="0 0 1000 430" preserveAspectRatio="none" aria-hidden="true"><path d="M190 80C330 80 330 215 440 215M190 215H440M190 350C330 350 330 215 440 215M560 215C670 215 670 80 810 80M560 215H810M560 215C670 215 670 350 810 350" /><path className="canonical-signal" d="M190 80C330 80 330 215 440 215H560C670 215 670 350 810 350" /></svg><div className="canonical-column canonical-inputs"><span><DiagramIcon type={0} />Application A</span><span><DiagramIcon type={1} />Application B</span><span><DiagramIcon type={2} />Application C</span></div><div className="canonical-core"><small>SWIFT+</small>{lang === 'fr' ? <>MODÈLE DE<br />DONNÉES PIVOT</> : <>CANONICAL<br />DATA MODEL</>}<span>{lang === 'fr' ? 'Normaliser • Contrôler • Transformer' : 'Normalize • Control • Transform'}</span></div><div className="canonical-column canonical-outputs"><span>SWIFT MT<DiagramIcon type={3} /></span><span>ISO 20022 / MX<DiagramIcon type={4} /></span><span>{lang === 'fr' ? 'Autres formats' : 'Other Formats'}<DiagramIcon type={5} /></span></div></div><div className="routing-note"><strong>{lang === 'fr' ? 'Préserver la couche de transport. Moderniser la couche de valeur.' : 'Preserve the transport layer. Modernise the value layer.'}</strong><p>SWIFT+ {lang === 'fr' ? 'complète les infrastructures SAA, STARS et routeurs existants ; elle ne les remplace pas.' : 'works alongside SAA, STARS and existing routing infrastructure; it does not replace them.'}</p></div></div></section> }

function IbansysIntegration() { const lang = useLang(); const systems = lang === 'fr' ? ['Système bancaire central', 'SWIFT+ Messaging Hub', 'Lutte anti-blanchiment & conformité', 'Systèmes de paiement', 'Gestion documentaire', 'Reporting & BI'] : ['Core Banking', 'SWIFT+ Messaging Hub', 'AML & Compliance', 'Payment Systems', 'Document Management', 'Reporting & BI']; return <section className="architecture section-pad"><div className="content"><SectionHeading eyebrow="INTEGRATION FIRST" title={lang === 'fr' ? 'Intégrer. Ne pas isoler.' : 'Integrate. Don’t isolate.'} body={lang === 'fr' ? 'IBANSYS se connecte au système d’information existant par APIs, services, fichiers et intégrations de données.' : 'IBANSYS connects to the existing information system through APIs, services, files and data integrations.'} light /><div className="integration-chart"><svg viewBox="0 0 1000 540" preserveAspectRatio="none" aria-hidden="true"><path d="M500 270L175 95M500 270L500 70M500 270L825 95M500 270L175 445M500 270L500 470M500 270L825 445" /><circle cx="500" cy="270" r="172" /><circle className="integration-signal signal-a" cx="0" cy="0" r="6" /><circle className="integration-signal signal-b" cx="0" cy="0" r="6" /></svg><div className="integration-core"><small>TRADE & INTERNATIONAL BANKING</small>IBANSYS<span>API • Services • Data</span></div>{systems.map((system, index) => <span className="integration-node" key={system}><DiagramIcon type={index} /><b>{system}</b><small>{index % 2 === 0 ? 'API / Services' : (lang === 'fr' ? 'Échange de données' : 'Data exchange')}</small></span>)}</div><div className="routing-note"><strong>{lang === 'fr' ? 'Plateforme globale. Conformité locale.' : 'Global platform. Local compliance.'}</strong><p>{lang === 'fr' ? 'Adaptable aux réglementations locales en vigueur et aux exigences propres à chaque marché.' : 'Adaptable to applicable local regulations and market requirements.'}</p></div></div></section> }
function InfoCard({ title, body }: { title: string; body: string }) { return <article className="info-card"><h3>{title}</h3><p>{body}</p></article> }

function TransformationPage() {
  const lang = useLang(); const stages = lang === 'fr' ? ['Comprendre', 'Évaluer', 'Définir la cible', 'Prioriser', 'Construire & intégrer', 'Migrer & valider', 'Déployer', 'Faire évoluer'] : ['Understand', 'Assess', 'Define the Target', 'Prioritise', 'Build & Integrate', 'Migrate & Validate', 'Deploy', 'Evolve']; const capabilities = lang === 'fr' ? [['Modernisation legacy', 'Préserver les règles métier et faire évoluer la technologie autour.'], ['APIs & intégration', 'Connecter ce qui existe et préparer ce qui vient.'], ['Migration de données', 'Préserver l’intégrité, l’historique et la continuité.'], ['Digitalisation des processus', 'Automatiser les contrôles, workflows et traitements répétitifs.'], ['Architecture moderne', 'Modularité, services et observabilité lorsque cela crée de la valeur.'], ['Contrôle par conception', 'Accès, traçabilité, séparation des rôles et validation métier.']] : [['Legacy Modernisation', 'Preserve business rules and evolve the technology around them.'], ['APIs & Integration', 'Connect what exists and enable what comes next.'], ['Data Migration', 'Preserve integrity, history and continuity.'], ['Process Digitalisation', 'Automate controls, workflows and repetitive processing.'], ['Modern Architecture', 'Modularity, services and observability where they create value.'], ['Control by Design', 'Access, traceability, segregation of duties and business validation.']]
  return <Layout><Seo title="Banking Digital Transformation & Legacy Modernisation | SMI" description="Banking modernisation without disruption." /><PageHero eyebrow="BANKING TRANSFORMATION" title={lang === 'fr' ? 'Moderniser la banque sans fragiliser ce qui fonctionne.' : 'Modernise banking without disrupting what works.'} body={lang === 'fr' ? 'SMI accompagne la modernisation progressive des applications, architectures et processus bancaires en combinant continuité opérationnelle, maîtrise du risque et compréhension métier.' : 'SMI supports progressive modernisation of banking applications, architectures and processes through operational continuity, risk control and business understanding.'} note="Banking Modernisation Without Disruption" /><section className="section-pad content"><SectionHeading eyebrow={lang === 'fr' ? 'CAPACITÉS' : 'CAPABILITIES'} title={lang === 'fr' ? 'Le métier d’abord. La technologie là où elle crée de la valeur.' : 'Business first. Technology where it creates value.'} /><div className="two-up">{capabilities.map(([title, body]) => <InfoCard key={title} title={title} body={body} />)}</div></section><section className="process-section section-pad"><div className="content"><SectionHeading eyebrow={lang === 'fr' ? 'NOTRE APPROCHE' : 'OUR APPROACH'} title={lang === 'fr' ? 'Une destination claire. Un chemin maîtrisé.' : 'A clear destination. A controlled path.'} /><ProcessJourney steps={stages} /></div></section><FinalCta title={lang === 'fr' ? 'Transformons ce qui doit évoluer. Préservons ce qui crée encore de la valeur.' : 'Transform what must evolve. Preserve what still creates value.'} /></Layout>
}

function ExpertisePage() { const lang = useLang(); const expertise = ['Trade Finance & International Banking', 'Payments & Financial Messaging', 'SWIFT & ISO 20022', 'Banking Integration & Interoperability', 'Legacy & Application Modernisation', 'Data & Migration', 'Process Digitalisation & Automation', 'Banking Technology']; return <Layout><Seo title="Banking Expertise | Trade Finance, SWIFT & ISO 20022 | SMI" description="35 years of banking knowledge turned into technology." /><PageHero eyebrow="EXPERTISE" title={lang === 'fr' ? '35 ans à comprendre la banque. Et à transformer cette expertise en solutions.' : '35 Years of Banking Knowledge. Turned into Technology.'} body={lang === 'fr' ? 'Nous comprenons ce que fait la banque. Nous savons comment la technologie peut l’améliorer.' : 'We understand what the bank does. We know how technology can make it better.'} note="Banking expertise + Technology expertise" /><section className="section-pad content"><div className="expertise-list">{expertise.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, '0')}</span><h2>{item}</h2><p>{lang === 'fr' ? 'Expertise métier, architecture, intégration et accompagnement dans la durée.' : 'Business knowledge, architecture, integration and long-term support.'}</p></article>)}</div></section><section className="knowledge-banner"><div><p className="eyebrow">KNOWLEDGE TRANSFER</p><h2>Build Knowledge, Not Dependency.</h2><p>{lang === 'fr' ? 'Formation fonctionnelle, formation technique, documentation et partage continu.' : 'Functional training, technical training, documentation and continuous knowledge sharing.'}</p></div></section><FinalCta title={lang === 'fr' ? 'Un projet. Une équipe dédiée. Plusieurs expertises.' : 'One project. One dedicated team. Multiple areas of expertise.'} /></Layout> }

function WhyPage() { const lang = useLang(); const values = lang === 'fr' ? [['Expertise', 'Comprendre avant d’agir.'], ['Fiabilité', 'Être digne de confiance.'], ['Engagement', 'Aller jusqu’au résultat.'], ['Proximité', 'Rester accessible.'], ['Adaptabilité', 'Évoluer avec la banque.'], ['Transmission', 'Renforcer l’autonomie du partenaire.']] : [['Expertise', 'Understand before acting.'], ['Reliability', 'Be worthy of trust.'], ['Commitment', 'Go through to the result.'], ['Proximity', 'Stay accessible.'], ['Adaptability', 'Evolve with banking.'], ['Knowledge Sharing', 'Build partner autonomy.']]; return <Layout><Seo title="Why SMI | 35 Years of Banking Expertise" description="More than a technology provider. A long-term banking partner." /><PageHero eyebrow="WHY SMI" title={lang === 'fr' ? 'Plus qu’un fournisseur de solutions. Un partenaire bancaire dans la durée.' : 'More Than a Technology Provider. A Long-Term Banking Partner.'} body={lang === 'fr' ? 'Depuis 1991, SMI évolue avec le secteur bancaire et transforme cette expérience accumulée en valeur pour chaque nouveau projet.' : 'Since 1991, SMI has evolved alongside banking and turns that accumulated experience into value for every new project.'} note="Understand. Deliver. Support. Evolve." /><section className="section-pad content"><SectionHeading eyebrow={lang === 'fr' ? 'NOS VALEURS' : 'OUR VALUES'} title={lang === 'fr' ? 'Des engagements concrets.' : 'Concrete commitments.'} /><ValuesJourney items={values} /></section><section className="architecture section-pad"><div className="content"><SectionHeading eyebrow={lang === 'fr' ? 'NOTRE RESPONSABILITÉ' : 'OUR RESPONSIBILITY'} title={lang === 'fr' ? 'Notre responsabilité ne s’arrête pas au Go-Live.' : 'Our responsibility does not stop at Go-Live.'} body={lang === 'fr' ? 'Évolutions métier, standards, intégrations, amélioration fonctionnelle et accompagnement opérationnel.' : 'Business evolution, standards, integrations, functional improvement and operational support.'} light /><PartnerStrip /></div></section><FinalCta title={lang === 'fr' ? 'Nous adaptons la solution à la banque. Pas la banque à la solution.' : 'We adapt the solution to the bank. Not the bank to the solution.'} /></Layout> }

function CustomerSuccessPage() { const lang = useLang(); const stories = lang === 'fr' ? [['Transformation ISO 20022', 'Messages, données, interfaces et contrôles', 'Analyse des flux, transformation, intégration et tests de bout en bout', 'Transition maîtrisée et continuité des opérations'], ['Digitalisation du Trade Finance', 'Processus documentaires complexes et fragmentés', 'Plateforme intégrée, workflows et connexion au Core Banking', 'Un environnement plus intégré, traçable et évolutif'], ['Modernisation legacy', 'Patrimoine applicatif riche mais difficile à faire évoluer', 'Évaluation, récupération des règles métier et migration contrôlée', 'Architecture modernisée et connaissance bancaire préservée']] : [['ISO 20022 Transformation', 'Messages, data, interfaces and controls', 'Flow analysis, transformation, integration and end-to-end testing', 'Controlled transition and operational continuity'], ['Trade Finance Digitalisation', 'Complex and fragmented documentary processes', 'Integrated platform, workflows and Core Banking connectivity', 'A more integrated, traceable and adaptable environment'], ['Legacy Modernisation', 'Rich application heritage that is hard to evolve', 'Assessment, business-rule recovery and controlled migration', 'Modernised architecture with banking knowledge preserved']]; return <Layout><Seo title="Customer Success | Banking Transformation Delivery | SMI" description="Trusted by banks. Proven through delivery." /><PageHero eyebrow="CUSTOMER SUCCESS" title={lang === 'fr' ? 'Des relations construites dans la durée. Des transformations qui produisent des résultats.' : 'Trusted by Banks. Proven Through Delivery.'} body={lang === 'fr' ? 'La mise en production est une étape. La valeur dans la durée est l’objectif.' : 'Go-live is a milestone. Long-term value is the objective.'} note="Long-term relationships. Personalised support. Dedicated teams." /><section className="section-pad"><PartnerStrip /></section><section className="section-pad content"><SectionHeading eyebrow="TRANSFORMATIONS" title={lang === 'fr' ? 'Le défi. Notre approche. Le résultat.' : 'The challenge. Our approach. The outcome.'} /><TransformationStories stories={stories} lang={lang} /></section><FinalCta title={lang === 'fr' ? 'Chaque banque est différente. Chaque transformation mérite sa propre approche.' : 'Every bank is different. Every transformation deserves its own approach.'} /></Layout> }

function InsightsPage() { const lang = useLang(); const library = [...insights[lang], ...extraInsights[lang]]; return <Layout><Seo title="SMI Insights | Trade Finance, SWIFT & ISO 20022" description="Insights for the next generation of banking." /><PageHero eyebrow="INSIGHTS" title={lang === 'fr' ? 'Comprendre les transformations qui façonnent la banque de demain.' : 'Insights for the Next Generation of Banking.'} body={lang === 'fr' ? 'Analyses métier et technologiques sur le Trade Finance, la messagerie financière, ISO 20022 et la modernisation bancaire.' : 'Business and technology perspectives on Trade Finance, financial messaging, ISO 20022 and banking modernisation.'} /><section className="section-pad content"><div className="insight-grid insight-grid-page">{library.map(item => <InsightCard key={item.title} {...item} />)}</div></section><FinalCta title={lang === 'fr' ? 'Une question métier ou technologique mérite une conversation experte.' : 'A business or technology question deserves an expert conversation.'} /></Layout> }

function InsightArticlePage() {
  const lang = useLang()
  const { slug } = useParams()
  const article = [...insights[lang], ...extraInsights[lang]].find(item => slugify(item.title) === slug)
  if (!article) return <Navigate to={`/${lang}/insights`} replace />
  const paragraphs = lang === 'fr'
    ? [
      `${article.summary} Cette analyse présente les principaux enjeux métier, technologiques et opérationnels à considérer avant d’engager une transformation.`,
      'La trajectoire doit relier les standards, la qualité des données, les règles métier, les interfaces et la continuité des opérations. Une approche progressive permet de maîtriser le changement tout en préservant les systèmes qui produisent déjà de la valeur.',
      'SMI accompagne les banques depuis le cadrage jusqu’à la mise en production, avec des équipes métier et techniques réunies autour des mêmes objectifs.',
    ]
    : [
      `${article.summary} This analysis outlines the main business, technology and operational questions to consider before starting a transformation.`,
      'The roadmap must connect standards, data quality, business rules, interfaces and operational continuity. A progressive approach helps control change while preserving the systems that already deliver value.',
      'SMI supports banks from initial framing through production, bringing business and technical specialists together around the same objectives.',
    ]
  return <Layout><Seo title={`${article.title} | SMI Insights`} description={article.summary} /><PageHero eyebrow={article.category} title={article.title} body={article.summary} /><section className="section-pad content"><article className="article-content"><p className="article-intro">{paragraphs[0]}</p><h2>{lang === 'fr' ? 'Construire une trajectoire maîtrisée' : 'Build a controlled roadmap'}</h2><p>{paragraphs[1]}</p><h2>{lang === 'fr' ? 'Relier le métier et la technologie' : 'Connect business and technology'}</h2><p>{paragraphs[2]}</p><LocalLink to="insights" className="text-link article-back"><span aria-hidden="true">←</span>{lang === 'fr' ? 'Retour aux analyses' : 'Back to insights'}</LocalLink></article></section><FinalCta title={lang === 'fr' ? 'Approfondissons le sujet avec vos équipes.' : 'Explore the topic with your teams.'} /></Layout>
}

function CareersPage() { const lang = useLang(); const paths = lang === 'fr' ? ['Ingénierie logicielle', 'Analyse bancaire & métier', 'Messagerie financière', 'Données & bases de données', 'Intégration & architecture', 'Gestion de projet & delivery'] : ['Software Engineering', 'Banking & Business Analysis', 'Financial Messaging', 'Data & Databases', 'Integration & Architecture', 'Project & Delivery']; return <Layout><Seo title="Careers at SMI | Banking Technology" description="Build expertise at the intersection of banking and technology." /><PageHero eyebrow="CAREERS" title={lang === 'fr' ? 'Construisez avec nous les technologies qui font évoluer la banque.' : 'Build the Future of Banking Technology With Us.'} body={lang === 'fr' ? 'Apprenez la technologie. Comprenez le métier. Construisez de vraies solutions bancaires.' : 'Learn the technology. Understand the business. Build real banking solutions.'} note="Curiosity. Rigour. Banking knowledge. Engineering excellence." /><section className="section-pad content"><SectionHeading eyebrow={lang === 'fr' ? 'DOMAINES' : 'FIELDS'} title={lang === 'fr' ? 'Travaillez sur des systèmes qui comptent.' : 'Work on systems that matter.'} /><CapabilityMatrix items={paths} /></section><section className="people section-pad"><div className="content people-grid"><SectionHeading eyebrow={lang === 'fr' ? 'GRANDIR CHEZ SMI' : 'GROW AT SMI'} title={lang === 'fr' ? 'L’expérience grandit lorsqu’elle est partagée.' : 'Experience grows when it is shared.'} body={lang === 'fr' ? 'Mentorat, sessions de connaissance, apprentissage projet, documentation et collaboration entre équipes.' : 'Mentoring, knowledge sessions, project learning, documentation and cross-team collaboration.'} /><div className="role-list">{(lang === 'fr' ? ['Projets utiles', 'Apprentissage continu', 'Collaboration entre experts', 'Évolution dans la durée'] : ['Meaningful Projects', 'Continuous Learning', 'Expert Collaboration', 'Long-Term Growth']).map(item => <div key={item}><span /><p>{item}</p></div>)}</div></div></section><FinalCta title={lang === 'fr' ? 'Commencez par la technologie. Développez une expertise bancaire.' : 'Start with technology. Grow into banking expertise.'} /></Layout> }

function ContactPage() {
  const lang = useLang(); const [submitted, setSubmitted] = useState(false); const onSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); track('form_submission', { form: 'contact', locale: lang }); setSubmitted(true) }; const interests = ['Trade Finance', 'IBANSYS', 'SWIFT & Financial Messaging', 'ISO 20022', 'SWIFT+ Messaging Hub', 'Banking Integration', 'Digital Transformation', 'Legacy Modernisation', 'Data Migration', 'Process Automation', 'Partnership', 'Other']
  return <Layout><Seo title="Talk to an Expert | SMI" description="Discuss your next banking challenge with SMI." /><PageHero eyebrow={lang === 'fr' ? 'PARLONS BANQUE' : 'LET’S TALK BANKING'} title={lang === 'fr' ? 'Parlons de votre prochain enjeu bancaire.' : 'Let’s Discuss What’s Next for Your Bank.'} body={lang === 'fr' ? 'Trade Finance, SWIFT, ISO 20022, modernisation ou intégration : chaque projet commence par la compréhension du contexte.' : 'Trade Finance, SWIFT, ISO 20022, modernisation or integration: every project starts with understanding the context.'} /><section className="section-pad content contact-grid"><div><SectionHeading eyebrow={lang === 'fr' ? 'VOTRE CONTEXTE D’ABORD' : 'YOUR CONTEXT FIRST'} title={lang === 'fr' ? 'Commençons par le besoin.' : 'Start with the challenge.'} body={lang === 'fr' ? 'La bonne discussion, avec la bonne expertise.' : 'The right discussion with the right expertise.'} /><div className="contact-details"><a href="mailto:contact@societelemondeinformatique.com">contact@societelemondeinformatique.com</a><a href="tel:+21653928121">+216 53 928 121</a><p>21 rue d’Iran, 1002 Tunis, Tunisie</p></div></div><form className="contact-form" onSubmit={onSubmit}>{submitted ? <div className="form-success"><strong>{lang === 'fr' ? 'Merci pour votre demande.' : 'Thank you for your request.'}</strong><p>{lang === 'fr' ? 'Le formulaire est prêt à être relié au CRM ou au service d’envoi retenu avant la mise en production.' : 'The form is ready to connect to the selected CRM or delivery service before production.'}</p><button type="button" className="button button-outline" onClick={() => setSubmitted(false)}>{lang === 'fr' ? 'Nouvelle demande' : 'New request'}</button></div> : <><div className="form-row"><label>{lang === 'fr' ? 'Prénom' : 'First Name'} *<input required name="firstName" /></label><label>{lang === 'fr' ? 'Nom' : 'Last Name'} *<input required name="lastName" /></label></div><label>{lang === 'fr' ? 'Institution / Entreprise' : 'Institution / Company'} *<input required name="institution" /></label><div className="form-row"><label>{lang === 'fr' ? 'Fonction' : 'Job Title'}<input name="jobTitle" /></label><label>{lang === 'fr' ? 'Pays' : 'Country'} *<input required name="country" /></label></div><label>{lang === 'fr' ? 'Email professionnel' : 'Business Email'} *<input required type="email" name="email" /></label><label>{lang === 'fr' ? 'Domaine d’intérêt' : 'Area of Interest'} *<select required name="interest" defaultValue=""><option value="" disabled>{lang === 'fr' ? 'Sélectionner' : 'Select'}</option>{interests.map(item => <option key={item}>{item}</option>)}</select></label><label>Message *<textarea required name="message" rows={5} /></label><label className="consent"><input type="checkbox" required />{lang === 'fr' ? 'J’accepte que SMI utilise ces informations pour répondre à ma demande.' : 'I agree that SMI may use this information to respond to my request.'}</label><button className="button button-primary" type="submit">{lang === 'fr' ? 'Envoyer la demande' : 'Send Request'} <Arrow /></button></>}</form></section></Layout>
}

function LegalPage({ kind }: { kind: 'privacy' | 'legal' }) { const lang = useLang(); const privacy = kind === 'privacy'; return <Layout><Seo title={`${privacy ? 'Privacy' : 'Legal'} | SMI`} description="SMI corporate information." /><section className="legal-page content"><p className="eyebrow">SMI</p><h1>{privacy ? (lang === 'fr' ? 'Politique de confidentialité' : 'Privacy Policy') : (lang === 'fr' ? 'Mentions légales' : 'Legal Notice')}</h1><p>{lang === 'fr' ? 'Cette page doit être finalisée et validée juridiquement avant la mise en production.' : 'This page must be completed and legally reviewed before production.'}</p></section></Layout> }

function AppRoutes() { return <Routes><Route path="/" element={<Navigate to="/fr" replace />} /><Route path="/:lang" element={<HomePage />} /><Route path="/:lang/solutions/ibansys" element={<ProductPage kind="ibansys" />} /><Route path="/:lang/solutions/swift-plus" element={<ProductPage kind="swift" />} /><Route path="/:lang/banking-transformation" element={<TransformationPage />} /><Route path="/:lang/expertise" element={<ExpertisePage />} /><Route path="/:lang/why-smi" element={<WhyPage />} /><Route path="/:lang/customer-success" element={<CustomerSuccessPage />} /><Route path="/:lang/insights" element={<InsightsPage />} /><Route path="/:lang/insights/:slug" element={<InsightArticlePage />} /><Route path="/:lang/careers" element={<CareersPage />} /><Route path="/:lang/contact" element={<ContactPage />} /><Route path="/:lang/privacy" element={<LegalPage kind="privacy" />} /><Route path="/:lang/legal" element={<LegalPage kind="legal" />} /><Route path="*" element={<Navigate to="/fr" replace />} /></Routes> }

export default function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '')
  return <BrowserRouter basename={basename || undefined}><AppRoutes /></BrowserRouter>
}
