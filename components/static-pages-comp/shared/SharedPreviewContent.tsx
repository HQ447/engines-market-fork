import { getNormalizedPreviewContent } from "@/lib/staticPagePreview";
import type { StaticBlock, StaticForm, StaticPageRecord, StaticLink } from "@/lib/staticPagePreview";
import { PreviewCardGrid, PreviewDataTable, PreviewFaqItem, PreviewMethodology, PreviewSectionBadge, PreviewSectionHeading, type MethodologyItem } from "./PreviewContentPrimitives";
import type { SharedPreviewConfig } from "./SharedPreviewPage";
import { isEditorialLinkSection, isMarketIntelligenceSection, semanticInclusionGroups, SharedFormBlock, SharedImageBlock, SharedInclusionCards, SharedLinksBlock, SharedPreviewBlockRenderer, SharedQuestionChecklist } from "./SharedPreviewBlockRenderer";
import SharedPreviewSection from "./SharedPreviewSection";
import SharedQuoteCtaSection from "./SharedQuoteCtaSection";
import styles from "./SharedPreviewContent.module.css";
import { adaptNumberedQuestions, adaptSemanticParagraphCards, classifyPreviewSection, resolvePreviewPill } from "@/lib/previewSemantics";

function isShortLabel(text: string) {
  return text.length < 70 && text === text.toUpperCase() && /[A-Z]/.test(text);
}

function isSameLink(left: StaticLink, right: StaticLink) {
  return left.href === right.href && left.text === right.text;
}

function normalizeLinkText(text: string) {
  return text.replace(/[↗→]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
}

function isLinkCardBlock(block: StaticBlock, links: StaticLink[]) {
  return block.type === "cards" && block.cards.length > 0 && block.cards.every((card) => {
    const cardText = normalizeLinkText(card.title || card.text).replace(/\bread\s+guide\b/g, "").trim();
    return Boolean(cardText) && links.some((link) => {
      const linkText = normalizeLinkText(link.text).replace(/\bread\s+guide\b/g, "").trim();
      return linkText === cardText || linkText.startsWith(cardText) || cardText.startsWith(linkText);
    });
  });
}

function derivedBadge(sectionHeading: string, index: number, sections: ReturnType<typeof getNormalizedPreviewContent>["sections"], config: SharedPreviewConfig) {
  if (!config.derivePriceBadges) return "";
  if (/compare\s+all\s+options/i.test(sectionHeading)) return "Engine condition types · cost comparison";
  const previousParagraphs = index > 0 ? sections[index - 1].blocks.filter((block): block is Extract<StaticBlock, { type: "paragraph" }> => block.type === "paragraph") : [];
  return [...previousParagraphs].reverse().find((block) => isShortLabel(block.text))?.text ?? "";
}

function isConditionSection(heading: string) {
  return /(?:which\s+(?:one|option).*(?:right|choose)|engine\s+condition)/i.test(heading);
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

function isQuoteCtaSection(section: { id: string; heading: string }) {
  return /(?:compare.*quotes|personalised.*(?:quote|price)|personalized.*(?:quote|price)|get.*(?:quote|quotes|price))/.test(`${section.id} ${section.heading}`.toLowerCase());
}

export default function SharedPreviewContent({ page, config }: { page: StaticPageRecord; config: SharedPreviewConfig }) {
  const { hero, sections, tables, faqs, forms, media, relatedLinks } = getNormalizedPreviewContent(page);
  const heroFormCount = hero.blocks.filter((block) => block.type === "form").length;
  const sectionFormCount = sections.flatMap((section) => section.blocks).filter((block) => block.type === "form").length;
  const sectionTableCount = sections.flatMap((section) => section.blocks).filter((block) => block.type === "table").length;
  const sectionFaqCount = sections.flatMap((section) => section.blocks).filter((block) => block.type === "faq").length;
  const renderedImageCount = hero.blocks.filter((block) => block.type === "image").length + sections.flatMap((section) => section.blocks).filter((block) => block.type === "image").length;
  const renderedLinks = sections.flatMap((section) => [...section.links, ...section.blocks.flatMap((block) => block.type === "links" ? block.links : [])]);
  const unrenderedRelatedLinks = relatedLinks.filter((link, index, all) => !renderedLinks.some((rendered) => rendered.href === link.href) && all.findIndex((candidate) => candidate.href === link.href) === index);
  const extraHeroForms = config.registrationEnabled ? [] : hero.blocks.filter((block): block is Extract<StaticBlock, { type: "form" }> => block.type === "form");
  const methodology = config.renderMethodology ? methodologyFromHero(hero.blocks) : null;

  return <main className={styles.content} data-preview-content-family={config.family}>
    {methodology ? <PreviewMethodology {...methodology} /> : null}
    {extraHeroForms.map((form, index) => <section className={styles.section} key={`hero-form-${index}`}><SharedFormBlock form={form} /></section>)}
    {sections.map((section, sectionIndex) => {
      const explicitBadgeIndex = section.blocks.findIndex((block) => block.type === "label");
      const semantic = classifyPreviewSection({ id: section.id, heading: section.heading, description: section.description, blocks: section.blocks, links: section.links, family: config.family });
      const explicitBadge = explicitBadgeIndex >= 0 ? (section.blocks[explicitBadgeIndex] as Extract<StaticBlock, { type: "label" }>).text : undefined;
      const badge = resolvePreviewPill({ id: section.id, heading: section.heading, description: section.description, blocks: section.blocks, links: section.links, family: config.family }, semantic, explicitBadge || (config.derivePriceBadges ? derivedBadge(section.heading, sectionIndex, sections, config) : undefined));
      // A prose-only mention of related guides is content, not a related-guide
      // module. Only switch to the compact text-link treatment when this
      // section actually carries destinations to preserve every extracted word.
      const hasGuideLinks = section.links.length > 0 || section.blocks.some((block) => block.type === "links" && block.links.length > 0);
      const isEditorialLinksSection = hasGuideLinks && isEditorialLinkSection(section.id, section.heading, section.blocks);
      const isMarketIntelligence = isMarketIntelligenceSection(section.id, section.heading, section.blocks);
      const sectionLinks = section.links.filter((link) => !section.blocks.some((block) => block.type === "links" && block.links.some((blockLink) => isSameLink(blockLink, link))));
      // Labels are section chrome, not body content. Retain the first one as the
      // badge and suppress any additional extracted labels so a section never
      // renders duplicate pills.
      const allSectionLinks = [...section.links, ...section.blocks.flatMap((block) => block.type === "links" ? block.links : [])];
      const bodyBlocks = section.blocks.filter((block) => block.type !== "label" && !(allSectionLinks.length && isLinkCardBlock(block, allSectionLinks)));
      const adaptedCards = adaptSemanticParagraphCards(section.heading, bodyBlocks);
      const questionCards = (adaptedCards?.variant === "question" ? adaptedCards.cards : adaptNumberedQuestions(bodyBlocks)).map((card) => ({ ...card }));
      const adaptedCardIndexes = new Set(adaptedCards?.coveredIndexes ?? []);
      const inclusionGroups = semanticInclusionGroups(bodyBlocks);
      const inclusionGroupStarts = new Map(inclusionGroups.map((group) => [group.startIndex, group]));
      const inclusionCoveredIndexes = new Set(inclusionGroups.flatMap((group) => group.coveredIndexes));
      if (isQuoteCtaSection(section)) {
        const paragraphs = section.blocks.filter((block): block is Extract<StaticBlock, { type: "paragraph" }> => block.type === "paragraph");
        return <SharedQuoteCtaSection id={section.id} key={section.id} title={section.heading} description={section.description ?? undefined} paragraphs={paragraphs.map((block) => block.text)} badge={badge} />;
      }
      return <SharedPreviewSection
        id={section.id}
        key={section.id}
        badge={badge}
        badgeIcon={isConditionSection(section.heading) ? "settings" : semantic.badgeIcon}
        heading={section.heading}
        description={section.description ?? undefined}
        className={isConditionSection(section.heading) ? styles.conditionSection : ""}
        accentWords={/compare\s+all\s+options/i.test(section.heading) ? 3 : 2}
      >
        {questionCards.length ? <SharedQuestionChecklist cards={questionCards} /> : null}
        {adaptedCards && adaptedCards.variant !== "question" ? <PreviewCardGrid cards={adaptedCards.cards} variant={adaptedCards.variant} /> : null}
        {bodyBlocks.map((block, index) => {
          const inclusionGroup = inclusionGroupStarts.get(index);
          if (inclusionGroup) return <SharedInclusionCards cards={inclusionGroup.cards} variant={inclusionGroup.variant} key={`inclusion-${index}`} />;
          if (inclusionCoveredIndexes.has(index) || adaptedCardIndexes.has(index) || (questionCards.length && block.type === "paragraph")) return null;
          return <SharedPreviewBlockRenderer block={block} blockIndex={index} sectionId={section.id} sectionHeading={section.heading} sectionDescription={section.description ?? undefined} sectionBlocks={bodyBlocks} sectionLinks={sectionLinks} suppressShortParagraphLabels={config.suppressShortParagraphLabels || isEditorialLinksSection} relatedGuides={isEditorialLinksSection} marketIntelligence={isMarketIntelligence || semantic.kind === "market-intelligence"} cardVariantOverride={semantic.cardVariant} key={index} />;
        })}
        {sectionLinks.length ? <SharedLinksBlock links={sectionLinks} compact={isEditorialLinksSection} /> : null}
      </SharedPreviewSection>;
    })}
    {tables.slice(hero.blocks.filter((block) => block.type === "table").length + sectionTableCount).map((table, index) => <section className={styles.section} key={`extra-table-${index}`}><PreviewDataTable table={table} /></section>)}
    {faqs.slice(hero.blocks.filter((block) => block.type === "faq").length + sectionFaqCount).length ? <section className={styles.section}><PreviewSectionBadge icon="faq">Frequently asked questions</PreviewSectionBadge><PreviewSectionHeading title="Frequently asked questions" accentWords={3} /><div className={styles.faqGrid}>{faqs.slice(hero.blocks.filter((block) => block.type === "faq").length + sectionFaqCount).map((faq) => <PreviewFaqItem faq={faq} key={faq.question} />)}</div></section> : null}
    {forms.slice(heroFormCount + sectionFormCount).map((form: StaticForm, index) => <section className={styles.section} key={`${form.action}-${index}`}><SharedFormBlock form={form} /></section>)}
    {media.slice(renderedImageCount).map((image, index) => <section className={styles.section} key={`extra-image-${index}`}><SharedImageBlock block={{ type: "image", src: image.src, alt: image.alt }} /></section>)}
    {unrenderedRelatedLinks.length ? <section className={styles.section}><SharedLinksBlock links={unrenderedRelatedLinks} /></section> : null}
  </main>;
}
