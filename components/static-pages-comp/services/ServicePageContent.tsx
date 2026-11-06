import type { StaticPageRecord } from "@/lib/staticPagePreview";
import SharedPreviewContent from "@/components/static-pages-comp/shared/SharedPreviewContent";
import { sharedPreviewConfigs } from "@/components/static-pages-comp/shared/SharedPreviewPage";

export default function ServicePageContent({ page }: { page: StaticPageRecord }) {
  return <SharedPreviewContent page={page} config={sharedPreviewConfigs.services} />;
}
