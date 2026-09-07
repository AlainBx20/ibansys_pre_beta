export type Lang = 'fr' | 'en'

export const banks = [
  { name: 'BIAT', logo: '/partners/3e5e0cf4-9a29-f93d-0cf7-71c30ed22862.jpeg' },
  { name: 'AMEN BANK', logo: '/partners/amen-bank.png' },
  { name: 'BNA', logo: '/partners/image3.png' },
  { name: 'BTL', logo: '/partners/logo21.png' },
  { name: 'NAIB', logo: '/partners/naib-bank.jpg' },
  { name: 'Wifak Bank', logo: '/partners/0f438529-efd6-ea68-5093-9e65e12f4643.png' },
  { name: 'QNB', logo: '/partners/QNB-logo.jpg' },
  { name: 'UBCI', logo: '/partners/logo-ubci-nouveau.png' },
  { name: 'UIB', logo: '/partners/uib.jpg' },
  { name: 'STB Bank', logo: '/partners/stb-bank.png' },
]

export const copy = {
  fr: {
    nav: { solutions: 'Solutions', expertise: 'Expertise', why: 'Pourquoi SMI', success: 'Références', insights: 'Analyses', careers: 'Carrières', expert: 'Parler à un expert', demo: 'Demander une démonstration' },
    home: {
      eyebrow: 'TECHNOLOGIE BANCAIRE • TRADE FINANCE • MESSAGERIE FINANCIÈRE',
      title: 'L’expertise bancaire au service de la transformation.',
      body: 'Depuis 1991, SMI conçoit et déploie des solutions technologiques dédiées aux banques et institutions financières. Du Trade Finance à la messagerie SWIFT et ISO 20022, nous accompagnons les transformations critiques avec expertise métier, maîtrise technologique et proximité.',
      trust: ['35 ans d’expertise bancaire', 'Partenariats durables', 'Équipes dédiées', 'Accompagnement personnalisé'],
      worldsTitle: 'Des enjeux bancaires complexes. Une expertise qui les relie.',
      solutionsTitle: 'Des solutions conçues autour des réalités bancaires.',
      isoTitle: 'ISO 20022 transforme la donnée. Votre architecture doit pouvoir évoluer.',
      isoBody: 'L’enjeu dépasse la conversion d’un message MT vers MX : qualité des données, interfaces, règles métier, contrôles et continuité opérationnelle doivent progresser ensemble.',
      whyTitle: 'La technologie compte. L’expérience bancaire fait la différence.',
      peopleTitle: 'Des expertises différentes. Une même compréhension de la banque.',
      commitmentsTitle: 'Un partenaire technologique qui reste à vos côtés.',
      finalTitle: 'Votre prochaine transformation bancaire commence par une conversation.',
    },
    common: { explore: 'Explorer', talk: 'Parler à un expert', requestDemo: 'Demander une démonstration', since: 'Depuis 1991', read: 'Lire l’analyse', all: 'Voir toutes les analyses' },
  },
  en: {
    nav: { solutions: 'Solutions', expertise: 'Expertise', why: 'Why SMI', success: 'Customer Success', insights: 'Insights', careers: 'Careers', expert: 'Talk to an Expert', demo: 'Request a Demo' },
    home: {
      eyebrow: 'BANKING TECHNOLOGY • TRADE FINANCE • FINANCIAL MESSAGING',
      title: 'Banking expertise. Technology that moves finance forward.',
      body: 'Since 1991, SMI has designed and delivered technology for banks and financial institutions. From Trade Finance to SWIFT and ISO 20022 messaging, we support critical transformations through banking knowledge, engineering expertise and close collaboration.',
      trust: ['35 years of banking expertise', 'Long-term partnerships', 'Dedicated teams', 'Personalised support'],
      worldsTitle: 'Complex banking challenges. Connected by expertise.',
      solutionsTitle: 'Solutions designed around banking realities.',
      isoTitle: 'ISO 20022 transforms data. Your architecture must be ready to evolve.',
      isoBody: 'The challenge goes beyond converting MT to MX: data quality, interfaces, business rules, controls and operational continuity must evolve together.',
      whyTitle: 'Technology matters. Banking experience makes the difference.',
      peopleTitle: 'Different disciplines. One understanding of banking.',
      commitmentsTitle: 'A technology partner that stays by your side.',
      finalTitle: 'Your next banking transformation starts with a conversation.',
    },
    common: { explore: 'Explore', talk: 'Talk to an Expert', requestDemo: 'Request a Demo', since: 'Since 1991', read: 'Read the Insight', all: 'View all insights' },
  },
} as const

export const worlds = {
  fr: [
    { id: 'trade', label: 'Trade Finance', title: 'Digitaliser le Trade sans perdre la maîtrise du métier.', text: 'IBANSYS centralise les activités de Trade Finance et de banque internationale dans un environnement intégré.', tags: ['Trade Finance', 'Paiements', 'Garanties', 'Opérations documentaires'], href: 'solutions/ibansys' },
    { id: 'messaging', label: 'Messagerie financière', title: 'Faire évoluer SWIFT sans bouleverser votre SI.', text: 'SWIFT+ centralise, contrôle et fait évoluer la messagerie MT, MX et ISO 20022 à l’échelle de la banque.', tags: ['MT & MX', 'ISO 20022', 'CBPR+', 'Monitoring'], href: 'solutions/swift-plus' },
    { id: 'transform', label: 'Transformation bancaire', title: 'Moderniser sans interrompre ce qui fonctionne.', text: 'SMI modernise progressivement les applications, les données et les processus autour du patrimoine existant.', tags: ['Legacy', 'APIs', 'Intégration', 'Migration'], href: 'banking-transformation' },
  ],
  en: [
    { id: 'trade', label: 'Trade Finance', title: 'Digitise Trade without losing business control.', text: 'IBANSYS brings Trade Finance and international banking activities into one integrated environment.', tags: ['Trade Finance', 'Payments', 'Guarantees', 'Documentary Operations'], href: 'solutions/ibansys' },
    { id: 'messaging', label: 'Financial Messaging', title: 'Evolve SWIFT without disrupting your architecture.', text: 'SWIFT+ centralises, controls and evolves MT, MX and ISO 20022 messaging across the bank.', tags: ['MT & MX', 'ISO 20022', 'CBPR+', 'Monitoring'], href: 'solutions/swift-plus' },
    { id: 'transform', label: 'Banking Transformation', title: 'Modernise without interrupting what works.', text: 'SMI progressively modernises applications, data and processes around the bank’s existing assets.', tags: ['Legacy', 'APIs', 'Integration', 'Migration'], href: 'banking-transformation' },
  ],
} as const

export const insights = {
  fr: [
    { category: 'Standards Releases', title: 'SR2026 : ce que les banques doivent préparer', summary: 'Données structurées, applications sources et préparation opérationnelle.' },
    { category: 'ISO 20022', title: 'Au-delà de la conversion MT vers MX', summary: 'Pourquoi ISO 20022 est d’abord une transformation de la donnée.' },
    { category: 'Trade Finance', title: 'Moderniser le Trade Finance sans rupture', summary: 'Préserver la connaissance métier tout en faisant évoluer l’architecture.' },
  ],
  en: [
    { category: 'Standards Releases', title: 'SR2026: What Banks Need to Prepare For', summary: 'Structured data, source applications and operational readiness.' },
    { category: 'ISO 20022', title: 'Beyond MT-to-MX Conversion', summary: 'Why ISO 20022 is first and foremost a data transformation.' },
    { category: 'Trade Finance', title: 'Modernising Trade Finance Without Disruption', summary: 'Preserving banking knowledge while evolving the architecture.' },
  ],
} as const
