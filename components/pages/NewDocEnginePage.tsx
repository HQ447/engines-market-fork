import type { EnginePageData } from "@/types/engine-page";
import EngineCompatibility from "../sections/new-doc-engine-sec/EngineCompatibility";
import EngineHero from "../sections/new-doc-engine-sec/EngineHero";
import EngineSpecs from "../sections/new-doc-engine-sec/EngineSpecs";
import EngineBuyingGuide from "../sections/new-doc-engine-sec/EngineBuyingGuide";
import EngineCostGuide from "../sections/new-doc-engine-sec/EngineCostGuide";
import EngineFaq from "../sections/new-doc-engine-sec/EngineFaq";
import EngineFailures from "../sections/new-doc-engine-sec/EngineFailures";
import EngineRelated from "../sections/new-doc-engine-sec/EngineRelated";
import EngineTrustCta from "../sections/new-doc-engine-sec/EngineTrustCta";
import EngineVariants from "../sections/new-doc-engine-sec/EngineVariants";

type Props = {
  data: EnginePageData;
  trustBackgroundImage?: string;
};

function getEngineCutout(data: EnginePageData["sections"]["hero"]) {
  if (data.engineCutout?.src) return data.engineCutout;

  const signals = [
    ...data.pills,
    data.title,
    data.description,
    data.engineImage.src,
  ]
    .join(" ")
    .toLowerCase();

  const src = /diesel|bluehdi|hdi|tdi|dci|cdi|turbodiesel/.test(signals)
    ? "/images/shared/hero-engines/temporary-diesel-engine-cutout.png"
    : /performance|gti|amg|m-power|v8|v6|type r|quattro rs/.test(signals)
      ? "/images/shared/hero-engines/temporary-performance-engine-cutout.png"
      : "/images/shared/hero-engines/temporary-petrol-engine-cutout.png";

  return { src, alt: data.engineImage.alt };
}

function getHeroPrices(
  data: EnginePageData,
): EnginePageData["sections"]["hero"]["prices"] {
  if (data.sections.hero.prices.length > 0) {
    return data.sections.hero.prices;
  }

  return data.sections.costGuide.rows
    .map((row) => {
      const condition = row.condition.trim();
      const tone = condition.toLowerCase();

      if (tone !== "used" && tone !== "reconditioned" && tone !== "rebuilt") {
        return null;
      }

      const price = row.supplyOnly.match(/£\s*[\d,]+/i)?.[0] ?? "";
      if (!price) return null;

      return {
        label: `${condition} from`,
        price,
        tone: tone as "used" | "reconditioned" | "rebuilt",
      };
    })
    .filter(
      (price): price is NonNullable<typeof price> => price !== null,
    );
}

export default function NewDocEnginePage({ data, trustBackgroundImage }: Props) {
  const engineCutout = getEngineCutout(data.sections.hero);
  const heroPrices = getHeroPrices(data);
  const engineVisual = engineCutout.src;
  const sectionBackground =
    trustBackgroundImage ?? data.sections.hero.backgroundImage?.src ?? engineVisual;

  return (
    <>
      <EngineHero
        data={{ ...data.sections.hero, engineCutout, prices: heroPrices }}
        engineCode={data.engine.code}
      />
      <EngineSpecs
        data={data.sections.specs}
        engineCode={data.engine.code}
        brandName={data.brand.name}
        engineImage={{
          ...data.sections.hero.engineImage,
          src: engineVisual,
        }}
        compatibility={data.sections.compatibility}
      />
      <EngineCompatibility data={data.sections.compatibility} engineCode={data.engine.code} brandName={data.brand.name} />
      <EngineCostGuide data={data.sections.costGuide} engineCode={data.engine.code} image={data.sections.costGuide.image} />
      <EngineFailures data={data.sections.failures} engineCode={data.engine.code} backgroundImage={sectionBackground} />
      <EngineVariants data={data.sections.variants} engineCode={data.engine.code} engineImage={engineVisual} backgroundImage={sectionBackground} />
      <EngineBuyingGuide data={data.sections.buyingGuide} engineCode={data.engine.code} engineImage={engineVisual} backgroundImage={sectionBackground} />
      <EngineRelated data={data.sections.related} engineCode={data.engine.code} engineImage={engineVisual} backgroundImage={sectionBackground} />
      <EngineFaq data={data.sections.faq} engineCode={data.engine.code} />
      <EngineTrustCta
        data={data.sections.trustCta}
        engineCode={data.engine.code}
        backgroundImage={sectionBackground}
      />
    </>
  );
}
