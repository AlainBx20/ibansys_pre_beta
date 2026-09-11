import { createElement, CSSProperties, FormEvent, KeyboardEvent as ReactKeyboardEvent, ReactNode, useEffect, useRef, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { banks, copy, insights, Lang, products, worlds } from './site-content'

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

function RecruitmentJourney({ lang }: { lang: Lang }) {
  const steps = lang === 'fr'
    ? [['01', 'Candidature'], ['02', 'Échange'], ['03', 'Discussion expertise'], ['04', 'Dernier échange'], ['05', 'Bienvenue chez SMI']]
    : [['01', 'Application'], ['02', 'Conversation'], ['03', 'Expertise discussion'], ['04', 'Final discussion'], ['05', 'Welcome to SMI']]
  return <section className="recruitment-journey section-pad content"><SectionHeading eyebrow={lang === 'fr' ? 'PROCESSUS' : 'PROCESS'} title={lang === 'fr' ? 'Un parcours clair, de la candidature à l’équipe.' : 'A clear path from application to team.'} /><div className="recruitment-track">{steps.map(([number, title]) => <article className="recruitment-step" key={number}><span>{number}</span><h3>{title}</h3></article>)}</div></section>
}

function NotFoundPage() {
  const lang = useLang()
  const copy404 = lang === 'fr'
    ? { eyebrow: 'SMI • RÉSEAU BANCAIRE', title: 'Connexion perdue.', body: 'La page recherchée n’est plus dans notre réseau. Revenez à l’accueil ou reprenez la conversation avec un expert SMI.', status: 'ERR_SMI_404 • PAGE INTROUVABLE', home: 'Retour à l’accueil', expert: 'Parler à un expert', node: 'SIGNAL SMI', motto: 'L’excellence dans chaque connexion. L’innovation dans chaque direction.', footer: 'Système SMI • Connexion sécurisée' }
    : { eyebrow: 'SMI • BANKING NETWORK', title: 'Connection lost.', body: 'The page you are looking for is no longer in our network. Return home or reconnect with an SMI expert.', status: 'ERR_SMI_404 • PAGE_NOT_FOUND', home: 'Return Home', expert: 'Talk to an Expert', node: 'SMI SIGNAL', motto: 'Excellence in every connection. Innovation in every direction.', footer: 'SMI System • Secure connection' }
  return <Layout>
    <Seo title={lang === 'fr' ? 'Page introuvable | SMI' : 'Page Not Found | SMI'} description={lang === 'fr' ? 'La page demandée est introuvable.' : 'The requested page could not be found.'} />
    <section className="not-found-page">
      <div className="not-found-grid" aria-hidden="true" />
      <div className="not-found-orbit not-found-orbit-one" aria-hidden="true" />
      <div className="not-found-orbit not-found-orbit-two" aria-hidden="true" />
      <div className="not-found-content">
        <div className="not-found-copy">
          <p className="eyebrow">{copy404.eyebrow}</p>
          <h1><span className="not-found-code">404</span>{copy404.title}</h1>
          <p className="not-found-body">{copy404.body}</p>
          <div className="not-found-status"><span className="not-found-status-dot" /><span>{copy404.status}</span></div>
          <div className="cta-pair"><LocalLink to="" className="button button-primary">{copy404.home} <Arrow /></LocalLink><LocalLink to="contact" className="button button-outline">{copy404.expert}</LocalLink></div>
        </div>
      </div>
    </section>
  </Layout>
}

function CookiePolicyPage() {
  const lang = useLang()
  return <Layout><Seo title={lang === 'fr' ? 'Politique relative aux cookies | SMI' : 'Cookie Policy | SMI'} description={lang === 'fr' ? 'Informations sur les cookies et services intégrés au site SMI.' : 'Information about cookies and embedded services on the SMI website.'} /><section className="legal-page content"><p className="eyebrow">SMI</p><h1>{lang === 'fr' ? 'Politique relative aux cookies' : 'Cookie Policy'}</h1><p>{lang === 'fr' ? 'Le site SMI n’installe pas directement de cookies non essentiels. Certains services intégrés, comme la carte Google Maps de la page Contact, peuvent toutefois traiter des données selon leurs propres politiques.' : 'The SMI website does not directly set non-essential cookies. Embedded services, such as the Google Maps panel on the Contact page, may process data under their own policies.'}</p><p>{lang === 'fr' ? 'Cette page doit être complétée et validée juridiquement avant la mise en production.' : 'This page must be completed and legally reviewed before production.'}</p></section></Layout>
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

function ExpertiseDomainIcon({ type }: { type: number }) {
  const icons = [
    <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.3 4.4 6.3 4.4 9S15 17.7 12 21c-3-3.3-4.4-6.3-4.4-9S9 6.3 12 3Z" /></>,
    <><path d="M4 8h15m0 0-4-4m4 4-4 4M20 16H5m0 0 4-4m-4 4 4 4" /></>,
    <><path d="M8 20 11 8m5 12L13 8m-3 7h5M12 4v1" /><path d="M7 5.5a7 7 0 0 0 0 9m10-9a7 7 0 0 1 0 9M4.5 4.5a12 12 0 0 0 0 15m15-15a12 12 0 0 1 0 15" /></>,
    <><rect x="9" y="3" width="6" height="5" rx="1" /><rect x="3" y="16" width="6" height="5" rx="1" /><rect x="15" y="16" width="6" height="5" rx="1" /><path d="M12 8v4M6 16v-4h12v4" /></>,
    <><path d="m4 8 8-4 8 4-8 4-8-4Zm0 5 8 4 8-4M4 17l8 4 8-4" /></>,
    <><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" /></>,
    <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /><path d="M10 6.5h4a3 3 0 0 1 3 3V14" /></>,
    <><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9" y="9" width="6" height="6" rx="1" /><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4" /></>,
  ]
  return <svg viewBox="0 0 24 24" overflow="visible" aria-hidden="true">{icons[type % icons.length]}</svg>
}

function ChevronDown() {
  return <svg className="chevron-down" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
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
      '.expertise-chain',
      '.story-grid article',
      '.transformation-stories',
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
  const [scrolled, setScrolled] = useState(false)
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

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 36)
    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })
    return () => window.removeEventListener('scroll', updateHeader)
  }, [])

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
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
    <div className="footer-bottom"><span>© 2026 SMI — Société Le Monde Informatique. {lang === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}</span><div><LocalLink to="privacy">{lang === 'fr' ? 'Confidentialité' : 'Privacy'}</LocalLink><LocalLink to="legal">{lang === 'fr' ? 'Mentions légales' : 'Legal Notice'}</LocalLink><LocalLink to="cookies">{lang === 'fr' ? 'Cookies' : 'Cookies'}</LocalLink><Link to={`/${lang === 'fr' ? 'en' : 'fr'}`}>{lang === 'fr' ? 'EN' : 'FR'}</Link></div></div>
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

interface PrincipleStory {
  title: string
  body: string
  metric: string
  metricLabel: string
}

function PrinciplesParcours({ items, lang }: { items: PrincipleStory[]; lang: Lang }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const targetRef = useRef(0)
  const valueRef = useRef(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const measure = () => {
      const element = wrapRef.current
      if (!element) return 0
      const rect = element.getBoundingClientRect()
      const viewport = window.innerHeight - 68
      const distance = rect.height - viewport
      return distance > 0 ? Math.min(1, Math.max(0, (68 - rect.top) / distance)) : 0
    }
    const animate = () => {
      const difference = targetRef.current - valueRef.current
      const next = Math.abs(difference) < .0003 ? targetRef.current : valueRef.current + difference * .14
      valueRef.current = next
      setProgress(next)
      if (next === targetRef.current) frameRef.current = null
      else frameRef.current = requestAnimationFrame(animate)
    }
    const update = () => {
      targetRef.current = measure()
      if (frameRef.current === null) frameRef.current = requestAnimationFrame(animate)
    }
    valueRef.current = measure()
    targetRef.current = valueRef.current
    setProgress(valueRef.current)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  const position = progress * (items.length - 1)
  const selected = Math.min(items.length - 1, Math.round(position))
  const localProgress = Math.min(1, Math.max(0, position - Math.floor(position)))
  const smooth = (value: number) => value * value * (3 - 2 * value)
  const directions = [-1, 1, -1, 1, 1, -1]

  return <section className="principles-parcours" aria-label={lang === 'fr' ? 'Les six principes SMI' : 'The six SMI principles'}>
    <div className="principles-intro content">
      <p className="eyebrow">{lang === 'fr' ? 'SYSTÈME D’EXPERTISE SMI' : 'SMI EXPERTISE SYSTEM'}</p>
      <h2>{lang === 'fr' ? 'L’expérience bancaire fait la différence.' : 'Banking experience makes the difference.'}</h2>
      <span className="principles-intro-rule" />
      <span className="principles-scroll-hint"><Arrow /><small>{lang === 'fr' ? 'FAITES DÉFILER' : 'SCROLL TO EXPLORE'}</small></span>
    </div>
    <div className="principles-scroll" ref={wrapRef}>
      <div className="principles-stage">
        <span className="principles-progress"><i style={{ transform: `scaleX(${progress})` }} /></span>
        <div className="principles-stage-grid" aria-hidden="true" />
        {items.map((item, index) => {
          const distance = Math.abs(position - index)
          const fade = distance <= .34 ? 0 : smooth(Math.min(1, (distance - .34) / .56))
          const travel = Math.sign(position - index) * smooth(Math.min(1, distance))
          const direction = directions[index]
          return <article
            className={`principle-act${selected === index ? ' is-current' : ''}`}
            key={item.title}
            aria-hidden={distance > .94}
            style={{ opacity: 1 - fade, visibility: distance > .94 ? 'hidden' : 'visible', justifyContent: direction > 0 ? 'flex-end' : 'flex-start', pointerEvents: distance < .5 ? 'auto' : 'none' }}>
            <span className={`principle-ghost ghost-${direction > 0 ? 'left' : 'right'}`} style={{ opacity: .055 * (1 - fade), transform: `translateY(-52%) translateX(${direction * travel * 90}px)` }}>{String(index + 1).padStart(2, '0')}</span>
            <div className={`principle-act-copy align-${direction > 0 ? 'right' : 'left'}`} style={{ transform: `translateX(${direction * -travel * 150}px) scale(${1 - smooth(Math.min(1, distance)) * .04})` }}>
              <span className="principle-kicker"><DiagramIcon type={index} /><b>{lang === 'fr' ? 'PRINCIPE' : 'PRINCIPLE'} {String(index + 1).padStart(2, '0')} / 06</b></span>
              <h3>{item.title}</h3>
              <span className="principle-rule" style={{ transform: `scaleX(${1 - smooth(Math.min(1, distance / .6))})` }} />
              <p>{item.body}</p>
              <span className="principle-metric"><strong>{item.metric}</strong><small>{item.metricLabel}</small></span>
            </div>
          </article>
        })}
        <nav className="principles-stations" aria-label={lang === 'fr' ? 'Progression' : 'Progress'}>
          {items.map((item, index) => <span className={selected === index ? 'is-current' : ''} key={item.title}><small>{String(index + 1).padStart(2, '0')}</small><i /></span>)}
        </nav>
        <span className="principles-counter">{String(selected + 1).padStart(2, '0')} <i>—</i> {String(Math.round(localProgress * 100)).padStart(2, '0')}%</span>
      </div>
    </div>
  </section>
}

interface ValueEngagement {
  title: string;
  tagline: string;
  metric: string;
  detail: string;
  tags: string[];
}

function WhyValuesVisual({ items, lang }: { items: ValueEngagement[]; lang: Lang }) {
  const [active, setActive] = useState<number | null>(null)
  const [rotation, setRotation] = useState(-120)
  const [detailRevealed, setDetailRevealed] = useState(false)
  const stepLock = useRef(false)
  const stepTimer = useRef<number | null>(null)
  const visibleItems = detailRevealed ? items : items.slice(0, 6)
  const angleStep = 360 / visibleItems.length
  const activeItem = active === null ? null : items[active]
  const selectItem = (index: number) => {
    const revealsDetail = index >= 6 && !detailRevealed
    const itemCount = revealsDetail ? items.length : visibleItems.length
    if (revealsDetail) setDetailRevealed(true)
    setRotation(current => {
      const target = -index * (360 / itemCount)
      const delta = ((target - current) % 360 + 540) % 360 - 180
      return current + delta
    })
    setActive(index)
  }
  const step = (direction: number) => {
    if (stepLock.current) return
    stepLock.current = true
    const current = active === null ? (direction > 0 ? -1 : 0) : active
    const count = detailRevealed ? items.length : Math.min(6, items.length)
    const next = direction > 0 && current === count - 1 && !detailRevealed && items.length > count
      ? count
      : (current + direction + count) % count
    selectItem(next)
    if (stepTimer.current) window.clearTimeout(stepTimer.current)
    stepTimer.current = window.setTimeout(() => { stepLock.current = false }, 720)
  }
  useEffect(() => () => { if (stepTimer.current) window.clearTimeout(stepTimer.current) }, [])
  const handleNodeKey = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectItem(index) }
    if (event.key === 'Escape') { event.preventDefault(); setActive(null) }
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); step(1) }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); step(-1) }
  }

  return <div className={`smi-values${active !== null ? ' has-selection' : ''}${detailRevealed ? ' has-detail-value' : ''}`} aria-label={lang === 'fr' ? 'Les engagements de SMI' : 'SMI commitments'}>
    <div className="smi-values-orbit">
      <span className="smi-values-wash" aria-hidden="true" />
      <span className="smi-values-ring smi-values-ring-outer" aria-hidden="true" />
      <span className="smi-values-ring smi-values-ring-inner" aria-hidden="true" />

      <div className="smi-values-rotor" style={{ '--orbit-rotation': `${rotation}deg` } as CSSProperties}>
        {visibleItems.map((item, index) => {
          const isActive = active === index
          const nodeStyle = {
            '--node-angle': `${index * angleStep}deg`,
            '--node-counter-angle': `${-(index * angleStep + rotation)}deg`,
            '--node-delay': `${120 + index * 55}ms`,
          } as CSSProperties
          return <div className={`smi-values-arm${isActive ? ' is-active' : ''}${index === 6 ? ' is-detail-node' : ''}`} style={nodeStyle} key={item.title}>
            <span className="smi-values-beam" aria-hidden="true" />
            <button type="button" className={`smi-values-node${isActive ? ' is-active' : ''}`} onClick={() => selectItem(index)} onKeyDown={event => handleNodeKey(event, index)} aria-pressed={isActive}>
              <span className="smi-values-node-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="smi-values-node-icon"><DiagramIcon type={index} /></span>
              <strong>{item.title}</strong>
              <small>{item.metric}</small>
            </button>
          </div>
        })}
      </div>

      <div className="smi-values-hub-shell">
        <span className="smi-values-halo" aria-hidden="true" />
        <button type="button" className="smi-values-hub" onClick={() => setActive(null)} aria-label={active === null ? 'SMI' : (lang === 'fr' ? 'Revenir à la vue d’ensemble' : 'Return to overview')}>
          <Logo />
          <small>{lang === 'fr' ? 'DEPUIS 1991' : 'SINCE 1991'}</small>
          <i aria-hidden="true" />
          <strong>{lang === 'fr' ? 'L’expertise bancaire au centre.' : 'Banking expertise at the centre.'}</strong>
          <em>{active !== null ? (lang === 'fr' ? '← RETOUR' : '← BACK') : ''}</em>
        </button>
      </div>
    </div>

    {activeItem && <article className="smi-values-detail" key={`${lang}-${active}`} aria-live="polite">
      <button type="button" className="smi-values-next" onClick={() => step(1)} aria-label={lang === 'fr' ? 'Engagement suivant' : 'Next commitment'}>
        <span aria-hidden="true"><Arrow /></span>
      </button>
      <span className="smi-values-detail-index">{String((active ?? 0) + 1).padStart(2, '0')}</span>
      <span className="smi-values-detail-rule" aria-hidden="true" />
      <small>{lang === 'fr' ? 'ENGAGEMENT ACTIF' : 'ACTIVE COMMITMENT'}</small>
      <h3>{activeItem.title}</h3>
      <p className="smi-values-detail-tagline">{activeItem.tagline}</p>
      <span className="smi-values-detail-rule" aria-hidden="true" />
      <p className="smi-values-detail-copy">{activeItem.detail}</p>
      <div className="smi-values-tags">{activeItem.tags.map((tag, index) => <span style={{ '--chip-delay': `${420 + index * 70}ms` } as CSSProperties} key={tag}>{tag}</span>)}</div>
      <nav className="smi-values-progress" aria-label={lang === 'fr' ? 'Choisir un engagement' : 'Choose a commitment'}>
        {visibleItems.map((item, index) => <button type="button" className={active === index ? 'is-active' : ''} aria-label={item.title} onClick={() => selectItem(index)} key={item.title} />)}
      </nav>
    </article>}
  </div>
}

function CommitmentJourney({ items }: { items: readonly string[] }) {
  const lang = useLang()
  const [travelStep, setTravelStep] = useState(0)
  const [reachedStep, setReachedStep] = useState<number | null>(0)
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  const isHoveringRef = useRef(false)
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
      if (isHoveringRef.current) {
        timer = window.setTimeout(depart, 100)
        return
      }
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

  const activeStep = hoveredStep ?? travelStep
  const activeReachedStep = hoveredStep ?? reachedStep
  const indicatorPosition = activeStep === items.length - 1
    ? 'calc(100% - 12px)'
    : `${activeStep / (items.length - 1) * 100}%`
  return <div className={`commitment-journey${hoveredStep !== null ? ' is-hovering' : ''}`} aria-label={lang === 'fr' ? 'Cycle d’accompagnement SMI' : 'SMI partnership lifecycle'}>
    <div className="commitment-head">
      <Logo />
      <span><small>{lang === 'fr' ? 'CYCLE D’ACCOMPAGNEMENT' : 'PARTNERSHIP LIFECYCLE'}</small><strong>{lang === 'fr' ? 'Un engagement continu, du cadrage à l’évolution.' : 'Continuous commitment, from discovery to evolution.'}</strong></span>
      <b>{lang === 'fr' ? 'PARTENARIAT DURABLE' : 'LONG-TERM PARTNERSHIP'}</b>
    </div>
    <div className="commitment-track">
      <div className="commitment-line" aria-hidden="true"><span /><i style={{ left: indicatorPosition }} /></div>
      {items.map((item, index) => <div className={`commitment-step${hoveredStep === index ? ' is-hovered' : ''}`} key={item} onMouseEnter={() => { isHoveringRef.current = true; setHoveredStep(index); setTravelStep(index); setReachedStep(index) }} onMouseLeave={() => { isHoveringRef.current = false; setHoveredStep(null) }}>
        <span className={`commitment-marker${activeReachedStep === index ? ' is-reached' : ''}`}><b>{String(index + 1).padStart(2, '0')}</b></span>
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
  const lang = useLang()
  const isCareers = items[0] === 'Ingénierie logicielle' || items[0] === 'Software Engineering'
  return <><div className="capability-map">{items.map((item, index) => <article key={item}>
    <span className="capability-icon-wrap"><DiagramIcon type={index} /></span>
    <h3>{item}</h3>
    <span className="capability-index">{String(index + 1).padStart(2, '0')}</span>
  </article>)}</div>{isCareers && <RecruitmentJourney lang={lang} />}</>
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

const STAGE_ICONS = [0, 3, 2]

function wheelPoint(radius: number, angle: number) {
  const radians = angle * Math.PI / 180
  return [500 + radius * Math.cos(radians), 500 + radius * Math.sin(radians)]
}

function wheelSector(inner: number, outer: number, start: number, end: number) {
  const [x1, y1] = wheelPoint(outer, start)
  const [x2, y2] = wheelPoint(outer, end)
  const [x3, y3] = wheelPoint(inner, end)
  const [x4, y4] = wheelPoint(inner, start)
  return `M${x1},${y1} A${outer},${outer} 0 0 1 ${x2},${y2} L${x3},${y3} A${inner},${inner} 0 0 0 ${x4},${y4} Z`
}

function wheelTextTransform(radius: number, angle: number) {
  const [x, y] = wheelPoint(radius, angle)
  let rotation = angle + 90
  if (rotation > 90) rotation -= 180
  if (rotation < -90) rotation += 180
  return `translate(${x} ${y}) rotate(${rotation})`
}

function wheelSegmentTextTransform(radius: number, angle: number) {
  const [x, y] = wheelPoint(radius, angle)
  const edgeSegment = Math.abs(Math.sin(angle * Math.PI / 180)) < .18
  if (!edgeSegment) return wheelTextTransform(radius, angle)
  let rotation = angle
  if (rotation > 90) rotation -= 180
  if (rotation < -90) rotation += 180
  return `translate(${x} ${y}) rotate(${rotation})`
}

function TransformationStories({ stories, lang }: { stories: string[][]; lang: Lang }) {
  const [selected, setSelected] = useState<number | null>(null)
  const labels = lang === 'fr' ? ['Défi', 'Approche SMI', 'Résultat'] : ['Challenge', 'SMI approach', 'Outcome']
  const wheelLabels = lang === 'fr'
    ? [
      [['Messages', '& données'], ['Interfaces'], ['Contrôles']],
      [['Plateforme', 'intégrée'], ['Workflows'], ['Connexion', 'Core Banking']],
      [['Évaluation'], ['Récupération', 'règles métier'], ['Migration', 'contrôlée']],
    ]
    : [
      [['Messages', '& data'], ['Interfaces'], ['Controls']],
      [['Integrated', 'platform'], ['Workflows'], ['Core Banking', 'connectivity']],
      [['Assessment'], ['Business-rule', 'recovery'], ['Controlled', 'migration']],
    ]
  const shortTitles = lang === 'fr'
    ? [['ISO 20022', 'TRANSFORMATION'], ['TRADE FINANCE', 'DIGITALISATION'], ['MODERNISATION', 'LEGACY']]
    : [['ISO 20022', 'TRANSFORMATION'], ['TRADE FINANCE', 'DIGITALISATION'], ['LEGACY', 'MODERNISATION']]
  const centers = [-90, 30, 150]
  const current = selected === null ? null : stories[selected]

  const selectStory = (index: number) => setSelected(index)

  return <div className={`expertise-wheel${selected !== null ? ' has-selection' : ''}`}>
    <div className="expertise-wheel-visual">
      <svg viewBox="0 0 1000 1000" role="group" aria-label={lang === 'fr' ? 'Trois transformations conduites par SMI' : 'Three transformations delivered by SMI'}>
        <circle className="expertise-wheel-backdrop" cx="500" cy="500" r="486" />
        {stories.map((story, index) => {
          const center = centers[index]
          const active = selected === index
          return <g className={`expertise-wheel-family expertise-wheel-family-${index + 1}${active ? ' is-active' : ''}`} key={story[0]} role="button" tabIndex={0} aria-pressed={active} aria-label={story[0]}
            onClick={() => selectStory(index)}
            onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectStory(index) } }}>
            <path className="expertise-wheel-outer" d={wheelSector(348, 470, center - 52, center + 52)} />
            <text className="expertise-wheel-title" transform={wheelTextTransform(411, center)}>
              <tspan x="0" y="-16">{shortTitles[index][0]}</tspan><tspan x="0" y="18">{shortTitles[index][1]}</tspan>
            </text>
            {wheelLabels[index].map((lines, segment) => {
              const angle = center + (segment - 1) * 33
              return <g className="expertise-wheel-segment" key={lines.join('-')}>
                <path d={wheelSector(176, 330, angle - 15, angle + 15)} />
                <text transform={wheelSegmentTextTransform(253, angle)}>
                  {lines.map((line, lineIndex) => <tspan key={line} x="0" y={(lineIndex - (lines.length - 1) / 2) * 24}>{line}</tspan>)}
                </text>
              </g>
            })}
          </g>
        })}
        <g className="expertise-wheel-hub-control" role="button" tabIndex={0} aria-label={lang === 'fr' ? 'Revenir à la vue d’ensemble' : 'Return to overview'} onClick={() => setSelected(null)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelected(null) } }}>
          <circle className="expertise-wheel-hub-ring" cx="500" cy="500" r="152" />
          <circle className="expertise-wheel-hub" cx="500" cy="500" r="132" />
          <image className="expertise-wheel-smi-logo" href={assetPath('/logo.png')} x="422" y="452" width="156" height="72" preserveAspectRatio="xMidYMid meet" aria-label="SMI" />
          <text className="expertise-wheel-caption" x="500" y="530">EXPERTISE</text>
        </g>
      </svg>
    </div>

    {current && <article className="expertise-wheel-detail" key={`${lang}-${selected}`}>
      <div className="expertise-detail-heading"><span>{String((selected ?? 0) + 1).padStart(2, '0')}</span><h3>{current[0]}</h3></div>
      <div className="expertise-detail-route">
        <span className="expertise-detail-rail" aria-hidden="true" />
        {current.slice(1).map((text, stage) => <div className={`expertise-detail-stage stage-${stage + 1}`} key={labels[stage]}>
          <span className="expertise-detail-marker"><DiagramIcon type={STAGE_ICONS[stage]} /></span>
          <small>{labels[stage]}</small>
          <p>{text}</p>
        </div>)}
      </div>
    </article>}
  </div>
}

function HomeHeroV3({ lang }: { lang: Lang }) {
  const [flipped, setFlipped] = useState(false)
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const flip = () => setFlipped(value => !value)
  useEffect(() => {
    if (reduceMotion) return
    const timer = window.setTimeout(flip, 12000)
    return () => window.clearTimeout(timer)
  }, [flipped, reduceMotion])

  const lines = lang === 'fr'
    ? ["L’expertise", 'bancaire au', 'service de la', 'transformation.']
    : ['Banking expertise.', 'Technology that', 'moves finance', 'forward.']
  const stats = lang === 'fr'
    ? ["35 ans d’expertise bancaire", 'Partenariats durables', 'Équipes dédiées', 'Accompagnement personnalisé']
    : ['35 years of banking expertise', 'Long-term partnerships', 'Dedicated teams', 'Personalised support']
  const nodes = [
    { x: 260, y: 290, r: 40 }, { x: 118, y: 138, r: 44 }, { x: 408, y: 176, r: 34 },
    { x: 404, y: 424, r: 27 }, { x: 140, y: 432, r: 76 },
  ]

  return <section className={`home-v3${flipped ? ' is-flipped' : ''}`}>
    <span className="home-v3-wedge home-v3-wedge-left" aria-hidden="true" />
    <span className="home-v3-wedge home-v3-wedge-right" aria-hidden="true" />
    <span className="home-v3-grid" aria-hidden="true" />
    <div className="home-v3-stage">
      <div className="home-v3-copy">
        <div>
          <p className="home-v3-eyebrow">{lang === 'fr' ? 'TECHNOLOGIE BANCAIRE · TRADE FINANCE · MESSAGERIE FINANCIÈRE' : 'BANKING TECHNOLOGY · TRADE FINANCE · FINANCIAL MESSAGING'}</p>
          <h1>{lines.map((line, index) => <span key={line}><b className={index === lines.length - 1 ? 'home-v3-title-accent' : undefined} style={{ '--hero-line-delay': `${140 + index * 110}ms` } as CSSProperties}>{line}</b></span>)}</h1>
          <i className="home-v3-rule" aria-hidden="true" />
          <p className="home-v3-body">{lang === 'fr' ? <>Depuis 1991, <strong>SMI</strong> conçoit et déploie des solutions technologiques dédiées aux banques et institutions financières. Du <strong>Trade Finance</strong> à la messagerie <strong>SWIFT et ISO 20022</strong>, nous accompagnons les transformations critiques avec expertise métier, maîtrise technologique et proximité.</> : <>Since 1991, <strong>SMI</strong> has designed and delivered technology solutions for banks and financial institutions. From <strong>Trade Finance</strong> to <strong>SWIFT and ISO 20022</strong> messaging, we support critical transformations through business expertise, technology mastery and close collaboration.</>}</p>
          <div className="home-v3-actions"><LocalLink to="solutions/ibansys" className="button button-primary">{lang === 'fr' ? 'Découvrir nos solutions' : 'Discover our solutions'} <Arrow /></LocalLink><LocalLink to="contact" className="button button-outline">{lang === 'fr' ? 'Parler à un expert' : 'Talk to an expert'}</LocalLink></div>
        </div>
      </div>
      <button type="button" className="home-v3-mark" onClick={flip} aria-label={flipped ? (lang === 'fr' ? 'Afficher Excellence' : 'Show Excellence') : (lang === 'fr' ? 'Afficher Innovation' : 'Show Innovation')}>
        <svg className="home-v3-symbol" viewBox="0 0 520 520" aria-hidden="true">
          <g className="home-v3-skeleton">
            {nodes.slice(1).map(node => <line key={`skeleton-line-${node.x}-${node.y}`} x1="260" y1="290" x2={node.x} y2={node.y} />)}
            {nodes.map(node => <circle key={`skeleton-node-${node.x}-${node.y}`} cx={node.x} cy={node.y} r={node.r} />)}
          </g>
          <g className="home-v3-arms">{nodes.slice(1).map((node, index) => <line key={`${node.x}-${node.y}`} x1="260" y1="290" x2={node.x} y2={node.y} style={{ '--hero-node-delay': `${620 + index * 190}ms` } as CSSProperties} />)}</g>
          <g className="home-v3-nodes">{nodes.map((node, index) => <circle key={`${node.x}-${node.y}`} cx={node.x} cy={node.y} r={node.r} style={{ '--hero-node-delay': `${index ? 760 + index * 190 : 480}ms` } as CSSProperties} />)}</g>
          <g className="home-v3-pings">{nodes.map((node, index) => <circle key={`${node.x}-${node.y}`} cx={node.x} cy={node.y} r={node.r} style={{ '--hero-ping-delay': `${2900 + index * 680}ms` } as CSSProperties} />)}</g>
        </svg>
        <span className="home-v3-word"><b className="home-v3-excellence">EXCELLENCE</b><b className="home-v3-innovation">INNOVATION</b></span>
        <span className="home-v3-signature"><Logo /><i /><small>{lang === 'fr' ? 'DEPUIS 1991' : 'SINCE 1991'}</small></span>
        <span className="home-v3-toggle" aria-hidden="true"><i /><i /></span>
      </button>
    </div>
    <div className="home-v3-stats">{stats.map((stat, index) => <span key={stat} style={{ '--hero-stat-delay': `${900 + index * 90}ms` } as CSSProperties}>{stat}</span>)}</div>
  </section>
}

function HomePage() {
  const lang = useLang(); const t = copy[lang]
  const reasons: PrincipleStory[] = lang === 'fr' ? [
    { title: '35 ans', body: 'Une expertise bancaire développée depuis 1991.', metric: '1991', metricLabel: 'PREMIÈRE MISSION' },
    { title: 'ADN bancaire', body: 'Le métier guide chaque choix technologique.', metric: 'MÉTIER', metricLabel: 'POINT DE DÉPART' },
    { title: 'Partenariats durables', body: 'Une relation qui continue après la mise en production.', metric: 'LONG TERME', metricLabel: 'HORIZON' },
    { title: 'Support personnalisé', body: 'Une réponse adaptée à chaque banque.', metric: 'DÉDIÉ', metricLabel: 'MODE DE RÉPONSE' },
    { title: 'Équipes dédiées', body: 'Des profils métier et techniques réunis.', metric: 'MIXTES', metricLabel: 'PROFILS RÉUNIS' },
    { title: 'Capacité à délivrer', body: 'Des transitions critiques conduites dans des délais exigeants.', metric: 'TENUS', metricLabel: 'DÉLAIS' },
  ] : [
    { title: '35 years', body: 'Banking expertise developed since 1991.', metric: '1991', metricLabel: 'FIRST ENGAGEMENT' },
    { title: 'Banking DNA', body: 'Business reality guides every technology choice.', metric: 'BUSINESS', metricLabel: 'STARTING POINT' },
    { title: 'Long-term partnerships', body: 'A relationship that continues after go-live.', metric: 'LONG TERM', metricLabel: 'HORIZON' },
    { title: 'Personalised support', body: 'An approach adapted to each bank.', metric: 'DEDICATED', metricLabel: 'RESPONSE MODEL' },
    { title: 'Dedicated teams', body: 'Business and technical profiles working together.', metric: 'BLENDED', metricLabel: 'PROFILES UNITED' },
    { title: 'Proven delivery', body: 'Critical transitions delivered to demanding timelines.', metric: 'KEPT', metricLabel: 'DEADLINES' },
  ]
  const roles = lang === 'fr' ? ['Experts Trade Finance', 'Spécialistes SWIFT & ISO 20022', 'Business Analysts', 'Architectes solutions', 'Ingénieurs logiciels', 'Équipes projet & delivery'] : ['Trade Finance Experts', 'SWIFT & ISO 20022 Specialists', 'Business Analysts', 'Solution Architects', 'Software Engineers', 'Project & Delivery Teams']
  const commitments = lang === 'fr' ? ['Comprendre avant de construire', 'Accompagner de façon personnalisée', 'Être présent dans la durée', 'Faire évoluer sans fragiliser'] : ['Understand before building', 'Support each bank personally', 'Stay for the long term', 'Evolve without disruption']
  return <Layout>
    <Seo title="SMI | Banking Technology, Trade Finance & Financial Messaging" description={t.home.body} />
    <HomeHeroV3 lang={lang} />
    <section className="partner-intro section-pad"><div className="content"><SectionHeading eyebrow={lang === 'fr' ? 'CONFIANCE' : 'TRUST'} title={lang === 'fr' ? 'Une expertise construite dans la durée.' : 'Expertise built over time.'} body={lang === 'fr' ? 'Des partenariats bancaires de longue date. Un accompagnement personnalisé. Des équipes dédiées.' : 'Long-standing banking partnerships. Personalised support. Dedicated teams.'} /><p className="strip-label">{lang === 'fr' ? 'PARTENAIRES BANCAIRES' : 'BANKING PARTNERS'}</p></div><PartnerStrip /><div className="content"><p className="strip-label strip-label-secondary">{lang === 'fr' ? 'PARTENAIRES TECHNOLOGIQUES' : 'TECHNOLOGY PARTNERS'}</p></div><PartnerStrip technology /></section>
    <section className="section-pad content"><SectionHeading eyebrow={lang === 'fr' ? 'NOS DOMAINES' : 'OUR DOMAINS'} title={t.home.worldsTitle} /><div className="world-grid">{worlds[lang].map((world, index) => <article className="world-card" key={world.id}><span className="card-number">0{index + 1}</span><p className="eyebrow">{world.label}</p><h3>{world.title}</h3><p>{world.text}</p><div className="tag-list">{world.tags.map(tag => <span key={tag}>{tag}</span>)}</div><LocalLink to={world.href} className="text-link">{t.common.explore} <Arrow /></LocalLink></article>)}</div></section>
    <section className="solutions-showcase section-pad"><div className="content"><SectionHeading eyebrow={lang === 'fr' ? 'SOLUTIONS PHARES' : 'FLAGSHIP SOLUTIONS'} title={t.home.solutionsTitle} light /><div className="product-grid"><ProductCard product={products[lang].ibansys} href="solutions/ibansys" /><ProductCard product={products[lang].swift} href="solutions/swift-plus" /></div></div></section>
    <section className="iso-section section-pad"><div className="content iso-grid"><div><p className="eyebrow">SWIFT • ISO 20022 • CBPR+</p><h2>{t.home.isoTitle}</h2><p>{t.home.isoBody}</p><LocalLink to="solutions/swift-plus" className="text-link text-link-light">{lang === 'fr' ? 'Explorer SWIFT+ Messaging Hub' : 'Explore SWIFT+ Messaging Hub'} <Arrow /></LocalLink></div><MessageFlow /></div></section>
    <PrinciplesParcours items={reasons} lang={lang} />
    <section className="people section-pad"><div className="content people-grid"><SectionHeading eyebrow={lang === 'fr' ? 'NOS ÉQUIPES' : 'OUR PEOPLE'} title={t.home.peopleTitle} body={lang === 'fr' ? 'L’expertise bancaire se construit avec le temps, la transmission et des équipes pluridisciplinaires.' : 'Banking expertise grows through time, knowledge sharing and multidisciplinary teams.'} /><div className="role-list">{roles.map(role => <div key={role}><span /><p>{role}</p></div>)}</div></div></section>
    <section className="section-pad content commitments"><SectionHeading eyebrow={lang === 'fr' ? 'NOS ENGAGEMENTS' : 'OUR COMMITMENTS'} title={t.home.commitmentsTitle} /><CommitmentJourney items={commitments} /></section>
    <section className="section-pad content"><SectionHeading eyebrow="INSIGHTS" title={lang === 'fr' ? 'Comprendre ce qui transforme la banque.' : 'Understand what is transforming banking.'} /><div className="insight-grid">{insights[lang].map(item => <InsightCard key={item.title} {...item} />)}</div><LocalLink to="insights" className="button button-outline section-action">{t.common.all}</LocalLink></section>
    <FinalCta title={t.home.finalTitle} />
  </Layout>
}

function ProductCard({ product, href }: { product: typeof products.fr.ibansys | typeof products.fr.swift | typeof products.en.ibansys | typeof products.en.swift; href: string }) {
  const lang = useLang()
  const hasPlus = product.title.includes('+')
  const base = hasPlus ? product.title.replace('+', '') : product.title
  return <article className="product-card">
    <div>
      <p className="eyebrow">{lang === 'fr' ? 'SOLUTION SMI' : 'SMI SOLUTION'}</p>
      <h3 className={`product-name${product.title.startsWith('SWIFT Messaging') ? ' product-name-swift' : ''}`}>{base}{hasPlus && <span className="product-name-plus">+</span>}</h3>
      <p>{product.subtitle}</p>
    </div>
    <div className="tag-list">{product.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
    <LocalLink to={href} className="text-link">{lang === 'fr' ? `Explorer ${product.title}` : `Explore ${product.title}`} <Arrow /></LocalLink>
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

/*
function ProductPage({ kind }: { kind: 'ibansys' | 'swift' }) {
  const lang = useLang(); const data = products[lang][kind]; const isSwift = kind === 'swift'
  const visionTitle = isSwift ? (lang === 'fr' ? 'Le point de référence de votre messagerie financière.' : 'The reference point for financial messaging.') : (lang === 'fr' ? 'Une vision unifiée du Trade et de la banque internationale.' : 'A unified view of Trade and international banking.')
  const lifecycleTitle = isSwift ? (lang === 'fr' ? 'Chaque message. Chaque étape. Un seul cycle de vie.' : 'Every message. Every stage. One lifecycle.') : (lang === 'fr' ? 'De l’initiation au règlement. Entièrement traçable.' : 'From initiation to settlement. Fully traceable.')
  const seoSuffix = isSwift ? 'ISO 20022 & Financial Messaging' : 'Trade Finance & International Banking Platform'
  return <Layout><Seo title={`${data.title} | ${seoSuffix}`} description={data.body} /><PageHero eyebrow={data.eyebrow} title={data.hero} body={data.body} label={data.title} note={lang === 'fr' ? '35 ans d’expertise bancaire au service de la technologie.' : 'Built on 35 years of banking expertise.'} /><section className="section-pad content"><SectionHeading eyebrow={lang === 'fr' ? 'VISION UNIFIÉE' : 'UNIFIED VISION'} title={visionTitle} /><CapabilityMatrix items={data.capabilities} /></section><section className="process-section section-pad"><div className="content"><SectionHeading eyebrow={lang === 'fr' ? 'DE BOUT EN BOUT' : 'END TO END'} title={lifecycleTitle} /><ProcessJourney steps={data.flow} /></div></section>{isSwift ? <SwiftArchitecture /> : <IbansysIntegration />}<section className="section-pad content"><SectionHeading eyebrow={lang === 'fr' ? 'POURQUOI SMI' : 'WHY SMI'} title={lang === 'fr' ? 'Une expertise métier au cœur de la solution.' : 'Banking expertise at the heart of the solution.'} /><div className="three-up"><InfoCard title={lang === 'fr' ? '35 ans' : '35 Years'} body={lang === 'fr' ? 'Une connaissance bancaire développée depuis 1991.' : 'Banking knowledge developed since 1991.'} /><InfoCard title={lang === 'fr' ? 'Équipe dédiée' : 'Dedicated Team'} body={lang === 'fr' ? 'Des profils fonctionnels et techniques tout au long du projet.' : 'Functional and technical specialists throughout the project.' [truncated]

*/
/*
function ProductPage({ kind }: { kind: 'ibansys' | 'swift' }) {
  const lang = useLang(); const data = productData[kind]; const isSwift = kind === 'swift'; const hero = lang === 'fr' ? data.heroFr : data.heroEn; const body = lang === 'fr' ? data.bodyFr : data.bodyEn
  const capabilities = lang === 'fr' ? (isSwift ? ['Génération de messages', 'Normalisation', 'Transformation', 'Validation', 'Routage fonctionnel', 'Supervision & investigation', 'Archivage'] : ['Crédits documentaires', 'Remises documentaires', 'Garanties internationales', 'Paiements internationaux', 'Financement du commerce', 'Banque correspondante']) : data.capabilities
  const flow = lang === 'fr' ? (isSwift ? ['Créer', 'Normaliser', 'Transformer', 'Valider', 'Router', 'Envoyer / Recevoir', 'Superviser', 'Investiguer', 'Archiver'] : ['Initiation', 'Contrôles métier', 'Circuit d’approbation', 'Contrôles de conformité', 'Messagerie financière', 'Règlement', 'Supervision']) : data.flow
  return <Layout><Seo title={`${data.title} | ${isSwift ? 'ISO 20022 & Financial Messaging' : 'Trade Finance & International Banking Platform'}`} description={body} /><PageHero eyebrow={data.eyebrow} title={hero} body={body} label={data.title} note={lang === 'fr' ? '35 ans d’expertise bancaire au service de la technologie.' : 'Built on 35 years of banking expertise.'} /><section className="section-pad content"><SectionHeading eyebrow={lang === 'fr' ? 'VISION UNIFIÉE' : 'UNIFIED VISION'} title={isSwift ? (lang === 'fr' ? 'Le point de référence de votre messagerie financière.' : 'The reference point for financial messaging.') : (lang === 'fr' ? 'Une vision unifiée du Trade et de la banque internationale.' : 'A unified view of Trade and international banking.')} /><CapabilityMatrix items={capabilities} /></section><section className="process-section section-pad"><div className="content"><SectionHeading eyebrow={lang === 'fr' ? 'DE BOUT EN BOUT' : 'END TO END'} title={isSwift ? (lang === 'fr' ? 'Chaque message. Chaque étape. Un seul cycle de vie.' : 'Every message. Every stage. One lifecycle.') : (lang === 'fr' ? 'De l’initiation au règlement. Entièrement traçable.' : 'From initiation to settlement. Fully traceable.')} /><ProcessJourney steps={flow} /></div></section>{isSwift ? <SwiftArchitecture /> : <IbansysIntegration />}<section className="section-pad content"><SectionHeading eyebrow={lang === 'fr' ? 'POURQUOI SMI' : 'WHY SMI'} title={lang === 'fr' ? 'Une expertise métier au cœur de la solution.' : 'Banking expertise at the heart of the solution.'} /><div className="three-up"><InfoCard title={lang === 'fr' ? '35 ans' : '35 Years'} body={lang === 'fr' ? 'Une connaissance bancaire développée depuis 1991.' : 'Banking knowledge developed since 1991.'} /><InfoCard title={lang === 'fr' ? 'Équipe dédiée' : 'Dedicated Team'} body={lang === 'fr' ? 'Des profils fonctionnels et techniques tout au long du projet.' : 'Functional and technical specialists throughout the project.'} /><InfoCard title={lang === 'fr' ? 'Évolution continue' : 'Continuous Evolution'} body={lang === 'fr' ? 'Une architecture conçue pour intégrer les évolutions futures.' : 'An architecture designed to absorb future change.'} /></div></section><FinalCta title={isSwift ? (lang === 'fr' ? 'Votre prochaine évolution SWIFT ne devrait pas déclencher une refonte de votre SI.' : 'Your next SWIFT evolution should not trigger another architecture overhaul.') : (lang === 'fr' ? 'Votre activité Trade mérite une plateforme à la hauteur de sa complexité.' : 'Your Trade business deserves a platform equal to its complexity.')} /></Layout>
}
*/

function ProductPage({ kind }: { kind: 'ibansys' | 'swift' }) {
  const lang = useLang()
  const data = products[lang][kind]
  const isSwift = kind === 'swift'
  const visionTitle = isSwift
    ? (lang === 'fr' ? 'Le point de référence de votre messagerie financière.' : 'The reference point for financial messaging.')
    : (lang === 'fr' ? 'Une vision unifiée du Trade et de la banque internationale.' : 'A unified view of Trade and international banking.')
  const lifecycleTitle = isSwift
    ? (lang === 'fr' ? 'Chaque message. Chaque étape. Un seul cycle de vie.' : 'Every message. Every stage. One lifecycle.')
    : (lang === 'fr' ? 'De l’initiation au règlement. Entièrement traçable.' : 'From initiation to settlement. Fully traceable.')
  const seoSuffix = isSwift ? 'ISO 20022 & Financial Messaging' : 'Trade Finance & International Banking Platform'

  return <Layout>
    <Seo title={`${data.title} | ${seoSuffix}`} description={data.body} />
    <PageHero eyebrow={data.eyebrow} title={data.hero} body={data.body} label={data.title} note={lang === 'fr' ? '35 ans d’expertise bancaire au service de la technologie.' : 'Built on 35 years of banking expertise.'} />
    <section className="section-pad content">
      <SectionHeading eyebrow={lang === 'fr' ? 'VISION UNIFIÉE' : 'UNIFIED VISION'} title={visionTitle} />
      <CapabilityMatrix items={data.capabilities} />
    </section>
    <section className="process-section section-pad">
      <div className="content">
        <SectionHeading eyebrow={lang === 'fr' ? 'DE BOUT EN BOUT' : 'END TO END'} title={lifecycleTitle} />
        <ProcessJourney steps={data.flow} />
      </div>
    </section>
    {isSwift ? <SwiftArchitecture /> : <IbansysIntegration />}
    <section className="section-pad content">
      <SectionHeading eyebrow={lang === 'fr' ? 'POURQUOI SMI' : 'WHY SMI'} title={lang === 'fr' ? 'Une expertise métier au cœur de la solution.' : 'Banking expertise at the heart of the solution.'} />
      <div className="three-up">
        <InfoCard title={lang === 'fr' ? '35 ans' : '35 Years'} body={lang === 'fr' ? 'Une connaissance bancaire développée depuis 1991.' : 'Banking knowledge developed since 1991.'} />
        <InfoCard title={lang === 'fr' ? 'Équipe dédiée' : 'Dedicated Team'} body={lang === 'fr' ? 'Des profils fonctionnels et techniques tout au long du projet.' : 'Functional and technical specialists throughout the project.'} />
        <InfoCard title={lang === 'fr' ? 'Évolution continue' : 'Continuous Evolution'} body={lang === 'fr' ? 'Une architecture conçue pour intégrer les évolutions futures.' : 'An architecture designed to absorb future change.'} />
      </div>
    </section>
    <FinalCta title={isSwift
      ? (lang === 'fr' ? 'Votre prochaine évolution SWIFT ne devrait pas déclencher une refonte de votre SI.' : 'Your next SWIFT evolution should not trigger another architecture overhaul.')
      : (lang === 'fr' ? 'Votre activité Trade mérite une plateforme à la hauteur de sa complexité.' : 'Your Trade business deserves a platform equal to its complexity.')} />
  </Layout>
}

function PageHero({ eyebrow, title, body, label }: { eyebrow: string; title: string; body: string; label?: string; note?: string }) {
  return <section className="page-hero"><div className="page-hero-inner"><div>{label && <span className="product-label">{label}</span>}<p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{body}</p><CtaPair /></div></div></section>
}

function MobileArchitectureGraph({ kind, lang }: { kind: 'ibansys' | 'swift'; lang: Lang }) {
  const isSwift = kind === 'swift'
  const ibansysNodes = lang === 'fr'
    ? [['SWIFT+ Messaging Hub', 'Échange de données'], ['Conformité & AML', 'API / Services'], ['Dépositaire central', 'Reporting réglementaire'], ['Reporting & BI', 'Échange de données'], ['Systèmes de paiement', 'Échange de données'], ['Core Banking', 'API / Services']]
    : [['SWIFT+ Messaging Hub', 'Data exchange'], ['AML & Compliance', 'API / Services'], ['Central Depository', 'Regulatory reporting'], ['Reporting & BI', 'Data exchange'], ['Payment Systems', 'Data exchange'], ['Core Banking', 'API / Services']]
  const swiftInputs = lang === 'fr'
    ? [['Application A', 'Core Banking'], ['Application B', 'Trade Finance'], ['Application C', 'Paiements & canaux']]
    : [['Application A', 'Core Banking'], ['Application B', 'Trade Finance'], ['Application C', 'Payments & channels']]
  const swiftOutputs = lang === 'fr'
    ? [['SWIFT MT', 'Messagerie existante'], ['ISO 20022 / MX', 'Données structurées'], ['Autres formats', 'Formats connectés']]
    : [['SWIFT MT', 'Legacy messaging'], ['ISO 20022 / MX', 'Structured data'], ['Other formats', 'Connected formats']]

  if (!isSwift) return <div className="mobile-architecture mobile-architecture-hub" aria-label={lang === 'fr' ? 'Écosystème d’intégration IBANSYS' : 'IBANSYS integration ecosystem'}>
    <div className="mobile-architecture-core"><small>{lang === 'fr' ? 'TRADE &amp; BANQUE INTERNATIONALE' : 'TRADE &amp; INTERNATIONAL BANKING'}</small><strong>IBANSYS</strong><span>{lang === 'fr' ? 'API · Services · Données' : 'API · Services · Data'}</span></div>
    <div className="mobile-architecture-nodes">
      {ibansysNodes.map(([title, detail], index) => <article key={title}><span><DiagramIcon type={index} /></span><div><strong>{title}</strong><small>{detail}</small></div></article>)}
    </div>
  </div>

  return <div className="mobile-architecture mobile-architecture-swift" aria-label={lang === 'fr' ? 'Architecture du modèle canonique SWIFT+' : 'SWIFT+ canonical model architecture'}>
    <div className="mobile-architecture-core mobile-swift-core"><small>{lang === 'fr' ? 'SWIFT+ · COUCHE PIVOT' : 'SWIFT+ · PIVOT LAYER'}</small><strong>{lang === 'fr' ? <>MODÈLE DE DONNÉES<br />CANONIQUE</> : <>CANONICAL<br />DATA MODEL</>}</strong><span>{lang === 'fr' ? 'Normaliser · Contrôler · Transformer' : 'Normalise · Control · Transform'}</span></div>
    <div className="mobile-architecture-column-heading"><span>{lang === 'fr' ? 'APPLICATIONS SOURCES' : 'SOURCE APPLICATIONS'}</span><span>{lang === 'fr' ? 'FORMATS DE SORTIE' : 'OUTPUT FORMATS'}</span></div>
    <div className="mobile-swift-routes">
      {swiftInputs.map((input, index) => <div className="mobile-swift-route" key={input[0]}>
        <article><span><DiagramIcon type={index} /></span><strong>{input[0]}</strong><small>{input[1]}</small></article>
        <i aria-hidden="true" />
        <article><span><DiagramIcon type={index + 3} /></span><strong>{swiftOutputs[index][0]}</strong><small>{swiftOutputs[index][1]}</small></article>
      </div>)}
    </div>
  </div>
}

function SwiftCanonical3D({ lang }: { lang: Lang }) {
  useEffect(() => { void import('./swift-canonical-scene') }, [])
  return <><div className="swift-3d-frame">
    <div className="swift-3d-stage">
      {createElement('swift-canonical-3d', { key: lang, lang, class: 'swift-3d-scene', 'aria-label': lang === 'fr' ? 'Architecture tridimensionnelle du modèle de données canonique SWIFT+' : 'Three-dimensional SWIFT+ canonical data model architecture' })}
    </div>
    <div className="swift-3d-legend" aria-hidden="true">
      <span><i className="swift-legend-input" />{lang === 'fr' ? 'Applications sources' : 'Source applications'}</span>
      <span><i className="swift-legend-core" />{lang === 'fr' ? 'Modèle canonique SWIFT+' : 'SWIFT+ canonical model'}</span>
      <span><i className="swift-legend-output" />{lang === 'fr' ? 'Formats de sortie' : 'Output formats'}</span>
      <small>{lang === 'fr' ? 'Survolez un flux' : 'Hover over a flow'}</small>
    </div>
  </div><MobileArchitectureGraph kind="swift" lang={lang} /></>
}

function SwiftArchitecture() { const lang = useLang(); return <section className="architecture section-pad"><div className="content"><SectionHeading eyebrow="CANONICAL DATA MODEL" title={lang === 'fr' ? 'Normaliser une fois. Évoluer en continu.' : 'Normalize once. Evolve continuously.'} body={lang === 'fr' ? 'Le modèle pivot isole les applications des changements de format et simplifie la coexistence MT/MX.' : 'The canonical model isolates applications from format changes and simplifies MT/MX coexistence.'} light /><SwiftCanonical3D lang={lang} /><div className="routing-note"><strong>{lang === 'fr' ? 'Préserver la couche de transport. Moderniser la couche de valeur.' : 'Preserve the transport layer. Modernise the value layer.'}</strong><p>SWIFT+ {lang === 'fr' ? 'complète les infrastructures SAA, STARS et routeurs existants ; elle ne les remplace pas.' : 'works alongside SAA, STARS and existing routing infrastructure; it does not replace them.'}</p></div></div></section> }

function IbansysIntegration3D({ lang }: { lang: Lang }) {
  useEffect(() => { void import('./ibansys-hub-scene') }, [])
  return <><div className="ibansys-3d-frame">
    <div className="ibansys-3d-stage">
      {/** The custom element owns its Three.js canvas and disposes it when unmounted. */}
      {createElement('ibansys-hub-3d', { key: lang, lang, class: 'ibansys-3d-scene', 'aria-label': lang === 'fr' ? 'Écosystème d’intégration IBANSYS en trois dimensions' : 'Three-dimensional IBANSYS integration ecosystem' })}
    </div>
    <div className="ibansys-3d-legend" aria-hidden="true">
      <span><i className="ibansys-legend-flow" />{lang === 'fr' ? 'Échange de données' : 'Data exchange'}</span>
      <span><i className="ibansys-legend-core" />{lang === 'fr' ? 'Cœur IBANSYS' : 'IBANSYS core'}</span>
      <small>{lang === 'fr' ? 'Survolez un système' : 'Hover over a system'}</small>
    </div>
  </div><MobileArchitectureGraph kind="ibansys" lang={lang} /></>
}

function IbansysIntegration() {
  const lang = useLang()
  return <section className="architecture section-pad"><div className="content"><SectionHeading eyebrow="INTEGRATION FIRST" title={lang === 'fr' ? 'Intégrer. Ne pas isoler.' : 'Integrate. Don’t isolate.'} body={lang === 'fr' ? 'IBANSYS se connecte au système d’information existant par APIs, services, fichiers et intégrations de données.' : 'IBANSYS connects to the existing information system through APIs, services, files and data integrations.'} light /><IbansysIntegration3D lang={lang} /><div className="routing-note"><strong>{lang === 'fr' ? 'Plateforme globale. Conformité locale.' : 'Global platform. Local compliance.'}</strong><p>{lang === 'fr' ? 'Adaptable aux réglementations locales en vigueur et aux exigences propres à chaque marché.' : 'Adaptable to applicable local regulations and market requirements.'}</p></div></div></section>
}
function InfoCard({ title, body }: { title: string; body: string }) { return <article className="info-card"><h3>{title}</h3><p>{body}</p></article> }

function TransformationPage() {
  const lang = useLang(); const stages = lang === 'fr' ? ['Comprendre', 'Évaluer', 'Définir la cible', 'Prioriser', 'Construire & intégrer', 'Migrer & valider', 'Déployer', 'Faire évoluer'] : ['Understand', 'Assess', 'Define the Target', 'Prioritise', 'Build & Integrate', 'Migrate & Validate', 'Deploy', 'Evolve']; const capabilities = lang === 'fr' ? [['Modernisation legacy', 'Préserver les règles métier et faire évoluer la technologie autour.'], ['APIs & intégration', 'Connecter ce qui existe et préparer ce qui vient.'], ['Migration de données', 'Préserver l’intégrité, l’historique et la continuité.'], ['Digitalisation des processus', 'Automatiser les contrôles, workflows et traitements répétitifs.'], ['Architecture moderne', 'Modularité, services et observabilité lorsque cela crée de la valeur.'], ['Contrôle par conception', 'Accès, traçabilité, séparation des rôles et validation métier.']] : [['Legacy Modernisation', 'Preserve business rules and evolve the technology around them.'], ['APIs & Integration', 'Connect what exists and enable what comes next.'], ['Data Migration', 'Preserve integrity, history and continuity.'], ['Process Digitalisation', 'Automate controls, workflows and repetitive processing.'], ['Modern Architecture', 'Modularity, services and observability where they create value.'], ['Control by Design', 'Access, traceability, segregation of duties and business validation.']]
  return <Layout><Seo title="Banking Digital Transformation & Legacy Modernisation | SMI" description="Banking modernisation without disruption." /><PageHero eyebrow="BANKING TRANSFORMATION" title={lang === 'fr' ? 'Moderniser la banque sans fragiliser ce qui fonctionne.' : 'Modernise banking without disrupting what works.'} body={lang === 'fr' ? 'SMI accompagne la modernisation progressive des applications, architectures et processus bancaires en combinant continuité opérationnelle, maîtrise du risque et compréhension métier.' : 'SMI supports progressive modernisation of banking applications, architectures and processes through operational continuity, risk control and business understanding.'} note="Banking Modernisation Without Disruption" /><section className="section-pad content"><SectionHeading eyebrow={lang === 'fr' ? 'CAPACITÉS' : 'CAPABILITIES'} title={lang === 'fr' ? 'Le métier d’abord. La technologie là où elle crée de la valeur.' : 'Business first. Technology where it creates value.'} /><div className="two-up">{capabilities.map(([title, body]) => <InfoCard key={title} title={title} body={body} />)}</div></section><section className="process-section section-pad"><div className="content"><SectionHeading eyebrow={lang === 'fr' ? 'NOTRE APPROCHE' : 'OUR APPROACH'} title={lang === 'fr' ? 'Une destination claire. Un chemin maîtrisé.' : 'A clear destination. A controlled path.'} /><ProcessJourney steps={stages} /></div></section><FinalCta title={lang === 'fr' ? 'Transformons ce qui doit évoluer. Préservons ce qui crée encore de la valeur.' : 'Transform what must evolve. Preserve what still creates value.'} /></Layout>
}

interface ExpertiseDomain {
  short: string;
  title: string;
  body: string;
  points: string[];
}

function ExpertiseChain({ items, lang }: { items: ExpertiseDomain[]; lang: Lang }) {
  const [selected, setSelected] = useState(0)
  const [revealKey, setRevealKey] = useState(0)
  const [scale, setScale] = useState(1)
  const wrapRef = useRef<HTMLDivElement>(null)
  const detail = items[selected]

  useEffect(() => {
    const wrapper = wrapRef.current
    if (!wrapper) return
    const fit = () => {
      const fitted = wrapper.clientWidth / 1260
      setScale(Math.min(1, wrapper.clientWidth < 800 ? Math.max(.72, fitted) : fitted))
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [])

  const selectDomain = (index: number) => {
    setSelected(index)
    setRevealKey(key => key + 1)
  }

  return <div className="expertise-chain">
    <div className="expertise-chain-heading"><span>{lang === 'fr' ? '08 DOMAINES' : '08 DOMAINS'}</span><i /></div>
    <div className="expertise-chain-window" ref={wrapRef} style={{ height: `${336 * scale}px` }}>
      <div className="expertise-chain-track" style={{ transform: `scale(${scale})` }}>
        <span className="expertise-chain-bar" aria-hidden="true"><i /></span>
        {items.map((item, index) => {
          const active = selected === index
          return <button type="button" className={`expertise-chain-link${index % 2 ? ' is-lower' : ' is-upper'}${active ? ' is-active' : ''}`} style={{ '--chain-delay': `${index * 62}ms`, '--chain-layer': index + 1 } as CSSProperties} onMouseEnter={() => selectDomain(index)} onFocus={() => selectDomain(index)} onClick={() => selectDomain(index)} aria-pressed={active} key={item.title}>
            <span className="expertise-chain-disc" />
            <span className="expertise-chain-ring" />
            <span className="expertise-chain-ring-front" />
            <span className="expertise-chain-glow" />
            <span className="expertise-chain-icon"><ExpertiseDomainIcon type={index} /></span>
            <span className="expertise-chain-label">{item.short}</span>
          </button>
        })}
        <span className="expertise-chain-sheen" aria-hidden="true" />
      </div>
    </div>
    <article className="expertise-chain-detail" key={`${lang}-${selected}-${revealKey}`} aria-live="polite">
      <div className="expertise-chain-copy">
        <div><span>{String(selected + 1).padStart(2, '0')}</span><h2>{detail.title}</h2></div>
        <p>{detail.body}</p>
      </div>
      <div className="expertise-chain-scope">
        <small>{lang === 'fr' ? 'PÉRIMÈTRE' : 'SCOPE'}</small>
        {detail.points.map((point, index) => <p style={{ '--point-delay': `${160 + index * 70}ms` } as CSSProperties} key={point}><i />{point}</p>)}
      </div>
    </article>
  </div>
}

function ExpertisePage() {
  const lang = useLang()
  const domains: ExpertiseDomain[] = lang === 'fr' ? [
    { short: 'Trade Finance', title: 'Trade Finance & International Banking', body: "Crédits documentaires, garanties et remises : des processus documentaires complexes, encore largement manuels, outillés de bout en bout et connectés au système d’information de la banque.", points: ['Crédits documentaires', 'Garanties internationales', 'Remises documentaires'] },
    { short: 'Paiements', title: 'Payments & Financial Messaging', body: 'Virements, prélèvements et messagerie financière : formats, canaux et contrôles réglementaires alignés sur les schémas SEPA et les corridors internationaux.', points: ['SEPA et virement instantané', 'Canaux et routage', 'Contrôles réglementaires'] },
    { short: 'SWIFT · ISO 20022', title: 'SWIFT & ISO 20022', body: 'Migration des messages MT vers MX, enrichissement des données structurées et cohabitation des deux formats pendant toute la période de transition.', points: ['Migration MT vers MX', 'CBPR+ et TARGET2', 'Cohabitation des formats'] },
    { short: 'Intégration', title: 'Banking Integration & Interoperability', body: "APIs, bus de services et connecteurs Core Banking pour faire circuler l’information entre applications internes, filiales et partenaires externes.", points: ['APIs et connecteurs', 'Bus de services', 'Interfaces Core Banking'] },
    { short: 'Modernisation', title: 'Legacy & Application Modernisation', body: 'Audit du patrimoine applicatif, récupération des règles métier enfouies dans le code et migration progressive vers une architecture maintenable, sans rupture de service.', points: ['Audit du patrimoine', 'Récupération des règles', 'Migration progressive'] },
    { short: 'Données', title: 'Data & Migration', body: 'Reprise, qualité et réconciliation des données lors des changements de système, avec des pistes d’audit complètes à chaque étape du transfert.', points: ['Reprise de données', 'Qualité et contrôles', 'Réconciliation et audit'] },
    { short: 'Automatisation', title: 'Process Digitalisation & Automation', body: 'Dématérialisation des dossiers, workflows de validation et automatisation des tâches répétitives à fort volume, au plus près des équipes opérationnelles.', points: ['Dématérialisation', 'Workflows de validation', 'Automatisation des tâches'] },
    { short: 'Technologie', title: 'Banking Technology', body: 'Choix d’architecture, sécurité et exploitation : les fondations techniques sur lesquelles reposent tous les autres domaines d’intervention.', points: ['Architecture technique', 'Sécurité', 'Exploitation et supervision'] },
  ] : [
    { short: 'Trade Finance', title: 'Trade Finance & International Banking', body: 'Documentary credits, guarantees and collections: complex processes are managed end to end and connected to the bank’s information system.', points: ['Documentary credits', 'International guarantees', 'Documentary collections'] },
    { short: 'Payments', title: 'Payments & Financial Messaging', body: 'Transfers, direct debits and financial messaging: formats, channels and regulatory controls aligned with SEPA schemes and international corridors.', points: ['SEPA and instant payments', 'Channels and routing', 'Regulatory controls'] },
    { short: 'SWIFT · ISO 20022', title: 'SWIFT & ISO 20022', body: 'MT-to-MX migration, enrichment of structured data and controlled coexistence of both formats throughout the transition.', points: ['MT-to-MX migration', 'CBPR+ and TARGET2', 'Format coexistence'] },
    { short: 'Integration', title: 'Banking Integration & Interoperability', body: 'APIs, service buses and Core Banking connectors move information reliably between internal applications, subsidiaries and external partners.', points: ['APIs and connectors', 'Service buses', 'Core Banking interfaces'] },
    { short: 'Modernisation', title: 'Legacy & Application Modernisation', body: 'Application estate assessment, recovery of business rules embedded in code and progressive migration to a maintainable architecture without service interruption.', points: ['Application assessment', 'Business-rule recovery', 'Progressive migration'] },
    { short: 'Data', title: 'Data & Migration', body: 'Data transfer, quality and reconciliation during system changes, with complete audit trails at every stage of the migration.', points: ['Data transfer', 'Quality and controls', 'Reconciliation and audit'] },
    { short: 'Automation', title: 'Process Digitalisation & Automation', body: 'Document digitisation, approval workflows and automation of high-volume repetitive tasks close to operational teams.', points: ['Document digitisation', 'Approval workflows', 'Task automation'] },
    { short: 'Technology', title: 'Banking Technology', body: 'Architecture, security and operations form the technical foundations supporting every other area of expertise.', points: ['Technical architecture', 'Security', 'Operations and monitoring'] },
  ]
  return <Layout><Seo title="Banking Expertise | Trade Finance, SWIFT & ISO 20022 | SMI" description="35 years of banking knowledge turned into technology." /><PageHero eyebrow="EXPERTISE" title={lang === 'fr' ? '35 ans à comprendre la banque. Et à transformer cette expertise en solutions.' : '35 Years of Banking Knowledge. Turned into Technology.'} body={lang === 'fr' ? 'Nous comprenons ce que fait la banque. Nous savons comment la technologie peut l’améliorer.' : 'We understand what the bank does. We know how technology can make it better.'} note="Banking expertise + Technology expertise" /><section className="expertise-chain-section"><ExpertiseChain items={domains} lang={lang} /></section><section className="knowledge-banner"><div><p className="eyebrow">KNOWLEDGE TRANSFER</p><h2>Build Knowledge, Not Dependency.</h2><p>{lang === 'fr' ? 'Formation fonctionnelle, formation technique, documentation et partage continu.' : 'Functional training, technical training, documentation and continuous knowledge sharing.'}</p></div></section><FinalCta title={lang === 'fr' ? 'Un projet. Une équipe dédiée. Plusieurs expertises.' : 'One project. One dedicated team. Multiple areas of expertise.'} /></Layout>
}

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
    },
    {
      title: 'Sens du détail',
      tagline: 'Voir ce que les autres ne voient pas.',
      metric: 'Précis',
      detail: 'Chaque règle métier, format de message, contrôle et exception opérationnelle est examiné avec précision. Cette attention aux plus petits détails protège la fiabilité de l’ensemble.',
      tags: ['Précision', 'Contrôles fins', 'Qualité durable']
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
    },
    {
      title: 'Attention to Detail',
      tagline: 'See what others overlook.',
      metric: 'Precise',
      detail: 'Every business rule, message format, control and operational exception is examined with precision. Attention to the smallest details protects the reliability of the whole system.',
      tags: ['Precision', 'Fine Controls', 'Lasting Quality']
    }
  ];
  return <Layout><Seo title="Why SMI | 35 Years of Banking Expertise" description="More than a technology provider. A long-term banking partner." /><PageHero eyebrow="WHY SMI" title={lang === 'fr' ? 'Plus qu’un fournisseur de solutions. Un partenaire bancaire dans la durée.' : 'More Than a Technology Provider. A Long-Term Banking Partner.'} body={lang === 'fr' ? 'Depuis 1991, SMI évolue avec le secteur bancaire et transforme cette expérience accumulée en valeur pour chaque nouveau projet.' : 'Since 1991, SMI has evolved alongside banking and turns that accumulated experience into value for every new project.'} note="Understand. Deliver. Support. Evolve." /><section className="section-pad content why-values-section"><SectionHeading eyebrow={lang === 'fr' ? 'NOS VALEURS' : 'OUR VALUES'} title={lang === 'fr' ? 'Des engagements concrets.' : 'Concrete commitments.'} /><WhyValuesVisual items={values} lang={lang} /></section><section className="architecture section-pad"><div className="content"><SectionHeading eyebrow={lang === 'fr' ? 'NOTRE RESPONSABILITÉ' : 'OUR RESPONSIBILITY'} title={lang === 'fr' ? 'Notre responsabilité ne s’arrête pas au Go-Live.' : 'Our responsibility does not stop at Go-Live.'} body={lang === 'fr' ? 'Évolutions métier, standards, intégrations, amélioration fonctionnelle et accompagnement opérationnel.' : 'Business evolution, standards, integrations, functional improvement and operational support.'} light /><PartnerStrip /></div></section><FinalCta title={lang === 'fr' ? 'Nous adaptons la solution à la banque. Pas la banque à la solution.' : 'We adapt the solution to the bank. Not the bank to the solution.'} /></Layout>;
}

// Every figure here is already stated elsewhere on the site (35 years, since 1991) or is
// derived from the partner list itself — nothing is invented.
function ProofBand({ lang }: { lang: Lang }) {
  const stats = lang === 'fr'
    ? [['35', 'ans d’expertise bancaire'], [String(banks.length), 'partenaires bancaires'], ['1991', 'depuis']]
    : [['35', 'years of banking expertise'], [String(banks.length), 'banking partners'], ['1991', 'since']]
  return <section className="proof-band">
    <div className="content proof-grid">
      {stats.map(([value, label]) => <div className="proof-stat" key={label}>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>)}
    </div>
    <p className="proof-detail">{lang === 'fr' ? 'Transition ISO 20022 réussie dans des délais particulièrement compétitifs, tout en préservant la continuité des opérations.' : 'Successful ISO 20022 transition within highly competitive timelines, while preserving operational continuity.'}</p>
  </section>
}

function CustomerSuccessPage() { const lang = useLang(); const stories = lang === 'fr' ? [['Transformation ISO 20022', 'Messages, données, interfaces et contrôles', 'Analyse des flux, transformation, intégration et tests de bout en bout', 'Transition maîtrisée et continuité des opérations'], ['Digitalisation du Trade Finance', 'Processus documentaires complexes et fragmentés', 'Plateforme intégrée, workflows et connexion au Core Banking', 'Un environnement plus intégré, traçable et évolutif'], ['Modernisation legacy', 'Patrimoine applicatif riche mais difficile à faire évoluer', 'Évaluation, récupération des règles métier et migration contrôlée', 'Architecture modernisée et connaissance bancaire préservée']] : [['ISO 20022 Transformation', 'Messages, data, interfaces and controls', 'Flow analysis, transformation, integration and end-to-end testing', 'Controlled transition and operational continuity'], ['Trade Finance Digitalisation', 'Complex and fragmented documentary processes', 'Integrated platform, workflows and Core Banking connectivity', 'A more integrated, traceable and adaptable environment'], ['Legacy Modernisation', 'Rich application heritage that is hard to evolve', 'Assessment, business-rule recovery and controlled migration', 'Modernised architecture with banking knowledge preserved']]; return <Layout><Seo title="Customer Success | Banking Transformation Delivery | SMI" description="Trusted by banks. Proven through delivery." /><PageHero eyebrow="CUSTOMER SUCCESS" title={lang === 'fr' ? 'Des relations construites dans la durée. Des transformations qui produisent des résultats.' : 'Trusted by Banks. Proven Through Delivery.'} body={lang === 'fr' ? 'La mise en production est une étape. La valeur dans la durée est l’objectif.' : 'Go-live is a milestone. Long-term value is the objective.'} note="Long-term relationships. Personalised support. Dedicated teams." /><ProofBand lang={lang} /><section className="partner-intro section-pad"><div className="content"><SectionHeading eyebrow={lang === 'fr' ? 'ILS NOUS FONT CONFIANCE' : 'TRUSTED BY'} title={lang === 'fr' ? 'Des institutions bancaires qui nous accompagnent depuis des années.' : 'Banking institutions that have worked with us for years.'} /><p className="strip-label">{lang === 'fr' ? 'PARTENAIRES BANCAIRES' : 'BANKING PARTNERS'}</p></div><PartnerStrip /><div className="content"><p className="strip-label strip-label-secondary">{lang === 'fr' ? 'PARTENAIRES TECHNOLOGIQUES' : 'TECHNOLOGY PARTNERS'}</p></div><PartnerStrip technology /></section><section className="customer-transformations section-pad content"><SectionHeading eyebrow="TRANSFORMATIONS" title={lang === 'fr' ? 'Le défi. Notre approche. Le résultat.' : 'The challenge. Our approach. The outcome.'} body={lang === 'fr' ? 'Trois transformations bancaires conduites de bout en bout, du cadrage initial jusqu’à la continuité des opérations.' : 'Three banking transformations delivered end to end, from initial framing through to operational continuity.'} /><TransformationStories stories={stories} lang={lang} /></section><FinalCta title={lang === 'fr' ? 'Chaque banque est différente. Chaque transformation mérite sa propre approche.' : 'Every bank is different. Every transformation deserves its own approach.'} /></Layout> }

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
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'idle' | 'submitting' | 'activation' | 'success' | 'error'>('idle')
  const interests = ['Trade Finance', 'IBANSYS', 'SWIFT & Financial Messaging', 'ISO 20022', 'SWIFT+ Messaging Hub', 'Banking Integration', 'Digital Transformation', 'Legacy Modernisation', 'Data Migration', 'Process Automation', 'Partnership', 'Other']
  const intent = searchParams.get('intent') || ''
  const initialInterest = intent === 'swift' || intent === 'iso20022' ? 'SWIFT+ Messaging Hub' : intent === 'ibansys' ? 'IBANSYS' : intent === 'transformation' ? 'Digital Transformation' : ''
  useEffect(() => {
    if (!initialInterest) return
    const select = document.querySelector<HTMLSelectElement>('select[name="interest"]')
    if (select) select.value = initialInterest
  }, [initialInterest])
  /*
  return <Layout><Seo title="Talk to an Expert | SMI" description="Discuss your next banking challenge with SMI." /><PageHero eyebrow={lang === 'fr' ? 'PARLONS BANQUE' : 'LET’S TALK BANKING'} title={lang === 'fr' ? 'Parlons de votre prochain enjeu bancaire.' : 'Let’s Discuss What’s Next for Your Bank.'} body={lang === 'fr' ? 'Trade Finance, SWIFT, ISO 20022, modernisation ou intégration : chaque projet commence par la compréhension du contexte.' : 'Trade Finance, SWIFT, ISO 20022, modernisation or integration: every project starts with understanding the context.'} /><section className="section-pad content contact-grid"><div><SectionHeading eyebrow={lang === 'fr' ? 'VOTRE CONTEXTE D’ABORD' : 'YOUR CONTEXT FIRST'} title={lang === 'fr' ? 'Commençons par le besoin.' : 'Start with the challenge.'} body={lang === 'fr' ? 'La bonne discussion, avec la bonne expertise.' : 'The right discussion with the right expertise.'} /><div className="contact-details"><a href="mailto:contact@societelemondeinformatique.com">contact@societelemondeinformatique.com</a><a href="tel:+21653928121">+216 53 928 121</a><p>{contactAddress}</p></div><ContactMap /></div><form className="contact-form" onSubmit={onSubmit}>{status === 'success' ? <div className="form-success" role="status"><strong>{lang === 'fr' ? 'Merci pour votre demande.' : 'Thank you for your request.'}</strong><p>{lang === 'fr' ? 'Votre message a bien été transmis à l’équipe SMI. Nous vous répondrons dans les meilleurs délais.' : 'Your message has been delivered to the SMI team. We will respond as soon as possible.'}</p><button type="button" className="button button-outline" onClick={() => setStatus('idle')}>{lang === 'fr' ? 'Nouvelle demande' : 'New request'}</button></div> : <><div className="form-row"><label>{lang === 'fr' ? 'Prénom' : 'First Name'} *<input required autoComplete="given-name" name="firstName" /></label><label>{lang === 'fr' ? 'Nom' : 'Last Name'} *<input required autoComplete="family-name" name="lastName" /></label></div><label>{lang === 'fr' ? 'Institution / Entreprise' : 'Institution / Company'} *<input required autoComplete="organization" name="institution" /></label><div className="form-row"><label>{lang === 'fr' ? 'Fonction' : 'Job Title'}<input autoComplete="organization-title" name="jobTitle" /></label><label>{lang === 'fr' ? 'Pays' : 'Country'} *<input required autoComplete="country-name" name="country" /></label></div><label>{lang === 'fr' ? 'Email professionnel' : 'Business Email'} *<input required type="email" autoComplete="email" name="email" /></label><input type="hidden" name="intent" value={intent} /><label>{lang === 'fr' ? 'Domaine d’intérêt' : 'Area of Interest'} *<select required name="interest" defaultValue={initialInterest}><option value="" disabled>{lang === 'fr' ? 'Sélectionner' : 'Select'}</option>{interests.map(item => <option key={item}>{item}</option>)}</select></label><label>Message *<textarea required name="message" rows={5} /></label><label className="form-honeypot" aria-hidden="true">Website<input name="_honey" tabIndex={-1} autoComplete="off" /></label><label className="consent"><input type="checkbox" required name="consent" value="accepted" />{lang === 'fr' ? 'J’accepte que SMI utilise ces informations pour répondre à ma demande.' : 'I agree that SMI may use this information to respond to my request.'}</label>{status === 'activation' && <p className="form-activation" role="status">{lang === 'fr' ? 'Un email d’activation a été envoyé à l’adresse de réception SMI. Cliquez sur « Activate Form », puis renvoyez cette demande.' : 'An activation email was sent to the SMI receiving address. Click « Activate Form », then submit again.'}</p>}{status === 'error' && <p className="form-error" role="alert">{lang === 'fr' ? 'Votre demande n’a pas pu être envoyée. Réessayez ou écrivez-nous directement.' : 'Your request could not be sent. Please try again or email us directly.'}</p>}<button className="button button-primary" type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? (lang === 'fr' ? 'Envoi…' : 'Sending…') : (lang === 'fr' ? 'Envoyer la demande' : 'Send request')} <Arrow /></button></>}</form></section></Layout>

  */
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

function AppRoutes() { return <Routes><Route path="/" element={<Navigate to="/fr" replace />} /><Route path="/:lang" element={<HomePage />} /><Route path="/:lang/solutions/ibansys" element={<ProductPage kind="ibansys" />} /><Route path="/:lang/solutions/swift-plus" element={<ProductPage kind="swift" />} /><Route path="/:lang/banking-transformation" element={<TransformationPage />} /><Route path="/:lang/expertise" element={<ExpertisePage />} /><Route path="/:lang/why-smi" element={<WhyPage />} /><Route path="/:lang/customer-success" element={<CustomerSuccessPage />} /><Route path="/:lang/insights" element={<InsightsPage />} /><Route path="/:lang/insights/:slug" element={<InsightArticlePage />} /><Route path="/:lang/careers" element={<CareersPage />} /><Route path="/:lang/contact" element={<ContactPage />} /><Route path="/:lang/privacy" element={<LegalPage kind="privacy" />} /><Route path="/:lang/legal" element={<LegalPage kind="legal" />} /><Route path="/:lang/cookies" element={<CookiePolicyPage />} /><Route path="/:lang/*" element={<NotFoundPage />} /><Route path="*" element={<NotFoundPage />} /></Routes> }

export default function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '')
  return <BrowserRouter basename={basename || undefined}><AppRoutes /></BrowserRouter>
}
