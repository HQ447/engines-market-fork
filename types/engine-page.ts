export type EnginePageHeroData = {
  breadcrumbs: Array<{
    label: string;
    href?: string;
  }>;
  pills: string[];
  title: string;
  description: string;
  trustBadges: string[];
  prices: Array<{
    label: string;
    price: string;
    tone: "used" | "reconditioned" | "rebuilt";
  }>;
  priceNote?: string;
  quoteCard: {
    heading: string;
    subtitle: string;
    countryCode: string;
    placeholder: string;
    buttonText: string;
    note: string;
  };
  engineImage: {
    src: string;
    alt: string;
  };
  backgroundImage?: {
    src: string;
    alt?: string;
  };
  engineCutout?: {
    src: string;
    alt?: string;
  };
  brandMark?: string;
  visualTagline?: string;
};

export type EngineSpecsSectionData = {
  tag: string;
  title: string;
  specs: Array<{
    label: string;
    value: string;
  }>;
};

export type EngineCompatibilitySectionData = {
  tag: string;
  title: string;
  intro: string;
  rows: Array<{
    model: string;
    image?: string;
    generation: string;
    badges: string;
    years: string;
    links: Array<{
      label: string;
      href: string;
    }>;
  }>;
  closing: string;
};

export type EngineCostGuideSectionData = {
  tag: string;
  title: string;
  image?: string;
  rows: Array<{
    condition: string;
    supplyOnly: string;
    fitted: string;
    warranty: string;
  }>;
  labourLine: string;
  paragraphs: string[];
  cta: string;
};

export type EngineFailuresSectionData = {
  tag: string;
  title: string;
  items: Array<{
    title: string;
    onset: string;
    whatHappens: string;
    repairVsReplace: string;
    image?: string;
  }>;
  goodYearsLine: string;
  cta: string;
};

export type EngineVariantsSectionData = {
  tag: string;
  title: string;
  intro: string;
  cards?: Array<{
    title: string;
    body: string;
  }>;
  relatives: Array<{
    code: string;
    href?: string;
    description: string;
  }>;
  closing: string;
};

export type EngineBuyingGuideSectionData = {
  tag: string;
  title: string;
  options: Array<{
    label: string;
    body: string;
    href: string;
  }>;
  supplyFitLine: string;
  vehicleValueNote: string;
  cta: string;
};

export type EngineRelatedSectionData = {
  tag: string;
  title: string;
  items: Array<{
    relation: string;
    code: string;
    href: string;
    description: string;
  }>;
};

export type EngineFaqSectionData = {
  tag: string;
  title: string;
  items: Array<{
    question: string;
    answer: string;
    bullets?: string[];
    cta?: string;
  }>;
};

export type EngineTrustCtaSectionData = {
  tag: string;
  title: string;
  bullets: string[];
  paragraph: string;
  buttonText: string;
  note: string;
};

export type EnginePageData = {
  brand: {
    name: string;
    slug: string;
    tone?: string;
  };
  engine: {
    code: string;
    slug: string;
  };
  seo: {
    title: string;
    description: string;
    canonical: string;
  };
  structuredData?: Record<string, unknown>;
  sections: {
    hero: EnginePageHeroData;
    specs: EngineSpecsSectionData;
    compatibility: EngineCompatibilitySectionData;
    costGuide: EngineCostGuideSectionData;
    failures: EngineFailuresSectionData;
    variants: EngineVariantsSectionData;
    buyingGuide: EngineBuyingGuideSectionData;
    related: EngineRelatedSectionData;
    faq: EngineFaqSectionData;
    trustCta: EngineTrustCtaSectionData;
  };
};
