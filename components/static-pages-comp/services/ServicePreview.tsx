import type { StaticPageRecord } from "@/lib/staticPagePreview";
import SharedPreviewPage, { sharedPreviewConfigs } from "@/components/static-pages-comp/shared/SharedPreviewPage";

export default function ServicePreview({ page }: { page: StaticPageRecord }) {
  return <SharedPreviewPage page={page} config={sharedPreviewConfigs.services} />;
}
