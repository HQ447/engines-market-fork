import type { StaticBlock } from "@/lib/staticPagePreview";
import { PreviewFaqGrid } from "@/components/static-pages-comp/shared/PreviewContentPrimitives";
type FaqBlock = Extract<StaticBlock, { type: "faq" }>;
export default function PriceFaqSection({ block }: { block: FaqBlock }) {
  return <PreviewFaqGrid title="Frequently asked questions" faqs={[block]} />;
}

