import type { ModelPageData } from "@/types/model";
import NewDocModelCommonProblems from "@/components/sections/new-doc-model-page-sections/NewDocModelCommonProblems";
import NewDocModelEngineCodes from "@/components/sections/new-doc-model-page-sections/NewDocModelEngineCodes";
import NewDocModelEngineSizes from "@/components/sections/new-doc-model-page-sections/NewDocModelEngineSizes";
import NewDocModelEngineTypes from "@/components/sections/new-doc-model-page-sections/NewDocModelEngineTypes";
import NewDocModelEngineYears from "@/components/sections/new-doc-model-page-sections/NewDocModelEngineYears";
import NewDocModelFaq from "@/components/sections/new-doc-model-page-sections/NewDocModelFaq";
import NewDocModelFuelTypes from "@/components/sections/new-doc-model-page-sections/NewDocModelFuelTypes";
import NewDocModelHero from "@/components/sections/new-doc-model-page-sections/NewDocModelHero";
import NewDocModelHowItWorks from "@/components/sections/new-doc-model-page-sections/NewDocModelHowItWorks";
import NewDocModelLiveMarketPrices from "@/components/sections/new-doc-model-page-sections/NewDocModelLiveMarketPrices";
import NewDocModelReviews from "@/components/sections/new-doc-model-page-sections/NewDocModelReviews";
import NewDocModelTrustCta from "@/components/sections/new-doc-model-page-sections/NewDocModelTrustCta";
import NewDocModelVariantCoverage from "@/components/sections/new-doc-model-page-sections/NewDocModelVariantCoverage";
import { applyModelPageVisualPlaceholders } from "@/lib/modelVisualSelection";
import { getEngineLinkMapForBrand } from "@/lib/enginePageData";
import { getVariantRouteMapForModel } from "@/lib/variantPageData";

type Props = {
  data: ModelPageData;
};

export default async function NewDocModelPage({ data }: Props) {
  // Keep the image selection consistent with the established model page.  The
  // new section components still receive the same ModelPageData shape.
  const visualData = applyModelPageVisualPlaceholders(data);
  const [variantRouteMap, engineLinks] = await Promise.all([
    getVariantRouteMapForModel(
      visualData.brand.slug,
      visualData.model.slug,
      visualData.sections.variantCoverage.cards,
    ),
    getEngineLinkMapForBrand(visualData.brand.slug),
  ]);

  return (
    <>
      <NewDocModelHero data={visualData} />
      <NewDocModelHowItWorks data={visualData.sections.howItWorks} />
      <NewDocModelLiveMarketPrices data={visualData} />
      <NewDocModelReviews data={visualData} />
      <NewDocModelVariantCoverage
        data={visualData}
        variantRouteMap={variantRouteMap}
      />
      <NewDocModelEngineCodes data={visualData} engineLinks={engineLinks} />
      <NewDocModelCommonProblems data={visualData} />
      <NewDocModelEngineTypes data={visualData} />
      <NewDocModelEngineSizes data={visualData} />
      <NewDocModelFuelTypes data={visualData} />
      <NewDocModelEngineYears data={visualData} />
      <NewDocModelFaq data={visualData} />
      <NewDocModelTrustCta data={visualData} />
    </>
  );
}
