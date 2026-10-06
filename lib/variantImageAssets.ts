import variantArtworkIndex from "./variant-artwork-index.json";

const VARIANT_ARTWORK_INDEX = variantArtworkIndex as Record<string, Record<string, string>>;

const NUMERIC_TOKEN_ALIASES: Record<string, string> = {
  "10": "1-0",
  "12": "1-2",
  "13": "1-3",
  "14": "1-4",
  "15": "1-5",
  "16": "1-6",
  "17": "1-7",
  "18": "1-8",
  "19": "1-9",
  "20": "2-0",
  "22": "2-2",
  "24": "2-4",
  "25": "2-5",
  "28": "2-8",
  "30": "3-0",
  "32": "3-2",
  "35": "3-5",
  "36": "3-6",
  "40": "4-0",
  "42": "4-2",
  "44": "4-4",
  "50": "5-0",
};

const EXPLICIT_SLUG_ALIASES: Record<string, string[]> = {
  "bmw-x3-e83-petrol": ["bmw-x3-e83"],
  "honda-accord-2-0-i-vtec": ["honda-accord-2-0-and-2-4-i-vtec"],
  "honda-accord-2-4-i-vtec": ["honda-accord-2-0-and-2-4-i-vtec"],
  "honda-accord-2-2-i-ctdi": ["honda-accord-2-2-i-dtec"],
  "honda-civic-1-4-i-vtec": ["honda-civic-1-4-1-6-i-vtec-ep"],
  "honda-civic-1-6-i-dtec-2017": ["honda-civic-1-6-i-dtec"],
  "honda-civic-1-0-vtec-turbo": ["honda-civic-1-5-vtec-turbo"],
  "honda-civic-1-8-i-vtec-facelift": ["honda-civic-1-8-i-vtec"],
  "honda-civic-2-2-i-ctdi": ["honda-civic-2-2-i-dtec"],
  "honda-civic-type-r-fk8": ["honda-civic-2-0-i-vtec-type-r"],
  "honda-civic-type-r-fl5": ["honda-civic-2-0-i-vtec-type-r"],
  "honda-civic-type-r-fn2": ["honda-civic-2-0-i-vtec-type-r"],
  "honda-hr-v-18-i-vtec-early": ["honda-hr-v-1-8-i-vtec-early"],
  "kia-niro-e-niro-drive-unit": ["kia-e-niro-electric"],
  "kia-xceed-t-gdi": ["kia-ceed-xceed-1-0-1-5-t-gdi"],
  "mercedes-benz-a-class-160-180-petrol": ["mercedes-benz-a160-a180-petrol"],
  "mercedes-benz-a-class-160-cdi": ["mercedes-benz-a160-cdi"],
  "mercedes-benz-e-class-270-300-cdi": ["mercedes-benz-e-class-270-cdi-300-cdi"],
  "mercedes-benz-e-class-320-350-cdi": ["mercedes-benz-e-class-320-cdi-350-cdi"],
  "mercedes-benz-g-class-g55-amg": ["mercedes-benz-g-class-g-55-amg"],
  "mercedes-benz-slc-220-250d": ["mercedes-benz-slc-class-220d-250d"],
  "mercedes-benz-slc-43-amg": ["mercedes-benz-slc-class-43-amg"],
  "mercedes-benz-slk-200-230-kompressor": ["mercedes-benz-slk-class-200-230"],
  "mercedes-benz-slk-200-cdi": ["mercedes-benz-slk-class-200-cdi"],
  "mercedes-benz-slk-250-350": ["mercedes-benz-slk-class-250-350"],
  "mercedes-benz-sprinter-208-316-cdi-older": [
    "mercedes-benz-sprinter-208-211-313-316-cdi-older",
  ],
  "suzuki-swift-12-13-petrol": ["suzuki-swift-1-2-1-3"],
  "suzuki-vitara-16-petrol-ddis": ["suzuki-vitara-1-6-petrol-ddis"],
  "vauxhall-corsa-10-12-14-petrol": ["vauxhall-corsa-1-0-1-2-1-4-petrol"],
  "vauxhall-corsa-12-puretech-15-bluehdi": ["vauxhall-corsa-1-2-puretech-1-5-bluehdi"],
  "vauxhall-meriva-13-17-cdti": ["vauxhall-meriva-1-3-1-7-cdti"],
  "volkswagen-golf-1-5-tsi": ["volkswagen-golf-1-5-tsi-etsi"],
  "volkswagen-golf-15-tsi": ["volkswagen-golf-1-5-tsi-etsi"],
  "volkswagen-polo-1-4-tdi": ["volkswagen-polo-1-4-1-6-tdi"],
  "volkswagen-polo-1-6-tdi": ["volkswagen-polo-1-4-1-6-tdi"],
  "volkswagen-polo-14-tdi": ["volkswagen-polo-1-4-1-6-tdi"],
  "volkswagen-polo-16-tdi": ["volkswagen-polo-1-4-1-6-tdi"],
  "vw-golf-1-5-tsi-etsi": ["volkswagen-golf-1-5-tsi-etsi"],
  "vw-passat-2-0-tsi": ["volkswagen-passat-2-0-tsi"],
  "vw-polo-1-4-1-6-tdi": ["volkswagen-polo-1-4-1-6-tdi"],
  "vw-polo-gti-2-0-tsi": ["volkswagen-polo-gti-2-0-tsi"],
  "vw-sharan-1-4-2-0-tsi": ["volkswagen-sharan-1-4-2-0-tsi"],
};

function normalizeAssetSlug(value?: string | null) {
  return (value ?? "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripEngineSuffix(value: string) {
  return value.replace(/-engine$/i, "");
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function expandNumericAliases(slug: string) {
  const tokens = slug.split("-");
  const expanded = new Set([slug]);

  tokens.forEach((token, index) => {
    const alias = NUMERIC_TOKEN_ALIASES[token];
    if (!alias) {
      return;
    }

    const replaced = [...tokens];
    replaced.splice(index, 1, ...alias.split("-"));
    expanded.add(replaced.join("-"));
  });

  Object.entries(NUMERIC_TOKEN_ALIASES).forEach(([compact, decimal]) => {
    const decimalPattern = `-${decimal}-`;
    if (slug.includes(decimalPattern)) {
      expanded.add(slug.replace(decimalPattern, `-${compact}-`));
    }
  });

  return [...expanded];
}

function expandClassAliases(slug: string) {
  return unique([
    slug,
    slug.replace(/-class-/g, "-"),
    slug.replace(/mercedes-benz-a-class-([0-9])/g, "mercedes-benz-a$1"),
    slug.replace(/mercedes-benz-b-class-([0-9])/g, "mercedes-benz-b$1"),
    slug.replace(/mercedes-benz-c-class-([0-9])/g, "mercedes-benz-c$1"),
    slug.replace(/mercedes-benz-e-class-([0-9])/g, "mercedes-benz-e$1"),
    slug.replace(/mercedes-benz-s-class-([0-9])/g, "mercedes-benz-s$1"),
  ]);
}

function expandAliases(candidates: string[]) {
  const expanded = new Set<string>();

  candidates.forEach((candidate) => {
    expandClassAliases(candidate).forEach((classAlias) => {
      expanded.add(classAlias);
      expandNumericAliases(classAlias).forEach((numericAlias) => {
        expanded.add(numericAlias);
        EXPLICIT_SLUG_ALIASES[numericAlias]?.forEach((alias) => expanded.add(alias));
      });
      EXPLICIT_SLUG_ALIASES[classAlias]?.forEach((alias) => expanded.add(alias));
    });
    EXPLICIT_SLUG_ALIASES[candidate]?.forEach((alias) => expanded.add(alias));
  });

  return [...expanded];
}

function findClosestArtworkSlug(candidates: string[], artworkIndex: Record<string, string>) {
  let bestMatch = "";

  candidates.forEach((candidate) => {
    Object.keys(artworkIndex).forEach((artworkSlug) => {
      const isClearPrefixMatch =
        candidate.startsWith(`${artworkSlug}-`) || artworkSlug.startsWith(`${candidate}-`);

      if (isClearPrefixMatch && artworkSlug.length > bestMatch.length) {
        bestMatch = artworkSlug;
      }
    });
  });

  return bestMatch;
}

function stripDuplicateWords(value: string) {
  const words = value.split("-");
  const deduped: string[] = [];

  words.forEach((word) => {
    if (deduped[deduped.length - 1] !== word) {
      deduped.push(word);
    }
  });

  return deduped.join("-");
}

function stripDescriptorTokens(value: string) {
  return value
    .replace(/-(facelift|early|older|modern|gen[0-9]+|fk8|fn2|fl5|ep|mb6|lwb|swb)(?=-|$)/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripDrivetrainPrefixes(value: string) {
  return value
    .replace(/-(sdrive|xdrive)(?=[0-9])/g, "-")
    .replace(/-(m-sport|m-mesh-edition|r-design|allgrip|allgrip-pro|4wd|2wd)(?=-|$)/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function expandEngineNamingAliases(value: string) {
  return unique([
    value,
    value.replace(/-i-ctdi-/g, "-i-dtec-"),
    value.replace(/-i-ctdi$/g, "-i-dtec"),
    value.replace(/-bluehdi-/g, "-blue-hdi-"),
    value.replace(/-bluehdi$/g, "-blue-hdi"),
    value.replace(/-l(?=-|$)/g, ""),
  ]);
}

function stripBrandPrefix(value: string, brandSlug: string) {
  const escapedBrand = brandSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return value.replace(new RegExp(`^${escapedBrand}-`, "i"), "");
}

function stripModelPrefix(value: string, modelSlug: string) {
  const escapedModel = modelSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return value.replace(new RegExp(`^${escapedModel}-`, "i"), "");
}

function resolveVariantArtworkMatch({
  brandSlug,
  brandName,
  modelSlug,
  modelName,
  variantSlug,
  variantName,
  cardTitle,
  cardImage,
}: {
  brandSlug?: string;
  brandName?: string;
  modelSlug?: string;
  modelName?: string;
  variantSlug?: string;
  variantName?: string;
  cardTitle?: string;
  cardImage?: string | null;
}) {
  const normalizedBrandSlug = normalizeAssetSlug(brandSlug);
  const lookupBrands = unique([
    normalizedBrandSlug,
    normalizedBrandSlug === "vw" ? "volkswagen" : "",
    normalizedBrandSlug === "land-rover" && normalizeAssetSlug(modelSlug).startsWith("range-rover")
      ? "range-rover"
      : "",
  ]);
  const artworkIndexes = lookupBrands
    .map((brand) => VARIANT_ARTWORK_INDEX[brand])
    .filter(Boolean);

  if (!artworkIndexes.length) {
    return undefined;
  }

  const normalizedBrandName = normalizeAssetSlug(brandName);
  const normalizedModelSlug = normalizeAssetSlug(modelSlug);
  const normalizedModelName = normalizeAssetSlug(modelName);
  const normalizedVariantSlug = stripEngineSuffix(normalizeAssetSlug(variantSlug));
  const normalizedVariantName = stripEngineSuffix(
    normalizeAssetSlug(variantName?.replace(/\s+engine replacement$/i, "")),
  );
  const normalizedCardTitle = stripEngineSuffix(
    normalizeAssetSlug(cardTitle?.replace(/\s+engine replacement$/i, "")),
  );

  const variantOnlySlug = normalizedModelSlug
    ? stripModelPrefix(stripBrandPrefix(normalizedVariantSlug, normalizedBrandSlug), normalizedModelSlug)
    : stripBrandPrefix(normalizedVariantSlug, normalizedBrandSlug);
  const cardTitleOnlySlug = normalizedModelName
    ? stripModelPrefix(stripBrandPrefix(normalizedCardTitle, normalizedBrandSlug), normalizedModelName)
    : stripBrandPrefix(normalizedCardTitle, normalizedBrandSlug);

  const candidates = expandAliases(unique([
    normalizeAssetSlug(cardImage),
    normalizedCardTitle,
    stripDuplicateWords(normalizedCardTitle),
    stripDescriptorTokens(stripDuplicateWords(normalizedCardTitle)),
    stripDrivetrainPrefixes(stripDescriptorTokens(stripDuplicateWords(normalizedCardTitle))),
    normalizedVariantName,
    stripDrivetrainPrefixes(normalizedVariantName),
    normalizedBrandSlug && cardTitleOnlySlug ? `${normalizedBrandSlug}-${cardTitleOnlySlug}` : "",
    normalizedBrandSlug && cardTitleOnlySlug
      ? stripDrivetrainPrefixes(`${normalizedBrandSlug}-${cardTitleOnlySlug}`)
      : "",
    normalizedBrandName && cardTitleOnlySlug ? `${normalizedBrandName}-${cardTitleOnlySlug}` : "",
    normalizedBrandSlug && cardTitleOnlySlug
      ? stripDescriptorTokens(`${normalizedBrandSlug}-${cardTitleOnlySlug}`)
      : "",
    normalizedModelName && variantOnlySlug ? `${normalizedModelName}-${variantOnlySlug}` : "",
    normalizedModelSlug && variantOnlySlug ? `${normalizedBrandSlug}-${normalizedModelSlug}-${variantOnlySlug}` : "",
    normalizedModelName && variantOnlySlug ? `${normalizedBrandName}-${normalizedModelName}-${variantOnlySlug}` : "",
    normalizedVariantSlug ? `${normalizedBrandSlug}-${normalizedVariantSlug}` : "",
    normalizedVariantSlug ? `${normalizedBrandName}-${normalizedVariantSlug}` : "",
    normalizedVariantSlug,
    ...lookupBrands.flatMap((lookupBrand) => [
      lookupBrand && cardTitleOnlySlug ? `${lookupBrand}-${cardTitleOnlySlug}` : "",
      lookupBrand && cardTitleOnlySlug ? stripDrivetrainPrefixes(`${lookupBrand}-${cardTitleOnlySlug}`) : "",
      lookupBrand && variantOnlySlug ? `${lookupBrand}-${variantOnlySlug}` : "",
      lookupBrand && variantOnlySlug ? stripDrivetrainPrefixes(`${lookupBrand}-${variantOnlySlug}`) : "",
    ]),
  ].flatMap(expandEngineNamingAliases)));

  for (const artworkIndex of artworkIndexes) {
    const matchedSlug = candidates.find((candidate) => artworkIndex[candidate]);
    if (matchedSlug) {
      return {
        path: artworkIndex[matchedSlug],
        slug: matchedSlug,
      };
    }

    const closestSlug = findClosestArtworkSlug(candidates, artworkIndex);
    if (closestSlug) {
      return {
        path: artworkIndex[closestSlug],
        slug: closestSlug,
      };
    }
  }

  return undefined;
}

export function resolveVariantArtwork(args: Parameters<typeof resolveVariantArtworkMatch>[0]) {
  return resolveVariantArtworkMatch(args)?.path;
}

export function resolveVariantArtworkSlug(args: Parameters<typeof resolveVariantArtworkMatch>[0]) {
  return resolveVariantArtworkMatch(args)?.slug;
}

/** Reuses the first available variant artwork as a model-section visual. */
export function resolveModelVariantArtwork({
  brandSlug,
  brandName,
  modelSlug,
  modelName,
  variants,
}: {
  brandSlug?: string;
  brandName?: string;
  modelSlug?: string;
  modelName?: string;
  variants: Array<{ slug?: string; h3?: string; image?: string | null }>;
}) {
  return variants
    .map((variant) =>
      resolveVariantArtwork({
        brandSlug,
        brandName,
        modelSlug,
        modelName,
        variantSlug: variant.slug,
        cardTitle: variant.h3,
        cardImage: variant.image,
      }),
    )
    .find(Boolean);
}

export const resolveBmwVariantArtwork = resolveVariantArtwork;
