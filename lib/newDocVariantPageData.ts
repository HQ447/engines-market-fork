import type { NewDocVariantData } from "@/types/new-doc-variant";
import type { VariantPageData } from "@/types/variant";
import { resolveModelImagePaths } from "@/lib/modelImageAssets";
import { resolveVariantHeroImageOverride } from "@/lib/variantHeroImageOverrides";

type NewDocImages = NewDocVariantData["images"];

type VariantAssetsWithNewDocImages = VariantPageData["assets"] & {
  newDocImages?: Partial<NewDocImages>;
};

// This is deliberately a single shared visual, matching the approved preview
// design. It is independent of each variant's existing model-card image.
const sharedVariantHeroBackground = "/images/shared/variant-hero-background.png";
const sharedCommonProblemsImage = "/images/shared/variant-common-problems.png";

const brandLogoAliases: Record<string, string[]> = {
  "alfa-romeo": ["alpha-romeo"],
  genesis: ["gensis"],
  "mercedes-benz": ["mercedes"],
  volkswagen: ["volkswagon"],
  vw: ["volkswagon"],
};

function resolveBrandLogo(brandSlug: string) {
  const normalizedBrandSlug = brandSlug.trim().toLowerCase();
  const candidates = [
    normalizedBrandSlug,
    ...(brandLogoAliases[normalizedBrandSlug] ?? []),
  ];

  // Brand-logo files live in public/BrandsLogos, but are intentionally not part
  // of image-manifest.json. Use the same dynamic public-asset convention as the
  // approved preview route instead of falling back to the model image.
  return `/BrandsLogos/${candidates.at(-1)}-logo-small.webp.webp`;
}

function splitHeading(value: string) {
  const parts = value.split(/\s+[-—]\s+/);

  if (parts.length < 2) {
    return { titleLead: value, titleAccent: "" };
  }

  return {
    titleLead: parts[0],
    titleAccent: parts.slice(1).join(" — "),
  };
}

function getTimelineItem(value: unknown, fallbackYear: string) {
  const item =
    typeof value === "object" && value !== null
      ? (value as { year?: string; description?: string })
      : undefined;
  const description = typeof value === "string" ? value : item?.description ?? "";
  const match = description.match(/^\*\*(\d{4})\*\*\s*-\s*(.*)$/);

  return {
    year: match?.[1] ?? item?.year ?? fallbackYear,
    text: match?.[2] ?? description,
  };
}

function getSpecPair(value: unknown): [string, string] {
  if (typeof value === "object" && value !== null) {
    const item = value as { label?: string; value?: string };
    return [item.label ?? "", item.value ?? ""];
  }

  if (typeof value === "string") {
    const separator = value.indexOf(":");
    return separator === -1
      ? [value, ""]
      : [value.slice(0, separator).trim(), value.slice(separator + 1).trim()];
  }

  return ["", ""];
}

function getTickerItems(ticker: string) {
  return ticker
    .split("·")
    .map((item) => item.replace(/^\s*[●•]\s*/, "").trim())
    .filter(Boolean);
}

function getImage(
  images: Partial<NewDocImages> | undefined,
  key: keyof NewDocImages,
  fallback: string,
) {
  return images?.[key] || fallback;
}

function getDisplayVariant(
  brandName: string,
  modelName: string,
  modelSlug: string,
  variantName: string,
) {
  const prefixes = [
    `${brandName} ${modelName}`,
    `${brandName} ${modelSlug}`,
    modelName,
    modelSlug,
  ];
  const normalizedVariant = variantName.trim();

  for (const prefix of prefixes) {
    if (normalizedVariant.toLowerCase().startsWith(prefix.toLowerCase())) {
      const remainder = normalizedVariant.slice(prefix.length).trim();
      if (remainder) {
        return remainder;
      }
    }
  }

  return normalizedVariant;
}

function limitCommonCodes(value: string) {
  const match = value.match(/^(\s*common codes\s*:\s*)(.+)$/i);

  if (!match) return value;

  const codes = match[2]
    .split(",")
    .map((code) => code.trim())
    .filter(Boolean)
    .slice(0, 3);

  return `${match[1]}${codes.join(", ")}`;
}

function getVariantEngineCutout(signals: string[]) {
  const content = signals.join(" ").toLowerCase();

  if (/diesel|bluehdi|hdi|tdi|dci|cdi|turbodiesel/.test(content)) {
    return "/images/shared/hero-engines/temporary-diesel-engine-cutout.png";
  }

  if (/performance|gti|amg|m-power|v8|v6|type r|quattro rs/.test(content)) {
    return "/images/shared/hero-engines/temporary-performance-engine-cutout.png";
  }

  return "/images/shared/hero-engines/temporary-petrol-engine-cutout.png";
}

export function mapVariantPageDataToNewDocData(
  source: VariantPageData,
): NewDocVariantData {
  const { brand, model, variant, sections } = source;
  const displayModel = model.slug || model.name;
  const displayVariant = getDisplayVariant(
    brand.name,
    model.name,
    model.slug,
    variant.name,
  );
  const heroHeading = splitHeading(sections.hero.h1);
  const historyHeading = splitHeading(sections.historyTimeline.h2);
  const engineHeading = splitHeading(sections.engineGuide.h2);
  const problemsHeading = splitHeading(sections.commonProblems.h2);
  const faqHeading = splitHeading(sections.faq.h2);
  const trustHeading = splitHeading(sections.trustCta.h2);
  const firstEngine = sections.engineGuide.items[0];
  const firstHighlight = sections.hero.highlights?.[0];
  const assets = source.assets as VariantAssetsWithNewDocImages;
  const imageOverrides = assets.newDocImages;
  const resolvedModelImages = resolveModelImagePaths({
    brandSlug: brand.slug,
    modelSlug: model.slug,
    modelName: model.name,
    configuredMainImage: assets.mainImage,
    configuredSmallImage: assets.smallImage,
    configuredHeroImage: assets.heroBg,
    configuredCtaImage: assets.ctaImage,
  });
  const resolvedVehicleImage = resolveVariantHeroImageOverride({
    brandSlug: brand.slug,
    modelSlug: model.slug,
    resolvedImage: resolvedModelImages.resolvedMainImage,
  });
  const vehicleImage = getImage(
    imageOverrides,
    "vehicle",
    [
      resolvedVehicleImage,
      resolvedModelImages.resolvedSmallImage,
      assets.mainImage,
      assets.smallImage,
      assets.ctaImage,
      assets.heroBg,
    ].find(Boolean) ?? assets.heroBg,
  );
  const engineOptions = sections.hero.engineOptions ?? [];
  const engineCode = firstEngine?.code || "";
  const variantEngineCutout = getVariantEngineCutout([
    brand.name,
    model.name,
    variant.name,
    engineCode,
    ...engineOptions.map((option) => `${option.label} ${option.image}`),
  ]);

  const priceText = firstHighlight?.price ?? "";
  const priceRange = priceText.match(/from\s+(.+)$/i)?.[1] ?? priceText;
  const priceDetails = (firstHighlight?.line2 || firstHighlight?.detail || "")
    .replace(/^\s*->\s*/, "")
    .split("·")
    .map((item) => limitCommonCodes(item.trim()))
    .filter(Boolean);

  return {
    brand: brand.name,
    model: displayModel,
    variant: displayVariant,
    engineCode,
    images: {
      heroBackground: sharedVariantHeroBackground,
      vehicle: vehicleImage,
      brandLogo: getImage(
        imageOverrides,
        "brandLogo",
        resolveBrandLogo(brand.slug),
      ),
      commonProblemsVehicle: getImage(
        imageOverrides,
        "commonProblemsVehicle",
        sharedCommonProblemsImage,
      ),
      usedEngine: getImage(
        imageOverrides,
        "usedEngine",
        variantEngineCutout,
      ),
      reconditionedEngine: getImage(
        imageOverrides,
        "reconditionedEngine",
        variantEngineCutout,
      ),
      rebuiltEngine: getImage(
        imageOverrides,
        "rebuiltEngine",
        variantEngineCutout,
      ),
      heroEngine: getImage(
        imageOverrides,
        "heroEngine",
        variantEngineCutout,
      ),
    },
    hero: {
      eyebrow: sections.hero.tag,
      titleLead: heroHeading.titleLead,
      titleAccent: heroHeading.titleAccent,
      description: sections.hero.subheading,
      trustItems: sections.hero.trustBadges,
      price: {
        engineName: firstHighlight?.title || `${brand.name} ${model.name} engine`,
        range: priceRange,
        details: priceDetails,
      },
      options: engineOptions.map((option) => ({
        title: `${brand.name} ${displayModel}`,
        description: `${option.label} Engine — ${engineCode}`,
        image:
          option.tone === "used"
            ? getImage(imageOverrides, "usedEngine", variantEngineCutout)
            : option.tone === "reconditioned"
              ? getImage(
                  imageOverrides,
                  "reconditionedEngine",
                  variantEngineCutout,
                )
              : option.tone === "rebuilt"
                ? getImage(
                    imageOverrides,
                    "rebuiltEngine",
                    variantEngineCutout,
                  )
                : variantEngineCutout,
        href: "#quote-form",
      })),
      cta: sections.hero.form.buttonText || sections.hero.ctaLinkText,
      tickerItems: getTickerItems(sections.hero.ticker),
    },
    howItWorks: sections.howItWorks.cards.map((card) => ({
      number: String(card.number).padStart(2, "0"),
      title: card.front.h3,
      description: card.front.text,
      back: [card.back.heading, card.back.text, ...card.back.bullets]
        .filter(Boolean)
        .join(" "),
    })),
    history: {
      eyebrow: sections.historyTimeline.tag,
      titleLead: historyHeading.titleLead,
      titleAccent: historyHeading.titleAccent,
      description: sections.historyTimeline.intro,
      specs: (sections.historyTimeline.specs as unknown[]).map(getSpecPair),
      timeline: (sections.historyTimeline.milestones as unknown[]).map((milestone, index) =>
        getTimelineItem(milestone, String(2006 + index)),
      ),
      closing: sections.historyTimeline.closingNote || "",
    },
    engineGuide: {
      eyebrow: sections.engineGuide.tag,
      titleLead: engineHeading.titleLead,
      titleAccent: engineHeading.titleAccent,
      description: sections.engineGuide.intro || sections.engineGuide.sectionSubtitle || "",
      engineName: firstEngine
        ? `${firstEngine.code} — ${firstEngine.title}`
        : `${brand.name} ${model.name} engine`,
      specs: (firstEngine?.specs || []).map(({ label, value }) => [label, value]),
      prices: (firstEngine?.costs || []).map(({ label, value }) => [label, value]),
      commonFailure: firstEngine?.commonFailure || "",
      cta: firstEngine?.cta || "",
      closing: firstEngine?.closing || "",
    },
    commonProblems: {
      eyebrow: sections.commonProblems.tag,
      titleLead: problemsHeading.titleLead,
      titleAccent: problemsHeading.titleAccent,
      description: sections.commonProblems.h3,
      vehicleValue: sections.commonProblems.h3,
      closingCta: {
        title: sections.commonProblems.finalCta.h4,
        description: sections.commonProblems.finalCta.paragraph,
        cta: sections.commonProblems.finalCta.buttonText,
      },
      cards: sections.commonProblems.problems.map((problem) => ({
        title: problem.group,
        affected: problem.affectedModels,
        mileage: problem.typicalFailureMileage,
        rootCause: problem.rootCause,
        repairOptions: (problem.repairOptions || []).map((option) => ({
          tier: option.tier,
          dealer: option.dealerPrice,
          specialist: option.specialistPrice,
        })),
        recommendation: problem.recommendation || "",
        cta: problem.cta,
      })),
    },
    faq: {
      eyebrow: sections.faq.tag,
      titleLead: faqHeading.titleLead,
      titleAccent: faqHeading.titleAccent,
      description: sections.faq.intro,
      items: sections.faq.items.map((item, index) => ({
        question: item.question.replace(/\s*[-—]\s*$/, "?"),
        answer: item.answer,
        icon: (["price", "problems", "value", "life", "compare", "code"] as const)[index % 6],
        highlights: item.comparisonTable?.rows.flatMap((row) =>
          row.map((value, columnIndex) => ({
            label: item.comparisonTable?.headers[columnIndex] || "",
            value,
          })),
        ),
        bullets: item.keyPoints,
        cta: item.cta,
      })),
    },
    whyChoose: {
      eyebrow: sections.trustCta.tag,
      titleLead: trustHeading.titleLead,
      titleAccent: trustHeading.titleAccent,
      description: sections.trustCta.finalText || sections.trustCta.intro,
      benefits: sections.trustCta.points.map((point, index) => ({
        value: point.title.split(" ")[0],
        label: point.title,
        icon: (["network", "warranty", "delivery"] as const)[index % 3],
      })),
      cta: sections.trustCta.buttonText,
      note: sections.trustCta.intro,
    },
  };
}
