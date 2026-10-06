import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { getModelRouteSlug } from "@/lib/modelRoutes";
import type { ModelsSectionData } from "@/types/brand";
import { sanitizeMojibake } from "@/lib/sanitizeBrandData";
import { withNormalizedSeoCanonical } from "@/lib/site";
import type { ModelPageData } from "@/types/model";

const MODELS_DIR = path.join(process.cwd(), "data", "models");
const UTF8_BOM = /^\uFEFF/;
let allModelPagesPromise: Promise<ModelPageData[]> | null = null;

function normalizeSlugPart(value: string) {
  return value.trim().toLowerCase();
}

function getCanonicalModelSlug(brandSlug: string, modelSlug: string) {
  const normalizedBrand = normalizeSlugPart(brandSlug);
  const normalizedModel = normalizeSlugPart(modelSlug);
  const prefixedBrand = `${normalizedBrand}-`;

  if (normalizedModel.startsWith(prefixedBrand)) {
    return normalizedModel.slice(prefixedBrand.length);
  }

  return normalizedModel;
}

function getModelRouteCandidates(page: ModelPageData) {
  const candidates = new Set<string>();

  candidates.add(getCanonicalModelSlug(page.brand.slug, page.model.slug));
  candidates.add(normalizeSlugPart(page.model.slug));

  if (page.model.legacySlug) {
    candidates.add(normalizeSlugPart(page.model.legacySlug));
  }

  return [...candidates].filter(Boolean);
}

function getPageIdentityKey(page: ModelPageData) {
  return `${normalizeSlugPart(page.brand.slug)}::${getCanonicalModelSlug(page.brand.slug, page.model.slug)}`;
}

function getModelFileSpecificity(page: ModelPageData, fileBaseName: string) {
  const normalizedFileBaseName = normalizeSlugPart(fileBaseName);
  const canonicalModelSlug = getCanonicalModelSlug(page.brand.slug, page.model.slug);
  const brandPrefixedCanonicalSlug = `${normalizeSlugPart(page.brand.slug)}-${canonicalModelSlug}`;
  const legacySlug = page.model.legacySlug ? normalizeSlugPart(page.model.legacySlug) : "";
  const modelSlug = normalizeSlugPart(page.model.slug);

  if (normalizedFileBaseName === brandPrefixedCanonicalSlug) {
    return 4;
  }

  if (legacySlug && normalizedFileBaseName === legacySlug) {
    return 3;
  }

  if (normalizedFileBaseName === modelSlug) {
    return 2;
  }

  if (normalizedFileBaseName === canonicalModelSlug) {
    return 1;
  }

  return 0;
}

function isModelPageData(value: unknown): value is ModelPageData {
  if (!value || typeof value !== "object") {
    return false;
  }

  const page = value as Partial<ModelPageData>;

  return Boolean(
    page.brand &&
      typeof page.brand.name === "string" &&
      typeof page.brand.slug === "string" &&
      page.model &&
      typeof page.model.name === "string" &&
      typeof page.model.slug === "string" &&
      page.sections &&
      typeof page.sections === "object",
  );
}

function parseModelPageData(raw: string) {
  const parsed = sanitizeMojibake(
    JSON.parse(raw.replace(UTF8_BOM, "")) as ModelPageData,
  );

  return isModelPageData(parsed) ? withNormalizedSeoCanonical(parsed) : null;
}

async function readModelPageDataFile(fileBaseName: string) {
  try {
    const filePath = path.join(MODELS_DIR, `${fileBaseName}.json`);
    const raw = await readFile(filePath, "utf-8");
    return parseModelPageData(raw);
  } catch {
    return null;
  }
}

export async function getAllModelPageData() {
  if (allModelPagesPromise) {
    return allModelPagesPromise;
  }

  allModelPagesPromise = (async () => {
    try {
      const entries = await readdir(MODELS_DIR, { withFileTypes: true });
      const pages = await Promise.all(
        entries
          .filter(
            (entry) =>
              entry.isFile() &&
              entry.name.endsWith(".json") &&
              entry.name.toLowerCase() !== "warnings.json",
          )
          .map(async (entry) => {
            try {
              const filePath = path.join(MODELS_DIR, entry.name);
              const raw = await readFile(filePath, "utf-8");
              const page = parseModelPageData(raw);
              if (!page) {
                return null;
              }

              return {
                fileBaseName: entry.name.replace(/\.json$/i, ""),
                page,
              };
            } catch {
              return null;
            }
          }),
      );

      const preferredPages = new Map<
        string,
        {
          fileBaseName: string;
          page: ModelPageData;
        }
      >();

      for (const loadedPage of pages) {
        if (!loadedPage) {
          continue;
        }

        const identityKey = getPageIdentityKey(loadedPage.page);
        const existingPage = preferredPages.get(identityKey);

        if (!existingPage) {
          preferredPages.set(identityKey, loadedPage);
          continue;
        }

        const currentScore = getModelFileSpecificity(loadedPage.page, loadedPage.fileBaseName);
        const existingScore = getModelFileSpecificity(existingPage.page, existingPage.fileBaseName);

        if (currentScore > existingScore) {
          preferredPages.set(identityKey, loadedPage);
        }
      }

      return [...preferredPages.values()].map(({ page }) => page);
    } catch {
      return [];
    }
  })();

  return allModelPagesPromise;
}

function extractPriceValues(value: string) {
  return (value.match(/(?:£|Â£)\s?[\d,]+/g) ?? [])
    .map((match) => Number.parseInt(match.replace(/[^\d]/g, ""), 10))
    .filter(Number.isFinite);
}

function summarizeModelPriceRange(page: ModelPageData) {
  const prices = page.sections.variantCoverage.cards.flatMap((card) =>
    extractPriceValues(card.priceRange),
  );

  if (!prices.length) {
    return "Compare prices";
  }

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  if (minPrice === maxPrice) {
    return `Starting from £${minPrice.toLocaleString("en-GB")}`;
  }

  return `Starting from £${minPrice.toLocaleString("en-GB")} - £${maxPrice.toLocaleString("en-GB")}`;
}

function summarizeModelSubtitle(page: ModelPageData) {
  const highlightTitles = page.sections.hero.highlights
    ?.map((highlight) => highlight.title?.trim())
    .filter(Boolean) as string[] | undefined;

  if (highlightTitles?.length) {
    return `Available for ${highlightTitles.slice(0, 3).join(", ")}`;
  }

  const variantTitles = page.sections.variantCoverage.cards
    .map((card) => card.h3.replace(/\s+Engine Replacement$/i, "").trim())
    .filter(Boolean);

  if (variantTitles.length) {
    return `Covers ${variantTitles.slice(0, 3).join(", ")}`;
  }

  return page.sections.hero.subheading;
}

function toBrandModelCard(page: ModelPageData): ModelsSectionData["cards"][number] {
  return {
    h3: `${page.model.name} Engines`,
    slug: getModelRouteSlug({
      slug: page.model.slug,
      name: page.model.name,
      h3: `${page.model.name} Engines`,
    }),
    subtitle: summarizeModelSubtitle(page),
    priceRange: summarizeModelPriceRange(page),
    cta: `Compare ${page.model.name} Engine Prices`,
    image: page.assets.heroBg || page.assets.mainImage || page.assets.ctaImage || "",
  };
}

export async function getBrandModelCards(
  brandSlug: string,
  existingCards: ModelsSectionData["cards"],
) {
  const pages = await getAllModelPageData();
  const matchingPages = pages.filter(
    (page) => normalizeSlugPart(page.brand.slug) === normalizeSlugPart(brandSlug),
  );

  const generatedCards = matchingPages.map(toBrandModelCard);
  const generatedBySlug = new Map(
    generatedCards.map((card) => [normalizeSlugPart(card.slug), card]),
  );
  const orderedCards: ModelsSectionData["cards"] = [];
  const seen = new Set<string>();

  for (const existingCard of existingCards) {
    const slug = normalizeSlugPart(getModelRouteSlug(existingCard));
    const generatedCard = generatedBySlug.get(slug);

    if (!generatedCard || seen.has(slug)) {
      continue;
    }

    orderedCards.push({
      ...generatedCard,
      ...existingCard,
      slug: generatedCard.slug,
    });
    seen.add(slug);
  }

  for (const generatedCard of generatedCards.sort((left, right) => left.h3.localeCompare(right.h3))) {
    const slug = normalizeSlugPart(generatedCard.slug);
    if (seen.has(slug)) {
      continue;
    }

    orderedCards.push(generatedCard);
    seen.add(slug);
  }

  return orderedCards;
}

export async function getModelPageData(brand: string, model: string) {
  const normalizedBrand = normalizeSlugPart(brand);
  const normalizedModel = normalizeSlugPart(model);
  const directCandidates = [
    `${normalizedBrand}-${normalizedModel}`,
    normalizedModel,
  ];

  for (const candidate of directCandidates) {
    const directMatch = await readModelPageDataFile(candidate);
    if (
      directMatch &&
      normalizeSlugPart(directMatch.brand.slug) === normalizedBrand &&
      getModelRouteCandidates(directMatch).includes(normalizedModel)
    ) {
      return directMatch;
    }
  }

  const pages = await getAllModelPageData();

  return (
    pages.find(
      (page) =>
        normalizeSlugPart(page.brand.slug) === normalizedBrand &&
        getModelRouteCandidates(page).includes(normalizedModel),
    ) ?? null
  );
}

export async function getModelPageStaticParams() {
  const pages = await getAllModelPageData();

  const seen = new Set<string>();

  return pages.flatMap((page) => {
    const normalizedModelSlug = getCanonicalModelSlug(
      page.brand.slug,
      page.model.slug,
    );
    const key = `${normalizeSlugPart(page.brand.slug)}::${normalizedModelSlug}`;

    if (seen.has(key)) {
      return [];
    }

    seen.add(key);

    return {
      brand: page.brand.slug,
      model: normalizedModelSlug,
    };
  });
}
