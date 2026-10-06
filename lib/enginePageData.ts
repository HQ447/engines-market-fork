import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { EnginePageData } from "@/types/engine-page";
import { getEngineCodeLookupKeys, type EngineLinkMap } from "@/lib/engineLinks";
import { withNormalizedSeoCanonical } from "@/lib/site";

const ENGINES_DIR = path.join(process.cwd(), "data", "engines");
const UTF8_BOM = /^\uFEFF/;
let allEnginePagesPromise: Promise<EnginePageData[]> | null = null;

function normalizeSlugPart(value: string) {
  return value.trim().toLowerCase();
}

function isEnginePageData(value: unknown): value is EnginePageData {
  if (!value || typeof value !== "object") {
    return false;
  }

  const page = value as Partial<EnginePageData>;

  return Boolean(
    page.brand &&
      typeof page.brand.name === "string" &&
      typeof page.brand.slug === "string" &&
      page.engine &&
      typeof page.engine.code === "string" &&
      typeof page.engine.slug === "string" &&
      page.sections?.hero,
  );
}

function parseEnginePageData(raw: string) {
  const parsed = JSON.parse(raw.replace(UTF8_BOM, "")) as EnginePageData;
  return isEnginePageData(parsed) ? withNormalizedSeoCanonical(parsed) : null;
}

async function readEnginePageDataFile(fileBaseName: string) {
  try {
    const filePath = path.join(ENGINES_DIR, `${fileBaseName}.json`);
    const raw = await readFile(filePath, "utf-8");
    return parseEnginePageData(raw);
  } catch {
    return null;
  }
}

export async function getAllEnginePageData() {
  if (allEnginePagesPromise) {
    return allEnginePagesPromise;
  }

  allEnginePagesPromise = (async () => {
    try {
      const entries = await readdir(ENGINES_DIR, { withFileTypes: true });
      const pages = await Promise.all(
        entries
          .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
          .map(async (entry) => {
            try {
              const raw = await readFile(path.join(ENGINES_DIR, entry.name), "utf-8");
              return parseEnginePageData(raw);
            } catch {
              return null;
            }
          }),
      );

      return pages.filter((page): page is EnginePageData => Boolean(page));
    } catch {
      return [];
    }
  })();

  return allEnginePagesPromise;
}

export async function getEnginePageData(brand: string, engineSlug: string) {
  const normalizedBrand = normalizeSlugPart(brand);
  const normalizedEngineSlug = normalizeSlugPart(engineSlug);
  const directCandidates = [`${normalizedBrand}-${normalizedEngineSlug}`, normalizedEngineSlug];

  for (const candidate of directCandidates) {
    const directMatch = await readEnginePageDataFile(candidate);
    if (
      directMatch &&
      normalizeSlugPart(directMatch.brand.slug) === normalizedBrand &&
      normalizeSlugPart(directMatch.engine.slug) === normalizedEngineSlug
    ) {
      return directMatch;
    }
  }

  const pages = await getAllEnginePageData();

  return (
    pages.find(
      (page) =>
        normalizeSlugPart(page.brand.slug) === normalizedBrand &&
        normalizeSlugPart(page.engine.slug) === normalizedEngineSlug,
    ) ?? null
  );
}

export async function getEnginePageStaticParams() {
  const pages = await getAllEnginePageData();

  return pages.map((page) => ({
    brand: page.brand.slug,
    model: page.engine.slug,
  }));
}

export async function getEngineLinkMapForBrand(brand: string) {
  const normalizedBrand = normalizeSlugPart(brand);
  const pages = await getAllEnginePageData();
  const engineLinks: EngineLinkMap = {};

  for (const page of pages) {
    if (normalizeSlugPart(page.brand.slug) !== normalizedBrand) {
      continue;
    }

    const href = `/${page.brand.slug}/${page.engine.slug}`;
    for (const key of getEngineCodeLookupKeys(page.engine.code)) {
      if (!engineLinks[key]) {
        engineLinks[key] = href;
      }
    }
  }

  return engineLinks;
}

export async function getAllEngineLinkMap() {
  const pages = await getAllEnginePageData();
  const engineLinks: EngineLinkMap = {};

  for (const page of pages) {
    const href = `/${page.brand.slug}/${page.engine.slug}`;
    for (const key of getEngineCodeLookupKeys(page.engine.code)) {
      if (!engineLinks[key]) {
        engineLinks[key] = href;
      }
    }
  }

  return engineLinks;
}
