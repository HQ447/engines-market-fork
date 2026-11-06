import type { StaticPageRecord } from "@/lib/staticPagePreview";
import SourceStaticPage from "@/components/static-pages-comp/SourceStaticPage";
import PricePreview from "@/components/static-pages-comp/prices/PricePreview";
import ServicePreview from "@/components/static-pages-comp/services/ServicePreview";
import SymptomPreview from "@/components/static-pages-comp/symptoms/SymptomPreview";
import InsightPreview from "@/components/static-pages-comp/insights/InsightPreview";

export default function FamilyPreviewRouter({ page }: { page: StaticPageRecord }) {
  if (page.contentType === "prices") return <PricePreview page={page} />;
  if (page.contentType === "services") return <ServicePreview page={page} />;
  if (page.contentType === "symptoms") return <SymptomPreview page={page} />;
  if (page.contentType === "insights") return <InsightPreview page={page} />;
  return <SourceStaticPage page={page} />;
}
