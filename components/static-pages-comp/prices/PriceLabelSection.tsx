import type { StaticBlock } from "@/lib/staticPagePreview";
import { PreviewSectionBadge } from "@/components/static-pages-comp/shared/PreviewContentPrimitives";
type LabelBlock = Extract<StaticBlock, { type: "label" }>;
export default function PriceLabelSection({ block }: { block: LabelBlock }) {
  return <PreviewSectionBadge>{block.text}</PreviewSectionBadge>;
}

