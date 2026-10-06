import type { NewDocVariantData } from "@/types/new-doc-variant";
import NewDocVariantCommonProblems from "@/components/sections/new-doc-variant-page-sections/NewDocVariantCommonProblems";
import NewDocVariantEngineCode from "@/components/sections/new-doc-variant-page-sections/NewDocVariantEngineCode";
import NewDocVariantHero from "@/components/sections/new-doc-variant-page-sections/NewDocVariantHero";
import NewDocVariantHistorySpecs from "@/components/sections/new-doc-variant-page-sections/NewDocVariantHistorySpecs";
import NewDocVariantHowItWorks from "@/components/sections/new-doc-variant-page-sections/NewDocVariantHowItWorks";
import NewDocVariantFaq from "@/components/sections/new-doc-variant-page-sections/NewDocVariantFaq";
import NewDocVariantWhyChoose from "@/components/sections/new-doc-variant-page-sections/NewDocVariantWhyChoose";

type Props = { data: NewDocVariantData };

export default function NewDocVariantPage({ data }: Props) {
  return (
    <>
      <NewDocVariantHero {...data} />
      <NewDocVariantHowItWorks steps={data.howItWorks} />
      <NewDocVariantHistorySpecs history={data.history} vehicleImage={data.images.vehicle} />
      <NewDocVariantEngineCode data={data.engineGuide} engineImage={data.images.heroEngine} />
      <NewDocVariantCommonProblems
        data={data.commonProblems}
        backgroundImage={data.images.commonProblemsVehicle}
      />
      <NewDocVariantFaq data={data.faq} vehicleImage={data.images.vehicle} />
      <NewDocVariantWhyChoose
        data={data.whyChoose}
        backgroundImage={data.images.commonProblemsVehicle}
      />
    </>
  );
}
