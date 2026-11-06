import type { StaticBlock } from "@/lib/staticPagePreview";
import { PreviewFaqItem } from "@/components/static-pages-comp/shared/PreviewContentPrimitives";
type FaqBlock = Extract<StaticBlock, { type: "faq" }>;
export default function ServiceFaqSection({ block }: { block: FaqBlock }) {
  return <PreviewFaqItem faq={block} />;
}

