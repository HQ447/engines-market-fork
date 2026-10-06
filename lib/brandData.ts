import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { sanitizeBrandPageData } from "@/lib/sanitizeBrandData";
import { withNormalizedSeoCanonical } from "@/lib/site";
import type { BrandPageData } from "@/types/brand";
import brandNotes from "@/data/live-market/brand-notes.json";

const BRANDS_DIR = path.join(process.cwd(), "data", "brands");
const UTF8_BOM = /^\uFEFF/;

function parseBrandPageData(raw: string) {
  return withNormalizedSeoCanonical(
    sanitizeBrandPageData(
      JSON.parse(raw.replace(UTF8_BOM, "")) as BrandPageData,
    ),
  );
}

function attachLiveMarketNotes(pageData: BrandPageData) {
  const notes = brandNotes.brands?.[pageData.brand.slug as keyof typeof brandNotes.brands];

  if (!notes?.items?.length) {
    return pageData;
  }

  return {
    ...pageData,
    sections: {
      ...pageData.sections,
      liveMarketPrices: {
        ...pageData.sections.liveMarketPrices,
        notes: {
          title: notes.title,
          items: notes.items,
        },
      },
    },
  };
}

export async function getBrandPageData(brand: string) {
  try {
    const filePath = path.join(BRANDS_DIR, `${brand}.json`);
    const raw = await readFile(filePath, "utf-8");
    return attachLiveMarketNotes(parseBrandPageData(raw));
  } catch {
    return null;
  }
}

export async function getBrandSlugs() {
  try {
    const entries = await readdir(BRANDS_DIR, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
      .map((entry) => entry.name.replace(/\.json$/i, ""));
  } catch {
    return [];
  }
}
