import type { Metadata } from "next";
import AutoInternalLinks from "@/components/internal-links/AutoInternalLinks";
import NewDocBrandCommonProblems from "@/components/sections/new-doc-brand-page-sections/NewDocBrandCommonProblems";
import NewDocBrandEngineCodes from "@/components/sections/new-doc-brand-page-sections/NewDocBrandEngineCodes";
import NewDocBrandEngineSizes from "@/components/sections/new-doc-brand-page-sections/NewDocBrandEngineSizes";
import NewDocBrandEngineTypes from "@/components/sections/new-doc-brand-page-sections/NewDocBrandEngineTypes";
import NewDocBrandEngineYears from "@/components/sections/new-doc-brand-page-sections/NewDocBrandEngineYears";
import NewDocBrandFaq from "@/components/sections/new-doc-brand-page-sections/NewDocBrandFaq";
import NewDocBrandFuelTypes from "@/components/sections/new-doc-brand-page-sections/NewDocBrandFuelTypes";
import NewDocBrandHero from "@/components/sections/new-doc-brand-page-sections/NewDocBrandHero";
import NewDocBrandHowItWorks from "@/components/sections/new-doc-brand-page-sections/NewDocBrandHowItWorks";
import NewDocBrandLiveMarketPrices from "@/components/sections/new-doc-brand-page-sections/NewDocBrandLiveMarketPrices";
import NewDocBrandModels from "@/components/sections/new-doc-brand-page-sections/NewDocBrandModels";
import NewDocBrandReviews from "@/components/sections/new-doc-brand-page-sections/NewDocBrandReviews";
import NewDocBrandWhyChoose from "@/components/sections/new-doc-brand-page-sections/NewDocBrandWhyChoose";
import { getBrandPageData, getBrandSlugs } from "@/lib/brandData";
import { resolveBrandPageVisuals } from "@/lib/engineImageSelection";
import { getInternalLinkPlan } from "@/lib/internalLinkIndex";
import { resolveModelImagePaths } from "@/lib/modelImageAssets";
import { getBrandModelCards } from "@/lib/modelPageData";
import { SITE_URL } from "@/lib/site";
import { buildBrandStructuredData } from "@/lib/structuredData";
import { notFound } from "next/navigation";

type BrandPageProps = {
  params: Promise<{
    brand: string;
  }>;
};

export async function generateStaticParams() {
  const brandSlugs = await getBrandSlugs();

  return brandSlugs.map((brand) => ({
    brand,
  }));
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { brand } = await params;
  const pageData = await getBrandPageData(brand);

  if (!pageData) {
    return {};
  }

  return {
    title: pageData.seo.title,
    description: pageData.seo.description,
    alternates: {
      canonical: pageData.seo.canonical,
    },
    metadataBase: new URL(SITE_URL),
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { brand } = await params;
  const pageData = await getBrandPageData(brand);

  if (!pageData) {
    notFound();
  }

  const allBrandModelCards = await getBrandModelCards(
    pageData.brand.slug,
    pageData.sections.models.cards,
  );
  const structuredData = buildBrandStructuredData(pageData, allBrandModelCards);
  const brandVisuals = resolveBrandPageVisuals(pageData);
  const modelCardsWithResolvedImages = allBrandModelCards.map((card) => ({
    ...card,
    image: resolveModelImagePaths({
      brandSlug: pageData.brand.slug,
      modelSlug: card.slug,
      modelName: card.h3,
      configuredSmallImage: card.image,
      configuredHeroImage: card.image,
    }).resolvedSmallImage,
  }));
  const internalLinkPlan = await getInternalLinkPlan({
    brandSlug: pageData.brand.slug,
    currentPath: pageData.seo.canonical,
    pageType: "brand",
  });

  return (
    <>
      <AutoInternalLinks
        targets={internalLinkPlan.targets}
        maxLinksByType={internalLinkPlan.maxLinksByType}
        maxLinksPerPage={internalLinkPlan.maxLinksPerPage}
        maxLinksPerTarget={internalLinkPlan.defaultMaxLinksPerTarget}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <NewDocBrandHero
        data={pageData}
        heroImage={brandVisuals.hero}
        modelCards={modelCardsWithResolvedImages}
      />

      <NewDocBrandHowItWorks
        data={pageData.sections.howItWorks}
        bgImage={pageData.assets.howItWorksBg}
        sectionId="how-it-works"
        compactSpacing
      />

      <NewDocBrandLiveMarketPrices
        data={pageData}
        heroImage={brandVisuals.liveMarket || brandVisuals.hero}
      />

      <NewDocBrandReviews data={pageData} />

      <NewDocBrandModels
        data={{
          ...pageData.sections.models,
          cards: modelCardsWithResolvedImages,
        }}
        brandSlug={pageData.brand.slug}
      />

      <NewDocBrandEngineCodes data={pageData} />

      <NewDocBrandCommonProblems
        data={pageData}
        bgImage={brandVisuals.hero}
      />

      <NewDocBrandEngineTypes
        data={pageData}
        bgImage={brandVisuals.hero}
      />

      <NewDocBrandEngineSizes
        data={pageData}
        bgImage={brandVisuals.hero}
      />

      <NewDocBrandFuelTypes data={pageData} />

      <NewDocBrandEngineYears data={pageData} heroImage={brandVisuals.hero} />

      <NewDocBrandFaq data={pageData} heroImage={brandVisuals.hero} />

      <NewDocBrandWhyChoose data={pageData} heroImage={brandVisuals.hero} />
    </>
  );
}
