import type { StaticBlock } from "@/lib/staticPagePreview";
import { PreviewDataTable } from "@/components/static-pages-comp/shared/PreviewContentPrimitives";
type TableBlock = Extract<StaticBlock, { type: "table" }>;
export default function ServiceTableSection({ block }: { block: TableBlock }) {
  return <PreviewDataTable table={block} />;
}

