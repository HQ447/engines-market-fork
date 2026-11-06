import type { StaticBlock } from "@/lib/staticPagePreview";
import { PreviewDataTable } from "@/components/static-pages-comp/shared/PreviewContentPrimitives";
type TableBlock = Extract<StaticBlock, { type: "table" }>;
export default function SymptomTableSection({ block }: { block: TableBlock }) {
  return <PreviewDataTable table={block} />;
}

