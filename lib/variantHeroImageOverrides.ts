import imageManifest from "./image-manifest.json";

const manifest = imageManifest as Record<string, number>;

// These aliases are deliberately limited to model groups whose generated
// `*-main.webp` path does not exist. They do not affect model or brand pages.
const VARIANT_HERO_IMAGE_OVERRIDES: Record<string, string> = {
  "bmw/m135i": "/images/brands/bmw/models/bmw-1-series-model-card.png",
  "bmw/z1": "/images/brands/bmw/models/bmw-z-series-model-card.png",
  "bmw/z3": "/images/brands/bmw/models/bmw-z-series-model-card.png",
  "bmw/z4": "/images/brands/bmw/models/bmw-z-series-model-card.png",
  "bmw/z8": "/images/brands/bmw/models/bmw-z-series-model-card.png",
  "ford/fiesta-st": "/images/brands/ford/models/ford-fiesta-model-card.png",
  "ford/puma": "/images/brands/ford/models/ford-puma-engines-new-and-classic-model-card.png",
  "hyundai/i20": "/images/brands/hyundai/brand/live-feed-hyundai.webp",
  "hyundai/i30": "/images/brands/hyundai/brand/live-feed-hyundai.webp",
  "hyundai/i40": "/images/brands/hyundai/brand/live-feed-hyundai.webp",
  "jaguar/xkr": "/images/brands/jaguar/models/jaguar-xk-model-card.jpg",
  "kia/e-niro": "/images/brands/kia/models/kia-niro-model-card.jpg",
  "kia/xceed": "/images/brands/kia/models/kia-ceed-model-card.jpg",
  "land-rover/defender-110": "/images/brands/land-rover/models/land-rover-defender-model-card.webp",
  "land-rover/defender-130": "/images/brands/land-rover/models/land-rover-defender-model-card.webp",
  "land-rover/defender-90": "/images/brands/land-rover/models/land-rover-defender-model-card.webp",
  "land-rover/discovery-sport": "/images/brands/land-rover/models/land-rover-discovery-model-card.webp",
  "land-rover/range-rover-sport": "/images/brands/land-rover/models/land-rover-range-rover-model-card.webp",
  "land-rover/range-rover-velar": "/images/brands/land-rover/models/land-rover-range-rover-model-card.webp",
  "mazda/mazda2": "/images/brands/mazda/models/mazda-2-model-card.jpg",
  "mazda/mazda3": "/images/brands/mazda/models/mazda-3-model-card.jpg",
  "mazda/mazda6": "/images/brands/mazda/models/mazda-6-model-card.jpg",
  "mazda/mx-5": "/images/brands/mazda/models/mazda-mx-5-miata-model-card.jpg",
  "mercedes-benz/a-class": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-a-class-model-card.png",
  "mercedes-benz/amg-gt": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-amg-gt-model-card.png",
  "mercedes-benz/b-class": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-b-class-model-card.png",
  "mercedes-benz/c-class": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-c-class-model-card.png",
  "mercedes-benz/citan": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-citan-model-card.png",
  "mercedes-benz/cla": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-cla-model-card.png",
  "mercedes-benz/clc-class": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-clc-class-model-card.png",
  "mercedes-benz/clk": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-clk-model-card.png",
  "mercedes-benz/cls": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-cls-model-card.png",
  "mercedes-benz/e-class": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-e-class-model-card.png",
  "mercedes-benz/g-class": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-g-class-model-card.png",
  "mercedes-benz/glc-class": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-glc-class-model-card.png",
  "mercedes-benz/gle-class": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-gle-class-model-card.png",
  "mercedes-benz/glk-class": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-glk-class-model-card.png",
  "mercedes-benz/gls": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-gls-model-card.png",
  "mercedes-benz/m-class": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-m-class-model-card.png",
  "mercedes-benz/r-class": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-r-class-model-card.png",
  "mercedes-benz/s-class": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-s-class-model-card.png",
  "mercedes-benz/sl": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-sl-model-card.png",
  "mercedes-benz/slc": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-slc-model-card.png",
  "mercedes-benz/slk": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-slk-model-card.png",
  "mercedes-benz/sls-amg": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-sls-amg-model-card.png",
  "mercedes-benz/sprinter": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-sprinter-model-card.png",
  "mercedes-benz/v-class": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-v-class-model-card.png",
  "mercedes-benz/vaneo": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-vaneo-model-card.png",
  "mercedes-benz/vario": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-vario-model-card.png",
  "mercedes-benz/viano": "/images/brands/mercedes-benz/models/mercedes-benz-mercedes-benz-viano-model-card.png",
  "mini/countryman": "/images/brands/mini/models/mini-country-man-model-card.png",
  "mini/hatch": "/images/brands/mini/models/mini-cooper-model-card.png",
  "mitsubishi/shogun-pajero": "/images/brands/mitsubishi/models/mitsubishi-pajero-shogun-model-card.png",
  "peugeot/108": "/images/brands/peugeot/models/peugeot-106-model-card.png",
  "peugeot/e-2008": "/images/brands/peugeot/models/peugeot-2008-model-card.png",
  "range-rover/4-4": "/images/brands/range-rover/models/range-rover-mainline-model-card.png",
  "range-rover/l405-lwb": "/images/brands/range-rover/models/range-rover-mainline-model-card.png",
  "range-rover/p510e": "/images/brands/range-rover/models/range-rover-mainline-model-card.png",
  "range-rover/p615": "/images/brands/range-rover/models/range-rover-mainline-model-card.png",
  "range-rover/tdv6": "/images/brands/range-rover/models/range-rover-mainline-model-card.png",
  "range-rover/vm-diesel": "/images/brands/range-rover/models/range-rover-mainline-model-card.png",
  "suzuki/s-cross-sx4": "/images/brands/suzuki/models/suzuki-sx4-model-card.png",
  "toyota/gr": "/images/brands/toyota/models/toyota-gt86-gr86-model-card.png",
  "volkswagen/e-golf": "/images/brands/volkswagen/models/volkswagen-golf-model-card.png",
  "volkswagen/golf": "/images/brands/volkswagen/models/volkswagen-golf-model-card.png",
  "volkswagen/passat": "/images/brands/volkswagen/models/volkswagen-passat-model-card.png",
  "volkswagen/polo": "/images/brands/volkswagen/models/volkswagen-polo-model-card.png",
  "volkswagen/sharan": "/images/brands/volkswagen/models/volkswagen-sharan-model-card.png",
  "volkswagen/t-roc": "/images/brands/volkswagen/brand/live-feed-volkswagen.webp",
  "volkswagen/tiguan": "/images/brands/volkswagen/models/volkswagen-tiguan-model-card.png",
  "volkswagen/touareg": "/images/brands/volkswagen/models/volkswagen-touareg-model-card.png",
  "volkswagen/touran": "/images/brands/volkswagen/models/volkswagen-touran-model-card.png",
  "volvo/s60-v60": "/images/brands/volvo/models/volvo-xc60-model-card.png",
  "volvo/xc40": "/images/brands/volvo/models/volvo-xc60-model-card.png",
};

function normalizeSlug(value: string) {
  return value.trim().toLowerCase();
}

function getOverrideKey(brandSlug: string, modelSlug: string) {
  const brand = normalizeSlug(brandSlug) === "vw" ? "volkswagen" : normalizeSlug(brandSlug);
  return `${brand}/${normalizeSlug(modelSlug)}`;
}

export function resolveVariantHeroImageOverride({
  brandSlug,
  modelSlug,
  resolvedImage,
}: {
  brandSlug: string;
  modelSlug: string;
  resolvedImage: string;
}) {
  if (manifest[resolvedImage]) {
    return resolvedImage;
  }

  const override = VARIANT_HERO_IMAGE_OVERRIDES[getOverrideKey(brandSlug, modelSlug)];
  return override && manifest[override] ? override : resolvedImage;
}
