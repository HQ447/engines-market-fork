import type { StaticBlock } from "@/lib/staticPagePreview";
import { PreviewCardGrid } from "@/components/static-pages-comp/shared/PreviewContentPrimitives";
type CardsBlock = Extract<StaticBlock, { type: "cards" }>;
export default function InsightsCardsSection({ block }: { block: CardsBlock }) {
  return <PreviewCardGrid cards={block.cards} />;
}

