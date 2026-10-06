export type NewDocVariantData = {
  brand: string;
  model: string;
  variant: string;
  engineCode: string;
  images: {
    heroBackground: string;
    vehicle: string;
    brandLogo: string;
    commonProblemsVehicle: string;
    usedEngine: string;
    reconditionedEngine: string;
    rebuiltEngine: string;
    heroEngine: string;
  };
  hero: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    description: string;
    trustItems: string[];
    price: { engineName: string; range: string; details: string[] };
    options: Array<{ title: string; description: string; image: string; href: string }>;
    cta: string;
    tickerItems: string[];
  };
  howItWorks: Array<{ number: string; title: string; description: string; back: string }>;
  history: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    description: string;
    specs: Array<[string, string]>;
    timeline: Array<{ year: string; text: string }>;
    closing: string;
  };
  engineGuide: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    description: string;
    engineName: string;
    specs: Array<[string, string]>;
    prices: Array<[string, string]>;
    commonFailure: string;
    cta: string;
    closing: string;
  };
  commonProblems: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    description: string;
    vehicleValue: string;
    closingCta: { title: string; description: string; cta: string };
    cards: Array<{
      title: string;
      affected: string;
      mileage: string;
      rootCause: string;
      repairOptions: Array<{ tier: string; dealer: string; specialist: string }>;
      recommendation: string;
      cta: string;
    }>;
  };
  faq: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    description: string;
    items: Array<{
      question: string;
      answer: string;
      icon: "price" | "problems" | "value" | "life" | "compare" | "code";
      highlights?: Array<{ label: string; value: string; detail?: string }>;
      bullets?: string[];
      cta: string;
    }>;
  };
  whyChoose: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    description: string;
    benefits: Array<{ value: string; label: string; icon: "network" | "warranty" | "delivery" }>;
    cta: string;
    note: string;
  };
};
