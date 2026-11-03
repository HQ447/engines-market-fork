"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import type { HomeHeroData } from "@/lib/homepageData";
import { getEngineLinkForCode, type EngineLinkMap } from "@/lib/engineLinks";
import { carModelsBySeries, carSeries } from "@/data/brands_Models";
import imageManifest from "@/lib/image-manifest.json";
import manualSelectorVariantPages from "@/data/manual-selector-variants.json";
import { PiEngine } from "react-icons/pi";
import { GoShield } from "react-icons/go";
import { GoVerified } from "react-icons/go";
import { FiLock } from "react-icons/fi";

type Props = {
  data: HomeHeroData;
  engineLinks?: EngineLinkMap;
};

type HeroBrandRow = {
  brand: string;
  stat: string;
  price: string;
  codes: string;
};

type TickerItem = {
  brand: string;
  code: string;
  price: string;
};

type EngineCarouselItem = {
  brand: string;
  code: string;
  spec: string;
  price: string;
};

type SearchMode = "registration" | "manual";

type VehicleRegistrationData = {
  registrationNumber: string;
  year: string;
  make: string;
  model: string;
  fuelType: string;
  engineCapacity: string;
  color: string;
  wheelplan: string;
};

type ManualSelectorVariantPageIndex = Record<string, Record<string, string[]>>;

const manualMakeOptions = [
  ...new Set([...Object.keys(carSeries), "Isuzu"]),
].sort();
const manualYearOptions = Array.from({ length: 2026 - 1990 + 1 }, (_, index) =>
  String(2026 - index),
);
const carSeriesByMake = carSeries as Record<string, string[]>;
const carModelsBySeriesMap = carModelsBySeries as Record<string, string[]>;
const featuredMakeKeys = [
  "BMW",
  "Mercedesbenz",
  "Jaguar",
  "LandRover",
  "RangeRover",
];
const makeLogoFiles: Record<string, string> = {
  AlfaRomeo: "/BrandsLogos/alpha-romeo-logo-small.webp.webp",
  AstonMartin: "/BrandsLogos/aston-martin-logo-small.webp.webp",
  Audi: "/BrandsLogos/audi-logo-small.webp.webp",
  Bentley: "/BrandsLogos/bentley-logo-small.webp.webp",
  BMW: "/BrandsLogos/bmw-logo-small.webp.webp",
  Cadillac: "/BrandsLogos/cadillac-logo-small.webp.webp",
  Chevrolet: "/BrandsLogos/chevrolet-logo-small.webp.webp",
  Chrysler: "/BrandsLogos/chrysler-logo-small.webp.webp",
  Citroen: "/BrandsLogos/citroen-logo-small.webp.webp",
  Dacia: "/BrandsLogos/dacia-logo-small.webp",
  Daewoo: "/BrandsLogos/daewoo-logo-small.webp.webp",
  Daihatsu: "/BrandsLogos/daihatsu-logo-small.webp.webp",
  Dodge: "/BrandsLogos/dodge-logo-small.webp.webp",
  Ferrari: "/BrandsLogos/ferrari-logo-small.webp.webp",
  Fiat: "/BrandsLogos/fiat-logo-small.webp.webp",
  Ford: "/BrandsLogos/ford-logo-small.webp.webp",
  Genesis: "/BrandsLogos/gensis-logo-small.webp",
  Honda: "/BrandsLogos/honda-logo-small.webp.webp",
  Hyundai: "/BrandsLogos/hyundai-logo-small.webp.webp",
  Isuzu: "/BrandsLogos/isuzu-logo-small.webp.webp",
  Iveco: "/BrandsLogos/iveco-logo-small.webp.webp",
  Jaguar: "/BrandsLogos/jaguar-logo-small.webp.webp",
  Jeep: "/BrandsLogos/jeep-logo-small.webp.webp",
  KIA: "/BrandsLogos/kia-logo-small.webp.webp",
  Lancia: "/BrandsLogos/lancia-logo-small.webp",
  LandRover: "/BrandsLogos/land-rover-logo-small.webp.webp",
  Lexus: "/BrandsLogos/lexus-logo-small.webp.webp",
  Lotus: "/BrandsLogos/lotus-logo-small.webp",
  Mazda: "/BrandsLogos/mazda-logo-small.webp.webp",
  Mercedesbenz: "/BrandsLogos/mercedes-logo-small.webp.webp",
  Mclaren: "/BrandsLogos/mclaren-logo-small.webp",
  MG: "/BrandsLogos/mg-logo-small.webp.webp",
  MINI: "/BrandsLogos/mini-logo-small.webp.webp",
  Mitsubishi: "/BrandsLogos/mitsubishi-logo-small.webp.webp",
  Nissan: "/BrandsLogos/nissan-logo-small.webp.webp",
  Opel: "",
  Peugeot: "/BrandsLogos/peugeot-logo-small.webp.webp",
  Polestar: "/BrandsLogos/polestar-logo-small.webp",
  Porsche: "/BrandsLogos/porsche-logo-small.webp.webp",
  RangeRover: "/BrandsLogos/range-rover-logo-small.webp.webp",
  Renault: "/BrandsLogos/renault-logo-small.webp.webp",
  Rover: "",
  RollsRoyce: "/BrandsLogos/rolls-royce-logo-small.webp.webp",
  Seat: "/BrandsLogos/seat-logo-small.webp.webp",
  Skoda: "/BrandsLogos/skoda-logo-small.webp.webp",
  Smart: "/BrandsLogos/smart-logo-small.webp",
  Ssangyong: "/BrandsLogos/ssangyong-logo-small.webp",
  Subaru: "/BrandsLogos/subaru-logo-small.webp.webp",
  Suzuki: "/BrandsLogos/suzuki-logo-small.webp.webp",
  Toyota: "/BrandsLogos/toyota-logo-small.webp.webp",
  Vauxhall: "/BrandsLogos/vauxhall-logo-small.webp.webp",
  Volkswagen: "/BrandsLogos/volkswagon-logo-small.webp.webp",
  Volvo: "/BrandsLogos/volvo-logo-small.webp.webp",
};
const manualBrandSlugs: Record<string, string> = {
  BMW: "bmw",
  Mercedesbenz: "mercedes-benz",
  Jaguar: "jaguar",
  LandRover: "land-rover",
  RangeRover: "range-rover",
};
const manualAssetModelSlugPrefixesByBrand: Record<string, string[]> = {
  BMW: ["2002"],
  Isuzu: ["d-max", "mu-x", "piazza", "rodeo", "tf", "trooper"],
  Iveco: ["daily-4x4", "daily", "massif"],
};
const manualAssetModelDisplayNamesByBrand: Record<
  string,
  Record<string, string>
> = {
  Isuzu: {
    "d-max": "D-Max",
    "mu-x": "MU-X",
    piazza: "Piazza",
    rodeo: "Rodeo",
    tf: "TF",
    trooper: "Trooper",
  },
  Iveco: {
    "daily-4x4": "Daily 4x4",
    daily: "Daily",
    massif: "Massif",
  },
};
const manualImageManifest = imageManifest as Record<string, number>;
const manualSelectorVariantPageIndex =
  manualSelectorVariantPages as ManualSelectorVariantPageIndex;
const manualModelCardExtensionPattern = /\.(?:png|jpe?g|webp)$/i;
const manualModelImagePaths = Object.keys(manualImageManifest).filter((path) =>
  /\/models\/[^/]+\.(?:png|jpe?g|webp)$/i.test(path),
);
const manualModelImagePathPriority = (path: string) =>
  (/live-feed-/i.test(path) ? 0 : /-model-card\./i.test(path) ? 10 : 20) +
  (/\.webp$/i.test(path) ? 0 : /\.png$/i.test(path) ? 1 : 2);
const manualModelImagePathsByStem = new Map(
  [...manualModelImagePaths]
    .sort(
      (left, right) =>
        manualModelImagePathPriority(left) -
        manualModelImagePathPriority(right),
    )
    .map((path) => [path.replace(manualModelCardExtensionPattern, ""), path]),
);
const manualBrandFolderSlugs = new Set(
  Object.keys(manualImageManifest)
    .map((path) => path.match(/^\/images\/brands\/([^/]+)\//)?.[1])
    .filter((brandSlug): brandSlug is string => Boolean(brandSlug)),
);
const manualModelCardEntriesByBrand = new Map<
  string,
  Array<{ path: string; modelSlug: string }>
>();

function getMakeLabel(make: string) {
  return make === "Mercedesbenz"
    ? "Mercedes-Benz"
    : make === "LandRover"
      ? "Land Rover"
      : make === "RangeRover"
        ? "Range Rover"
        : make;
}

function getMakeLogoPath(make: string) {
  return makeLogoFiles[make] || null;
}

function slugifyManualImageValue(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getManualBrandSlug(make: string) {
  const camelCaseBrandSlug = slugifyManualImageValue(
    make.replace(/([a-z])([A-Z])/g, "$1-$2"),
  );
  const brandCandidates = [
    manualBrandSlugs[make],
    slugifyManualImageValue(getMakeLabel(make)),
    camelCaseBrandSlug,
    slugifyManualImageValue(make),
  ].filter((candidate): candidate is string => Boolean(candidate));

  return (
    brandCandidates.find((candidate) =>
      manualBrandFolderSlugs.has(candidate),
    ) ??
    brandCandidates[0] ??
    ""
  );
}

const manualAssetMakeOptions = manualMakeOptions.filter((make) =>
  manualBrandFolderSlugs.has(getManualBrandSlug(make)),
);

function stripManualBrandPrefix(
  modelSlug: string,
  make: string,
  brandSlug: string,
) {
  const brandNames = [
    getMakeLabel(make),
    make,
    make.replace(/([a-z])([A-Z])/g, "$1 $2"),
    brandSlug,
  ];

  return brandNames.reduce((currentSlug, brandName) => {
    const brandPrefix = `${slugifyManualImageValue(brandName)}-`;
    return currentSlug.startsWith(brandPrefix)
      ? currentSlug.slice(brandPrefix.length)
      : currentSlug;
  }, modelSlug);
}

function getManualModelSlugCandidates(
  make: string,
  model: string,
  brandSlug: string,
) {
  const rawModelSlug = slugifyManualImageValue(model);
  const rawModelSlugWithoutBrand = stripManualBrandPrefix(
    rawModelSlug,
    make,
    brandSlug,
  );
  const fullModelSlug = rawModelSlug.replace(
    /-(?:cng|diesel|petrol|hybrid|electric|flexfuel|alcohol)(?:-.+)?$/i,
    "",
  );
  const modelSlugWithoutBrand = stripManualBrandPrefix(
    fullModelSlug,
    make,
    brandSlug,
  );
  const modelSlugs = [
    rawModelSlugWithoutBrand,
    modelSlugWithoutBrand,
    modelSlugWithoutBrand.replace(/-series$/i, ""),
    modelSlugWithoutBrand.replace(/-class$/i, ""),
    modelSlugWithoutBrand.replace(/-class$/i, "").replace(/-series$/i, ""),
    modelSlugWithoutBrand.replace(/^c-/, ""),
    `${modelSlugWithoutBrand}-class`,
    `${modelSlugWithoutBrand}-series`,
    fullModelSlug,
  ];

  return [...new Set(modelSlugs.filter(Boolean))];
}

function getManualVariantBrandSlugs(make: string) {
  return [
    getManualBrandSlug(make),
    slugifyManualImageValue(getMakeLabel(make)),
    slugifyManualImageValue(make),
    make === "Volkswagen" ? "vw" : "",
  ].filter(
    (candidate, index, candidates): candidate is string =>
      Boolean(candidate) && candidates.indexOf(candidate) === index,
  );
}

function getManualVariantPageOptions(make: string, model: string) {
  if (!make || !model) {
    return [];
  }

  const brandSlug = getManualBrandSlug(make);
  const modelSlugCandidates = new Set(
    getManualModelSlugCandidates(make, model, brandSlug).map(
      normalizeManualModelSlug,
    ),
  );

  if (brandSlug === "land-rover" && modelSlugCandidates.has("defender")) {
    ["defender", "defender-90", "defender-110", "defender-130"].forEach(
      (candidate) => modelSlugCandidates.add(candidate),
    );
  }

  return getManualVariantBrandSlugs(make).flatMap((variantBrandSlug) =>
    Object.entries(manualSelectorVariantPageIndex[variantBrandSlug] ?? {})
      .filter(([variantModelSlug]) =>
        modelSlugCandidates.has(normalizeManualModelSlug(variantModelSlug)),
      )
      .flatMap(([, variants]) => variants),
  );
}

function mergeManualVariantOptions(
  existingOptions: string[],
  pageOptions: string[],
) {
  const mergedOptions = [...existingOptions];
  const existingKeys = new Set(
    existingOptions.map((variant) => normalizeManualModelSlug(variant)),
  );

  pageOptions.forEach((variant) => {
    const key = normalizeManualModelSlug(variant);

    if (!existingKeys.has(key)) {
      existingKeys.add(key);
      mergedOptions.push(variant);
    }
  });

  return mergedOptions;
}

function getManualModelImageModelSlug(
  path: string,
  make: string,
  brandSlug: string,
) {
  const fileName =
    path
      .split("/")
      .pop()
      ?.replace(/(?:-model-card)?\.(?:png|jpe?g|webp)$/i, "") ?? "";
  const modelFileName = fileName.replace(/^live-feed-/i, "");
  const brandPrefix = `${brandSlug}-`;
  const rawModelSlug = modelFileName.startsWith(brandPrefix)
    ? modelFileName.slice(brandPrefix.length)
    : modelFileName;
  const isCanonicalModelAsset =
    /-model-card\./i.test(path) || /\/live-feed-/i.test(path);
  const knownModelSlugPrefixes = [
    ...(carSeriesByMake[make] ?? []).flatMap((model) =>
      getManualModelSlugCandidates(make, model, brandSlug),
    ),
    ...(manualAssetModelSlugPrefixesByBrand[make] ?? []),
  ]
    .map((candidate) => slugifyManualImageValue(candidate))
    .sort((left, right) => right.length - left.length);
  const normalizedRawModelSlug = normalizeManualModelSlug(rawModelSlug);
  const matchedModelSlug = knownModelSlugPrefixes.find((candidate) =>
    normalizedRawModelSlug.startsWith(normalizeManualModelSlug(candidate)),
  );
  const modelSlug =
    !isCanonicalModelAsset && matchedModelSlug
      ? matchedModelSlug
      : rawModelSlug;

  return modelSlug.replace(new RegExp(`^${brandSlug}-`, "i"), "");
}

function normalizeManualModelSlug(value: string) {
  return value.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function getManualModelImageAliasPath(
  make: string,
  model: string,
  brandSlug: string,
) {
  const modelCardEntries = manualModelCardEntriesByBrand.get(brandSlug) ?? [];
  const modelSlugCandidates = getManualModelSlugCandidates(
    make,
    model,
    brandSlug,
  );

  return (
    modelCardEntries.find(({ modelSlug }) =>
      modelSlugCandidates.some((candidate) => {
        const normalizedCandidate = normalizeManualModelSlug(candidate);
        const normalizedAssetSlug = normalizeManualModelSlug(modelSlug);

        return (
          normalizedAssetSlug === normalizedCandidate ||
          normalizedAssetSlug.endsWith(normalizedCandidate) ||
          normalizedCandidate.endsWith(normalizedAssetSlug)
        );
      }),
    )?.path ?? null
  );
}

function getManualModelImagePath(make: string, model: string) {
  const brandSlug = getManualBrandSlug(make);
  const modelSlugCandidates = getManualModelSlugCandidates(
    make,
    model,
    brandSlug,
  );
  const modelImageStems = modelSlugCandidates.flatMap((modelSlug) => [
    `/images/brands/${brandSlug}/models/live-feed-${brandSlug}-${modelSlug}`,
    `/images/brands/${brandSlug}/models/live-feed-${modelSlug}`,
    `/images/brands/${brandSlug}/models/${brandSlug}-${modelSlug}-model-card`,
    `/images/brands/${brandSlug}/models/${brandSlug}-${brandSlug}-${modelSlug}-model-card`,
    `/images/brands/${brandSlug}/models/${brandSlug}-${modelSlug}`,
    `/images/brands/${brandSlug}/models/${brandSlug}-${brandSlug}-${modelSlug}`,
  ]);

  const exactImagePath = modelImageStems
    .map((stem) => manualModelImagePathsByStem.get(stem))
    .find((path): path is string => Boolean(path));

  if (exactImagePath) {
    return exactImagePath;
  }

  const aliasCardPath = getManualModelImageAliasPath(make, model, brandSlug);

  if (aliasCardPath) {
    return aliasCardPath;
  }

  const prefixMatches = modelImageStems.flatMap((stem) =>
    manualModelImagePaths.filter(
      (path) => path.startsWith(`${stem}-`) || path.startsWith(`${stem} `),
    ),
  );

  return [...new Set(prefixMatches)][0] ?? null;
}

const normalize = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

const modelsByMake: Record<string, string[] | Record<string, string[]>> =
  Object.entries(carSeries).reduce(
    (accumulator, [brand, items]) => {
      const normalizedBrand = normalize(brand);

      if (
        Array.isArray(items) &&
        items.length > 0 &&
        carModelsBySeriesMap[items[0]]
      ) {
        const seriesMap: Record<string, string[]> = {};

        items.forEach((seriesName) => {
          seriesMap[seriesName] = carModelsBySeriesMap[seriesName] ?? [];
        });

        accumulator[normalizedBrand] = seriesMap;
        return accumulator;
      }

      accumulator[normalizedBrand] = items;
      return accumulator;
    },
    {} as Record<string, string[] | Record<string, string[]>>,
  );

function titleCaseManualModelSlug(modelSlug: string) {
  return modelSlug
    .split("-")
    .filter(Boolean)
    .map((token) =>
      token.length <= 3
        ? token.toUpperCase()
        : `${token.charAt(0).toUpperCase()}${token.slice(1)}`,
    )
    .join(" ");
}

function getManualModelOptionKey(make: string, model: string) {
  const brandSlug = getManualBrandSlug(make);
  const modelSlug = slugifyManualImageValue(model).replace(
    /-(?:series|class)$/i,
    "",
  );
  const modelSlugWithoutBrand = stripManualBrandPrefix(
    modelSlug,
    make,
    brandSlug,
  );

  return modelSlugWithoutBrand.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function getManualDataModelOptionKeys(make: string, model: string) {
  const modelSlug = slugifyManualImageValue(model).replace(
    /-(?:cng|diesel|petrol|hybrid|electric|flexfuel|alcohol)(?:-.+)?$/i,
    "",
  );

  return [
    getManualModelOptionKey(make, model),
    getManualModelOptionKey(make, modelSlug),
  ];
}

function buildManualAssetModelOptions() {
  const optionsByMake: Record<string, string[]> = {};

  manualModelImagePathsByStem.forEach((path) => {
    const brandSlug = path.split("/")[3];
    const make = manualMakeOptions.find(
      (candidate) => getManualBrandSlug(candidate) === brandSlug,
    );

    if (!make) {
      return;
    }

    const modelSlug = getManualModelImageModelSlug(path, make, brandSlug);
    const modelSlugWithoutBrand = stripManualBrandPrefix(
      modelSlug,
      make,
      brandSlug,
    );
    const modelDisplayName =
      manualAssetModelDisplayNamesByBrand[make]?.[modelSlugWithoutBrand] ??
      titleCaseManualModelSlug(modelSlugWithoutBrand);
    const option = `${getMakeLabel(make)} ${modelDisplayName}`.trim();

    if (!optionsByMake[make]) {
      optionsByMake[make] = [];
    }

    if (
      !optionsByMake[make].some(
        (existing) =>
          getManualModelOptionKey(make, existing) ===
          getManualModelOptionKey(make, option),
      )
    ) {
      optionsByMake[make].push(option);
    }

    if (!manualModelCardEntriesByBrand.has(brandSlug)) {
      manualModelCardEntriesByBrand.set(brandSlug, []);
    }

    manualModelCardEntriesByBrand.get(brandSlug)?.push({
      path,
      modelSlug: modelSlugWithoutBrand,
    });
  });

  return optionsByMake;
}

const manualAssetModelOptionsByMake = buildManualAssetModelOptions();

function mergeManualModelOptions(make: string, dataModelOptions: string[]) {
  const imageBackedDataOptions = dataModelOptions.filter((model) =>
    getManualModelImagePath(make, model),
  );
  const mergedOptions = [...imageBackedDataOptions];
  const existingKeys = new Set(
    imageBackedDataOptions.flatMap((model) =>
      getManualDataModelOptionKeys(make, model),
    ),
  );

  (manualAssetModelOptionsByMake[make] ?? []).forEach((model) => {
    const key = getManualModelOptionKey(make, model);

    if (!existingKeys.has(key)) {
      existingKeys.add(key);
      mergedOptions.push(model);
    }
  });

  return mergedOptions;
}

function getManualContextualOptions(
  options: string[],
  selectedOption: string,
  count: number,
) {
  if (!options.length) {
    return [];
  }

  const selectedIndex = options.indexOf(selectedOption);

  if (selectedIndex < 0) {
    return options.slice(0, count);
  }

  const maxStart = Math.max(0, options.length - count);
  const start = Math.min(
    maxStart,
    Math.max(0, selectedIndex - Math.floor((count - 1) / 2)),
  );

  return options.slice(start, start + count);
}

function getManualWindowStart(options: string[], visibleOptions: string[]) {
  const firstVisibleOption = visibleOptions[0];
  const start = firstVisibleOption ? options.indexOf(firstVisibleOption) : 0;

  return Math.max(0, start);
}

const manualSelectedTileClass =
  "relative z-[3] overflow-visible after:absolute after:-right-1.5 after:-top-1.5 after:grid after:h-[18px] after:w-[18px] after:place-items-center after:rounded-full after:bg-[#0878ee] after:text-[11px] after:font-black after:leading-none after:text-white after:shadow-[0_2px_5px_rgba(8,80,180,0.35)] after:content-['✓']";

const rowGroups: HeroBrandRow[][] = [
  [
    { brand: "BMW", stat: "820+ quotes · last 30 days", price: "£1,800 - £4,500", codes: "N47D20 · B47D20 · N57D30" },
    { brand: "Land Rover", stat: "540+ quotes · last 30 days", price: "£3,200 - £6,500", codes: "306DT · 508PN · 276DT" },
    { brand: "Mercedes-Benz", stat: "675+ quotes · last 30 days", price: "£2,200 - £5,500", codes: "OM651 · M271 · M276" },
  ],
  [
    { brand: "Ford", stat: "480+ quotes · last 30 days", price: "£1,200 - £3,200", codes: "HHDA · M8MA · PNDA" },
    { brand: "Volkswagen", stat: "340+ quotes · last 30 days", price: "£1,400 - £3,500", codes: "CAYC · CFFB · CZCA" },
    { brand: "Jaguar", stat: "300+ quotes · last 30 days", price: "£2,800 - £5,800", codes: "306PS · 508PN · AJ126" },
  ],
  [
    { brand: "Nissan", stat: "280+ quotes · last 30 days", price: "£1,400 - £3,200", codes: "K9K · HR16DE · YD25DDTi" },
    { brand: "Renault", stat: "250+ quotes · last 30 days", price: "£1,100 - £2,800", codes: "K9K · M9R · H4M" },
    { brand: "Toyota", stat: "220+ quotes · last 30 days", price: "£1,200 - £3,000", codes: "1ND-TV · 2AD-FTV · 2ZR-FE" },
  ],
  [
    { brand: "Mitsubishi", stat: "175+ quotes · last 30 days", price: "£1,800 - £3,800", codes: "4N14 · 4D56 · 6G74" },
    { brand: "Peugeot", stat: "160+ quotes · last 30 days", price: "£1,100 - £2,800", codes: "DV6C · DW10 · EP6" },
    { brand: "Audi", stat: "160+ quotes · last 30 days", price: "£1,600 - £4,200", codes: "CAGA · CFFB · CDUC" },
  ],
  [
    { brand: "Honda", stat: "140+ quotes · last 30 days", price: "£1,300 - £3,000", codes: "N22A · R20A · K20C" },
    { brand: "Kia", stat: "125+ quotes · last 30 days", price: "£1,200 - £2,800", codes: "D4FB · G4FJ · D4HA" },
    { brand: "Mazda", stat: "120+ quotes · last 30 days", price: "£1,400 - £3,200", codes: "SH-VPTS · R2AA · L5-VE" },
  ],
];

const tickerItems: TickerItem[] = [
  { brand: "BMW", code: "N47D20", price: "£2,200" },
  { brand: "Land Rover", code: "306DT", price: "£4,100" },
  { brand: "Mercedes", code: "OM651", price: "£2,800" },
  { brand: "Ford", code: "HHDA", price: "£1,500" },
  { brand: "VW", code: "CAYC", price: "£1,800" },
  { brand: "Jaguar", code: "306PS", price: "£3,400" },
  { brand: "Nissan", code: "K9K", price: "£1,600" },
  { brand: "Renault", code: "M9R", price: "£1,400" },
  { brand: "Toyota", code: "2AD-FTV", price: "£1,800" },
  { brand: "Mitsubishi", code: "4N14", price: "£2,200" },
  { brand: "Peugeot", code: "DW10", price: "£1,400" },
  { brand: "Audi", code: "CAGA", price: "£2,100" },
  { brand: "Honda", code: "N22A", price: "£1,600" },
  { brand: "Kia", code: "D4FB", price: "£1,500" },
  { brand: "Mazda", code: "SH-VPTS", price: "£1,800" },
];

const engineCarouselItems: EngineCarouselItem[] = [
  { brand: "BMW", code: "N47D20", spec: "2.0L Diesel", price: "£2,200" },
  { brand: "Mercedes", code: "OM651", spec: "2.2L Diesel", price: "£2,800" },
  { brand: "Land Rover", code: "306DT", spec: "3.0L Diesel", price: "£4,100" },
  { brand: "Audi", code: "CAGA", spec: "2.0L TDI", price: "£2,000" },
  { brand: "Volkswagen", code: "CAYC", spec: "2.0L TDI", price: "£1,900" },
  { brand: "Ford", code: "HHDA", spec: "1.0L Petrol", price: "£1,500" },
  { brand: "Nissan", code: "K9K", spec: "1.5L Diesel", price: "£1,600" },
  { brand: "Toyota", code: "2AD-FTV", spec: "2.2L Diesel", price: "£1,800" },
];

const bottomBarItems = [
  {
    icon: "lightning",
    text: "Instant engine replacement quote - 100% free, no obligation",
  },
  {
    icon: "location",
    text: "Engine replacement near me - UK-wide specialist network",
  },
  {
    icon: "pound",
    text: "Compare reconditioned, rebuilt & used engine prices",
  },
  {
    icon: "wrench",
    text: "Supply & fit available - parts and labour from vetted specialists",
  },
  { icon: "shield", text: "12-24 month warranty on all replacement engines" },
];

// Map engine codes to their image filenames
function getEngineImagePath(code: string): string {
  const engineMap: Record<string, string> = {
    N47D20: "/96da5878-45b8-406b-8fc7-32f8a60d5c5c_removalai_preview.webp",
    OM651: "/194ff4f9-dd13-4c28-b2fc-4307d63ae0ce_removalai_preview.webp",
    "306DT": "/16924a6b-58ec-44d8-9ed5-ccd89f220a22_removalai_preview.webp",
    CAGA: "/04544090-33c9-4640-8eb7-0aa9041ae6b7_removalai_preview.webp",
    CAYC: "/d1ba9486-2d7d-4d0a-8b67-a00842d083c6_removalai_preview.webp",
    HHDA: "/dded14b9-939e-4104-9e75-073a942a5c68_removalai_preview.webp",
    K9K: "/e0597dc3-6685-4beb-bf5f-8be1626b14a1_removalai_preview.webp",
    "2AD-FTV": "/fac66331-c94d-48e9-983a-7997fd84a619_removalai_preview.webp",
  };
  return `/images/engines/${engineMap[code] || "engine-placeholder.webp"}`;
}

/* ─── Icon Components ─── */

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[14px] w-[14px]"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m9 18 6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SelectorChevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3 w-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === "left" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"} />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3 w-3 flex-none"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="11"
        width="18"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M7 11V7a5 5 0 0 1 10 0v4"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <circle
        cx="10.8"
        cy="10.8"
        r="6.8"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="m16 16 5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function splitInlineDisclaimerText(text: string, trailingWords = 3) {
  const normalized = text.replace(/\s+/g, " ").trim();
  const words = normalized.split(" ").filter(Boolean);

  if (words.length <= trailingWords) {
    return {
      leading: "",
      trailing: normalized,
    };
  }

  return {
    leading: words.slice(0, -trailingWords).join(" "),
    trailing: words.slice(-trailingWords).join(" "),
  };
}

function EngineTickerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="8"
        width="18"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="8"
        y="5"
        width="8"
        height="4"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="6" cy="16" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="18" cy="16" r="1.5" fill="currentColor" stroke="none" />
      <path
        d="M3 13H1M21 13h2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M5 11l1.8-5.4A2 2 0 0 1 8.7 4h6.6a2 2 0 0 1 1.9 1.6L19 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect
        x="3"
        y="11"
        width="18"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="7.5" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16.5" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5.5 18H3v-2M18.5 18H21v-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M7 16V4m0 0L3 8m4-4l4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 8v12m0 0l4-4m-4 4l-4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EngineCodeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="8"
        width="18"
        height="10"
        rx="2"
        stroke="#15803d"
        strokeWidth="1.5"
      />
      <rect
        x="8"
        y="5"
        width="8"
        height="4"
        rx="1"
        stroke="#15803d"
        strokeWidth="1.5"
      />
      <circle cx="6" cy="16" r="1.5" fill="#15803d" />
      <circle cx="18" cy="16" r="1.5" fill="#15803d" />
      <path
        d="M3 13H1M21 13h2"
        stroke="#15803d"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldStarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
      <path
        d="M12 3L4 7v5c0 4.8 3.4 9.3 8 10.3C16.6 21.3 20 16.8 20 12V7L12 3z"
        stroke="#15803d"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 8l.9 2.6H16l-2.5 1.9 1 2.5L12 13.5l-2.5 1.5 1-2.5L8 10.6h3.1L12 8z"
        stroke="#15803d"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="#15803d" strokeWidth="1.5" />
      <path
        d="M8 12l3 3 5-5"
        stroke="#15803d"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LightningIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 flex-none"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M13 2L4.5 13.5H11L10 22l9.5-12H13V2z"
        stroke="#15803d"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 flex-none"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2C8.7 2 6 4.7 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.3-2.7-6-6-6z"
        stroke="#15803d"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="8" r="2" stroke="#15803d" strokeWidth="1.5" />
    </svg>
  );
}

function PoundIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 flex-none"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 18h8"
        stroke="#15803d"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 14h7"
        stroke="#15803d"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9 14V9.5C9 7.6 10.6 6 12.5 6 14.4 6 16 7.6 16 9.5"
        stroke="#15803d"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 flex-none"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
        stroke="#15803d"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 flex-none"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3L4 7v5c0 4.8 3.4 9.3 8 10.3C16.6 21.3 20 16.8 20 12V7L12 3z"
        stroke="#15803d"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="#15803d"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="m15 18-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="m9 18 6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BottomBarIcon({ type }: { type: string }) {
  switch (type) {
    case "lightning":
      return <LightningIcon />;
    case "location":
      return <LocationIcon />;
    case "pound":
      return <PoundIcon />;
    case "wrench":
      return <WrenchIcon />;
    case "shield":
      return <ShieldCheckIcon />;
    default:
      return null;
  }
}

/* UK Flag SVG */
function UKFlag() {
  return (
    <img
      src="/failures/img/gb.webp"
      alt=""
      className="h-full w-full rounded-[1px] object-fill"
      aria-hidden="true"
    />
  );
}

/* Engine illustration for carousel cards */
function EngineIllustration() {
  return (
    <svg
      viewBox="0 0 100 72"
      className="h-full w-full"
      fill="none"
      aria-hidden="true"
    >
      {/* Main engine block */}
      <rect
        x="16"
        y="22"
        width="68"
        height="36"
        rx="4"
        fill="#d1d5db"
        stroke="#9ca3af"
        strokeWidth="1"
      />
      {/* Cylinder head */}
      <rect
        x="20"
        y="13"
        width="60"
        height="12"
        rx="3"
        fill="#e5e7eb"
        stroke="#9ca3af"
        strokeWidth="1"
      />
      {/* Cylinders */}
      <rect x="25" y="15" width="11" height="8" rx="2" fill="#9ca3af" />
      <rect x="41" y="15" width="11" height="8" rx="2" fill="#9ca3af" />
      <rect x="57" y="15" width="11" height="8" rx="2" fill="#9ca3af" />
      <rect x="73" y="15" width="11" height="8" rx="2" fill="#9ca3af" />
      {/* Valve cover detail */}
      <rect
        x="22"
        y="25"
        width="56"
        height="8"
        rx="2"
        fill="#c4c9d1"
        stroke="#9ca3af"
        strokeWidth="0.8"
      />
      {/* Intake manifold */}
      <path
        d="M30 22 Q28 32 36 36"
        stroke="#9ca3af"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Oil filler cap */}
      <circle
        cx="66"
        cy="30"
        r="6"
        fill="#9ca3af"
        stroke="#6b7280"
        strokeWidth="1"
      />
      <circle cx="66" cy="30" r="3" fill="#6b7280" />
      {/* Alternator */}
      <rect
        x="74"
        y="35"
        width="14"
        height="12"
        rx="3"
        fill="#b0b8c4"
        stroke="#6b7280"
        strokeWidth="0.8"
      />
      <circle cx="81" cy="41" r="4" fill="#6b7280" />
      <circle cx="81" cy="41" r="2" fill="#9ca3af" />
      {/* Drive belt */}
      <path
        d="M16 38 Q8 38 8 46 Q8 56 16 56"
        stroke="#374151"
        strokeWidth="2"
        fill="none"
      />
      <circle
        cx="12"
        cy="47"
        r="6"
        stroke="#374151"
        strokeWidth="1.5"
        fill="#e5e7eb"
      />
      {/* Sump / oil pan */}
      <rect
        x="22"
        y="55"
        width="56"
        height="6"
        rx="2"
        fill="#c4c9d1"
        stroke="#9ca3af"
        strokeWidth="0.8"
      />
      {/* Exhaust ports */}
      <rect x="26" y="58" width="7" height="10" rx="1" fill="#9ca3af" />
      <rect x="45" y="58" width="7" height="10" rx="1" fill="#9ca3af" />
      <rect x="64" y="58" width="7" height="10" rx="1" fill="#9ca3af" />
    </svg>
  );
}

function getBrandLogoPath(brand: string): string {
  const brandMap: Record<string, string> = {
    BMW: "bmw-logo-small.webp.webp",
    "Land Rover": "land-rover-logo-small.webp.webp",
    "Mercedes-Benz": "mercedes-logo-small.webp.webp",
    Ford: "ford-logo-small.webp.webp",
    Volkswagen: "volkswagon-logo-small.webp.webp",
    Jaguar: "jaguar-logo-small.webp.webp",
    Nissan: "nissan-logo-small.webp.webp",
    Renault: "renault-logo-small.webp.webp",
    Toyota: "toyota-logo-small.webp.webp",
    Mitsubishi: "mitsubishi-logo-small.webp.webp",
    Peugeot: "peugeot-logo-small.webp.webp",
    Audi: "audi-logo-small.webp.webp",
    Honda: "honda-logo-small.webp.webp",
    Kia: "kia-logo-small.webp.webp",
    Mazda: "mazda-logo-small.webp.webp",
  };

  return `/BrandsLogos/${brandMap[brand] || "default-logo.webp"}`;
}

function LogoBadge({ brand }: { brand: string }) {
  return (
    <div className="flex h-11 w-11 flex-none items-center justify-center overflow-hidden">
      <img
        src={getBrandLogoPath(brand)}
        alt={`${brand} logo`}
        className="h-11 w-11 object-contain"
      />
    </div>
  );
}

function renderLinkedEngineCodes(codes: string, engineLinks?: EngineLinkMap) {
  return codes.split(/(,\s*|\s*\/\s*|\s*·\s*)/).map((part, index) => {
    if (!part.trim() || /^[,\s/·]+$/.test(part)) {
      return <span key={`${part}-${index}`}>{part}</span>;
    }

    const href = getEngineLinkForCode(part, engineLinks);

    if (!href) {
      return <span key={`${part}-${index}`}>{part}</span>;
    }

    return (
      <Link
        key={`${part}-${index}`}
        href={href}
        className="underline-offset-2 transition hover:text-[#15803d] hover:underline"
      >
        {part}
      </Link>
    );
  });
}

/* Brand Row - matches screenshot layout exactly */
function HeroRow({ row, engineLinks }: { row: HeroBrandRow; engineLinks?: EngineLinkMap }) {
  return (
    // Changed px-4 to px-2 sm:px-4 to reduce overall left/right space on mobile
    <div className="flex h-[80px] cursor-pointer items-center sm:gap-15 border-b border-[rgba(13,27,46,0.1)] px-2 sm:px-4 last:border-b-0 transition-colors hover:bg-[#f9fafb]">

      {/* LEFT: Logo + Brand name grouped together */}
      {/* Changed w-[110px] to w-[50px] sm:w-[110px] to reduce space around the logo on mobile */}
      <div className="flex w-[50px] min-[380px]:w-[60px] sm:w-[10px] flex-shrink-0 flex-col items-center gap-2 sm:flex-row sm:gap-4">
        <LogoBadge brand={row.brand} />
        {/* <span className="hidden sm:inline text-md font-bold text-[#0d1b2e] sm:text-left">{row.brand}</span> */}
      </div>

      {/* CENTER: 3-line stats block */}
      <div className="min-w-0 flex-1">
        {/* Line 1: green quote count */}
        <div className="mb-[3px] text-[13px] font-bold text-[#15803d]">
          {/* Added brand name here for mobile only, in dark blue */}
          <span className="mr-1.5 text-[#0d1b2e]">{row.brand}</span>
          {row.stat}
        </div>

{/* Line 2: price range */}
<div className="mb-[2px] text-[13px] text-[#0d1b2e]">
  Avg. <span className="font-semibold">Rebuilt</span> Quote:{" "}
  <span className="font-semibold">{row.price}</span>{" "}
  <span className="text-[11px] text-[#6b7280]">· supply only</span>
</div>

{/* Line 3: most requested codes */}
<div className="truncate text-[11px] text-[#6b7280]">
  Most requested:{" "}
  <span className="font-medium text-[#2563eb]">{renderLinkedEngineCodes(row.codes, engineLinks)}</span>
</div>
      </div>

      {/* RIGHT: chevron arrow */}
      <span className="flex-none text-[#9ca3af]">
        <ArrowIcon />
      </span>
    </div>
  );
}

type ManualSelectorKind = "makes" | "models" | "variants" | "years";

function ManualSelectorPanel({
  kind,
  query,
  onQueryChange,
  onClose,
  makeOptions,
  modelOptions,
  variantOptions,
  yearOptions,
  manualMake,
  manualModel,
  manualVariant,
  manualYear,
  onMakeSelect,
  onModelSelect,
  onVariantSelect,
  onYearSelect,
}: {
  kind: ManualSelectorKind;
  query: string;
  onQueryChange: (value: string) => void;
  onClose: () => void;
  makeOptions: string[];
  modelOptions: string[];
  variantOptions: string[];
  yearOptions: string[];
  manualMake: string;
  manualModel: string;
  manualVariant: string;
  manualYear: string;
  onMakeSelect: (make: string) => void;
  onModelSelect: (model: string) => void;
  onVariantSelect: (variant: string) => void;
  onYearSelect: (year: string) => void;
}) {
  const sourceOptions =
    kind === "makes"
      ? makeOptions
      : kind === "models"
        ? modelOptions
        : kind === "variants"
          ? variantOptions
          : yearOptions;
  const normalizedQuery = query.trim().toLowerCase();
  const filteredOptions = sourceOptions.filter((option) =>
    option.toLowerCase().includes(normalizedQuery),
  );
  const title =
    kind === "makes"
      ? "Select Your Make"
      : kind === "models"
        ? "Select Your Model"
        : kind === "variants"
          ? "Select Your Variant"
          : "Select Your Year";
  const placeholder =
    kind === "makes"
      ? "Search brands..."
      : kind === "models"
        ? "Search models..."
        : kind === "variants"
          ? "Search variants..."
          : "Search years...";
  const selectorGridClass =
    kind === "makes"
      ? "grid-cols-3 md:grid-cols-5"
      : kind === "models" || kind === "variants"
        ? "grid-cols-3 md:grid-cols-4"
        : "grid-cols-4 md:grid-cols-8";
  const optionListHeightClass =
    kind === "makes" || kind === "models"
      ? "max-h-[216px] lg:max-h-[270px]"
      : kind === "variants"
        ? "max-h-[216px] lg:max-h-[126px]"
        : "max-h-[108px] lg:max-h-[132px]";
  const inlinePaddingClass =
    kind === "makes" || kind === "models" ? "px-[6px] sm:px-[4px]" : "";

  return (
    <div className={`bg-transparent ${inlinePaddingClass}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-[15px] font-bold leading-none text-[#102452]">
          {title}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close selector"
          className="grid h-6 w-6 flex-none place-items-center rounded-full border border-[#d6e0ec] bg-white text-[#52657d] shadow-sm transition hover:border-[#0878ee] hover:text-[#0878ee]"
        >
          <CloseIcon />
        </button>
      </div>

      <label className="relative mt-1 block">
        <span className="sr-only">{placeholder}</span>
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8a97aa]">
          <SearchIcon />
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.currentTarget.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="h-9 w-full rounded-[8px] border border-[#cbd8e7] bg-white pl-9 pr-3 text-[12px] text-[#102452] outline-none placeholder:text-[#8a97aa] focus:border-[#0878ee] focus:ring-2 focus:ring-[#0878ee]/15"
        />
      </label>

      <div
        className={`mt-2 overflow-y-auto overscroll-contain pr-1 ${optionListHeightClass}`}
      >
        {filteredOptions.length > 0 ? (
          <div className={`grid gap-1.5 ${selectorGridClass}`}>
            {filteredOptions.map((option, index) => {
              const isMake = kind === "makes";
              const isModel = kind === "models";
              const isVariant = kind === "variants";
              const isSelected = isMake
                ? manualMake === option
                : isModel
                  ? manualModel === option
                  : isVariant
                    ? manualVariant === option
                    : manualYear === option;
              const optionImagePath = isMake
                ? getMakeLogoPath(option)
                : isModel
                  ? getManualModelImagePath(manualMake, option)
                  : null;
              const selectorTileSize = isMake
                ? "min-h-[72px] md:aspect-[1.25/1]"
                : isModel
                  ? "min-h-[86px]"
                  : isVariant
                    ? "min-h-[36px]"
                    : "min-h-[40px]";
              const selectorImageSize = isMake
                ? "h-10 w-[72px] md:h-[39px]"
                : "h-11 w-[104px] md:h-[50px]";

              return (
                <button
                  key={`${kind}-${option}-${index}`}
                  type="button"
                  onClick={() => {
                    if (isMake) onMakeSelect(option);
                    else if (isModel) onModelSelect(option);
                    else if (isVariant) onVariantSelect(option);
                    else onYearSelect(option);
                  }}
                  className={`flex ${selectorTileSize} ${isModel || isMake ? "flex-col gap-1" : ""} items-center justify-center rounded-[8px] border px-1 py-1 text-center text-[10px] font-semibold leading-[1.05] transition ${
                    isSelected
                      ? `border-2 border-[#0878ee] bg-[#eaf5ff] text-[#064ea7] ${manualSelectedTileClass}`
                      : "border-[#d6e0ec] bg-gradient-to-b from-white to-[#f9fbfd] text-[#102452] hover:border-[#65aefa]"
                  }`}
                >
                  {optionImagePath ? (
                    <img
                      src={optionImagePath}
                      alt=""
                      className={`${selectorImageSize} object-contain`}
                    />
                  ) : isMake ? (
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e7eef8] text-[15px] text-[#1e3a8a]">
                      {getMakeLabel(option).charAt(0)}
                    </span>
                  ) : null}
                  <span
                    className={
                      isModel || isVariant ? "line-clamp-2" : "line-clamp-1"
                    }
                  >
                    {isMake ? getMakeLabel(option) : option}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-[62px] items-center justify-center rounded-[8px] border border-dashed border-[#cbd8e7] bg-white/65 px-3 text-center text-[11px] font-semibold text-[#8a97aa]">
            No matches found
          </div>
        )}
      </div>
    </div>
  );
}

/* CTA Panel - reused on both mobile and desktop */
function CTAPanel({
  registration,
  onRegistrationChange,
  onSubmit,
  isRegistrationLookupLoading,
  registrationLookupError,
  gdprNote,
}: {
  registration: string;
  onRegistrationChange: (val: string) => void;
  onSubmit: (payload: {
    searchMode: SearchMode;
    regNumber?: string;
    make?: string;
    model?: string;
    variant?: string;
    series?: string;
    year?: string;
    engineCode?: string;
  }) => void | Promise<void>;
  isRegistrationLookupLoading: boolean;
  registrationLookupError: string;
  gdprNote: string;
}) {
  const [searchMode, setSearchMode] = useState<SearchMode>("registration");
  const [manualMake, setManualMake] = useState<string>("BMW");
  const [manualModel, setManualModel] = useState<string>("");
  const [manualVariant, setManualVariant] = useState<string>("");
  const [manualYear, setManualYear] = useState<string>("");
  const [manualEngineCode, setManualEngineCode] = useState("");
  const [expandedSelector, setExpandedSelector] =
    useState<ManualSelectorKind | null>(null);
  const [selectorQuery, setSelectorQuery] = useState("");
  const [manualMakeWindow, setManualMakeWindow] = useState<string[] | null>(
    null,
  );
  const [manualModelWindow, setManualModelWindow] = useState<string[] | null>(
    null,
  );

  const { modelOptions, variantsByModel } = useMemo(() => {
    const entry = modelsByMake[normalize(manualMake)];

    if (entry && !Array.isArray(entry)) {
      const imageBackedModelOptions = mergeManualModelOptions(
        manualMake,
        Object.keys(entry),
      );

      return {
        modelOptions: imageBackedModelOptions,
        variantsByModel: Object.fromEntries(
          Object.entries(entry).filter(([model]) =>
            imageBackedModelOptions.includes(model),
          ),
        ) as Record<string, string[]>,
      };
    }

    return {
      modelOptions: mergeManualModelOptions(
        manualMake,
        (entry as string[]) ?? [],
      ),
      variantsByModel: {} as Record<string, string[]>,
    };
  }, [manualMake]);

  useEffect(() => {
    setManualModel("");
    setManualVariant("");
    setManualYear("");
    setManualModelWindow(null);
    setExpandedSelector(null);
    setSelectorQuery("");
  }, [manualMake]);

  const featuredMakeOptions = featuredMakeKeys.filter((make) =>
    manualAssetMakeOptions.includes(make),
  );
  const visibleMakeOptions =
    manualMakeWindow ??
    (manualMake === "BMW"
      ? featuredMakeOptions
      : getManualContextualOptions(manualAssetMakeOptions, manualMake, 5));
  const visibleModelOptions =
    manualModelWindow ??
    (manualModel
      ? getManualContextualOptions(modelOptions, manualModel, 5)
      : modelOptions.slice(0, 5));
  const variantOptions = mergeManualVariantOptions(
    variantsByModel[manualModel] ?? [],
    getManualVariantPageOptions(manualMake, manualModel),
  );
  const visibleVariantOptions = variantOptions.slice(0, 5);
  const visibleYearOptions = manualYearOptions.slice(0, 4);
  const hasManualVariants = variantOptions.length > 0;
  const isYearSelectionReady = Boolean(
    manualMake && manualModel && (!hasManualVariants || manualVariant),
  );
  const isManualSelectionComplete = Boolean(
    manualMake &&
    manualModel &&
    (!hasManualVariants || manualVariant) &&
    manualYear,
  );

  function openSelector(kind: ManualSelectorKind) {
    setSelectorQuery("");
    setExpandedSelector(kind);
  }

  function closeSelector() {
    setSelectorQuery("");
    setExpandedSelector(null);
  }

  function selectMake(make: string, fromSelector = false) {
    if (fromSelector) {
      setManualMakeWindow(
        getManualContextualOptions(manualAssetMakeOptions, make, 5),
      );
    } else if (!manualMakeWindow) {
      setManualMakeWindow(visibleMakeOptions);
    }

    setManualMake(make);
    setManualModel("");
    setManualVariant("");
    setManualYear("");
    closeSelector();
  }

  function selectModel(model: string, fromSelector = false) {
    if (fromSelector) {
      setManualModelWindow(getManualContextualOptions(modelOptions, model, 5));
    } else if (!manualModelWindow) {
      setManualModelWindow(visibleModelOptions);
    }

    setManualModel(model);
    setManualVariant("");
    setManualYear("");
    closeSelector();
  }

  function moveManualMakeWindow(direction: -1 | 1) {
    const currentStart = getManualWindowStart(
      manualAssetMakeOptions,
      visibleMakeOptions,
    );
    const maxStart = Math.max(0, manualAssetMakeOptions.length - 5);
    const nextStart = Math.min(
      maxStart,
      Math.max(0, currentStart + direction * 5),
    );

    setManualMakeWindow(manualAssetMakeOptions.slice(nextStart, nextStart + 5));
  }

  const manualMakeWindowStart = getManualWindowStart(
    manualAssetMakeOptions,
    visibleMakeOptions,
  );
  const canMoveManualMakeLeft = manualMakeWindowStart > 0;
  const canMoveManualMakeRight =
    manualMakeWindowStart + visibleMakeOptions.length <
    manualAssetMakeOptions.length;

  function selectVariant(variant: string) {
    setManualVariant(variant);
    setManualYear("");
    closeSelector();
  }

  function selectYear(year: string) {
    setManualYear(year);
    closeSelector();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (searchMode === "registration") {
      await onSubmit({
        searchMode,
        regNumber: registration.trim(),
      });
      return;
    }

    if (!isManualSelectionComplete) {
      return;
    }

    await onSubmit({
      searchMode,
      make: manualMake,
      model: manualModel,
      variant: manualVariant,
      year: manualYear,
      engineCode: manualEngineCode.trim().toUpperCase(),
    });
  }

  return (
    <div>
      {/* Toggle buttons */}
      <div className="mb-2 grid w-full grid-cols-2 gap-0 overflow-hidden rounded-[15px] border border-white/70 bg-white/80 p-0 shadow-[0_4px_12px_rgba(10,39,83,0.12)] backdrop-blur-[20px]">
        <button
          type="button"
          onClick={() => {
            setSearchMode("registration");
            closeSelector();
          }}
          aria-pressed={searchMode === "registration"}
          style={
            searchMode === "registration"
              ? {
                 background: "linear-gradient(180deg, #0e2a4f 0%, #061a33 60%, #030d1a 100%)",
                  boxShadow:
                    "inset 0 2px 0 rgba(255,255,255,0.30), inset 0 -3px 6px rgba(0,0,20,0.30), 0 4px 10px rgba(10,30,90,0.35)",
                }
              : undefined
          }
          className={`flex min-h-[46px] flex-1 items-center justify-center gap-1 px-1.5 py-2 text-[10px] font-semibold transition-all [&>svg]:h-3 [&>svg]:w-3 sm:min-h-[55px] sm:gap-1.5 sm:rounded-md sm:px-4 sm:py-3 sm:text-[13px] sm:[&>svg]:h-4 sm:[&>svg]:w-4 ${
            searchMode === "registration"
              ? "border border-white/20 text-white active:translate-y-[3px] active:shadow-none"
              : "border border-transparent bg-white text-[#0b245a] shadow-[inset_0_2px_5px_rgba(10,39,83,0.10)] hover:bg-[#f2f8ff] active:translate-y-[2px] active:shadow-none"
          }`}
        >
          <CarIcon />
          Search by Registration
        </button>
        <button
          type="button"
          onClick={() => {
            setSearchMode("manual");
            closeSelector();
          }}
          aria-pressed={searchMode === "manual"}
          style={
            searchMode === "manual"
              ? {
                  background:
                    "linear-gradient(180deg, #0e2a4f 0%, #061a33 60%, #030d1a 100%)",
                  boxShadow:
                    "inset 0 2px 0 rgba(255,255,255,0.30), inset 0 -3px 6px rgba(0,0,20,0.30), 0 4px 10px rgba(10,30,90,0.35)",
                }
              : undefined
          }
          className={`flex min-h-[46px] flex-1 items-center justify-center gap-1 px-1.5 py-2 text-[10px] font-semibold transition-all [&>svg]:h-3 [&>svg]:w-3 sm:min-h-[55px] sm:gap-1.5 sm:rounded-md sm:px-4 sm:py-3 sm:text-[13px] sm:[&>svg]:h-4 sm:[&>svg]:w-4 ${
            searchMode === "manual"
              ? "border border-white/20 text-white active:translate-y-[3px] active:shadow-none"
              : "border border-transparent bg-white text-[#0b245a] shadow-[inset_0_2px_5px_rgba(10,39,83,0.10)] hover:bg-[#f2f8ff] active:translate-y-[2px] active:shadow-none"
          }`}
        >
          <SwapIcon />
          Search Manually
        </button>
      </div>

      <div
        className={`text-center ${searchMode === "manual" ? (expandedSelector ? "p-0.5 sm:p-1 lg:p-1" : "p-3 sm:p-4 lg:px-[15px] lg:py-[6px]") : "p-2 sm:p-6"}`}
      >
        {searchMode === "registration" ? (
          <>
            <h3 className="mb-1 text-[18px] font-semibold text-[#0d1b2e] mx-auto">
              Get Your Free Engine Quotes
            </h3>
            <p className="mb-4 text-[15px] text-gray-600 mx-auto">
              Instant comparison from UK-vetted engine specialists
            </p>
          </>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className={
            searchMode === "manual"
              ? expandedSelector
                ? "mb-0"
                : "mb-2"
              : "mb-4"
          }
        >
          {searchMode === "registration" ? (
            <div className="relative mx-auto block w-full">
              <div className="flex h-[60px] w-full min-w-0 overflow-hidden rounded-[9px] border-[4px] border-[#102442] bg-[#ffdd00] sm:h-[68px]">
                <div className="flex w-[48px] shrink-0 items-center justify-center border-r-[4px] border-[#102442] bg-[#003399]">
                  <UKFlag />
                </div>
                <input
                  type="text"
                  value={registration}
                  onChange={(e) =>
                    onRegistrationChange(e.currentTarget.value.toUpperCase())
                  }
                  placeholder="REG HERE"
                  maxLength={8}
                  autoCapitalize="characters"
                  autoComplete="off"
                  spellCheck={false}
                  className="min-w-0 flex-1 bg-transparent px-2 text-center text-[22px] font-bold uppercase tracking-[0.07em] text-[#10151c] outline-none placeholder:text-[22px] placeholder:text-[#10151c] placeholder:opacity-100 focus:outline-none focus:ring-0 sm:text-[32px] sm:placeholder:text-[32px]"
                  style={{
                    fontFamily:
                      '"Charles Wright", "Arial Black", Arial, sans-serif',
                  }}
                />
              </div>
            </div>
          ) : expandedSelector ? (
            <ManualSelectorPanel
              kind={expandedSelector}
              query={selectorQuery}
              onQueryChange={setSelectorQuery}
              onClose={closeSelector}
              makeOptions={manualAssetMakeOptions}
              modelOptions={modelOptions}
              variantOptions={variantOptions}
              yearOptions={manualYearOptions}
              manualMake={manualMake}
              manualModel={manualModel}
              manualVariant={manualVariant}
              manualYear={manualYear}
              onMakeSelect={(make) => selectMake(make, true)}
              onModelSelect={(model) => selectModel(model, true)}
              onVariantSelect={selectVariant}
              onYearSelect={selectYear}
            />
          ) : (
            <div className="grid gap-2 text-left">
              <div>
                <div className="mb-1 text-[13.5px] font-bold leading-tight text-[#2d567c]">
                  Select Your Make
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => moveManualMakeWindow(-1)}
                    disabled={!canMoveManualMakeLeft}
                    aria-label="Previous brands"
                    className="absolute -left-2 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 place-items-center rounded-full border border-[#cfdbea] bg-white text-[#1e3a8a] shadow-[0_2px_6px_rgba(9,42,83,0.22)] transition hover:scale-110 hover:opacity-100 disabled:cursor-default disabled:opacity-30 sm:grid"
                  >
                    <SelectorChevron direction="left" />
                  </button>
                  <div className="manual-selector-grid manual-selector-grid--three-plus-view-all grid grid-cols-3 gap-1.5 sm:grid-cols-6">
                    {visibleMakeOptions.map((make, index) => {
                      const logoPath = getMakeLogoPath(make);
                      const isSelected = manualMake === make;

                      return (
                        <button
                          key={`${make}-${index}`}
                          type="button"
                          onClick={() => selectMake(make)}
                          className={`flex min-h-[78px] min-w-0 flex-col items-center justify-center gap-1 rounded-[8px] border px-1 py-1 text-center text-[10px] font-semibold leading-[1.05] transition sm:min-h-[84px] lg:h-[74px] lg:min-h-[74px] ${
                            isSelected
                              ? `border-2 border-[#0878ee] bg-[#eaf5ff] text-[#064ea7] shadow-[0_0_0_2px_rgba(8,120,238,0.12),0_3px_8px_rgba(8,120,238,0.14)] ${manualSelectedTileClass}`
                              : "border-[#d6e0ec] bg-gradient-to-b from-white to-[#f9fbfd] text-[#102452] shadow-[0_2px_5px_rgba(9,42,83,0.07)] hover:-translate-y-px hover:border-[#65aefa]"
                          }`}
                        >
                          {logoPath ? (
                            <img
                              src={logoPath}
                              alt=""
                              className="h-9 w-full object-contain sm:h-10 lg:h-10 lg:w-[68px]"
                            />
                          ) : (
                            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e7eef8] text-[15px] text-[#1e3a8a] sm:h-10 sm:w-10 lg:h-10 lg:w-10">
                              {getMakeLabel(make).charAt(0)}
                            </span>
                          )}
                          <span className="max-w-full truncate">
                            {getMakeLabel(make)}
                          </span>
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => openSelector("makes")}
                      className="flex min-h-[78px] min-w-0 flex-row items-center justify-center gap-1 rounded-[8px] border border-[#d6e0ec] bg-gradient-to-b from-white to-[#f2f8ff] px-1 py-1 text-center text-[10px] font-bold leading-[1.05] text-[#1e3a8a] shadow-[0_2px_5px_rgba(9,42,83,0.07)] sm:min-h-[84px] lg:h-[74px] lg:min-h-[74px]"
                    >
                      <span>View All</span>
                      <ArrowIcon />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => moveManualMakeWindow(1)}
                    disabled={!canMoveManualMakeRight}
                    aria-label="Next brands"
                    className="absolute -right-2 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 place-items-center rounded-full border border-[#cfdbea] bg-white text-[#1e3a8a] shadow-[0_2px_6px_rgba(9,42,83,0.22)] transition hover:scale-110 hover:opacity-100 disabled:cursor-default disabled:opacity-30 sm:grid"
                  >
                    <SelectorChevron direction="right" />
                  </button>
                </div>
              </div>

              <div>
                <div className="mb-1 text-[13.5px] font-bold leading-tight text-[#2d567c]">
                  Select Your Model
                </div>
                <div
                  className={`manual-selector-grid grid grid-cols-3 gap-1.5 sm:grid-cols-6 ${modelOptions.length > 5 ? "manual-selector-grid--three-plus-view-all" : ""}`}
                >
                  {visibleModelOptions.length > 0 ? (
                    visibleModelOptions.map((model, index) =>
                      (() => {
                        const modelImagePath = getManualModelImagePath(
                          manualMake,
                          model,
                        );

                        return (
                          <button
                            key={`${manualMake}-model-${model}-${index}`}
                            type="button"
                            onClick={() => selectModel(model)}
                            className={`flex min-h-[78px] flex-col items-center justify-center gap-1 rounded-[8px] border px-1 py-1 text-center text-[10px] font-semibold leading-[1.05] transition sm:min-h-[84px] lg:h-[74px] lg:min-h-[74px] ${
                              manualModel === model
                                ? `border-2 border-[#0878ee] bg-[#eaf5ff] text-[#064ea7] ${manualSelectedTileClass}`
                                : "border-[#d6e0ec] bg-gradient-to-b from-white to-[#f9fbfd] text-[#102452] hover:border-[#65aefa]"
                            }`}
                          >
                            {modelImagePath ? (
                              <img
                                src={modelImagePath}
                                alt=""
                                className="h-10 w-full object-contain sm:h-11 lg:h-11 lg:w-[82px]"
                              />
                            ) : null}
                            <span className="line-clamp-2">{model}</span>
                          </button>
                        );
                      })(),
                    )
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="flex min-h-[78px] min-w-0 cursor-default items-center justify-center rounded-[8px] border border-dashed border-[#cbd8e7] bg-white/65 px-2 text-center text-[10px] font-semibold text-[#8a97aa] sm:min-h-[84px] lg:h-[74px] lg:min-h-[74px]"
                    >
                      Select a make
                    </button>
                  )}
                  {modelOptions.length > 5 ? (
                    <button
                      type="button"
                      onClick={() => openSelector("models")}
                      className="flex min-h-[78px] items-center justify-center gap-1 rounded-[8px] border border-[#d6e0ec] bg-gradient-to-b from-white to-[#f2f8ff] px-1 py-1 text-center text-[10px] font-bold leading-[1.05] text-[#1e3a8a] sm:min-h-[84px] lg:h-[74px] lg:min-h-[74px]"
                    >
                      <span>View All</span>
                      <ArrowIcon />
                    </button>
                  ) : null}
                </div>
              </div>

              {manualModel !== "" && variantOptions.length > 0 ? (
                <div>
                  <div className="mb-1 text-[13.5px] font-bold leading-tight text-[#2d567c]">
                    Select Your Variant
                  </div>
                  <div
                    className={`manual-selector-grid grid grid-cols-3 gap-1.5 sm:grid-cols-6 ${variantOptions.length > 5 ? "manual-selector-grid--three-plus-view-all" : ""}`}
                  >
                    {visibleVariantOptions.map((variant, index) => {
                      return (
                        <button
                          key={`${manualMake}-variant-${variant}-${index}`}
                          type="button"
                          onClick={() => selectVariant(variant)}
                          className={`flex min-h-[40px] items-center justify-center rounded-[8px] border px-1 py-1 text-center text-[10px] font-semibold leading-[1.05] transition ${
                            manualVariant === variant
                              ? `border-2 border-[#0878ee] bg-[#eaf5ff] text-[#064ea7] ${manualSelectedTileClass}`
                              : "border-[#d6e0ec] bg-gradient-to-b from-white to-[#f9fbfd] text-[#102452] hover:border-[#65aefa]"
                          }`}
                        >
                          <span className="line-clamp-2">{variant}</span>
                        </button>
                      );
                    })}
                    {variantOptions.length > 5 ? (
                      <button
                        type="button"
                        onClick={() => openSelector("variants")}
                        className="flex min-h-[40px] items-center justify-center gap-1 rounded-[8px] border border-[#d6e0ec] bg-gradient-to-b from-white to-[#f2f8ff] px-1 py-1 text-center text-[10px] font-bold leading-[1.05] text-[#1e3a8a]"
                      >
                        <span>View All</span>
                        <ArrowIcon />
                      </button>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {isYearSelectionReady ? (
                <div>
                  <div className="mb-1 text-[13.5px] font-bold leading-tight text-[#2d567c]">
                    Select Your Year
                  </div>
                  <div className="manual-selector-grid manual-selector-grid--year grid grid-cols-3 gap-1.5 sm:grid-cols-6">
                    {visibleYearOptions.map((year, index) => (
                      <button
                        key={`${year}-${index}`}
                        type="button"
                        onClick={() => setManualYear(year)}
                        className={`min-h-[30px] rounded-[8px] border px-1 py-1 text-center text-[12px] font-bold transition ${
                          manualYear === year
                            ? `border-2 border-[#0878ee] bg-[#eaf5ff] text-[#064ea7] ${manualSelectedTileClass}`
                            : "border-[#d6e0ec] bg-gradient-to-b from-white to-[#f9fbfd] text-[#102452] hover:border-[#65aefa]"
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => openSelector("years")}
                      className="flex min-h-[30px] items-center justify-center gap-1 rounded-[8px] border border-[#d6e0ec] bg-gradient-to-b from-white to-[#f2f8ff] px-1 py-1 text-center text-[10px] font-bold leading-[1.05] text-[#1e3a8a]"
                    >
                      <span>View All Years</span>
                      <ArrowIcon />
                    </button>
                  </div>
                </div>
              ) : null}

              <label className="grid gap-1 text-left text-[12px] font-bold text-[#2d567c]">
                Engine Code
                <input
                  type="text"
                  value={manualEngineCode}
                  onChange={(e) =>
                    setManualEngineCode(e.currentTarget.value.toUpperCase())
                  }
                  placeholder="Enter engine code"
                  autoComplete="off"
                  spellCheck={false}
                  className="h-10 w-full rounded-[8px] border border-[#d6e0ec] bg-white/80 px-3 text-[13px] uppercase text-[#0d1b2e] outline-none shadow-[inset_0_1px_2px_rgba(12,39,77,0.05)] placeholder:normal-case placeholder:text-[#8a97aa] focus:border-[#0878ee] focus:ring-2 focus:ring-[#0878ee]/15"
                />
              </label>
            </div>
          )}
          {expandedSelector ? null : (
            <button
              type="submit"
              disabled={
                (searchMode === "registration" &&
                  isRegistrationLookupLoading) ||
                (searchMode === "manual" && !isManualSelectionComplete)
              }
              className={`w-full rounded-[8px] bg-[#15803d] px-6 py-[13px] text-[15px] font-bold text-white transition hover:bg-[#166534] active:translate-y-[3px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none ${searchMode === "manual" ? "mt-2" : "mt-3"}`}
              style={{
                background:
                  "linear-gradient(180deg, #15803d 0%, #15803d 70%, #14532d 100%)",
                boxShadow:
                  "inset 0 2px 0 rgba(255,255,255,0.30), inset 0 -3px 6px rgba(0,0,20,0.30), 0 4px 10px rgba(10,90,35,0.35)",
              }}
            >
              {searchMode === "registration" && isRegistrationLookupLoading
                ? "Checking Registration..."
                : "Get Free Engine Quotes →"}
            </button>
          )}
        </form>

        {searchMode === "registration" && registrationLookupError ? (
          <p className="-mt-1 mb-3 text-center text-[12px] font-semibold text-red-600">
            {registrationLookupError}
          </p>
        ) : null}

        {/* GDPR */}
        {searchMode === "registration" ? (
          <p className="mb-4 text-center text-[12px] text-gray-500 sm:text-[14px]">
            <FiLock className="mr-1 inline h-4 w-4 align-text-bottom text-[#15803d]" />
            {gdprNote}
          </p>
        ) : null}

        {searchMode === "registration" ? (
          <div className="grid grid-cols-3 gap-3 border-t border-[rgba(13,27,46,0.08)] pt-4 text-left sm:grid-cols-3 sm:gap-2 sm:text-center">
            {/* 1. Engine Codes */}
            <div className="flex flex-col items-center gap-1 sm:flex-row sm:items-center sm:gap-[6px]">
              <img
                src="/Home/enginelogo.webp"
                alt="Engine Codes"
                className="h-8 w-8 flex-none object-contain"
              />
              <div className="min-w-0 flex flex-col items-center gap-1 sm:gap-0">
                <div className="text-[18px] font-extrabold leading-none text-[#0d1b2e]">
                  8,000+
                </div>
                <div className="text-[11px] leading-tight text-[#6b7280]">
                  Engine Codes
                </div>
              </div>
            </div>

            {/* 2. Car Brands */}
            <div className="flex flex-col items-center gap-1 sm:flex-row sm:items-center sm:gap-[6px]">
              <img
                src="/Home/carlogo.webp"
                alt="Car Brands"
                className="h-8 w-8 flex-none object-contain"
              />
              <div className="min-w-0 flex flex-col items-center gap-1 sm:gap-0">
                <div className="text-[18px] font-extrabold leading-none text-[#0d1b2e]">
                  40+
                </div>
                <div className="text-[11px] leading-tight text-[#6b7280]">
                  Car Brands
                </div>
              </div>
            </div>

            {/* 3. Free / No Obligation */}
            <div className="flex flex-col items-center gap-1 sm:flex-row sm:items-center sm:gap-[6px]">
              <img
                src="/Home/verifiedlogo.webp"
                alt="Free No Obligation"
                className="h-8 w-8 flex-none object-contain"
              />
              <div className="min-w-0 flex flex-col items-center gap-1 sm:gap-0">
                <div className="text-[18px] font-extrabold leading-none text-[#0d1b2e]">
                  100%
                </div>
                <div className="text-[11px] leading-tight text-[#6b7280] text-center">
                  Free · No Obligation
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function HomeHeroSection({ data, engineLinks }: Props) {
  const router = useRouter();
  const [registration, setRegistration] = useState("");
  const [isRegistrationLookupLoading, setIsRegistrationLookupLoading] =
    useState(false);
  const [registrationLookupError, setRegistrationLookupError] = useState("");
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [groupIndex, setGroupIndex] = useState(0);
  const [carouselOffset, setCarouselOffset] = useState(0);
  const [desktopCarouselOffset, setDesktopCarouselOffset] = useState(0);

  // How many carousel items are visible depends on viewport - use 3 for mobile logic
  const MOBILE_VISIBLE = 3;
  const DESKTOP_VISIBLE = 6;
  const maxOffset = Math.max(0, engineCarouselItems.length - MOBILE_VISIBLE);
  const desktopMaxOffset = Math.max(
    0,
    engineCarouselItems.length - DESKTOP_VISIBLE,
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setGroupIndex((current) => (current + 1) % rowGroups.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    function clearRegistration() {
      setRegistration("");
    }

    window.addEventListener("engine-market:clear-registration", clearRegistration);
    return () => window.removeEventListener("engine-market:clear-registration", clearRegistration);
  }, []);

  const engineTickerLoop = useMemo(() => [...tickerItems, ...tickerItems], []);
  const bottomTickerLoop = useMemo(
    () => [...bottomBarItems, ...bottomBarItems],
    [],
  );

  function appendVehicleParams(
    queryParams: URLSearchParams,
    vehicle: VehicleRegistrationData,
  ) {
    if (vehicle.registrationNumber)
      queryParams.append("registrationNumber", vehicle.registrationNumber);
    if (vehicle.year) queryParams.append("year", vehicle.year);
    if (vehicle.make) queryParams.append("make", vehicle.make);
    if (vehicle.model) queryParams.append("model", vehicle.model);
    if (vehicle.fuelType) queryParams.append("fuelType", vehicle.fuelType);
    if (vehicle.engineCapacity)
      queryParams.append("engineCapacity", vehicle.engineCapacity);
    if (vehicle.color) queryParams.append("color", vehicle.color);
    if (vehicle.wheelplan) queryParams.append("wheelplan", vehicle.wheelplan);
  }

  async function fetchVehicleRegistration(regNumber: string) {
    const response = await fetch(
      `/api/vehicle-registration?registrationNumber=${encodeURIComponent(regNumber)}`,
    );
    const text = await response.text();
    let payload: {
      vehicle?: VehicleRegistrationData;
      error?: string;
    };

    try {
      payload = JSON.parse(text) as typeof payload;
    } catch {
      throw new Error(
        response.ok
          ? "The vehicle lookup service returned an invalid response. Please try again."
          : "The vehicle lookup service is temporarily unavailable. Please try again.",
      );
    }

    if (!response.ok || !payload.vehicle) {
      throw new Error(
        payload.error ||
          "We could not find vehicle details for that registration.",
      );
    }

    return payload.vehicle;
  }

  async function openQuoteCheckout(payload: {
    searchMode: SearchMode;
    regNumber?: string;
    make?: string;
    model?: string;
    variant?: string;
    series?: string;
    year?: string;
    engineCode?: string;
  }) {
    // For manual search, navigate to form page with query parameters
    if (payload.searchMode === "manual") {
      setRegistrationLookupError("");
      const queryParams = new URLSearchParams();
      if (payload.make) queryParams.append("make", payload.make);
      if (payload.model) queryParams.append("model", payload.model);
      if (payload.variant) queryParams.append("variant", payload.variant);
      if (payload.year) queryParams.append("year", payload.year);
      if (payload.engineCode)
        queryParams.append("engineCode", payload.engineCode);
      queryParams.set("sourceLabel", "home-manual-search");
      queryParams.set("sourcePage", window.location.href);
      queryParams.set("searchMode", "manual");

      router.push(`/form?${queryParams.toString()}`);
      return;
    }

    const regNumber = payload.regNumber?.trim() ?? "";
    if (!regNumber) {
      setRegistrationLookupError("Please enter your registration number.");
      return;
    }

    setIsRegistrationLookupLoading(true);
    setRegistrationLookupError("");

    try {
      const vehicle = await fetchVehicleRegistration(regNumber);
      const queryParams = new URLSearchParams();
      appendVehicleParams(queryParams, vehicle);
      queryParams.set("sourceLabel", "home-registration-search");
      queryParams.set("sourcePage", window.location.href);
      queryParams.set("searchMode", "registration");
      router.push(`/form?${queryParams.toString()}`);
    } catch (error) {
      setRegistrationLookupError(
        error instanceof Error ? error.message : "Vehicle lookup failed.",
      );
    } finally {
      setIsRegistrationLookupLoading(false);
    }
  }

  const homeSubheadingParts = splitInlineDisclaimerText(data.subheading);
  const homeDisclaimerText =
    "Prices are indicative rebuilt/reconditioned supply-only averages. Actual quotes vary by variant, year and supplier.";
  const activeGroup = rowGroups[groupIndex] ?? rowGroups[0];

  return (
    <>
      <style>{`
        @media (max-width: 639px) {
          .manual-selector-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
          .manual-selector-grid--three-plus-view-all > :nth-child(4):not(:last-child),
          .manual-selector-grid--three-plus-view-all > :nth-child(5):not(:last-child),
          .manual-selector-grid--year > :nth-child(4):not(:last-child) {
            display: none;
          }
        }
        @keyframes slideLeftMobile {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes slideLeftDesktop {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .mobile-carousel-track {
          display: flex;
          flex-wrap: nowrap;
          width: max-content;
          min-width: 200%;
          will-change: transform;
          animation: slideLeftMobile 40s linear infinite;
        }
        .mobile-carousel-track:hover {
          animation-play-state: paused;
        }
        .desktop-carousel-track {
          animation: slideLeftDesktop 40s linear infinite;
        }
      `}</style>
      {/* ─── HERO SECTION ─── */}
      <section
        className="home-hero-background overflow-hidden pt-8 lg:pt-12"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.78) 30%, rgba(255,255,255,0.64) 58%, rgba(255,255,255,0.54) 100%), url('/images/home/home-hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Container className="max-w-[1400px] px-2 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-10 lg:gap-12 lg:pb-10">
            {/* ── LEFT / MAIN COLUMN ── */}
            <div className="flex flex-col lg:col-span-6 lg:justify-center">
              {/* Badge */}
              {/* <span className="mb-4 inline-flex w-fit items-center gap-[6px] rounded-full bg-[#0d1b2e] px-[10px] py-[4px] text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                <span className="h-[6px] w-[6px] rounded-full bg-[#15803d]" />
                <span>{data.tag}</span>
              </span> */}

              {/* Heading */}
              <h1
                className="mb-2 text-center leading-[1.1] tracking-[-0.03em] text-[#0d1b2e] lg:text-left"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <span className="block text-[26px] sm:text-[clamp(28px,5vw,48px)] font-extrabold">{data.headingLead}</span>
                <span className="mt-[2px] block text-[clamp(20px,3.5vw,36px)] font-semibold text-[#15803d]">
                  {data.headingAccent}
                </span>
              </h1>

              {/* Green underline - desktop only */}
              <span className="mb-5 hidden h-[3px] w-10 rounded-full bg-[#15803d] lg:block" />

              {/* Subheading */}
              <p
                className="mb-6 text-center text-[18px] leading-[1.6] text-[#6b7280] lg:max-w-[62ch] lg:text-left"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {homeSubheadingParts.leading
                  ? `${homeSubheadingParts.leading} `
                  : ""}
                <span className="whitespace-nowrap">
                  {homeSubheadingParts.trailing}{" "}
                  <button
                    type="button"
                    onClick={() => setIsDisclaimerOpen((current) => !current)}
                    aria-expanded={isDisclaimerOpen}
                    aria-label="Toggle disclaimer"
                    className="inline-flex h-5 w-5 translate-y-[-1px] items-center justify-center rounded-full border border-black align-middle text-[11px] font-bold leading-none text-black transition focus:outline-none focus:ring-2 focus:ring-[#2d7a3a] focus:ring-offset-2"
                  >
                    !
                  </button>
                </span>
              </p>

              {/* ── MOBILE: CTA Card (appears ABOVE brand rows) ── */}
              {isDisclaimerOpen ? (
                <div
                  className="-mt-4 mb-6 rounded-[16px] border border-[#dbe4ef] bg-white/85 px-4 py-3 text-[11.5px] leading-[1.6] text-[#64748b] shadow-[0_12px_32px_rgba(13,27,46,0.07)] backdrop-blur-sm md:px-5 md:text-[12.5px] lg:max-w-[62ch]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  <p>{homeDisclaimerText}</p>
                </div>
              ) : null}

              <div className="mb-5 rounded-[12px] border border-[rgba(13,27,46,0.08)] bg-white p-0 shadow-[0_8px_30px_rgba(13,27,46,0.2)] lg:hidden">
                <CTAPanel
                  registration={registration}
                  onRegistrationChange={setRegistration}
                  onSubmit={openQuoteCheckout}
                  isRegistrationLookupLoading={isRegistrationLookupLoading}
                  registrationLookupError={registrationLookupError}
                  gdprNote={data.gdprNote}
                />
              </div>

              <div className="hidden max-w-2xl overflow-hidden rounded-[12px] border border-[rgba(13,27,46,0.1)] bg-white shadow-[0_8px_30px_rgba(13,27,46,0.2)] lg:block">
                <h3
                  className="mb-3 pt-5 text-center text-[15px] font-bold text-[#0d1b2e] lg:hidden"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Compare quotes from vetted specialists
                </h3>
                {activeGroup.map((row) => (
                  <HeroRow
                    key={`${groupIndex}-${row.brand}`}
                    row={row}
                    engineLinks={engineLinks}
                  />
                ))}
              </div>

              <p
                className="mb-5 hidden pt-5 text-center text-[13px] leading-[1.5] text-[#6b7280] lg:block lg:text-left"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Covering <strong className="font-bold text-[#0d1b2e]">8,000+</strong> engine codes across{" "}
                <strong className="font-bold text-[#0d1b2e]">40+</strong> makes - from{" "}
                <strong className="font-bold text-[#0d1b2e]">BMW</strong> and{" "}
                <strong className="font-bold text-[#0d1b2e]">Land Rover</strong> to{" "}
                <strong className="font-bold text-[#0d1b2e]">Ford</strong> and{" "}
                <strong className="font-bold text-[#0d1b2e]">Vauxhall</strong>.
              </p>
            </div>

            {/* ── RIGHT COLUMN - Desktop CTA ── */}
            <div className="relative mt-2 hidden min-w-0 w-full lg:flex lg:min-h-[360px] lg:col-span-4 lg:flex-col">
              <div className="overflow-hidden rounded-[18px] border border-white/75 bg-white/55 shadow-[0_14px_30px_rgba(4,30,72,0.23),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-[26px] saturate-[155%]">
                <CTAPanel
                  registration={registration}
                  onRegistrationChange={setRegistration}
                  onSubmit={openQuoteCheckout}
                  isRegistrationLookupLoading={isRegistrationLookupLoading}
                  registrationLookupError={registrationLookupError}
                  gdprNote={data.gdprNote}
                />
              </div>

              {/* Desktop engine ticker strip */}
              {/* <div className="mt-4 h-14 overflow-hidden rounded-[10px] border border-[rgba(13,27,46,0.1)] bg-[#f9fafb]">
                <div className="hero-ticker-track h-14">
                  {engineTickerLoop.map((item, index) => (
                    <div
                      key={`desktop-ticker-${item.brand}-${item.code}-${index}`}
                      className="flex h-14 min-w-[90px] flex-none flex-col items-center justify-center border-r border-[rgba(13,27,46,0.1)] px-4"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#0d1b2e] text-white">
                        <EngineTickerIcon />
                      </div>
                      <span className="mt-[2px] whitespace-nowrap text-[9px] font-bold tracking-[0.04em] text-[#0d1b2e]">
                        {item.brand} · {item.code}
                      </span>
                      <span className="whitespace-nowrap text-[9px] font-semibold text-[#15803d]">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div> */}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── ENGINE CAROUSEL ─── */}
      {/* ─── ENGINE CAROUSEL ─── */}
      <section className="border-t border-[rgba(13,27,46,0.08)] bg-gray-50 py-5">
        {/* MOBILE SLIDER - full-width overflow-hidden so the max-content track scrolls correctly */}
        <div className="w-full overflow-hidden lg:hidden">
          <div className="mobile-carousel-track">
            {[...engineCarouselItems, ...engineCarouselItems].map(
              (item, index) => (
                <div
                  key={`mobile-carousel-${item.code}-${index}`}
                  className="flex flex-shrink-0 items-center gap-2 px-3 py-1"
                  style={{ flex: "0 0 150px", width: "150px" }}
                >
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-[6px]">
                    <img
                      src={getEngineImagePath(item.code)}
                      alt={`${item.brand} ${item.code} engine`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="whitespace-nowrap text-[10px] font-bold leading-tight text-[#0d1b2e]">
                      {item.brand}
                    </div>
                    <div className="whitespace-nowrap text-[9px] text-[#6b7280]">
                      {renderLinkedEngineCodes(item.code, engineLinks)}
                    </div>
                    <div className="whitespace-nowrap text-[10px] font-bold text-[#15803d]">
                      {item.price}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* DESKTOP SLIDER - Full bleed so the engine ticker reaches both viewport edges */}
        <div className="w-full">
          <div className="hidden items-center gap-3 lg:flex">
            <div className="overflow-hidden flex-1">
              <div className="desktop-carousel-track flex">
                {[...engineCarouselItems, ...engineCarouselItems].map(
                  (item, index) => (
                    <div
                      key={`desktop-carousel-${item.code}-${index}`}
                      className="flex min-w-0 flex-none items-center gap-2 p-2"
                      style={{
                        flex: "0 0 clamp(157px, calc((100vw - 80px) / 6), 220px)",
                      }}
                    >
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden">
                        <img
                          src={getEngineImagePath(item.code)}
                          alt={`${item.brand} ${item.code} engine`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <div className="whitespace-nowrap text-[13px] font-bold leading-tight text-[#0d1b2e]">
                          {item.brand}{" "}
                          <span className="text-[#2563eb]">
                            {renderLinkedEngineCodes(item.code, engineLinks)}
                          </span>
                        </div>
                        <div className="whitespace-nowrap text-[11px] text-[#6b7280]">
                          {item.spec}
                        </div>
                        <div className="text-[10px] font-bold text-[#15803d]">
                          {item.price}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MOBILE LIVE BAR ─── */}
      {/* <div className="flex h-10 items-center justify-around border-t border-[rgba(13,27,46,0.1)] bg-[#f9fafb] px-3 lg:hidden">
        <div className="flex items-center gap-[5px] text-[11px] font-bold text-[#15803d]">
          <span className="h-[6px] w-[6px] rounded-full bg-[#15803d]" />
          LIVE
        </div>
        <span className="h-4 w-px bg-[rgba(13,27,46,0.15)]" />
        <span className="text-[11px] font-semibold text-[#0d1b2e]">8,000+ Engine Codes</span>
        <span className="h-4 w-px bg-[rgba(13,27,46,0.15)]" />
        <span className="text-[11px] font-semibold text-[#0d1b2e]">40+ Car Brands</span>
        <span className="h-4 w-px bg-[rgba(13,27,46,0.15)]" />
        <span className="text-[11px] font-semibold text-[#0d1b2e]">100% Free · No Obligation</span>
      </div> */}

      {/* ─── BOTTOM DARK BAR ─── */}
      <div className="bg-[#0d1b2e]">
        {/* Desktop: scrolling ticker */}
        <div className="hidden h-14 items-center overflow-hidden lg:flex">
          <Container className="max-w-[1400px] px-10">
            <div
              className="hero-ticker-track h-14"
              style={{ animationDuration: "32s" }}
            >
              {bottomTickerLoop.map((item, index) => (
                <span
                  key={`desktop-bottom-ticker-${index}`}
                  className="flex h-14 flex-none items-center gap-[10px] border-r border-r-white/10 px-6 text-[12px] leading-[1.4] text-white/80"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  <BottomBarIcon type={item.icon} />
                  <span>{item.text}</span>
                </span>
              ))}
            </div>
          </Container>
        </div>

        {/* Mobile: scrolling ticker */}
        <div className="flex h-12 items-center overflow-hidden lg:hidden">
          <div
            className="hero-ticker-track h-12"
            style={{ animationDuration: "45s" }}
          >
            {bottomTickerLoop.map((item, index) => (
              <span
                key={`bottom-ticker-${index}`}
                className="flex h-12 flex-none items-center gap-[8px] border-r border-r-white/10 px-5 text-[12px] text-white/80"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <BottomBarIcon type={item.icon} />
                <span>{item.text}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
