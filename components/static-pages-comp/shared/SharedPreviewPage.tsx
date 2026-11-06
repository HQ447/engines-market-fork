import type { StaticPageRecord } from "@/lib/staticPagePreview";
import SharedPreviewContent from "./SharedPreviewContent";
import SharedPreviewHero from "./SharedPreviewHero";

export type SharedPreviewFamily = "prices" | "services" | "symptoms" | "insights";

export type SharedPreviewConfig = {
  family: SharedPreviewFamily;
  registrationEnabled: boolean;
  heroDescriptionMode: "price" | "plain";
  heroImage?: { src: string; alt: string };
  suppressShortParagraphLabels: boolean;
  derivePriceBadges: boolean;
  renderMethodology: boolean;
};

export const sharedPreviewConfigs: Record<SharedPreviewFamily, SharedPreviewConfig> = {
  prices: { family: "prices", registrationEnabled: true, heroDescriptionMode: "price", suppressShortParagraphLabels: true, derivePriceBadges: true, renderMethodology: true },
  services: { family: "services", registrationEnabled: true, heroDescriptionMode: "plain", suppressShortParagraphLabels: false, derivePriceBadges: false, renderMethodology: false },
  symptoms: { family: "symptoms", registrationEnabled: true, heroDescriptionMode: "plain", suppressShortParagraphLabels: false, derivePriceBadges: false, renderMethodology: false },
  insights: { family: "insights", registrationEnabled: true, heroDescriptionMode: "plain", suppressShortParagraphLabels: false, derivePriceBadges: false, renderMethodology: false },
};

export default function SharedPreviewPage({ page, config }: { page: StaticPageRecord; config: SharedPreviewConfig }) {
  return <div className="min-h-screen bg-white" data-preview-family={config.family} data-preview-theme="prices-style" data-preview-registration={config.registrationEnabled ? "enabled" : "disabled"}>
    {page.structuredData.length ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(page.structuredData) }} /> : null}
    <article>
      <SharedPreviewHero page={page} config={config} />
      <SharedPreviewContent page={page} config={config} />
    </article>
  </div>;
}
