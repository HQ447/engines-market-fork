import type { StaticPageRecord } from "@/lib/staticPagePreview";
import SharedPreviewHero from "./SharedPreviewHero";
import { sharedPreviewConfigs } from "./SharedPreviewPage";

/** Compatibility wrapper for family-specific hero imports. */
export default function FamilyRegistrationHero({ page }: { page: StaticPageRecord }) {
  const family = page.contentType === "services" || page.contentType === "symptoms" || page.contentType === "insights" ? page.contentType : "services";
  return <SharedPreviewHero page={page} config={sharedPreviewConfigs[family]} />;
}
