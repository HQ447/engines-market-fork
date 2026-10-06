import type {
  FaqSectionData,
  HowItWorksData,
  TrustCtaData,
} from "@/types/brand";

export type VariantHeroData = {
  tag: string;
  h1: string;
  subheading: string;
  trustBadges: string[];
  ctaLinkText: string;
  supportingText: string;
  ticker: string;
  imageAlt?: string;
  vehicleImagePrompt?: string;
  vehicleBadge?: string;
  highlights?: {
    title: string;
    price: string;
    line1?: string;
    line2?: string;
    detail?: string;
    image?: string;
    imageAlt?: string;
  }[];
  engineOptions?: {
    label: string;
    price: string;
    description: string;
    image?: string;
    imageAlt?: string;
    tone?: "used" | "reconditioned" | "rebuilt";
  }[];
  registrationInput?: {
    label?: string;
    platePlaceholder?: string;
    countryCode?: string;
    countryLabel?: string;
  };
  form: {
    heading: string;
    subtitle: string;
    inputPlaceholder: string;
    buttonText: string;
    note: string;
  };
};

export type VariantHistoryTimelineData = {
  tag: string;
  h2: string;
  intro: string;
  milestones: Array<{
    year: string;
    description: string;
    title?: string;
    icon?: string;
  }>;
  vehicleTitle?: string;
  vehicleSubtitle?: string;
  vehicleMeta?: Array<{
    label: string;
    value: string;
    icon?: string;
  }>;
  specsLabel: string;
  specs: Array<{
    label: string;
    value: string;
    icon?: string;
  }>;
  closingNote?: string;
};

export type VariantEngineGuideData = {
  tag: string;
  h2: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
  intro?: string;
  items: {
    code: string;
    title: string;
    specs: {
      label: string;
      value: string;
    }[];
    costs: {
      label: string;
      value: string;
      description?: string;
    }[];
    compatibleTrimLevels?: string[];
    commonFailure: string;
    cta: string;
    closing: string;
  }[];
  closing?: string;
  prompt?: string;
};

export type VariantCommonProblemsData = {
  tag: string;
  h2: string;
  h3: string;
  problems: {
    group: string;
    h4: string;
    image?: string;
    imageAlt?: string;
    affectedModels: string;
    typicalFailureMileage: string;
    rootCause: string;
    whyItHappens?: string;
    repairOptions?: {
      tier: string;
      dealerPrice: string;
      specialistPrice: string;
      whatItInvolves: string;
      longevity: string;
      estimatedTime?: string;
    }[];
    vehicleValueCheck?: string;
    recommendation?: string;
    cta: string;
  }[];
  emptyState?: {
    title: string;
    description: string;
    placeholder?: string;
  } | null;
  finalCta: {
    h4: string;
    paragraph: string;
    buttonText: string;
    disclaimer: string;
  };
  reviewSummary?: {
    label: string;
    rating: string;
    basedOn: string;
  };
};

export type VariantPageData = {
  brand: {
    name: string;
    slug: string;
    tone: string;
  };
  model: {
    name: string;
    slug: string;
  };
  variant: {
    name: string;
    slug: string;
    storageSlug: string;
  };
  seo: {
    title: string;
    description: string;
    canonical: string;
  };
  assets: {
    mainImage?: string;
    smallImage?: string;
    heroBg: string;
    howItWorksBg: string;
    ctaImage?: string;
    newDocImages?: {
      heroBackground?: string;
      vehicle?: string;
      brandLogo?: string;
      commonProblemsVehicle?: string;
      usedEngine?: string;
      reconditionedEngine?: string;
      rebuiltEngine?: string;
      heroEngine?: string;
    };
  };
  structuredData?: Record<string, unknown>;
  sections: {
    hero: VariantHeroData;
    howItWorks: HowItWorksData;
    historyTimeline: VariantHistoryTimelineData;
    engineGuide: VariantEngineGuideData;
    commonProblems: VariantCommonProblemsData;
    faq: FaqSectionData;
    trustCta: TrustCtaData;
  };
};
