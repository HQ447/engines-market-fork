import type { StaticPageRecord } from "@/lib/staticPagePreview";
import SharedPreviewHero from "./SharedPreviewHero";
import { sharedPreviewConfigs } from "./SharedPreviewPage";

/** Compatibility wrapper for callers that still import the former Prices hero. */
export default function RegistrationHero({ page }: { page: StaticPageRecord }) {
  return <SharedPreviewHero page={page} config={sharedPreviewConfigs.prices} />;
}
