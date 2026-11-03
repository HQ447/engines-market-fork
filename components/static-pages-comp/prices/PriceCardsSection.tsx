import type { StaticBlock } from "@/lib/staticPagePreview";
import { PreviewCardGrid, type PreviewCardVariant } from "@/components/static-pages-comp/shared/PreviewContentPrimitives";
type CardsBlock = Extract<StaticBlock, { type: "cards" }>;
type LinkItem = { href: string; text: string };

function normalizeLinkText(text: string) {
  return text.replace(/[↗→]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
}

export default function PriceCardsSection({ block, variant = "standard", links = [] }: { block: CardsBlock; variant?: PreviewCardVariant; links?: LinkItem[] }) {
  const cards = block.cards.map((card) => {
    const text = card.title || card.text;
    const link = links.find((item) => normalizeLinkText(item.text) === normalizeLinkText(text));
    return link ? { ...card, href: link.href } : card;
  });
  return <PreviewCardGrid cards={cards} variant={variant} />;
}

