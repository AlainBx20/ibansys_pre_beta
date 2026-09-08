import { CSSProperties, FormEvent, ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
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

function ChevronRight() {
  return <svg className="chevron-right" viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
}

function GlobeIcon() {
  return <svg className="lang-globe" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.7 2.6 4.2 5.7 4.2 9s-1.5 6.4-4.2 9c-2.7-2.6-4.2-5.7-4.2-9S9.3 5.6 12 3Z" /></svg>
}

function MapPinIcon() {
  return <svg className="map-pin-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.4" /></svg>
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
      '.value-print',
      '.values-smi-anchor',
      '.why-principle',
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
  const pathFor = (l: Lang) => location.pathname.replace(/^\/(fr|en)/, `/${l}`)
  const close = () => {
    setMobile(false)
    setSolutionsOpen(false)
    setMobileSolutions(false)
  }
  const homeItem = ['', t.nav.home]
  const nav = [['expertise', t.nav.expertise], ['why-smi', t.nav.why], ['customer-success', t.nav.success], ['insights', t.nav.insights], ['careers', t.nav.careers]]
  const isActive = (path: string) => {
    if (path === '') return location.pathname === `/${lang}` || location.pathname === `/${lang}/`
    return location.pathname.startsWith(`/${lang}/${path}`)
  }

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
          <LocalLink to={homeItem[0]} className={`nav-link${isActive(homeItem[0]) ? ' is-active' : ''}`}>{homeItem[1]}</LocalLink>
          <div className={`nav-solutions${solutionsOpen ? ' is-open' : ''}`} ref={solutionsRef}>
            <button className="nav-link nav-trigger" type="button" aria-expanded={solutionsOpen} aria-controls="desktop-solutions-menu" onClick={() => setSolutionsOpen(open => !open)}><span>{t.nav.solutions}</span><ChevronDown /></button>
            <div className="solutions-menu" id="desktop-solutions-menu" aria-hidden={!solutionsOpen}>
              <LocalLink to="solutions/ibansys" onClick={close}><strong>IBANSYS</strong><span>Trade & International Banking Platform</span></LocalLink>
              <LocalLink to="solutions/swift-plus" onClick={close}><strong>SWIFT+ Messaging Hub</strong><span>Financial Messaging Backbone</span></LocalLink>
              <LocalLink to="banking-transformation" onClick={close}><strong>{lang === 'fr' ? 'Transformation bancaire' : 'Banking Transformation'}</strong><span>Legacy Modernisation & Integration</span></LocalLink>
            </div>
          </div>
          {nav.map(([path, label]) => <LocalLink key={path} to={path} className={`nav-link${isActive(path) ? ' is-active' : ''}`}>{label}</LocalLink>)}
        </nav>
        <div className="header-actions">
          <div className="lang-switch" role="group" aria-label={lang === 'fr' ? 'Changer de langue' : 'Switch language'}>
            <GlobeIcon />
            {(['fr', 'en'] as const).map(option => <Link key={option} to={pathFor(option)} className={`lang-option${lang === option ? ' is-active' : ''}`} aria-current={lang === option ? 'true' : undefined} onClick={() => lang !== option && track('language_selection', { locale: option })}>{option.toUpperCase()}</Link>)}
          </div>
          <LocalLink to="contact" className="button button-ghost header-expert">{t.nav.expert}</LocalLink>
          <LocalLink to="contact?intent=demo" className="button button-primary header-demo">{t.nav.demo}</LocalLink>
          <button className={`menu-button${mobile ? ' is-open' : ''}`} onClick={() => setMobile(!mobile)} aria-expanded={mobile} aria-label="Menu"><span /><span /><span /></button>
        </div>
      </div>
      {mobile && <nav className="mobile-nav" aria-label="Mobile navigation">
        <LocalLink to={homeItem[0]} className={isActive(homeItem[0]) ? 'is-active' : undefined} onClick={close}>{homeItem[1]}</LocalLink>
        <button className="mobile-solutions-trigger" type="button" aria-expanded={mobileSolutions} onClick={() => setMobileSolutions(open => !open)}><span>{t.nav.solutions}</span><ChevronDown /></button>
        {mobileSolutions && <div className="mobile-solutions-panel">
          <LocalLink to="solutions/ibansys" onClick={close}>IBANSYS</LocalLink>
          <LocalLink to="solutions/swift-plus" onClick={close}>SWIFT+ Messaging Hub</LocalLink>
          <LocalLink to="banking-transformation" onClick={close}>{lang === 'fr' ? 'Transformation bancaire' : 'Banking Transformation'}</LocalLink>
        </div>}
        {nav.map(([path, label]) => <LocalLink key={path} to={path} className={isActive(path) ? 'is-active' : undefined} onClick={close}>{label}</LocalLink>)}
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

function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return <><ScrollToTop /><ScrollReveal /><Header /><main key={pathname} className="page-transition">{children}</main><Footer /></>
}

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
  const lang = useLang()
  const branches = [
    'M142 210H275V70H319',
    'M142 210H275V70H725',
    'M142 210H319',
    'M142 210H725',
    'M142 210H275V350H319',
    'M142 210H275V350H725',
  ]
  return <div className="values-journey" aria-label={lang === 'fr' ? 'Réseau des principes SMI' : 'SMI principles network'}>
    <div className="values-journey-head">
      <Logo />
      <span><small>{lang === 'fr' ? 'SYSTÈME D’EXPERTISE SMI' : 'SMI EXPERTISE SYSTEM'}</small><strong>{lang === 'fr' ? 'Six principes. Une même exigence.' : 'Six principles. One standard.'}</strong></span>
      <b>{lang === 'fr' ? 'Depuis 1991' : 'Since 1991'}</b>
    </div>
    <div className="values-network">
      <svg className="values-connectors" viewBox="0 0 1100 420" preserveAspectRatio="none" aria-hidden="true">
        <path className="values-backbone" d="M142 210H275M275 70V350M275 70H319M275 210H319M275 350H319M706 70H725M706 210H725M706 350H725" />
        <path className="values-active-route" d={branches[active]} />
        <path className="values-signal" d={branches[active]} />
      </svg>
      <div className="values-core" aria-live="polite">
        <span className="values-core-ring" aria-hidden="true" />
        <Logo />
        <small>{lang === 'fr' ? 'PRINCIPE ACTIF' : 'ACTIVE PRINCIPLE'}</small>
        <strong>{items[active][0]}</strong>
      </div>
      <div className="values-grid">
        {items.map(([title, body], index) => <button className={`value-node${active === index ? ' is-active' : ''}`} type="button" key={title} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)} aria-pressed={active === index}>
          <span className="value-node-top"><span className="value-number">{String(index + 1).padStart(2, '0')}</span><DiagramIcon type={index} /></span>
          <span className="value-node-copy"><strong>{title}</strong><span className="value-description">{body}</span></span>
          <i aria-hidden="true" />
        </button>)}
      </div>
    </div>
  </div>
}

interface ValueEngagement {
  title: string;
  tagline: string;
  metric: string;
  detail: string;
  tags: string[];
}

function WhyValuesVisual({ items, lang }: { items: ValueEngagement[]; lang: Lang }) {
  const [active, setActive] = useState<number | null>(0);

  const art = [
    <><path d="M65 115 150 65l85 50-85 50zM65 140l85 50 85-50M65 165l85 50 85-50"/><path d="M150 65V30m-16 14 16-14 16 14"/></>,
    <><path d="M150 35 220 65v65c0 50-70 85-70 85s-70-35-70-85V65z"/><path d="m117 120 23 23 46-48"/></>,
    <><path d="M65 195h45v-40h45v-40h45V75h40"/><path d="m211 47 29 28-29 28"/><circle cx="65" cy="195" r="9"/></>,
    <><circle cx="115" cy="105" r="38"/><circle cx="185" cy="105" r="38"/><path d="M60 200v-20c0-38 50-54 90-25 40-29 90-13 90 25v20"/></>,
    <><path d="M70 140c0-90 160-90 160 0M230 110v30h-30M230 115c0 90-160 90-160 0M70 145v-30h30"/><path d="m125 125 25-25 25 25-25 25z"/></>,
    <><path d="M150 85c-25-20-55-25-90-15v115c35-10 65-5 90 15 25-20 55-25 90-15V70c-35-10-65-5-90 15v115"/><path d="M85 100c15 0 25 3 40 10m-40 20c15 0 25 3 40 10m50-30c15-7 25-10 40-10m-40 40c15-7 25-10 40-10"/></>,
  ];

  const branchPaths = [
    "M500 210C440 210 455 72 410 72",   // 0: Expertise (top-left)
    "M500 210H410",                     // 1: Fiabilité (mid-left)
    "M500 210C440 210 455 348 410 348", // 2: Engagement (bottom-left)
    "M500 210C560 210 545 72 590 72",   // 3: Proximité (top-right)
    "M500 210H590",                     // 4: Adaptabilité (mid-right)
    "M500 210C560 210 545 348 590 348", // 5: Transmission (bottom-right)
  ];

  return (
    <div className="values-gallery values-connected" aria-label={lang === 'fr' ? 'Les six engagements de SMI' : 'SMI’s six commitments'}>
      <svg className="values-branches" viewBox="0 0 1000 420" preserveAspectRatio="none" aria-hidden="true">
        {branchPaths.map((d, index) => {
          const isBranchActive = active === index;
          return (
            <g key={index} className={`branch-group ${isBranchActive ? 'is-active' : ''}`}>
              <path d={d} className="branch-line-base" />
              {isBranchActive && <path d={d} className="branch-line-active" />}
            </g>
          );
        })}
      </svg>

      <div
        className={`values-smi-anchor ${active !== null ? 'has-active' : ''}`}
        onClick={() => setActive(null)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(null); } }}
        title={lang === 'fr' ? 'Vue d’ensemble' : 'Overview'}
      >
        <Logo />
        <span className="smi-hub-title">{lang === 'fr' ? 'NOS ENGAGEMENTS' : 'OUR COMMITMENTS'}</span>
        {active !== null && (
          <span className="smi-hub-badge">
            {items[active]?.title}
          </span>
        )}
      </div>

      {items.map((item, index) => {
        const isActive = active === index;
        return (
          <article
            className={`value-print value-print-${index} ${isActive ? 'is-active' : ''}`}
            key={item.title}
            onClick={() => setActive(isActive ? null : index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActive(isActive ? null : index);
              }
            }}
            aria-expanded={isActive}
          >
            <div className="value-card-top">
              <div className="value-card-mark">
                <div className="value-print-art" aria-hidden="true">
                  <svg viewBox="0 0 300 250">
                    <ellipse className="print-shadow" cx="150" cy="222" rx="72" ry="8"/>
                    <g className="print-art-paths">{art[index]}</g>
                  </svg>
                </div>
                <span className="print-index">0{index + 1}</span>
              </div>
              <span className="value-metric-pill">{item.metric}</span>
            </div>

            <div className="value-print-copy">
              <h3>{item.title}</h3>
              <p className="value-tagline">{item.tagline}</p>
              
              <div className="value-drawer">
                <p className="value-detail">{item.detail}</p>
                <div className="value-tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className="value-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function CommitmentJourney({ items }: { items: readonly string[] }) {
  const lang = useLang()
  const [travelStep, setTravelStep] = useState(0)
  const [reachedStep, setReachedStep] = useState<number | null>(0)
  const phases = lang === 'fr' ? ['COMPRENDRE', 'ACCOMPAGNER', 'RESTER', 'ÉVOLUER'] : ['UNDERSTAND', 'SUPPORT', 'STAY', 'EVOLVE']
  const notes = lang === 'fr'
    ? ['Cadrer le besoin autour du métier bancaire.', 'Construire avec une équipe dédiée.', 'Assurer la continuité après le déploiement.', 'Faire progresser la solution sans rupture.']
    : ['Frame the need around banking reality.', 'Build with one dedicated team.', 'Maintain continuity after deployment.', 'Advance the solution without disruption.']

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let current = 0
    let direction = 1
    let timer: number
    const depart = () => {
      setReachedStep(null)
      const next = current + direction
      setTravelStep(next)
      timer = window.setTimeout(() => {
        current = next
        setReachedStep(current)
        if (current === items.length - 1 || current === 0) direction *= -1
        timer = window.setTimeout(depart, 700)
      }, 2800)
    }
    timer = window.setTimeout(depart, 900)
    return () => window.clearTimeout(timer)
  }, [items.length])

  const indicatorPosition = travelStep === items.length - 1
    ? 'calc(100% - 12px)'
    : `${travelStep / (items.length - 1) * 100}%`
  return <div className="commitment-journey" aria-label={lang === 'fr' ? 'Cycle d’accompagnement SMI' : 'SMI partnership lifecycle'}>
    <div className="commitment-head">
      <Logo />
      <span><small>{lang === 'fr' ? 'CYCLE D’ACCOMPAGNEMENT' : 'PARTNERSHIP LIFECYCLE'}</small><strong>{lang === 'fr' ? 'Un engagement continu, du cadrage à l’évolution.' : 'Continuous commitment, from discovery to evolution.'}</strong></span>
      <b>{lang === 'fr' ? 'PARTENARIAT DURABLE' : 'LONG-TERM PARTNERSHIP'}</b>
    </div>
    <div className="commitment-track">
      <div className="commitment-line" aria-hidden="true"><span /><i style={{ left: indicatorPosition }} /></div>
      {items.map((item, index) => <div className="commitment-step" key={item}>
        <span className={`commitment-marker${reachedStep === index ? ' is-reached' : ''}`}><b>{String(index + 1).padStart(2, '0')}</b></span>
        <article className="commitment-node">
          <div className="commitment-icon"><DiagramIcon type={index + 1} /></div>
          <small>{phases[index]}</small>
          <h3>{item}</h3>
          <p>{notes[index]}</p>
          <span className="commitment-corner" aria-hidden="true" />
        </article>
      </div>)}
    </div>
  </div>
}

function CapabilityMatrix({ items }: { items: readonly string[] }) {
  return <div className="capability-map">{items.map((item, index) => <article key={item}>
    <span className="capability-icon-wrap"><DiagramIcon type={index} /></span>
    <h3>{item}</h3>
    <span className="capability-index">{String(index + 1).padStart(2, '0')}</span>
  </article>)}</div>
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
  const stageIcons = [0, 3, 2]
  return <div className="transformation-stories">{stories.map(([title, challenge, approach, outcome], storyIndex) => <article className="transformation-story" key={title}>
    <div className="story-heading"><span>{String(storyIndex + 1).padStart(2, '0')}</span><h3>{title}</h3></div>
    <div className="story-route">{[challenge, approach, outcome].map((text, index) => <div className={`story-stage story-stage-${index + 1}`} key={labels[index]}>
      <div className="story-stage-head">
        <span className="story-stage-icon"><DiagramIcon type={stageIcons[index]} /></span>
        <small>{labels[index]}</small>
        {index < 2 && <span className="story-arrow" aria-hidden="true"><ChevronRight /></span>}
      </div>
      <p>{text}</p>
    </div>)}</div>
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

function ProductCard({ name, subtitle, tags, href }: { name: string; subtitle: string; tags: readonly string[]; href: string }) {
  const lang = useLang()
  const hasPlus = name.endsWith('+')
  const base = hasPlus ? name.slice(0, -1) : name
  return <article className="product-card">
    <div>
      <p className="eyebrow">SMI SOLUTION</p>
      <h3 className="product-name">{base}{hasPlus && <span className="product-name-plus">+</span>}</h3>
      <p>{subtitle}</p>
    </div>
    <div className="tag-list">{tags.map(tag => <span key={tag}>{tag}</span>)}</div>
    <LocalLink to={href} className="text-link">{lang === 'fr' ? `Explorer ${name}` : `Explore ${name}`} <Arrow /></LocalLink>
  </article>
}
function MessageFlow() {
  const lang = useLang()
  const pipelineRef = useRef<HTMLDivElement>(null)
  const ballRef = useRef<HTMLElement>(null)
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [litNode, setLitNode] = useState<number | null>(null)

  useEffect(() => {
    const pipeline = pipelineRef.current
    const ball = ballRef.current
    if (!pipeline || !ball) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let running = false

    // The packet's position is read from the live DOM rather than derived from the
    // animation's timing: the rows are uneven (the focus row is ~50% taller), so any
    // fixed percentage would light the wrong node.
    const track = () => {
      const ballBox = ball.getBoundingClientRect()
      const ballY = ballBox.top + ballBox.height / 2
      let hit: number | null = null
      nodeRefs.current.forEach((el, index) => {
        if (!el) return
        const box = el.getBoundingClientRect()
        if (ballY >= box.top && ballY <= box.bottom) hit = index
      })
      // Returning the previous value makes React bail out, so this only re-renders on
      // an actual change (4x per cycle) rather than every frame.
      setLitNode(prev => (prev === hit ? prev : hit))
      frame = requestAnimationFrame(track)
    }

    const observer = new IntersectionObserver(entries => {
      const visible = entries.some(entry => entry.isIntersecting)
      if (visible && !running) {
        running = true
        frame = requestAnimationFrame(track)
      } else if (!visible && running) {
        running = false
        cancelAnimationFrame(frame)
        setLitNode(null)
      }
    }, { threshold: 0 })
    observer.observe(pipeline)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  const labels = lang === 'fr'
    ? {
        lifecycle: 'Cycle de messagerie', applications: 'Applications bancaires', applicationNote: 'Core Banking • Trade • Paiements', source: 'Sources',
        actions: ['Préparer', 'Contrôler', 'Router', 'Superviser'], orchestration: 'Couche d’orchestration unifiée',
        router: 'Routeur existant', routerNote: 'SAA • STARS • Infrastructure en place', integration: 'Interopérable',
        network: 'Réseau financier', networkNote: 'MT • MX • ISO 20022 • CBPR+', destination: 'Destination'
      }
    : {
        lifecycle: 'Message lifecycle', applications: 'Banking Applications', applicationNote: 'Core Banking • Trade • Payments', source: 'Sources',
        actions: ['Prepare', 'Control', 'Route', 'Monitor'], orchestration: 'Unified orchestration layer',
        router: 'Existing Router', routerNote: 'SAA • STARS • Existing infrastructure', integration: 'Interoperable',
        network: 'Financial Network', networkNote: 'MT • MX • ISO 20022 • CBPR+', destination: 'Destination'
      }

  return <div className="flow-diagram" aria-label={lang === 'fr' ? 'Cycle de vie d’un message financier' : 'Financial message lifecycle'}>
    <div className="flow-diagram-head">
      <span><small>SWIFT+ ARCHITECTURE</small><strong>{labels.lifecycle}</strong></span>
    </div>
    <div className="flow-pipeline" ref={pipelineRef}>
      <span className="flow-spine" aria-hidden="true"><i ref={ballRef} /></span>
      <div className="flow-row">
        <span className={`flow-node${litNode === 0 ? ' is-lit' : ''}`} ref={el => { nodeRefs.current[0] = el }}>01</span>
        <div className="flow-stage">
          <span className="flow-stage-icon"><DiagramIcon type={0} /></span>
          <span className="flow-stage-copy"><strong>{labels.applications}</strong><span>{labels.applicationNote}</span></span>
          <span className="flow-stage-tag">{labels.source}</span>
        </div>
      </div>
      <div className="flow-row flow-row-focus">
        <span className={`flow-node${litNode === 1 ? ' is-lit' : ''}`} ref={el => { nodeRefs.current[1] = el }}>02</span>
        <div className="flow-focus">
          <span className="flow-focus-kicker">SMI • SWIFT+</span>
          <strong>Messaging Hub</strong>
          <small>{labels.orchestration}</small>
          <div className="flow-focus-actions">{labels.actions.map((action, index) => <span key={action}><b>0{index + 1}</b>{action}</span>)}</div>
        </div>
      </div>
      <div className="flow-row">
        <span className={`flow-node${litNode === 2 ? ' is-lit' : ''}`} ref={el => { nodeRefs.current[2] = el }}>03</span>
        <div className="flow-stage">
          <span className="flow-stage-icon"><DiagramIcon type={4} /></span>
          <span className="flow-stage-copy"><strong>{labels.router}</strong><span>{labels.routerNote}</span></span>
          <span className="flow-stage-tag">{labels.integration}</span>
        </div>
      </div>
      <div className="flow-row">
        <span className={`flow-node${litNode === 3 ? ' is-lit' : ''}`} ref={el => { nodeRefs.current[3] = el }}>04</span>
        <div className="flow-stage">
          <span className="flow-stage-icon"><DiagramIcon type={2} /></span>
          <span className="flow-stage-copy"><strong>{labels.network}</strong><span>{labels.networkNote}</span></span>
          <span className="flow-stage-tag">{labels.destination}</span>
        </div>
      </div>
    </div>
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

type CanonicalLine = { key: string; d: string }

function CanonicalDiagram({ lang }: { lang: Lang }) {
  const inputs = [
    { key: 'a', label: 'Application A', icon: 0 },
    { key: 'b', label: 'Application B', icon: 1 },
    { key: 'c', label: 'Application C', icon: 2 },
  ]
  const outputs = [
    { key: 'mt', label: 'SWIFT MT', icon: 3 },
    { key: 'mx', label: 'ISO 20022 / MX', icon: 4 },
    { key: 'other', label: lang === 'fr' ? 'Autres formats' : 'Other Formats', icon: 5 },
  ]

  const containerRef = useRef<HTMLDivElement>(null)
  const coreRef = useRef<HTMLDivElement>(null)
  const inputRefs = useRef<(HTMLDivElement | null)[]>([])
  const outputRefs = useRef<(HTMLDivElement | null)[]>([])
  const [lines, setLines] = useState<CanonicalLine[]>([])
  const [hover, setHover] = useState<string | null>(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    const core = coreRef.current
    if (!container || !core) return

    const measure = () => {
      const containerBox = container.getBoundingClientRect()
      const coreBox = core.getBoundingClientRect()
      if (!containerBox.width || !coreBox.width) return
      const next: CanonicalLine[] = []
      inputRefs.current.forEach((el, index) => {
        if (!el) return
        const box = el.getBoundingClientRect()
        const startX = box.right - containerBox.left
        const startY = box.top + box.height / 2 - containerBox.top
        const endX = coreBox.left - containerBox.left
        const endY = coreBox.top + coreBox.height / 2 - containerBox.top
        const midX = startX + (endX - startX) * 0.55
        next.push({ key: `in-${index}`, d: `M${startX},${startY} C${midX},${startY} ${midX},${endY} ${endX},${endY}` })
      })
      outputRefs.current.forEach((el, index) => {
        if (!el) return
        const box = el.getBoundingClientRect()
        const startX = coreBox.right - containerBox.left
        const startY = coreBox.top + coreBox.height / 2 - containerBox.top
        const endX = box.left - containerBox.left
        const endY = box.top + box.height / 2 - containerBox.top
        const midX = startX + (endX - startX) * 0.45
        next.push({ key: `out-${index}`, d: `M${startX},${startY} C${midX},${startY} ${midX},${endY} ${endX},${endY}` })
      })
      setLines(next)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(container)
    ro.observe(core)
    inputRefs.current.forEach(el => el && ro.observe(el))
    outputRefs.current.forEach(el => el && ro.observe(el))
    window.addEventListener('resize', measure)
    document.fonts?.ready?.then(measure).catch(() => {})
    const settle = window.setTimeout(measure, 320)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
      window.clearTimeout(settle)
    }
  }, [lang])

  return <div className="canonical-chart" ref={containerRef}>
    <svg className="canonical-lines" aria-hidden="true">
      {lines.map(line => <path key={line.key} d={line.d} className={`canonical-line${hover === line.key ? ' is-active' : ''}`} />)}
      {lines.map(line => <path key={`${line.key}-signal`} d={line.d} className={`canonical-line-signal${hover && hover !== line.key ? ' is-dim' : ''}`} />)}
    </svg>
    <div className="canonical-column canonical-inputs">
      {inputs.map((item, index) => <div className={`canonical-node${hover === `in-${index}` ? ' is-hovered' : ''}`} key={item.key} ref={el => { inputRefs.current[index] = el }} onMouseEnter={() => setHover(`in-${index}`)} onMouseLeave={() => setHover(null)}>
        <DiagramIcon type={item.icon} /><span>{item.label}</span>
      </div>)}
    </div>
    <div className="canonical-core" ref={coreRef}>
      <small>SWIFT+</small>
      <strong>{lang === 'fr' ? <>MODÈLE DE<br />DONNÉES PIVOT</> : <>CANONICAL<br />DATA MODEL</>}</strong>
      <span>{lang === 'fr' ? 'Normaliser • Contrôler • Transformer' : 'Normalize • Control • Transform'}</span>
    </div>
    <div className="canonical-column canonical-outputs">
      {outputs.map((item, index) => <div className={`canonical-node${hover === `out-${index}` ? ' is-hovered' : ''}`} key={item.key} ref={el => { outputRefs.current[index] = el }} onMouseEnter={() => setHover(`out-${index}`)} onMouseLeave={() => setHover(null)}>
        <span>{item.label}</span><DiagramIcon type={item.icon} />
      </div>)}
    </div>
  </div>
}

function SwiftArchitecture() { const lang = useLang(); return <section className="architecture section-pad"><div className="content"><SectionHeading eyebrow="CANONICAL DATA MODEL" title={lang === 'fr' ? 'Normaliser une fois. Évoluer en continu.' : 'Normalize once. Evolve continuously.'} body={lang === 'fr' ? 'Le modèle pivot isole les applications des changements de format et simplifie la coexistence MT/MX.' : 'The canonical model isolates applications from format changes and simplifies MT/MX coexistence.'} light /><CanonicalDiagram lang={lang} /><div className="routing-note"><strong>{lang === 'fr' ? 'Préserver la couche de transport. Moderniser la couche de valeur.' : 'Preserve the transport layer. Modernise the value layer.'}</strong><p>SWIFT+ {lang === 'fr' ? 'complète les infrastructures SAA, STARS et routeurs existants ; elle ne les remplace pas.' : 'works alongside SAA, STARS and existing routing infrastructure; it does not replace them.'}</p></div></div></section> }

type RailStub = { key: string; d: string }
type RailJunction = { key: string; x: number; y: number }

function IntegrationDiagram({ lang, systems }: { lang: Lang; systems: { key: string; label: string; icon: number }[] }) {
  const top = systems.slice(0, 3)
  const bottom = systems.slice(3, 6)

  const containerRef = useRef<HTMLDivElement>(null)
  const hubRef = useRef<HTMLDivElement>(null)
  const topRefs = useRef<(HTMLDivElement | null)[]>([])
  const bottomRefs = useRef<(HTMLDivElement | null)[]>([])
  const [stubs, setStubs] = useState<RailStub[]>([])
  const [junctions, setJunctions] = useState<RailJunction[]>([])
  const [rail, setRail] = useState('')
  const [hover, setHover] = useState<string | null>(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    const hub = hubRef.current
    if (!container || !hub) return

    const measure = () => {
      const containerBox = container.getBoundingClientRect()
      const hubBox = hub.getBoundingClientRect()
      if (!containerBox.width || !hubBox.width) return
      const railY = hubBox.top + hubBox.height / 2 - containerBox.top
      const hubCx = hubBox.left + hubBox.width / 2 - containerBox.left

      const nextStubs: RailStub[] = []
      const nextJunctions: RailJunction[] = []
      let minX = hubCx
      let maxX = hubCx

      const collect = (refs: (HTMLDivElement | null)[], side: 'top' | 'bottom') => {
        refs.forEach((el, index) => {
          if (!el) return
          const box = el.getBoundingClientRect()
          const x = box.left + box.width / 2 - containerBox.left
          const y = (side === 'top' ? box.bottom : box.top) - containerBox.top
          const key = `${side}-${index}`
          nextStubs.push({ key, d: `M${x},${y} L${x},${railY}` })
          nextJunctions.push({ key, x, y: railY })
          minX = Math.min(minX, x)
          maxX = Math.max(maxX, x)
        })
      }
      collect(topRefs.current, 'top')
      collect(bottomRefs.current, 'bottom')

      setStubs(nextStubs)
      setJunctions(nextJunctions)
      setRail(`M${minX},${railY} L${maxX},${railY}`)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(container)
    ro.observe(hub)
    topRefs.current.forEach(el => el && ro.observe(el))
    bottomRefs.current.forEach(el => el && ro.observe(el))
    window.addEventListener('resize', measure)
    document.fonts?.ready?.then(measure).catch(() => {})
    const settle = window.setTimeout(measure, 320)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
      window.clearTimeout(settle)
    }
  }, [lang, systems])

  const exchangeLabel = lang === 'fr' ? 'Échange de données' : 'Data exchange'

  return <div className="integration-chart" ref={containerRef}>
    <svg className="integration-lines" aria-hidden="true">
      {rail && <path d={rail} className="integration-rail" />}
      {rail && <path d={rail} className="integration-rail-current" />}
      {stubs.map(s => <path key={s.key} d={s.d} className={`integration-stub${hover === s.key ? ' is-active' : ''}`} />)}
      {junctions.map(j => <circle key={j.key} cx={j.x} cy={j.y} r="3.5" className={`integration-via${hover === j.key ? ' is-active' : ''}`} />)}
      {rail && <circle className="integration-signal signal-a" r="4" style={{ offsetPath: `path('${rail}')` }} />}
    </svg>
    <div className="integration-row integration-row-top">
      {top.map((system, index) => <div className={`integration-node${hover === `top-${index}` ? ' is-hovered' : ''}`} key={system.key} ref={el => { topRefs.current[index] = el }} onMouseEnter={() => setHover(`top-${index}`)} onMouseLeave={() => setHover(null)}>
        <span className="integration-icon-wrap"><DiagramIcon type={system.icon} /></span>
        <b>{system.label}</b>
        <small>{index % 2 === 0 ? 'API / Services' : exchangeLabel}</small>
      </div>)}
    </div>
    <div className="integration-hub-track">
      <div className="integration-hub" ref={hubRef}>
        <small>TRADE &amp; INTERNATIONAL BANKING</small>
        <strong>IBANSYS</strong>
        <span className="hub-tagline">API • Services • Data</span>
      </div>
    </div>
    <div className="integration-row integration-row-bottom">
      {bottom.map((system, index) => <div className={`integration-node${hover === `bottom-${index}` ? ' is-hovered' : ''}`} key={system.key} ref={el => { bottomRefs.current[index] = el }} onMouseEnter={() => setHover(`bottom-${index}`)} onMouseLeave={() => setHover(null)}>
        <span className="integration-icon-wrap"><DiagramIcon type={system.icon} /></span>
        <b>{system.label}</b>
        <small>{(index + 3) % 2 === 0 ? 'API / Services' : exchangeLabel}</small>
      </div>)}
    </div>
  </div>
}

function IbansysIntegration() {
  const lang = useLang()
  const labels = lang === 'fr' ? ['Système bancaire central', 'SWIFT+ Messaging Hub', 'Lutte anti-blanchiment & conformité', 'Systèmes de paiement', 'Gestion documentaire', 'Reporting & BI'] : ['Core Banking', 'SWIFT+ Messaging Hub', 'AML & Compliance', 'Payment Systems', 'Document Management', 'Reporting & BI']
  const systems = labels.map((label, index) => ({ key: `sys-${index}`, label, icon: index }))
  return <section className="architecture section-pad"><div className="content"><SectionHeading eyebrow="INTEGRATION FIRST" title={lang === 'fr' ? 'Intégrer. Ne pas isoler.' : 'Integrate. Don’t isolate.'} body={lang === 'fr' ? 'IBANSYS se connecte au système d’information existant par APIs, services, fichiers et intégrations de données.' : 'IBANSYS connects to the existing information system through APIs, services, files and data integrations.'} light /><IntegrationDiagram lang={lang} systems={systems} /><div className="routing-note"><strong>{lang === 'fr' ? 'Plateforme globale. Conformité locale.' : 'Global platform. Local compliance.'}</strong><p>{lang === 'fr' ? 'Adaptable aux réglementations locales en vigueur et aux exigences propres à chaque marché.' : 'Adaptable to applicable local regulations and market requirements.'}</p></div></div></section>
}
function InfoCard({ title, body }: { title: string; body: string }) { return <article className="info-card"><h3>{title}</h3><p>{body}</p></article> }

function TransformationPage() {
  const lang = useLang(); const stages = lang === 'fr' ? ['Comprendre', 'Évaluer', 'Définir la cible', 'Prioriser', 'Construire & intégrer', 'Migrer & valider', 'Déployer', 'Faire évoluer'] : ['Understand', 'Assess', 'Define the Target', 'Prioritise', 'Build & Integrate', 'Migrate & Validate', 'Deploy', 'Evolve']; const capabilities = lang === 'fr' ? [['Modernisation legacy', 'Préserver les règles métier et faire évoluer la technologie autour.'], ['APIs & intégration', 'Connecter ce qui existe et préparer ce qui vient.'], ['Migration de données', 'Préserver l’intégrité, l’historique et la continuité.'], ['Digitalisation des processus', 'Automatiser les contrôles, workflows et traitements répétitifs.'], ['Architecture moderne', 'Modularité, services et observabilité lorsque cela crée de la valeur.'], ['Contrôle par conception', 'Accès, traçabilité, séparation des rôles et validation métier.']] : [['Legacy Modernisation', 'Preserve business rules and evolve the technology around them.'], ['APIs & Integration', 'Connect what exists and enable what comes next.'], ['Data Migration', 'Preserve integrity, history and continuity.'], ['Process Digitalisation', 'Automate controls, workflows and repetitive processing.'], ['Modern Architecture', 'Modularity, services and observability where they create value.'], ['Control by Design', 'Access, traceability, segregation of duties and business validation.']]
  return <Layout><Seo title="Banking Digital Transformation & Legacy Modernisation | SMI" description="Banking modernisation without disruption." /><PageHero eyebrow="BANKING TRANSFORMATION" title={lang === 'fr' ? 'Moderniser la banque sans fragiliser ce qui fonctionne.' : 'Modernise banking without disrupting what works.'} body={lang === 'fr' ? 'SMI accompagne la modernisation progressive des applications, architectures et processus bancaires en combinant continuité opérationnelle, maîtrise du risque et compréhension métier.' : 'SMI supports progressive modernisation of banking applications, architectures and processes through operational continuity, risk control and business understanding.'} note="Banking Modernisation Without Disruption" /><section className="section-pad content"><SectionHeading eyebrow={lang === 'fr' ? 'CAPACITÉS' : 'CAPABILITIES'} title={lang === 'fr' ? 'Le métier d’abord. La technologie là où elle crée de la valeur.' : 'Business first. Technology where it creates value.'} /><div className="two-up">{capabilities.map(([title, body]) => <InfoCard key={title} title={title} body={body} />)}</div></section><section className="process-section section-pad"><div className="content"><SectionHeading eyebrow={lang === 'fr' ? 'NOTRE APPROCHE' : 'OUR APPROACH'} title={lang === 'fr' ? 'Une destination claire. Un chemin maîtrisé.' : 'A clear destination. A controlled path.'} /><ProcessJourney steps={stages} /></div></section><FinalCta title={lang === 'fr' ? 'Transformons ce qui doit évoluer. Préservons ce qui crée encore de la valeur.' : 'Transform what must evolve. Preserve what still creates value.'} /></Layout>
}

function ExpertisePage() { const lang = useLang(); const expertise = ['Trade Finance & International Banking', 'Payments & Financial Messaging', 'SWIFT & ISO 20022', 'Banking Integration & Interoperability', 'Legacy & Application Modernisation', 'Data & Migration', 'Process Digitalisation & Automation', 'Banking Technology']; return <Layout><Seo title="Banking Expertise | Trade Finance, SWIFT & ISO 20022 | SMI" description="35 years of banking knowledge turned into technology." /><PageHero eyebrow="EXPERTISE" title={lang === 'fr' ? '35 ans à comprendre la banque. Et à transformer cette expertise en solutions.' : '35 Years of Banking Knowledge. Turned into Technology.'} body={lang === 'fr' ? 'Nous comprenons ce que fait la banque. Nous savons comment la technologie peut l’améliorer.' : 'We understand what the bank does. We know how technology can make it better.'} note="Banking expertise + Technology expertise" /><section className="section-pad content"><div className="expertise-list">{expertise.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, '0')}</span><h2>{item}</h2><p>{lang === 'fr' ? 'Expertise métier, architecture, intégration et accompagnement dans la durée.' : 'Business knowledge, architecture, integration and long-term support.'}</p></article>)}</div></section><section className="knowledge-banner"><div><p className="eyebrow">KNOWLEDGE TRANSFER</p><h2>Build Knowledge, Not Dependency.</h2><p>{lang === 'fr' ? 'Formation fonctionnelle, formation technique, documentation et partage continu.' : 'Functional training, technical training, documentation and continuous knowledge sharing.'}</p></div></section><FinalCta title={lang === 'fr' ? 'Un projet. Une équipe dédiée. Plusieurs expertises.' : 'One project. One dedicated team. Multiple areas of expertise.'} /></Layout> }

function WhyPage() {
  const lang = useLang();
  const values: ValueEngagement[] = lang === 'fr' ? [
    {
      title: 'Expertise',
      tagline: 'Comprendre avant d’agir.',
      metric: '30+ ans',
      detail: 'Maîtrise approfondie des flux transactionnels, du Trade Finance et des standards internationaux SWIFT & ISO 20022.',
      tags: ['Trade Finance', 'ISO 20022', 'Normes BCT']
    },
    {
      title: 'Fiabilité',
      tagline: 'Être digne de confiance.',
      metric: '99.9%',
      detail: 'Architectures logicielles haute résilience garantissant une continuité absolue et une sécurité transactionnelle sans compromis.',
      tags: ['Zéro rupture', 'Audit & Sécurité', 'Haute disponibilité']
    },
    {
      title: 'Engagement',
      tagline: 'Aller jusqu’au résultat.',
      metric: '100%',
      detail: 'Mobilisation totale de nos ingénieurs jusqu’à la recette métier, l’interfaçage Core Banking et le Go-Live en production.',
      tags: ['Recette métier', 'Intégration CBS', 'Go-Live']
    },
    {
      title: 'Proximité',
      tagline: 'Rester accessible.',
      metric: 'Direct',
      detail: 'Interlocuteurs experts dédiés, réactivité immédiate et collaboration directe sur le terrain auprès des banques partenaires.',
      tags: ['Support direct', 'Équipes locales', 'Écoute active']
    },
    {
      title: 'Adaptabilité',
      tagline: 'Évoluer avec la banque.',
      metric: 'Sur-mesure',
      detail: 'Nos progiciels s’adaptent au système d’information de chaque banque et absorbent les évolutions réglementaires en continu.',
      tags: ['Interopérabilité', 'Sur-mesure', 'Évolutivité']
    },
    {
      title: 'Transmission',
      tagline: 'Renforcer l’autonomie du partenaire.',
      metric: 'Pérenne',
      detail: 'Transfert structuré de compétences, ateliers fonctionnels et documentation exhaustive pour bâtir une maîtrise durable.',
      tags: ['Formation continue', 'Documentation', 'Autonomie']
    }
  ] : [
    {
      title: 'Expertise',
      tagline: 'Understand before acting.',
      metric: '30+ yrs',
      detail: 'Deep mastery of banking transactional flows, Trade Finance operations and international standards including SWIFT and ISO 20022.',
      tags: ['Trade Finance', 'ISO 20022', 'BCT Standards']
    },
    {
      title: 'Reliability',
      tagline: 'Be worthy of trust.',
      metric: '99.9%',
      detail: 'High-availability software architectures designed for absolute uptime, rigorous auditing and transactional security.',
      tags: ['Zero Downtime', 'Security', 'Resilience']
    },
    {
      title: 'Commitment',
      tagline: 'Go through to the result.',
      metric: '100%',
      detail: 'Full team accountability from functional validation to Core Banking integration and successful production deployment.',
      tags: ['Validation', 'CBS Integration', 'Go-Live']
    },
    {
      title: 'Proximity',
      tagline: 'Stay accessible.',
      metric: 'Direct',
      detail: 'Dedicated local engineering teams providing immediate responsiveness, agile collaboration and continuous hands-on support.',
      tags: ['Direct Support', 'Local Teams', 'Agility']
    },
    {
      title: 'Adaptability',
      tagline: 'Evolve with banking.',
      metric: 'Tailored',
      detail: 'Modular systems engineered to fit each bank’s existing Core Banking infrastructure without disruptive replacements.',
      tags: ['Interoperability', 'Tailored', 'Scalability']
    },
    {
      title: 'Knowledge Sharing',
      tagline: 'Build partner autonomy.',
      metric: 'Enduring',
      detail: 'Structured skill transfer, functional workshops and comprehensive documentation ensuring long-term bank autonomy.',
      tags: ['Training', 'Documentation', 'Autonomy']
    }
  ];
  return <Layout><Seo title="Why SMI | 35 Years of Banking Expertise" description="More than a technology provider. A long-term banking partner." /><PageHero eyebrow="WHY SMI" title={lang === 'fr' ? 'Plus qu’un fournisseur de solutions. Un partenaire bancaire dans la durée.' : 'More Than a Technology Provider. A Long-Term Banking Partner.'} body={lang === 'fr' ? 'Depuis 1991, SMI évolue avec le secteur bancaire et transforme cette expérience accumulée en valeur pour chaque nouveau projet.' : 'Since 1991, SMI has evolved alongside banking and turns that accumulated experience into value for every new project.'} note="Understand. Deliver. Support. Evolve." /><section className="section-pad content why-values-section"><SectionHeading eyebrow={lang === 'fr' ? 'NOS VALEURS' : 'OUR VALUES'} title={lang === 'fr' ? 'Des engagements concrets.' : 'Concrete commitments.'} /><WhyValuesVisual items={values} lang={lang} /></section><section className="architecture section-pad"><div className="content"><SectionHeading eyebrow={lang === 'fr' ? 'NOTRE RESPONSABILITÉ' : 'OUR RESPONSIBILITY'} title={lang === 'fr' ? 'Notre responsabilité ne s’arrête pas au Go-Live.' : 'Our responsibility does not stop at Go-Live.'} body={lang === 'fr' ? 'Évolutions métier, standards, intégrations, amélioration fonctionnelle et accompagnement opérationnel.' : 'Business evolution, standards, integrations, functional improvement and operational support.'} light /><PartnerStrip /></div></section><FinalCta title={lang === 'fr' ? 'Nous adaptons la solution à la banque. Pas la banque à la solution.' : 'We adapt the solution to the bank. Not the bank to the solution.'} /></Layout>;
}

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

const contactAddress = '11 Av. Louis Braille, Tunis, Tunisie'

function ContactMap() {
  const lang = useLang()
  const query = encodeURIComponent(contactAddress)
  return <div className="contact-map" aria-label={lang === 'fr' ? 'Carte : bureaux SMI à Tunis' : 'Map: SMI offices in Tunis'}>
    <iframe title={lang === 'fr' ? 'Localisation SMI' : 'SMI location'} src={`https://www.google.com/maps?q=${query}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
    <a className="contact-map-pin" href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noopener noreferrer">
      <span><MapPinIcon />SMI — {lang === 'fr' ? 'Siège Tunis' : 'Tunis HQ'}</span>
      <small>{contactAddress}</small>
      <em className="text-link">{lang === 'fr' ? 'Itinéraire' : 'Get directions'} <Arrow /></em>
    </a>
  </div>
}

function ContactPage() {
  const lang = useLang()
  const [status, setStatus] = useState<'idle' | 'submitting' | 'activation' | 'success' | 'error'>('idle')
  const interests = ['Trade Finance', 'IBANSYS', 'SWIFT & Financial Messaging', 'ISO 20022', 'SWIFT+ Messaging Hub', 'Banking Integration', 'Digital Transformation', 'Legacy Modernisation', 'Data Migration', 'Process Automation', 'Partnership', 'Other']

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'submitting') return
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    if (data._honey) return
    setStatus('submitting')
    try {
      const response = await fetch('https://formsubmit.co/ajax/chuikaa.a@societelemondeinformatique.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...data,
          _subject: `SMI website — ${data.interest || 'Contact request'}`,
          _template: 'table',
          _replyto: data.email,
          source: window.location.href,
        }),
      })
      if (!response.ok) throw new Error(`Submission failed with ${response.status}`)
      const result = await response.json() as { success?: string | boolean; message?: string }
      if ((result.success === false || result.success === 'false') && result.message?.toLowerCase().includes('activation')) {
        setStatus('activation')
        return
      }
      if (result.success === false || result.success === 'false') throw new Error('Submission was rejected')
      track('form_submission', { form: 'contact', locale: lang })
      form.reset()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return <Layout><Seo title="Talk to an Expert | SMI" description="Discuss your next banking challenge with SMI." /><PageHero eyebrow={lang === 'fr' ? 'PARLONS BANQUE' : 'LET’S TALK BANKING'} title={lang === 'fr' ? 'Parlons de votre prochain enjeu bancaire.' : 'Let’s Discuss What’s Next for Your Bank.'} body={lang === 'fr' ? 'Trade Finance, SWIFT, ISO 20022, modernisation ou intégration : chaque projet commence par la compréhension du contexte.' : 'Trade Finance, SWIFT, ISO 20022, modernisation or integration: every project starts with understanding the context.'} /><section className="section-pad content contact-grid"><div><SectionHeading eyebrow={lang === 'fr' ? 'VOTRE CONTEXTE D’ABORD' : 'YOUR CONTEXT FIRST'} title={lang === 'fr' ? 'Commençons par le besoin.' : 'Start with the challenge.'} body={lang === 'fr' ? 'La bonne discussion, avec la bonne expertise.' : 'The right discussion with the right expertise.'} /><div className="contact-details"><a href="mailto:contact@societelemondeinformatique.com">contact@societelemondeinformatique.com</a><a href="tel:+21653928121">+216 53 928 121</a><p>{contactAddress}</p></div><ContactMap /></div><form className="contact-form" onSubmit={onSubmit}>{status === 'success' ? <div className="form-success" role="status"><strong>{lang === 'fr' ? 'Merci pour votre demande.' : 'Thank you for your request.'}</strong><p>{lang === 'fr' ? 'Votre message a bien été transmis à l’équipe SMI. Nous vous répondrons dans les meilleurs délais.' : 'Your message has been delivered to the SMI team. We will respond as soon as possible.'}</p><button type="button" className="button button-outline" onClick={() => setStatus('idle')}>{lang === 'fr' ? 'Nouvelle demande' : 'New request'}</button></div> : <><div className="form-row"><label>{lang === 'fr' ? 'Prénom' : 'First Name'} *<input required autoComplete="given-name" name="firstName" /></label><label>{lang === 'fr' ? 'Nom' : 'Last Name'} *<input required autoComplete="family-name" name="lastName" /></label></div><label>{lang === 'fr' ? 'Institution / Entreprise' : 'Institution / Company'} *<input required autoComplete="organization" name="institution" /></label><div className="form-row"><label>{lang === 'fr' ? 'Fonction' : 'Job Title'}<input autoComplete="organization-title" name="jobTitle" /></label><label>{lang === 'fr' ? 'Pays' : 'Country'} *<input required autoComplete="country-name" name="country" /></label></div><label>{lang === 'fr' ? 'Email professionnel' : 'Business Email'} *<input required type="email" autoComplete="email" name="email" /></label><label>{lang === 'fr' ? 'Domaine d’intérêt' : 'Area of Interest'} *<select required name="interest" defaultValue=""><option value="" disabled>{lang === 'fr' ? 'Sélectionner' : 'Select'}</option>{interests.map(item => <option key={item}>{item}</option>)}</select></label><label>Message *<textarea required name="message" rows={5} /></label><label className="form-honeypot" aria-hidden="true">Website<input name="_honey" tabIndex={-1} autoComplete="off" /></label><label className="consent"><input type="checkbox" required name="consent" value="accepted" />{lang === 'fr' ? 'J’accepte que SMI utilise ces informations pour répondre à ma demande.' : 'I agree that SMI may use this information to respond to my request.'}</label>{status === 'activation' && <p className="form-activation" role="status">{lang === 'fr' ? 'Un email d’activation a été envoyé à l’adresse de réception SMI. Cliquez sur « Activate Form », puis renvoyez cette demande.' : 'An activation email was sent to the SMI receiving address. Click “Activate Form”, then submit this request again.'}</p>}{status === 'error' && <p className="form-error" role="alert">{lang === 'fr' ? 'L’envoi a échoué. Vérifiez votre connexion et réessayez, ou contactez-nous directement par email.' : 'Your request could not be sent. Check your connection and try again, or contact us directly by email.'}</p>}<button className="button button-primary" type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? (lang === 'fr' ? 'Envoi en cours…' : 'Sending…') : (lang === 'fr' ? 'Envoyer la demande' : 'Send Request')} {status !== 'submitting' && <Arrow />}</button></>}</form></section></Layout>
}

function LegalPage({ kind }: { kind: 'privacy' | 'legal' }) { const lang = useLang(); const privacy = kind === 'privacy'; return <Layout><Seo title={`${privacy ? 'Privacy' : 'Legal'} | SMI`} description="SMI corporate information." /><section className="legal-page content"><p className="eyebrow">SMI</p><h1>{privacy ? (lang === 'fr' ? 'Politique de confidentialité' : 'Privacy Policy') : (lang === 'fr' ? 'Mentions légales' : 'Legal Notice')}</h1><p>{lang === 'fr' ? 'Cette page doit être finalisée et validée juridiquement avant la mise en production.' : 'This page must be completed and legally reviewed before production.'}</p></section></Layout> }

function AppRoutes() { return <Routes><Route path="/" element={<Navigate to="/fr" replace />} /><Route path="/:lang" element={<HomePage />} /><Route path="/:lang/solutions/ibansys" element={<ProductPage kind="ibansys" />} /><Route path="/:lang/solutions/swift-plus" element={<ProductPage kind="swift" />} /><Route path="/:lang/banking-transformation" element={<TransformationPage />} /><Route path="/:lang/expertise" element={<ExpertisePage />} /><Route path="/:lang/why-smi" element={<WhyPage />} /><Route path="/:lang/customer-success" element={<CustomerSuccessPage />} /><Route path="/:lang/insights" element={<InsightsPage />} /><Route path="/:lang/insights/:slug" element={<InsightArticlePage />} /><Route path="/:lang/careers" element={<CareersPage />} /><Route path="/:lang/contact" element={<ContactPage />} /><Route path="/:lang/privacy" element={<LegalPage kind="privacy" />} /><Route path="/:lang/legal" element={<LegalPage kind="legal" />} /><Route path="*" element={<Navigate to="/fr" replace />} /></Routes> }

export default function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '')
  return <BrowserRouter basename={basename || undefined}><AppRoutes /></BrowserRouter>
}
