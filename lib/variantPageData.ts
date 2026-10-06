import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { sanitizeMojibake } from "@/lib/sanitizeBrandData";
import { withNormalizedSeoCanonical } from "@/lib/site";
import type { VariantPageData } from "@/types/variant";

const VARIANTS_DIR = path.join(process.cwd(), "data", "variants");
const UTF8_BOM = /^\uFEFF/;
let allVariantPagesPromise: Promise<VariantPageData[]> | null = null;

function normalizeSlugPart(value: string) {
  return value.trim().toLowerCase();
}

function tokenizeSlug(value: string) {
  return normalizeSlugPart(value)
    .replace(/^\/+|\/+$/g, "")
    .replace(/-engine$/g, "")
    .split(/[/-]+/)
    .filter(Boolean);
}

function getModelScopedTokens(value: string, brandSlug: string, modelSlug: string) {
  const brandTokens = new Set(tokenizeSlug(brandSlug));
  const modelTokens = new Set(tokenizeSlug(modelSlug));

  return tokenizeSlug(value).filter(
    (token) =>
      !brandTokens.has(token) &&
      !modelTokens.has(token) &&
      token !== "engine" &&
      token !== "replacement",
  );
}

function getCanonicalVariantRoute(page: VariantPageData) {
  const canonical = page.seo.canonical?.trim();
  if (!canonical) {
    return `/${page.brand.slug}/${page.model.slug}/${page.variant.slug}`;
  }

  return canonical.startsWith("/") ? canonical : `/${canonical}`;
}

function scoreVariantRouteMatch(
  cardSlug: string,
  page: VariantPageData,
  brandSlug: string,
  modelSlug: string,
) {
  const normalizedCardSlug = normalizeSlugPart(cardSlug);
  const variantSlug = normalizeSlugPart(page.variant.slug);
  const storageSlug = normalizeSlugPart(page.variant.storageSlug);
  const canonicalPath = getCanonicalVariantRoute(page).replace(/^\/+|\/+$/g, "");

  if (normalizedCardSlug === variantSlug) {
    return 1000;
  }

  if (normalizedCardSlug === storageSlug) {
    return 950;
  }

  if (normalizedCardSlug === canonicalPath) {
    return 900;
  }

  if (normalizedCardSlug.endsWith(variantSlug)) {
    return 850;
  }

  const cardTokens = getModelScopedTokens(cardSlug, brandSlug, modelSlug);
  const variantTokens = getModelScopedTokens(page.variant.slug, brandSlug, modelSlug);
  const storageTokens = getModelScopedTokens(page.variant.storageSlug, brandSlug, modelSlug);
  const combinedVariantTokens = new Set([...variantTokens, ...storageTokens]);

  if (!cardTokens.length || !combinedVariantTokens.size) {
    return -1;
  }

  const overlap = cardTokens.filter((token) => combinedVariantTokens.has(token));

  if (!overlap.length) {
    return -1;
  }

  return overlap.length * 100 - (cardTokens.length - overlap.length) * 10;
}

function getVariantRouteCandidates(page: VariantPageData) {
  return [page.variant.slug].map(normalizeSlugPart).filter(Boolean);
}

function isVariantPageData(value: unknown): value is VariantPageData {
  if (!value || typeof value !== "object") {
    return false;
  }

  const page = value as Partial<VariantPageData>;

  return Boolean(
    page.brand &&
      typeof page.brand.name === "string" &&
      typeof page.brand.slug === "string" &&
      page.model &&
      typeof page.model.name === "string" &&
      typeof page.model.slug === "string" &&
      page.variant &&
      typeof page.variant.name === "string" &&
      typeof page.variant.slug === "string" &&
      typeof page.variant.storageSlug === "string" &&
      page.sections &&
      typeof page.sections === "object",
  );
}

function parseVariantPageData(raw: string) {
  const parsed = sanitizeMojibake(
    JSON.parse(raw.replace(UTF8_BOM, "")) as VariantPageData,
  );

  return isVariantPageData(parsed) ? withNormalizedSeoCanonical(parsed) : null;
}

async function readVariantPageFile(fileBaseName: string) {
  try {
    const filePath = path.join(VARIANTS_DIR, `${fileBaseName}.json`);
    const raw = await readFile(filePath, "utf-8");
    return parseVariantPageData(raw);
  } catch {
    return null;
  }
}

export async function getAllVariantPageData() {
  if (allVariantPagesPromise) {
    return allVariantPagesPromise;
  }

  allVariantPagesPromise = (async () => {
    try {
      const entries = await readdir(VARIANTS_DIR, { withFileTypes: true });
      const pages = await Promise.all(
        entries
          .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
          .map(async (entry) => {
            try {
              const raw = await readFile(path.join(VARIANTS_DIR, entry.name), "utf-8");
              return parseVariantPageData(raw);
            } catch {
              return null;
            }
          }),
      );

      return pages.filter((page): page is VariantPageData => page !== null);
    } catch {
      return [];
    }
  })();

  return allVariantPagesPromise;
}

export async function getVariantPageData(brand: string, model: string, variant: string) {
  const normalizedBrand = normalizeSlugPart(brand);
  const normalizedModel = normalizeSlugPart(model);
  const normalizedVariant = normalizeSlugPart(variant);
  const directCandidate = `${normalizedBrand}-${normalizedModel}-${normalizedVariant}`;
  const directMatch = await readVariantPageFile(directCandidate);

  if (
    directMatch &&
    normalizeSlugPart(directMatch.brand.slug) === normalizedBrand &&
    normalizeSlugPart(directMatch.model.slug) === normalizedModel &&
    getVariantRouteCandidates(directMatch).includes(normalizedVariant)
  ) {
    return directMatch;
  }

  const pages = await getAllVariantPageData();

  return (
    pages.find(
      (page) =>
        normalizeSlugPart(page.brand.slug) === normalizedBrand &&
        normalizeSlugPart(page.model.slug) === normalizedModel &&
        getVariantRouteCandidates(page).includes(normalizedVariant),
    ) ?? null
  );
}

export async function getVariantPageStaticParams() {
  const pages = await getAllVariantPageData();
  const seen = new Set<string>();

  return pages.flatMap((page) => {
    const key = `${normalizeSlugPart(page.brand.slug)}::${normalizeSlugPart(page.model.slug)}::${normalizeSlugPart(page.variant.slug)}`;

    if (seen.has(key)) {
      return [];
    }

    seen.add(key);

    return {
      brand: page.brand.slug,
      model: page.model.slug,
      variant: page.variant.slug,
    };
  });
}

export async function getVariantRouteMapForModel(
  brand: string,
  model: string,
  cards: Array<{ slug: string }>,
) {
  const normalizedBrand = normalizeSlugPart(brand);
  const normalizedModel = normalizeSlugPart(model);
  const pages = await getAllVariantPageData();
  const matchingPages = pages.filter(
    (page) =>
      normalizeSlugPart(page.brand.slug) === normalizedBrand &&
      normalizeSlugPart(page.model.slug) === normalizedModel,
  );

  const routeMap: Record<string, string> = {};

  for (const card of cards) {
    const bestMatch = matchingPages
      .map((page) => ({
        page,
        score: scoreVariantRouteMatch(card.slug, page, normalizedBrand, normalizedModel),
      }))
      .filter((entry) => entry.score >= 0)
      .sort((left, right) => right.score - left.score)[0];

    if (bestMatch) {
      routeMap[card.slug] = getCanonicalVariantRoute(bestMatch.page);
    }
  }

  return routeMap;
}
