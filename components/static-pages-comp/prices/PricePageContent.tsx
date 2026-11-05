import type { ReactNode } from "react";
import { getNormalizedPreviewContent } from "@/lib/staticPagePreview";
import type { StaticBlock, StaticPageRecord } from "@/lib/staticPagePreview";
import PriceHeadingSection from "@/components/static-pages-comp/prices/PriceHeadingSection";
import PriceParagraphSection from "@/components/static-pages-comp/prices/PriceParagraphSection";
import PriceListSection from "@/components/static-pages-comp/prices/PriceListSection";
import PriceTableSection from "@/components/static-pages-comp/prices/PriceTableSection";
import PriceFormSection from "@/components/static-pages-comp/prices/PriceFormSection";
import PriceLinksSection from "@/components/static-pages-comp/prices/PriceLinksSection";
import PriceLabelSection from "@/components/static-pages-comp/prices/PriceLabelSection";
import PriceCardsSection from "@/components/static-pages-comp/prices/PriceCardsSection";
import PriceStatSection from "@/components/static-pages-comp/prices/PriceStatSection";
import PriceImageSection from "@/components/static-pages-comp/prices/PriceImageSection";
import PriceQuoteSection from "@/components/static-pages-comp/prices/PriceQuoteSection";
import {
  PreviewFaqGrid,
  PreviewMethodology,
  PreviewSectionBadge,
  PreviewSectionHeading,
  type MethodologyItem,
  type PreviewCardVariant,
} from "@/components/static-pages-comp/shared/PreviewContentPrimitives";
import styles from "./PricePageContent.module.css";

function isShortLabel(text: string) {
  return text.length < 70 && text === text.toUpperCase() && /[A-Z]/.test(text);
}

function cardVariant(sectionId: string, block: Extract<StaticBlock, { type: "cards" }>, cardBlockIndex: number): PreviewCardVariant {
  if (sectionId === "which-one-is-right-for-your-car") return "condition";
  if (sectionId === "what-24-650-quote-requests-tell-us") return "metric";
  if (sectionId === "know-exactly-what-you-re-paying-for") return cardBlockIndex === 0 ? "included" : "excluded";
  if (sectionId === "weighing-cost-against-vehicle-value") return "value";
  if (sectionId === "from-quote-to-driving-away") return "value";
  if (sectionId === "10-questions-to-ask-your-engine-supplier") return "question";
  if (block.cards.length >= 4) return "compact";
  return "standard";
}

function renderPriceContentBlock(block: StaticBlock, index: number, cardBlockIndex: number, sectionId: string, sectionLinks: { href: string; text: string }[]): ReactNode {
  switch (block.type) {
    case "heading": return <PriceHeadingSection block={block} key={index} variant={sectionId === "know-exactly-what-you-re-paying-for" ? "included" : undefined} />;
    case "paragraph": return isShortLabel(block.text) ? null : <PriceParagraphSection block={block} key={index} />;
    case "list": return <PriceListSection block={block} key={index} />;
    case "table": return <PriceTableSection block={block} key={index} />;
    case "form": return <PriceFormSection form={block} key={index} />;
    case "links": return <PriceLinksSection block={block} key={index} />;
    case "label": return <PriceLabelSection block={block} key={index} />;
    case "cards": return <PriceCardsSection block={block} links={sectionLinks} variant={cardVariant(sectionId, block, cardBlockIndex)} key={index} />;
    case "stat": return <PriceStatSection block={block} key={index} />;
    case "image": return <PriceImageSection block={block} key={index} />;
    case "quote": return <PriceQuoteSection block={block} key={index} />;
    case "faq": return null;
    default: return null;
  }
}

function sectionBadge(sectionId: string, index: number, sections: ReturnType<typeof getNormalizedPreviewContent>["sections"]) {
  if (sectionId === "compare-all-options-side-by-side") return "Engine condition types · cost comparison";
  const previousParagraphs = index > 0 ? sections[index - 1].blocks.filter((block): block is Extract<StaticBlock, { type: "paragraph" }> => block.type === "paragraph") : [];
  const transitionLabel = [...previousParagraphs].reverse().find((block) => isShortLabel(block.text));
  if (transitionLabel) return transitionLabel.text;
  return "";
}

function sectionAccentWords(sectionId: string) {
  if (sectionId === "compare-all-options-side-by-side") return 3;
  if (sectionId === "which-one-is-right-for-your-car") return 2;
  return 2;
}

function methodologyFromHero(blocks: StaticBlock[]) {
  const paragraphs = blocks.filter((block): block is Extract<StaticBlock, { type: "paragraph" }> => block.type === "paragraph").map((block) => block.text.trim());
  const marker = paragraphs.findIndex((text) => /^ABOUT THIS DATA/i.test(text));
  if (marker < 0) return null;
  const summary = paragraphs[marker + 1] ?? "";
  const items: MethodologyItem[] = [];
  let review = "";
  for (let index = marker + 2; index < paragraphs.length; index += 1) {
    const text = paragraphs[index];
    if (/^Review cycle:/i.test(text)) { review = text; break; }
    if (/^\[[^\]]+\]$/.test(text) && paragraphs[index + 1]) {
      items.push({ label: text.replace(/^\[|\]$/g, ""), description: paragraphs[index + 1] });
      index += 1;
    }
  }
  return { summary, items, review };
}

export default function PricePageContent({ page }: { page: StaticPageRecord }) {
  const { hero, sections, tables, faqs, forms } = getNormalizedPreviewContent(page);
  const methodology = methodologyFromHero(hero.blocks);
  const renderedTableCount = sections.flatMap((section) => section.blocks).filter((block) => block.type === "table").length;
  const renderedFaqCount = sections.flatMap((section) => section.blocks).filter((block) => block.type === "faq").length;
  const renderedFormCount = hero.blocks.filter((block) => block.type === "form").length + sections.flatMap((section) => section.blocks).filter((block) => block.type === "form").length;

  return (
    <div className={styles.content}>
      {methodology ? <PreviewMethodology {...methodology} /> : null}

      {sections.map((section, sectionIndex) => {
        const sectionFaqs = section.blocks.filter((block): block is Extract<StaticBlock, { type: "faq" }> => block.type === "faq");
        if (sectionFaqs.length) return <PreviewFaqGrid title={section.heading} faqs={sectionFaqs} key={section.id} />;
        const badge = sectionBadge(section.id, sectionIndex, sections);
        if (section.id === "compare-real-quotes-from-100-uk-suppliers") {
          const paragraphs = section.blocks.filter((block): block is Extract<StaticBlock, { type: "paragraph" }> => block.type === "paragraph");
          const trust = paragraphs[0]?.text;
          const buttonText = paragraphs[1]?.text;
          const trustBadges = paragraphs[2]?.text.split(/\s*·\s*/).filter(Boolean) ?? [];
          return (
            <section className={`${styles.section} ${styles.finalQuoteSection}`} id={section.id} key={section.id}>
              {badge ? <PreviewSectionBadge>{badge}</PreviewSectionBadge> : null}
              <PreviewSectionHeading title={section.heading} accentWords={sectionAccentWords(section.id)} />
              {section.description ? <p className={styles.sectionDescription}>{section.description}</p> : null}
              {trust ? <p className={styles.finalQuoteTrust}>{trust}</p> : null}
              {buttonText ? <a className={styles.finalQuoteButton} href="#quote-form" data-quote-trigger="true">{buttonText}</a> : null}
              {trustBadges.length ? <div className={styles.finalQuoteBadges}>{trustBadges.map((item) => <span key={item}>{item}</span>)}</div> : null}
            </section>
          );
        }
        return (
          <section className={`${styles.section} ${section.id === "which-one-is-right-for-your-car" ? styles.conditionSection : ""}`} id={section.id} key={section.id}>
            {badge ? <PreviewSectionBadge icon={section.id.includes("which-one") ? "settings" : "layers"}>{badge}</PreviewSectionBadge> : null}
            <PreviewSectionHeading title={section.heading} accentWords={sectionAccentWords(section.id)} />
            {section.description ? <p className={styles.sectionDescription}>{section.description}</p> : null}
            <div className={styles.sectionBlocks}>{section.blocks.map((block, index) => renderPriceContentBlock(block, index, section.blocks.slice(0, index).filter((previous) => previous.type === "cards").length, section.id, section.links))}</div>
            {section.links.length && !(section.id === "explore-more-engine-cost-information" && section.blocks.some((block) => block.type === "cards")) ? <PriceLinksSection block={{ type: "links", links: section.links }} /> : null}
          </section>
        );
      })}

      {tables.slice(renderedTableCount).map((table, index) => <section className={styles.section} key={`extra-table-${index}`}><PriceTableSection block={{ type: "table", ...table }} /></section>)}
      {faqs.slice(renderedFaqCount).length ? <PreviewFaqGrid title="Frequently asked questions" faqs={faqs.slice(renderedFaqCount)} /> : null}
      {forms.slice(renderedFormCount).map((form, index) => <section className={styles.section} key={`${form.action}-${index}`}><PriceFormSection form={form} /></section>)}
    </div>
  );
}
