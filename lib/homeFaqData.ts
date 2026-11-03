import { homeFaqClusterGuides as rawHomeFaqClusterGuides, homeFaqOverrides as rawHomeFaqOverrides } from "@/lib/homeFaqContent";

export type HomeFaqClusterId =
  | "costs"
  | "failures"
  | "types"
  | "rebuild-vs-replace"
  | "specialists"
  | "compatibility"
  | "lifespan"
  | "process"
  | "value"
  | "authority";

export type HomeFaqBrandId =
  | "bmw"
  | "land-rover"
  | "jaguar"
  | "mercedes"
  | "audi"
  | "volkswagen"
  | "ford"
  | "vauxhall"
  | "hyundai"
  | "toyota";

export type HomeFaqCluster = {
  id: HomeFaqClusterId;
  number: string;
  label: string;
  count: number;
  icon: "pound" | "warning" | "layers" | "scales" | "shield" | "chip" | "clock" | "process" | "chart" | "star";
};

export type HomeFaqBrand = {
  id: HomeFaqBrandId;
  label: string;
  slug: string;
  logoSrc: string;
  replacementCost: string;
  reconCost: string;
  usedCost: string;
  supplyFitCost: string;
  dealerSaving: string;
  commonEngine: string;
  commonFailure: string;
  commonModels: string;
  turnaround: string;
  warranty: string;
  specialistFocus: string;
  financeAngle: string;
  valueAngle: string;
  authorityLine: string;
};

export type HomeFaqAnswerBlock =
  | {
      type: "paragraph";
      lead?: string;
      text: string;
    }
  | {
      type: "bullets";
      items: readonly string[];
    };

export type HomeFaqClusterGuide = {
  eyebrow: string;
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

export type HomeFaqItem = {
  id: string;
  clusterId: HomeFaqClusterId;
  brandId: HomeFaqBrandId;
  question: string;
  answer: readonly HomeFaqAnswerBlock[];
  ctaText: string;
  href: string;
};

export const homeFaqHeader = {
  badge: "ENGINE REPLACEMENT FAQ HUB",
  headingLead: "Your Engine Replacement",
  headingAccent: "Questions, Answered",
  headingTail: "by Brand and Topic.",
  subtext: "10 topic clusters. 10 brands. 800+ questions answered.",
  searchPlaceholder: "Search FAQs - e.g. BMW timing chain cost",
};

export const homeFaqClusters: HomeFaqCluster[] = [
  { id: "costs", number: "1.", label: "Engine Replacement Costs", count: 10, icon: "pound" },
  { id: "failures", number: "2.", label: "Common Engine Failures", count: 10, icon: "warning" },
  { id: "types", number: "3.", label: "Engine Types & Buying Options", count: 10, icon: "layers" },
  { id: "rebuild-vs-replace", number: "4.", label: "Engine Rebuild vs Replacement", count: 10, icon: "scales" },
  { id: "specialists", number: "5.", label: "Engine Specialists & Trust", count: 10, icon: "shield" },
  { id: "compatibility", number: "6.", label: "Engine Compatibility & Codes", count: 10, icon: "chip" },
  { id: "lifespan", number: "7.", label: "Lifespan & Reliability", count: 10, icon: "clock" },
  { id: "process", number: "8.", label: "Process & Timelines", count: 10, icon: "process" },
  { id: "value", number: "9.", label: "Vehicle Value & Finances", count: 10, icon: "chart" },
  { id: "authority", number: "10.", label: "Brand Engine Authority", count: 10, icon: "star" },
];

export const homeFaqBrands: HomeFaqBrand[] = [
  {
    id: "bmw",
    label: "BMW",
    slug: "bmw",
    logoSrc: "/images/home/brand-logos/bmw.png",
    replacementCost: "GBP 2,400-7,500",
    reconCost: "GBP 2,400-5,700",
    usedCost: "GBP 1,200-3,100",
    supplyFitCost: "GBP 600-1,300",
    dealerSaving: "25-40%",
    commonEngine: "N47 / B47 2.0 diesel",
    commonFailure: "timing chain wear, oil starvation and turbo damage",
    commonModels: "1 Series, 3 Series, 5 Series, X3 and X5",
    turnaround: "3-5 working days",
    warranty: "12-24 months",
    specialistFocus: "diesel timing-chain failures and late-model BMW fitment",
    financeAngle: "higher-value premium cars where the right replacement can protect resale",
    valueAngle: "worth considering when the car is otherwise strong on body, gearbox and history",
    authorityLine: "BMW enquiries are led by 2.0 diesel chain-related failures and careful VIN-level fitment checks.",
  },
  {
    id: "land-rover",
    label: "Land Rover",
    slug: "land-rover",
    logoSrc: "/images/home/brand-logos/land-rover.png",
    replacementCost: "GBP 3,200-8,200",
    reconCost: "GBP 3,200-6,800",
    usedCost: "GBP 1,900-4,200",
    supplyFitCost: "GBP 800-1,500",
    dealerSaving: "30-45%",
    commonEngine: "Ingenium 2.0 and TDV6 / SDV6 diesel",
    commonFailure: "timing chain stretch, crank damage and turbo-related contamination",
    commonModels: "Discovery Sport, Discovery 4, Defender and Freelander",
    turnaround: "4-6 working days",
    warranty: "12-24 months",
    specialistFocus: "Ingenium, TDV6 and supply-and-fit off-road applications",
    financeAngle: "vehicles where avoiding dealer pricing makes the repair far more viable",
    valueAngle: "best where the chassis, electronics and suspension still justify the spend",
    authorityLine: "Land Rover cases need extra attention on engine code, ancillaries and contamination after major failures.",
  },
  {
    id: "jaguar",
    label: "Jaguar",
    slug: "jaguar",
    logoSrc: "/images/home/brand-logos/jaguar.png",
    replacementCost: "GBP 2,800-7,000",
    reconCost: "GBP 2,800-5,900",
    usedCost: "GBP 1,700-3,800",
    supplyFitCost: "GBP 700-1,400",
    dealerSaving: "25-40%",
    commonEngine: "AJ200D 2.0 diesel and V6 diesel units",
    commonFailure: "timing chain problems, turbo failure and oil dilution",
    commonModels: "XF, XE, F-Pace and E-Pace",
    turnaround: "3-5 working days",
    warranty: "12-24 months",
    specialistFocus: "Ingenium-family diesel failures and premium-saloon supply and fit",
    financeAngle: "cars where a specialist route often keeps the repair below dealer territory",
    valueAngle: "most sensible when trim, transmission and electronics remain in good order",
    authorityLine: "Jaguar replacement work often overlaps with the same Ingenium concerns seen across the wider JLR family.",
  },
  {
    id: "mercedes",
    label: "Mercedes",
    slug: "mercedes-benz",
    logoSrc: "/images/home/brand-logos/mercedes-benz.png",
    replacementCost: "GBP 2,600-7,200",
    reconCost: "GBP 2,600-5,800",
    usedCost: "GBP 1,500-3,700",
    supplyFitCost: "GBP 650-1,350",
    dealerSaving: "20-35%",
    commonEngine: "OM651 and OM654 diesel",
    commonFailure: "injector issues, oil dilution and timing-chain wear",
    commonModels: "C-Class, E-Class, GLC and Sprinter",
    turnaround: "3-5 working days",
    warranty: "12-24 months",
    specialistFocus: "diesel saloon, SUV and van applications with precise code matching",
    financeAngle: "vehicles where a specialist quote can be materially lower than dealer-led repair paths",
    valueAngle: "often worthwhile on premium cars and commercial vehicles with otherwise strong history",
    authorityLine: "Mercedes replacement quotes often turn on injector history, emissions equipment and exact engine variant.",
  },
  {
    id: "audi",
    label: "Audi",
    slug: "audi",
    logoSrc: "/images/home/brand-logos/audi.png",
    replacementCost: "GBP 2,000-6,200",
    reconCost: "GBP 2,000-5,100",
    usedCost: "GBP 1,200-3,300",
    supplyFitCost: "GBP 600-1,250",
    dealerSaving: "25-40%",
    commonEngine: "2.0 TDI and 3.0 TDI VAG engines",
    commonFailure: "timing issues, EGR faults and turbo wear",
    commonModels: "A4, A6, Q5 and Q7",
    turnaround: "3-5 working days",
    warranty: "12-24 months",
    specialistFocus: "VAG diesel fitment, ECU compatibility and multi-variant engine codes",
    financeAngle: "repairs where the specialist route is usually much stronger value than a main-dealer engine",
    valueAngle: "best when the gearbox, driveline and emissions systems remain worth preserving",
    authorityLine: "Audi engine replacement planning usually starts with exact VAG code matching rather than model name alone.",
  },
  {
    id: "volkswagen",
    label: "Volkswagen",
    slug: "volkswagen",
    logoSrc: "/images/home/brand-logos/volkswagen.png",
    replacementCost: "GBP 1,800-4,800",
    reconCost: "GBP 1,800-4,000",
    usedCost: "GBP 900-2,600",
    supplyFitCost: "GBP 550-1,150",
    dealerSaving: "25-40%",
    commonEngine: "2.0 TDI and 1.6 TDI",
    commonFailure: "injector wear, EGR faults and timing-related damage",
    commonModels: "Golf, Passat, Tiguan and Transporter",
    turnaround: "2-5 working days",
    warranty: "12-24 months",
    specialistFocus: "high-volume VAG diesel sourcing and rapid UK turnaround",
    financeAngle: "mainstream vehicles where price transparency matters more than brand prestige",
    valueAngle: "especially viable where the rest of the car is tidy and mileage is realistic for its age",
    authorityLine: "Volkswagen replacement demand is driven by common-volume diesel engines and strong parts availability.",
  },
  {
    id: "ford",
    label: "Ford",
    slug: "ford",
    logoSrc: "/images/home/brand-logos/ford.png",
    replacementCost: "GBP 1,400-3,800",
    reconCost: "GBP 1,400-3,200",
    usedCost: "GBP 700-1,900",
    supplyFitCost: "GBP 500-1,050",
    dealerSaving: "20-35%",
    commonEngine: "1.0 EcoBoost and 2.0 TDCi / EcoBlue",
    commonFailure: "coolant-related damage, injector issues and turbo wear",
    commonModels: "Fiesta, Focus, Transit and Kuga",
    turnaround: "2-4 working days",
    warranty: "12-24 months",
    specialistFocus: "EcoBoost, TDCi and van-focused supply and fit work",
    financeAngle: "jobs where keeping the total below the car's value is essential",
    valueAngle: "most sensible when the body, clutch and turbo system still justify the investment",
    authorityLine: "Ford pricing is usually driven by engine family and availability rather than badge prestige.",
  },
  {
    id: "vauxhall",
    label: "Vauxhall",
    slug: "vauxhall",
    logoSrc: "/images/home/brand-logos/vauxhall.png",
    replacementCost: "GBP 1,200-3,200",
    reconCost: "GBP 1,200-2,800",
    usedCost: "GBP 650-1,700",
    supplyFitCost: "GBP 500-1,000",
    dealerSaving: "20-35%",
    commonEngine: "1.6 CDTi and 2.0 CDTi",
    commonFailure: "timing issues, EGR problems and lubrication-related wear",
    commonModels: "Astra, Insignia, Corsa and Vivaro",
    turnaround: "2-4 working days",
    warranty: "12-24 months",
    specialistFocus: "cost-led mainstream replacement jobs and quick availability",
    financeAngle: "repairs where owners want predictable pricing before committing",
    valueAngle: "best where the replacement restores practical use without exceeding vehicle value",
    authorityLine: "Vauxhall engine quotes are often decided by engine code, emissions equipment and labour access.",
  },
  {
    id: "hyundai",
    label: "Hyundai",
    slug: "hyundai",
    logoSrc: "/images/home/brand-logos/hyundai.png",
    replacementCost: "GBP 1,500-3,600",
    reconCost: "GBP 1,500-3,000",
    usedCost: "GBP 750-1,900",
    supplyFitCost: "GBP 500-1,050",
    dealerSaving: "20-35%",
    commonEngine: "1.6 CRDi and 1.7 CRDi",
    commonFailure: "DPF blockage, injector wear and fuel-system issues",
    commonModels: "i30, Tucson, Santa Fe and ix35",
    turnaround: "2-4 working days",
    warranty: "12-24 months",
    specialistFocus: "diesel family-car applications with strong parts interchange knowledge",
    financeAngle: "value-led repairs where owners still want warranty-backed options",
    valueAngle: "a good fit when the car remains dependable aside from the engine event",
    authorityLine: "Hyundai replacements are usually straightforward when the engine code and ancillaries are verified early.",
  },
  {
    id: "toyota",
    label: "Toyota",
    slug: "toyota",
    logoSrc: "/images/home/brand-logos/toyota.png",
    replacementCost: "GBP 1,600-3,900",
    reconCost: "GBP 1,600-3,300",
    usedCost: "GBP 800-2,100",
    supplyFitCost: "GBP 500-1,050",
    dealerSaving: "20-35%",
    commonEngine: "1.3 petrol, 2.0 diesel and hybrid-adjacent petrol units",
    commonFailure: "oil consumption, overheating damage and diesel emissions faults",
    commonModels: "Yaris, Corolla, RAV4 and Avensis",
    turnaround: "2-4 working days",
    warranty: "12-24 months",
    specialistFocus: "reliable mainstream sourcing with careful spec checking on newer drivetrains",
    financeAngle: "repairs where long-term ownership can still justify a quality recon unit",
    valueAngle: "particularly sensible on well-kept Toyotas with strong service history",
    authorityLine: "Toyota cases usually hinge on condition, mileage and whether a repair or replacement offers the cleaner long-term outcome.",
  },
];

export const homeFaqGuides: Partial<Record<HomeFaqClusterId, HomeFaqClusterGuide>> = rawHomeFaqClusterGuides;

function getCtaText(brand: HomeFaqBrand, clusterId: HomeFaqClusterId) {
  if (clusterId === "costs") {
    return `Compare ${brand.label} engine replacement quotes from vetted UK specialists →`;
  }

  if (clusterId === "failures") {
    return `Compare ${brand.label} engine failure replacement quotes from vetted UK specialists →`;
  }

  if (clusterId === "process") {
    return `Get ${brand.label} engine replacement quotes with turnaround estimates →`;
  }

  if (clusterId === "value") {
    return `Get ${brand.label} engine replacement quotes vs vehicle value →`;
  }

  if (clusterId === "authority") {
    return `Compare ${brand.label} engine replacement by engine family and code →`;
  }

  return `Compare ${brand.label} engine replacement quotes from vetted UK specialists →`;
}

function buildCostsFaq(brand: HomeFaqBrand, index: number) {
  switch (index) {
    case 0:
      return {
        question: `How much does a ${brand.label} engine replacement cost in the UK?`,
        highlight: brand.replacementCost,
        body: ` is the usual specialist range for a supplied-and-fitted ${brand.label} replacement. Used engines often start nearer ${brand.usedCost}, while dealer-led solutions are commonly ${brand.dealerSaving} higher.`,
      };
    case 1:
      return {
        question: `What is the cost of a reconditioned ${brand.label} engine?`,
        highlight: brand.reconCost,
        body: ` is the typical reconditioned price band for ${brand.label} engines. The final quote depends on engine code, warranty term and whether supply and fit are included together.`,
      };
    case 2:
      return {
        question: `How much does ${brand.label} engine supply and fit cost?`,
        highlight: brand.supplyFitCost,
        body: ` is the labour and install allowance most customers should expect on top of the engine itself. Accessibility, ancillaries and contamination from the failed unit all affect the final figure.`,
      };
    case 3:
      return {
        question: `Is a used ${brand.label} engine cheaper than reconditioned?`,
        highlight: brand.usedCost,
        body: ` is where used units usually begin, so they can be cheaper upfront. Reconditioned engines cost more but usually come with a stronger warranty and clearer preparation standards.`,
      };
    case 4:
      return {
        question: `How much more do dealers charge for a ${brand.label} engine replacement?`,
        highlight: brand.dealerSaving,
        body: ` is the kind of saving owners often see when comparing vetted independent specialists against dealer pricing, especially on reconditioned or rebuilt routes.`,
      };
    case 5:
      return {
        question: `Which ${brand.label} models are usually the most expensive for engine replacement?`,
        highlight: brand.commonModels,
        body: ` are the models we most often see pushing quotes upward because of engine size, packaging complexity and the cost of fitting work around the unit.`,
      };
    case 6:
      return {
        question: `What changes the final price of a ${brand.label} replacement engine quote?`,
        highlight: "Engine code, condition, warranty and labour access",
        body: ` are the four biggest pricing drivers. The same ${brand.label} model can have multiple engines, so exact fitment matters far more than the badge alone.`,
      };
    case 7:
      return {
        question: `Are rebuilt ${brand.label} engines worth the extra cost?`,
        highlight: "Usually yes after a serious internal failure",
        body: ` because rebuilt units let specialists address worn surfaces and known weak points. They cost more than used engines, but the risk profile is usually lower.`,
      };
    case 8:
      return {
        question: `Do warranty length and price move together on ${brand.label} engine quotes?`,
        highlight: brand.warranty,
        body: ` is the normal coverage window for quality specialist supply. Longer warranty-backed options often sit slightly higher in price, but they give better protection against repeat spend.`,
      };
    default:
      return {
        question: `When should I get multiple ${brand.label} engine replacement quotes?`,
        highlight: "Always before committing",
        body: ` because one supplier may be stronger on used stock, another on recon, and another on supply and fit. Comparing warranty, turnaround and exact spec is how most owners save money safely.`,
      };
  }
}

function buildFailuresFaq(brand: HomeFaqBrand, index: number) {
  switch (index) {
    case 0:
      return {
        question: `What engine problems most commonly lead to ${brand.label} replacement?`,
        highlight: brand.commonFailure,
        body: ` are the patterns we see most often on ${brand.label} enquiries. Once metal contamination or low oil pressure is involved, replacement often becomes the cleaner route.`,
      };
    case 1:
      return {
        question: `Which ${brand.label} models most commonly need replacement engines?`,
        highlight: brand.commonModels,
        body: ` are the vehicles most frequently linked to serious engine-failure conversations through the UK specialist market.`,
      };
    case 2:
      return {
        question: `Does a timing-chain failure usually mean a full ${brand.label} engine replacement?`,
        highlight: "Often yes if internal damage follows",
        body: ` because bent valves, piston contact and oil contamination quickly push the job past a simple chain repair. That is especially true on engines already known for repeated failure.`,
      };
    case 3:
      return {
        question: `Can turbo failure damage a ${brand.label} engine beyond repair?`,
        highlight: "Yes if debris or oil starvation reaches the internals",
        body: ` and that is why specialists inspect contamination carefully before recommending repair, rebuild or replacement.`,
      };
    case 4:
      return {
        question: `What warning signs suggest my ${brand.label} engine is close to failure?`,
        highlight: "Knocking, smoke, oil-pressure warnings and sudden power loss",
        body: ` are the signs owners should treat seriously. The earlier you stop using the vehicle, the better the chance of avoiding a more expensive outcome.`,
      };
    case 5:
      return {
        question: `Is overheating enough to write off a ${brand.label} engine?`,
        highlight: "It can be if the head, block or bearings are affected",
        body: ` and that is why a pressure test alone is not always enough. Persistent overheating can cause damage that only shows once the unit is stripped or replaced.`,
      };
    case 6:
      return {
        question: `Are injector problems a reason to replace a ${brand.label} engine?`,
        highlight: "Only when they trigger wider internal damage",
        body: ` such as piston wash, bore scoring or serious contamination. In many cases injectors are repairable, but delayed diagnosis can escalate the job.`,
      };
    case 7:
      return {
        question: `How do specialists confirm whether a failed ${brand.label} engine can be saved?`,
        highlight: "Compression, leak-down and contamination checks",
        body: ` help separate repairable faults from failures that justify a replacement. The answer usually depends on what happened after the first symptom appeared.`,
      };
    case 8:
      return {
        question: `Do diesel ${brand.label} engines fail differently from petrol ones?`,
        highlight: "Usually yes",
        body: ` because diesel failures often involve injectors, turbos, oil pressure and emissions equipment, while petrol cases more often turn on overheating, chain issues or lubrication loss.`,
      };
    default:
      return {
        question: `What failure pattern is most common on ${brand.label} enquiries right now?`,
        highlight: brand.commonFailure,
        body: ` still leads the volume, which is why many buyers compare reconditioned and rebuilt options before they commit to repair or replacement.`,
      };
  }
}

function buildTypesFaq(brand: HomeFaqBrand, index: number) {
  switch (index) {
    case 0:
      return {
        question: `What is the cheapest replacement engine option for ${brand.label}?`,
        highlight: "Used supply-only engines are usually the lowest entry point",
        body: ` starting from around ${brand.usedCost}. They suit budget-led jobs, but the warranty and preparation are usually lighter than a recon or rebuild.`,
      };
    case 1:
      return {
        question: `When should I choose a reconditioned ${brand.label} engine?`,
        highlight: "When you want the best balance of cost and reassurance",
        body: ` because reconditioned units normally sit in the middle of the market: cheaper than a full rebuild, stronger than a used take-out engine and usually backed by warranty.`,
      };
    case 2:
      return {
        question: `Are rebuilt ${brand.label} engines better than used ones?`,
        highlight: "Usually yes after serious failure",
        body: ` because a rebuilt unit allows known wear points to be addressed properly. Used engines remain attractive on price, but they carry more uncertainty around history and remaining life.`,
      };
    case 3:
      return {
        question: `What does supply and fit include on a ${brand.label} engine quote?`,
        highlight: "Removal, installation, fluids and workmanship cover",
        body: ` are usually bundled into supply-and-fit packages. Always confirm what happens to ancillaries, coding and any contamination clean-up before approving the work.`,
      };
    case 4:
      return {
        question: `Is a remanufactured ${brand.label} engine worth considering?`,
        highlight: "Yes if you want factory-like preparation without new-OEM pricing",
        body: ` although availability depends on the exact engine family. Remanufactured options sit above recon and are often chosen for premium or newer vehicles.`,
      };
    case 5:
      return {
        question: `What warranty should I expect on a ${brand.label} replacement engine?`,
        highlight: brand.warranty,
        body: ` is the normal specialist range for reconditioned and rebuilt units. Used engines may carry shorter terms, so always compare warranty with price rather than price alone.`,
      };
    case 6:
      return {
        question: `Can I buy a ${brand.label} engine supply-only and use my own garage?`,
        highlight: "Yes in most cases",
        body: ` but you will need the exact engine code and a garage willing to confirm fitment. This route is common when owners already trust a local installer.`,
      };
    case 7:
      return {
        question: `Is a refurbished ${brand.label} engine the same as reconditioned?`,
        highlight: "No",
        body: ` because refurbished usually means inspected and refreshed, while reconditioned normally implies a deeper strip, cleaning and component replacement process.`,
      };
    case 8:
      return {
        question: `Which ${brand.label} replacement option is best for keeping the car long-term?`,
        highlight: "Reconditioned or rebuilt",
        body: ` because they offer a stronger balance of reliability, paperwork and warranty than a used take-out unit for owners planning to keep the car.`,
      };
    default:
      return {
        question: `How do I compare used, reconditioned and rebuilt ${brand.label} quotes properly?`,
        highlight: "Check engine code, warranty, mileage and what is included",
        body: ` before comparing the headline price. Two quotes can look similar until you check whether fitting, ancillaries and delivery are included.`,
      };
  }
}

function buildRebuildFaq(brand: HomeFaqBrand, index: number) {
  switch (index) {
    case 0:
      return {
        question: `When is a ${brand.label} engine rebuild better than replacement?`,
        highlight: "When the original unit is rebuildable and worth saving",
        body: ` usually because the block and major castings are still sound. If the damage is localised, a rebuild can preserve the original engine and still fix core wear.`,
      };
    case 1:
      return {
        question: `When is replacement better than rebuilding a ${brand.label} engine?`,
        highlight: "When the damage is widespread or time matters",
        body: ` because heavy contamination, cracked components or catastrophic failure often make a ready-to-fit replacement the faster and safer path.`,
      };
    case 2:
      return {
        question: `Is rebuilding a failed ${brand.label} engine cheaper than fitting a recon unit?`,
        highlight: "Not always",
        body: ` because labour, machining and parts can move quickly once the unit is stripped. Many owners compare a rebuild against a recon engine before they commit.`,
      };
    case 3:
      return {
        question: `Can a seized ${brand.label} engine usually be rebuilt?`,
        highlight: "Sometimes, but not reliably enough to assume",
        body: ` because seizure often points to deep internal damage. A strip-down is needed before any honest answer can be given.`,
      };
    case 4:
      return {
        question: `Do specialists rebuild the same weak points on ${brand.label} engines?`,
        highlight: "Yes, that is one of the main reasons buyers choose a rebuild",
        body: ` because experienced workshops know the recurring failure points and can address them while the engine is apart.`,
      };
    case 5:
      return {
        question: `Will a rebuilt ${brand.label} engine last longer than a used replacement?`,
        highlight: "Often yes",
        body: ` because inspection, machining and refreshed components usually give a better starting point than an unknown used engine history.`,
      };
    case 6:
      return {
        question: `Do rebuilt ${brand.label} engines come with warranty?`,
        highlight: brand.warranty,
        body: ` is the normal specialist expectation. Warranty details still vary, so check what is covered and whether fitting must be done by an approved installer.`,
      };
    case 7:
      return {
        question: `How long does a ${brand.label} engine rebuild usually take?`,
        highlight: brand.turnaround,
        body: ` is a sensible planning window for a specialist replacement route, while a full rebuild can take longer if machining or parts sourcing becomes necessary.`,
      };
    case 8:
      return {
        question: `Can I compare rebuild and replacement quotes for the same ${brand.label} engine?`,
        highlight: "Yes and you should",
        body: ` because the right answer depends on damage, timescale and what the car is worth to you. Good specialists will explain both routes clearly.`,
      };
    default:
      return {
        question: `What usually decides rebuild versus replacement on a ${brand.label}?`,
        highlight: "Damage level, turnaround and total landed cost",
        body: ` are the deciding factors. Once those are clear, the best route is usually obvious.`,
      };
  }
}

function buildSpecialistFaq(brand: HomeFaqBrand, index: number) {
  switch (index) {
    case 0:
      return {
        question: `How do I choose a trusted ${brand.label} engine specialist?`,
        highlight: "Look for code-matching, written warranty and clear quote breakdowns",
        body: ` rather than choosing on headline price alone. The strongest specialists explain what is included and what has been checked.`,
      };
    case 1:
      return {
        question: `What should a proper ${brand.label} engine quote include?`,
        highlight: "Engine type, engine code, warranty, delivery and fitting detail",
        body: ` should all be listed clearly. If those details are missing, the quote is not detailed enough to compare safely.`,
      };
    case 2:
      return {
        question: `Are independent ${brand.label} engine specialists better value than dealers?`,
        highlight: brand.dealerSaving,
        body: ` is the sort of difference many buyers see, especially when comparing recon or rebuilt options with specialist supply and fit.`,
      };
    case 3:
      return {
        question: `Can I trust a warranty on a ${brand.label} replacement engine?`,
        highlight: "Yes, if the terms are written and specific",
        body: ` and if the supplier explains what is covered, how claims work and whether installation conditions apply.`,
      };
    case 4:
      return {
        question: `Do specialists need my registration or engine code for a ${brand.label} quote?`,
        highlight: "Yes, preferably both",
        body: ` because accurate code matching prevents the wrong unit being quoted or delivered. That matters even more on brands with multiple engine variants per model.`,
      };
    case 5:
      return {
        question: `Should I ask whether the specialist works on ${brand.label} engines regularly?`,
        highlight: brand.specialistFocus,
        body: ` is the type of experience you want to hear about. Brand familiarity matters when a job involves known failure points or coding differences.`,
      };
    case 6:
      return {
        question: `What are the red flags on a ${brand.label} engine supplier?`,
        highlight: "No engine code confirmation, no warranty detail and vague pricing",
        body: ` are the biggest warning signs. If the quote is not transparent, it is hard to trust the outcome.`,
      };
    case 7:
      return {
        question: `Can a specialist recover my ${brand.label} if it is off the road?`,
        highlight: "Often yes",
        body: ` especially on supply-and-fit enquiries. Recovery and diagnostics can usually be bundled into the workshop route.`,
      };
    case 8:
      return {
        question: `Do vetted specialists help compare multiple ${brand.label} engine options?`,
        highlight: "Yes, that is exactly where comparison saves money",
        body: ` because one supplier may be stronger on used stock, another on recon, and another on full supply and fit.`,
      };
    default:
      return {
        question: `Why does specialist experience matter so much on ${brand.label} engine jobs?`,
        highlight: "Because fitment mistakes are expensive",
        body: ` and brand familiarity reduces the chance of quoting the wrong code, missing a known weak point or underestimating labour.`,
      };
  }
}

function buildCompatibilityFaq(brand: HomeFaqBrand, index: number) {
  switch (index) {
    case 0:
      return {
        question: `Why does engine code matter on a ${brand.label} replacement?`,
        highlight: "Because the same model can use multiple different engines",
        body: ` and mounts, ancillaries, fuelling and ECU compatibility can all change. Code-level matching is safer than model-name matching.`,
      };
    case 1:
      return {
        question: `Can I swap a different ${brand.label} engine code into my car?`,
        highlight: "Sometimes, but only after careful fitment checks",
        body: ` because wiring, emissions equipment and gearbox compatibility can all block a simple swap.`,
      };
    case 2:
      return {
        question: `Do I need the VIN for a ${brand.label} engine quote?`,
        highlight: "It helps a lot",
        body: ` because it confirms the exact original engine specification and reduces the risk of ordering the wrong unit.`,
      };
    case 3:
      return {
        question: `Are used ${brand.label} engines supplied with ancillaries?`,
        highlight: "Sometimes, but never assume",
        body: ` because ancillaries vary by supplier. Always ask whether turbo, injectors, manifolds and pumps are included or transferred from your old unit.`,
      };
    case 4:
      return {
        question: `Can an ECU or immobiliser stop a ${brand.label} engine swap?`,
        highlight: "Yes",
        body: ` especially on newer vehicles. Coding, sensors and emissions hardware all need to match the chosen engine route.`,
      };
    case 5:
      return {
        question: `How do specialists verify a compatible ${brand.label} replacement engine?`,
        highlight: "Registration, VIN, engine code and build-year checks",
        body: ` are normally used together, which is why accurate initial vehicle details save time and prevent mistakes.`,
      };
    case 6:
      return {
        question: `Can two ${brand.label} engines with the same size still be incompatible?`,
        highlight: "Yes",
        body: ` because displacement alone does not confirm fuelling, emissions spec, turbo setup or ECU requirements.`,
      };
    case 7:
      return {
        question: `Should I quote the exact ${brand.commonEngine} family when asking about ${brand.label}?`,
        highlight: "Yes if you know it",
        body: ` because suppliers can narrow the right options faster when they know the engine family and not just the model badge.`,
      };
    case 8:
      return {
        question: `Do specialist quotes account for emissions and Euro-spec differences on ${brand.label}?`,
        highlight: "They should",
        body: ` especially on newer diesels. Euro spec, DPF setup and ancillaries can materially change which engine is correct.`,
      };
    default:
      return {
        question: `What is the safest way to avoid buying the wrong ${brand.label} engine?`,
        highlight: "Use registration and code verification before payment",
        body: ` and make sure the quote states the exact engine being supplied, not just the model name.`,
      };
  }
}

function buildLifespanFaq(brand: HomeFaqBrand, index: number) {
  switch (index) {
    case 0:
      return {
        question: `How long should a replacement ${brand.label} engine last?`,
        highlight: "It depends on quality, maintenance and the type of replacement chosen",
        body: ` but a well-prepared reconditioned or rebuilt unit should offer a meaningful second life when serviced properly.`,
      };
    case 1:
      return {
        question: `Are reconditioned ${brand.label} engines reliable for daily use?`,
        highlight: "Yes when they are properly prepared and correctly fitted",
        body: ` which is why warranty, invoice detail and specialist reputation matter more than price alone.`,
      };
    case 2:
      return {
        question: `Do used ${brand.label} engines carry more risk than rebuilt ones?`,
        highlight: "Usually yes",
        body: ` because a used unit always carries more uncertainty around wear history, storage and prior maintenance.`,
      };
    case 3:
      return {
        question: `What helps a replacement ${brand.label} engine last longer?`,
        highlight: "Correct oil, shorter service intervals and fixing related faults",
        body: ` are the biggest controllables once the engine is installed. Ignoring cooling, fuelling or turbo issues can shorten life quickly.`,
      };
    case 4:
      return {
        question: `Does warranty length tell me anything about ${brand.label} engine reliability?`,
        highlight: "Usually yes",
        body: ` because longer written cover often reflects more confidence in preparation standards, though it is still not a substitute for fitment quality.`,
      };
    case 5:
      return {
        question: `Can a replacement ${brand.label} engine be more reliable than the original?`,
        highlight: "Sometimes",
        body: ` especially when a known weak point is addressed during reconditioning or rebuild work.`,
      };
    case 6:
      return {
        question: `Should I replace ancillaries when fitting a ${brand.label} engine?`,
        highlight: "Where needed, yes",
        body: ` because tired injectors, turbos, coolers or pumps can compromise a good replacement unit if they are simply reused without checks.`,
      };
    case 7:
      return {
        question: `Are lower-mileage used ${brand.label} engines always the best choice?`,
        highlight: "Not always",
        body: ` because mileage matters, but service history, storage and the known behaviour of that engine family matter too.`,
      };
    case 8:
      return {
        question: `What reliability questions should I ask before buying a ${brand.label} replacement engine?`,
        highlight: "Ask about code match, preparation, test checks and warranty",
        body: ` so you understand both the engine itself and the support behind it.`,
      };
    default:
      return {
        question: `Is a replacement ${brand.label} engine worth it for long-term ownership?`,
        highlight: brand.valueAngle,
        body: ` and that is usually the deciding context. If the rest of the vehicle is strong, a good engine can reset the ownership picture.`,
      };
  }
}

function buildProcessFaq(brand: HomeFaqBrand, index: number) {
  switch (index) {
    case 0:
      return {
        question: `How long does a ${brand.label} engine replacement usually take?`,
        highlight: brand.turnaround,
        body: ` is the normal specialist window once the engine choice is agreed. Complications around ancillaries or contamination can extend that slightly.`,
      };
    case 1:
      return {
        question: `How quickly can I get a ${brand.label} engine quote after sending my details?`,
        highlight: "Often the same day",
        body: ` especially when the registration, engine code and symptoms are clear from the start.`,
      };
    case 2:
      return {
        question: `What happens after I request ${brand.label} engine quotes?`,
        highlight: "Your vehicle details are matched, checked and sent to relevant specialists",
        body: ` so you can compare price, warranty and supply-and-fit options without guessing on compatibility.`,
      };
    case 3:
      return {
        question: `Do I need to approve diagnostics before a ${brand.label} engine replacement?`,
        highlight: "Sometimes",
        body: ` because some specialists will want to confirm the failure path before finalising the engine route or labour scope.`,
      };
    case 4:
      return {
        question: `Can specialists collect my ${brand.label} if it will not start?`,
        highlight: "Yes in many supply-and-fit cases",
        body: ` and that is often the cleanest route when the car is already off the road.`,
      };
    case 5:
      return {
        question: `When do I pay for a ${brand.label} replacement engine job?`,
        highlight: "Usually in stages",
        body: ` with the exact pattern depending on whether the job is supply-only or full supply and fit. Ask for the payment schedule before approving the work.`,
      };
    case 6:
      return {
        question: `What delays ${brand.label} engine replacements most often?`,
        highlight: "Code mismatch, contamination and parts availability",
        body: ` are the main causes of delay. Clear fitment info and an honest initial diagnosis help keep the job moving.`,
      };
    case 7:
      return {
        question: `Will a specialist test my ${brand.label} after the engine is fitted?`,
        highlight: "Yes, they should",
        body: ` because post-fit checks, leak checks and road-testing are part of a proper supply-and-fit process.`,
      };
    case 8:
      return {
        question: `Can I compare turnaround times as well as price on ${brand.label} quotes?`,
        highlight: "Absolutely",
        body: ` because the cheapest quote is not always the best if the vehicle is off the road and you need it back quickly.`,
      };
    default:
      return {
        question: `What should I have ready before asking for ${brand.label} engine quotes?`,
        highlight: "Registration, symptoms, mileage and any known engine code",
        body: ` help suppliers quote faster and more accurately from the first conversation.`,
      };
  }
}

function buildValueFaq(brand: HomeFaqBrand, index: number) {
  switch (index) {
    case 0:
      return {
        question: `Is a ${brand.label} engine replacement worth it financially?`,
        highlight: brand.financeAngle,
        body: ` is the right way to think about it. The answer depends on the rest of the car, the ownership plan and what a comparable replacement vehicle would cost.`,
      };
    case 1:
      return {
        question: `Will a replacement engine improve the value of my ${brand.label}?`,
        highlight: "It can support value, but rarely returns every pound spent",
        body: ` because buyers value a healthy drivetrain and paperwork, yet the wider condition of the vehicle still matters most.`,
      };
    case 2:
      return {
        question: `Should I replace the engine or sell my failed ${brand.label} as it is?`,
        highlight: "Compare the repair cost with the value of a healthy example",
        body: ` and be honest about the rest of the car. If the body, gearbox and history are good, replacement is often easier to justify.`,
      };
    case 3:
      return {
        question: `Can I finance a ${brand.label} engine replacement?`,
        highlight: "Some workshops offer staged or assisted payment options",
        body: ` but availability varies, so ask early if budget management is important to you.`,
      };
    case 4:
      return {
        question: `Does a warranty-backed ${brand.label} engine help resale confidence?`,
        highlight: "Yes",
        body: ` because paperwork, receipts and written cover all make the story easier for the next buyer to trust.`,
      };
    case 5:
      return {
        question: `Is supply and fit better value than arranging my own ${brand.label} install?`,
        highlight: "Often yes when the labour risk is high",
        body: ` because a single specialist can take ownership of compatibility, installation and workmanship.`,
      };
    case 6:
      return {
        question: `What if my ${brand.label} needs other work besides the engine?`,
        highlight: "Add those costs before deciding",
        body: ` because clutch, turbo, DPF, cooling and gearbox issues can all change whether the project still stacks up.`,
      };
    case 7:
      return {
        question: `Are used ${brand.label} engines good for low-value cars?`,
        highlight: "They often are",
        body: ` because they can keep an older car viable when a full rebuild or recon would overshoot the vehicle's value.`,
      };
    case 8:
      return {
        question: `How do I judge whether my ${brand.label} is worth saving?`,
        highlight: brand.valueAngle,
        body: ` should be your starting test, together with rust, electronics, gearbox health and service history.`,
      };
    default:
      return {
        question: `Can comparing multiple ${brand.label} engine quotes materially change the outcome?`,
        highlight: "Yes",
        body: ` because price, warranty and turnaround often move enough between suppliers to change whether the job makes financial sense.`,
      };
  }
}

function buildAuthorityFaq(brand: HomeFaqBrand, index: number) {
  switch (index) {
    case 0:
      return {
        question: `What makes ${brand.label} engine replacement different from a generic quote?`,
        highlight: brand.authorityLine,
        body: ` That is why brand-aware specialists usually deliver better-fit quotes than general assumptions based on badge alone.`,
      };
    case 1:
      return {
        question: `Which ${brand.label} engine family is asked about most often in the UK?`,
        highlight: brand.commonEngine,
        body: ` is one of the most common reference points in specialist conversations because it drives both price and known-failure context.`,
      };
    case 2:
      return {
        question: `Why do specialists talk about known weak points on ${brand.label} engines?`,
        highlight: "Because it changes what a safe replacement should include",
        body: ` and it helps buyers understand whether a used, reconditioned or rebuilt route makes more sense.`,
      };
    case 3:
      return {
        question: `Do ${brand.label} engine quotes depend more on the badge or the engine code?`,
        highlight: "Engine code",
        body: ` because the code determines compatibility, ancillaries and often the failure pattern being priced around.`,
      };
    case 4:
      return {
        question: `Is there one best replacement route for every ${brand.label} engine?`,
        highlight: "No",
        body: ` because the right answer changes with the engine family, the failure type and how long you plan to keep the vehicle.`,
      };
    case 5:
      return {
        question: `How do specialists stay current on ${brand.label} replacement patterns?`,
        highlight: "By seeing repeat failures and quoting the same engine families every week",
        body: ` which helps them judge availability, typical spend and the safest route faster than a generalist.`,
      };
    case 6:
      return {
        question: `Why does ${brand.label} expertise matter on newer engines?`,
        highlight: "Because emissions, coding and variant complexity are higher",
        body: ` and small fitment mistakes can become expensive very quickly.`,
      };
    case 7:
      return {
        question: `What should I ask to test whether a supplier really understands ${brand.label} engines?`,
        highlight: "Ask about common failures, code matching and warranty",
        body: ` and see whether the answers are specific or generic. Real brand knowledge sounds concrete.`,
      };
    case 8:
      return {
        question: `Does brand-specific knowledge help reduce quote mistakes on ${brand.label}?`,
        highlight: "Yes",
        body: ` because it improves engine-code accuracy, fitment confidence and labour scoping before the job starts.`,
      };
    default:
      return {
        question: `Why do ${brand.label} owners usually benefit from comparing specialist quotes instead of taking the first answer?`,
        highlight: "Because brand context changes price, risk and suitability",
        body: ` and the best route is clearer once you can compare matched specialists side by side.`,
      };
  }
}

function buildFaqForCluster(clusterId: HomeFaqClusterId, brand: HomeFaqBrand, index: number) {
  if (clusterId === "costs") return buildCostsFaq(brand, index);
  if (clusterId === "failures") return buildFailuresFaq(brand, index);
  if (clusterId === "types") return buildTypesFaq(brand, index);
  if (clusterId === "rebuild-vs-replace") return buildRebuildFaq(brand, index);
  if (clusterId === "specialists") return buildSpecialistFaq(brand, index);
  if (clusterId === "compatibility") return buildCompatibilityFaq(brand, index);
  if (clusterId === "lifespan") return buildLifespanFaq(brand, index);
  if (clusterId === "process") return buildProcessFaq(brand, index);
  if (clusterId === "value") return buildValueFaq(brand, index);
  return buildAuthorityFaq(brand, index);
}

function makeFallbackAnswer(highlight: string, body: string): readonly HomeFaqAnswerBlock[] {
  return [
    {
      type: "paragraph",
      lead: highlight,
      text: body,
    },
  ];
}

type RawOverrideEntry = {
  question: string;
  answer: readonly HomeFaqAnswerBlock[];
  ctaText?: string;
};

type RawOverrideMap = Partial<
  Record<HomeFaqClusterId, Partial<Record<HomeFaqBrandId, readonly RawOverrideEntry[]>>>
>;

const homeFaqOverrides: RawOverrideMap = rawHomeFaqOverrides;

export const homeFaqItems: HomeFaqItem[] = homeFaqBrands.flatMap((brand) =>
  homeFaqClusters.flatMap((cluster) => {
    const overrideEntries = homeFaqOverrides[cluster.id]?.[brand.id];

    if (overrideEntries?.length) {
      return overrideEntries.map((item, index) => ({
        id: `${cluster.id}-${brand.id}-${index + 1}`,
        clusterId: cluster.id,
        brandId: brand.id,
        question: item.question,
        answer: item.answer,
        ctaText: item.ctaText ?? getCtaText(brand, cluster.id),
        href: "#quote-form",
      }));
    }

    return Array.from({ length: cluster.count }, (_, index) => {
      const item = buildFaqForCluster(cluster.id, brand, index);

      return {
        id: `${cluster.id}-${brand.id}-${index + 1}`,
        clusterId: cluster.id,
        brandId: brand.id,
        question: item.question,
        answer: makeFallbackAnswer(item.highlight, item.body),
        ctaText: getCtaText(brand, cluster.id),
        href: "#quote-form",
      };
    });
  }),
);
