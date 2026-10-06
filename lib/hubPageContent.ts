import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import type { Metadata } from "next";
import { normalizeCanonical, SITE_URL } from "@/lib/site";

type HubPageContent = {
  title: string;
  description: string;
  css: string;
  mainHtml: string;
};

const HUB_PAGE_SCOPE = ".em-hub-page";

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function extractMatch(source: string, pattern: RegExp, fallback = "") {
  return source.match(pattern)?.[1]?.trim() ?? fallback;
}

function findMatchingBrace(source: string, openBraceIndex: number) {
  let depth = 0;

  for (let index = openBraceIndex; index < source.length; index += 1) {
    if (source[index] === "{") {
      depth += 1;
    } else if (source[index] === "}") {
      depth -= 1;

      if (depth === 0) {
        return index;
      }
    }
  }

  return source.length - 1;
}

function splitSelectors(selectorGroup: string) {
  const selectors: string[] = [];
  let current = "";
  let depth = 0;

  for (const char of selectorGroup) {
    if (char === "(" || char === "[") {
      depth += 1;
    } else if ((char === ")" || char === "]") && depth > 0) {
      depth -= 1;
    }

    if (char === "," && depth === 0) {
      selectors.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  if (current.trim()) {
    selectors.push(current);
  }

  return selectors;
}

function scopeSingleSelector(selector: string) {
  const trimmed = selector.trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed === ":root" || trimmed === "html" || trimmed === "body" || trimmed === "main") {
    return HUB_PAGE_SCOPE;
  }

  const replacedRootSelector = trimmed
    .replace(/:root/g, HUB_PAGE_SCOPE)
    .replace(/^(html|body|main)(?=[\s>+~.#:[(]|$)/, HUB_PAGE_SCOPE);

  if (replacedRootSelector !== trimmed) {
    return replacedRootSelector;
  }

  if (trimmed.startsWith(HUB_PAGE_SCOPE)) {
    return trimmed;
  }

  if (trimmed.startsWith("*")) {
    return `${HUB_PAGE_SCOPE} ${trimmed}`;
  }

  return `${HUB_PAGE_SCOPE} ${trimmed}`;
}

function scopeSelectorGroup(selectorGroup: string) {
  return splitSelectors(selectorGroup)
    .map(scopeSingleSelector)
    .filter(Boolean)
    .join(", ");
}

function scopeCss(css: string): string {
  let output = "";
  let cursor = 0;

  while (cursor < css.length) {
    const nextBraceIndex = css.indexOf("{", cursor);

    if (nextBraceIndex === -1) {
      output += css.slice(cursor);
      break;
    }

    const selector = css.slice(cursor, nextBraceIndex).trim();
    const closeBraceIndex = findMatchingBrace(css, nextBraceIndex);
    const blockBody = css.slice(nextBraceIndex + 1, closeBraceIndex);

    if (!selector) {
      cursor = closeBraceIndex + 1;
      continue;
    }

    if (
      selector.startsWith("@media") ||
      selector.startsWith("@supports") ||
      selector.startsWith("@container") ||
      selector.startsWith("@layer")
    ) {
      output += `${selector}{${scopeCss(blockBody)}}`;
    } else if (
      selector.startsWith("@keyframes") ||
      selector.startsWith("@font-face") ||
      selector.startsWith("@property")
    ) {
      output += `${selector}{${blockBody}}`;
    } else {
      output += `${scopeSelectorGroup(selector)}{${blockBody}}`;
    }

    cursor = closeBraceIndex + 1;
  }

  return output;
}

export const getHubPageContent = cache((slug: string): HubPageContent => {
  const filePath = path.join(process.cwd(), "content", "hub-pages", `${slug}.html`);
  const source = fs.readFileSync(filePath, "utf8");

  const title = decodeHtmlEntities(
    extractMatch(source, /<title>([\s\S]*?)<\/title>/i, "Engines Market"),
  );
  const description = decodeHtmlEntities(
    extractMatch(
      source,
      /<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']\s*\/?>/i,
      "Engines Market",
    ),
  );
  const combinedStyles = Array.from(source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi))
    .map((match) => match[1].trim())
    .join("\n");
  const contentBetweenStaticChrome = extractMatch(
    source,
    /<\/header>\s*([\s\S]*?)\s*<footer[^>]*class=["'][^"']*em-static-footer[^"']*["'][^>]*>/i,
  );
  const mainOnlyContent = extractMatch(source, /<main[^>]*>([\s\S]*?)<\/main>/i);
  const mainHtml = (contentBetweenStaticChrome || mainOnlyContent).replace(/<script[\s\S]*?<\/script>/gi, "");

  return {
    title,
    description,
    css: scopeCss(combinedStyles),
    mainHtml,
  };
});

export function getHubPageMetadata(slug: string): Metadata {
  const page = getHubPageContent(slug);

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: normalizeCanonical(`${SITE_URL}/${slug}`),
    },
  };
}
