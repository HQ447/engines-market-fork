import type { StaticPageRecord } from "@/lib/staticPagePreview";
import RegistrationHero from "@/components/static-pages-comp/shared/RegistrationHero";
import PriceQuoteCta from "@/components/static-pages-comp/prices/PriceQuoteCta";
import PricePageContent from "@/components/static-pages-comp/prices/PricePageContent";

export default function PricePreview({ page }: { page: StaticPageRecord }) {
  return (
    <div className="min-h-screen bg-white">
      {page.structuredData.length ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(page.structuredData) }} /> : null}
      <RegistrationHero page={page} quotePanel={<PriceQuoteCta variant="hero" />} />
      <PricePageContent page={page} />
    </div>
  );
}
