const DEFAULT_SITE_URL = "https://enginesmarket.co.uk";

function normalizeSiteUrl(url: string) {
  return url.trim().replace(/\/+$/, "");
}

export const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL,
);

/**
 * Canonical URLs: no trailing slash except site root `/`.
 * Accepts absolute or path-only values.
 */
export function normalizeCanonical(url: string): string {
  const value = url.trim();
  if (!value) return value;

  if (/^https?:\/\//i.test(value)) {
    try {
      const parsed = new URL(value);
      if (parsed.pathname !== "/") {
        parsed.pathname = parsed.pathname.replace(/\/+$/, "") || "/";
      }
      if (parsed.pathname === "/") {
        return `${parsed.origin}/`;
      }
      return `${parsed.origin}${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
      return value.replace(/\/+$/, "");
    }
  }

  if (value === "/") return "/";
  return value.replace(/\/+$/, "");
}

export function withNormalizedSeoCanonical<T extends { seo?: { canonical?: string } }>(
  page: T,
): T {
  const canonical = page.seo?.canonical;
  if (!canonical || !page.seo) return page;

  const normalized = normalizeCanonical(canonical);
  if (normalized === canonical) return page;

  return {
    ...page,
    seo: {
      ...page.seo,
      canonical: normalized,
    },
  };
}
