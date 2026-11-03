import type { StaticPageRecord } from "@/lib/staticPagePreview";
import SourceStaticPage from "@/components/static-pages-comp/SourceStaticPage";
import PricePreview from "@/components/static-pages-comp/prices/PricePreview";

export default function FamilyPreviewRouter({ page }: { page: StaticPageRecord }) {
  if (page.contentType === "prices") return <PricePreview page={page} />;
  return <SourceStaticPage page={page} />;
}
