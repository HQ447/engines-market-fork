import type { StaticPageRecord } from "@/lib/staticPagePreview";
import SharedPreviewHero from "@/components/static-pages-comp/shared/SharedPreviewHero";
import { sharedPreviewConfigs } from "@/components/static-pages-comp/shared/SharedPreviewPage";

export default function ServiceHero({ page }: { page: StaticPageRecord }) {
  return <SharedPreviewHero page={page} config={sharedPreviewConfigs.services} />;
}
