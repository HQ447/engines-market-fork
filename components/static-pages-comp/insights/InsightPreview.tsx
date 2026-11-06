import type { StaticPageRecord } from "@/lib/staticPagePreview";
import SharedPreviewPage, { sharedPreviewConfigs } from "@/components/static-pages-comp/shared/SharedPreviewPage";

export default function InsightPreview({ page }: { page: StaticPageRecord }) {
  return <SharedPreviewPage page={page} config={sharedPreviewConfigs.insights} />;
}
