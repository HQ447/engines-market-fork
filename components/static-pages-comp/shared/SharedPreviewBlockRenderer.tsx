import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { StaticBlock, StaticForm, StaticLink } from "@/lib/staticPagePreview";
import { PreviewCardGrid, PreviewDataTable, PreviewFaqItem, PreviewSectionBadge, type PreviewCard, type PreviewCardVariant } from "./PreviewContentPrimitives";
import { capitalizeHeading } from "./text";
import styles from "./SharedPreviewBlocks.module.css";

type HeadingBlock = Extract<StaticBlock, { type: "heading" }>;
type CardsBlock = Extract<StaticBlock, { type: "cards" }>;

function normalizeLinkText(text: string) {
  return text.replace(/[↗→]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
}

export function inclusionVariantFromText(text: string): Extract<PreviewCardVariant, "included" | "excluded"> | undefined {
  const normalized = text.toLowerCase();
  if (/(?:not\s+included|excluded|excludes|extra\s+cost|hidden\s+cost|does\s+not\s+cover)/.test(normalized)) return "excluded";
  if (/(?:included|what\s+the\s+warranty\s+covers|warranty\s+covers)/.test(normalized)) return "included";
  return undefined;
}

export type SemanticInclusionGroup = {
  cards: PreviewCard[];
  coveredIndexes: number[];
  startIndex: number;
  variant: Extract<PreviewCardVariant, "included" | "excluded">;
};

function cardsFromParagraphs(blocks: StaticBlock[]): PreviewCard[] {
  const lines = blocks.filter((block): block is Extract<StaticBlock, { type: "paragraph" }> => block.type === "paragraph").map((block) => block.text.trim()).filter(Boolean);
  const mergedLines = lines.reduce<string[]>((result, line) => {
    if (/^[\p{Extended_Pictographic}\uFE0F\s]+$/u.test(line) && result.length === 0) return [...result, line];
    if (/^[\p{Extended_Pictographic}\uFE0F\s]+$/u.test(line)) return [...result, line];
    const previous = result.at(-1);
    if (previous && /^[\p{Extended_Pictographic}\uFE0F\s]+$/u.test(previous)) return [...result.slice(0, -1), `${previous} ${line}`];
    return [...result, line];
  }, []);
  const cards: PreviewCard[] = [];
  for (let index = 0; index < mergedLines.length; index += 2) {
    cards.push({ title: mergedLines[index], text: mergedLines[index + 1] ?? "", highlight: "", meta: "" });
  }
  return cards;
}

export function semanticInclusionGroups(blocks: StaticBlock[]): SemanticInclusionGroup[] {
  const markers = blocks.flatMap((block, index) => block.type === "heading" ? [{ index, variant: inclusionVariantFromText(block.text) }] : []).filter((marker): marker is { index: number; variant: Extract<PreviewCardVariant, "included" | "excluded"> } => Boolean(marker.variant));
  return markers.flatMap((marker, markerIndex) => {
    const end = markers[markerIndex + 1]?.index ?? blocks.length;
    const range = blocks.slice(marker.index + 1, end);
    const rangeIndexes = Array.from({ length: range.length }, (_, index) => marker.index + index + 1);
    const cardBlockIndexes = rangeIndexes.filter((index) => blocks[index].type === "cards");
    const explicitCards = range
      .filter((block): block is Extract<StaticBlock, { type: "cards" }> => block.type === "cards")
      .flatMap((block) => block.cards);
    const listIndexes = rangeIndexes.filter((index) => blocks[index].type === "list");
    const cards = explicitCards.length
      ? explicitCards
      : listIndexes.length
      ? range.filter((block): block is Extract<StaticBlock, { type: "list" }> => block.type === "list").flatMap((block) => block.items.map((item) => ({ title: item, text: "", highlight: "", meta: "" })))
      : cardsFromParagraphs(range);
    const coveredIndexes = explicitCards.length
      ? cardBlockIndexes
      : listIndexes.length
        ? listIndexes
        : rangeIndexes.filter((index) => blocks[index].type === "paragraph");
    return cards.length ? [{ variant: marker.variant, cards, coveredIndexes, startIndex: coveredIndexes[0] }] : [];
  });
}

export function SharedInclusionCards({ cards, variant }: Pick<SemanticInclusionGroup, "cards" | "variant">) {
  return <PreviewCardGrid cards={cards} variant={variant} />;
}

export function SharedHeadingBlock({ block }: { block: HeadingBlock }) {
  const text = capitalizeHeading(block.text.replace(/^[\s\u{1F300}-\u{1FAFF}\u2600-\u27BF\uFE0F]+/u, "").trim());
  const inclusionVariant = inclusionVariantFromText(text);
  if (block.level === "h3" && inclusionVariant) {
    return <h3 id={block.id || undefined} className={`${styles.inclusionHeading} ${inclusionVariant === "excluded" ? styles.inclusionHeadingExcluded : ""}`}>{text}</h3>;
  }
  return block.level === "h3"
    ? <h3 id={block.id || undefined} className="mt-5 text-[clamp(1.2rem,2.4vw,2rem)] font-black leading-[1.03] tracking-[-0.04em] text-[#071936]">{text}</h3>
    : <h4 id={block.id || undefined} className="mt-4 text-[clamp(1rem,1.8vw,1.35rem)] font-extrabold leading-tight text-[#0a2952]">{text}</h4>;
}

export function SharedParagraphBlock({ text }: { text: string }) {
  return <p className="mt-5 max-w-4xl text-[15px] leading-8 text-slate-600">{text}</p>;
}

export function SharedListBlock({ block }: { block: Extract<StaticBlock, { type: "list" }> }) {
  const List = block.ordered ? "ol" : "ul";
  return <List className="mt-5 grid gap-3 text-[15px] leading-7 text-slate-600">{block.items.map((item, index) => <li className="flex items-start gap-3" key={`${item}-${index}`}><span aria-hidden="true" className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-black text-[#14803d]">{block.ordered ? index + 1 : "✓"}</span><span>{item}</span></li>)}</List>;
}

export function SharedFormBlock({ form }: { form: StaticForm }) {
  return <form action={form.action || "/get-a-quote"} method={form.method === "post" ? "post" : "get"} className="rounded-2xl border border-emerald-200 bg-[linear-gradient(135deg,#f0fdf4_0%,#f8fafc_100%)] p-5 shadow-sm sm:p-6"><div className="flex items-start justify-between gap-4"><p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#116533]">Preview form · existing action preserved</p><span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" /></div><div className="mt-5 grid gap-4 sm:grid-cols-2">{form.fields.filter((field) => ["input", "select", "textarea"].includes(field.element)).map((field, index) => <label className="grid gap-1.5 text-xs font-extrabold text-[#0a2952]" key={field.name + index}>{field.name || field.placeholder || "Field"}{field.element === "textarea" ? <textarea className="min-h-24 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name={field.name || `field-${index + 1}`} placeholder={field.placeholder} rows={4} required={field.required} /> : field.element === "select" ? <select className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal text-slate-600 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name={field.name || `field-${index + 1}`} defaultValue="" required={field.required}><option value="">{field.placeholder || "Select an option"}</option></select> : <input className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" name={field.name || `field-${index + 1}`} type={field.type || "text"} placeholder={field.placeholder} required={field.required} />}</label>)}</div><button className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0a2952] px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#123d84]" type="submit">Continue to existing form action <span aria-hidden="true" className="ml-2">→</span></button></form>;
}

export function SharedLinksBlock({ links, compact = false }: { links: StaticLink[]; compact?: boolean }) {
  const linkClassName = compact ? styles.relatedGuideLink : "flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm font-bold text-[#078d4a] transition hover:border-emerald-200 hover:bg-emerald-50/60";
  const listClassName = compact ? styles.relatedGuideList : "mt-6 grid gap-3 sm:grid-cols-2";
  return <ul className={listClassName}>{links.map((link) => { const cleanText = link.text.replace(/[↗→↑]/g, "").replace(/\s+/g, " ").trim(); const content = <><span>{cleanText}</span><span aria-hidden="true" className="relatedGuideArrow">↗</span></>; return <li className="group" key={link.href + link.text}>{link.href.startsWith("/") ? <Link className={linkClassName} href={link.href}>{content}</Link> : <a className={linkClassName} href={link.href}>{content}</a>}</li>; })}</ul>;
}

export function SharedCardsBlock({ block, variant, links }: { block: CardsBlock; variant: PreviewCardVariant; links: StaticLink[] }) {
  const cards = block.cards.map((card) => {
    const text = card.title || card.text;
    const link = links.find((item) => normalizeLinkText(item.text) === normalizeLinkText(text));
    return link ? { ...card, href: link.href } : card;
  });
  return <PreviewCardGrid cards={cards} variant={variant} />;
}

export function questionCardsFromParagraphs(sectionId: string, blocks: StaticBlock[]): PreviewCard[] {
  if (!/question/.test(sectionId)) return [];
  const cards: PreviewCard[] = [];
  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    if (block.type !== "paragraph" || !/^(?:question\s*)?\d+\.?\s+/i.test(block.text)) continue;
    const nextBlock = blocks[index + 1];
    cards.push({
      title: block.text,
      text: nextBlock?.type === "paragraph" && !/^(?:question\s*)?\d+\.?\s+/i.test(nextBlock.text) ? nextBlock.text : "",
      highlight: "",
      meta: "",
    });
  }
  return cards.length >= 2 ? cards : [];
}

export function SharedQuestionChecklist({ cards }: { cards: PreviewCard[] }) {
  return <PreviewCardGrid cards={cards} variant="question" />;
}

export function SharedStatBlock({ block }: { block: Extract<StaticBlock, { type: "stat" }> }) {
  return <div className="my-7 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#071936_0%,#0a2952_62%,#116533_100%)] p-6 text-white shadow-[0_12px_30px_rgba(10,41,82,0.18)]"><div aria-hidden="true" className="mb-5 h-1 w-12 rounded-full bg-emerald-400" /><p className="text-4xl font-black tracking-tight">{block.value}</p><p className="mt-2 text-sm font-semibold text-slate-200">{block.label}</p></div>;
}

export function SharedImageBlock({ block }: { block: Extract<StaticBlock, { type: "image" }> }) {
  const src = block.src.startsWith("/") ? block.src : `/${block.src.replace(/^\.\//, "")}`;
  return block.src ? <div className="my-7 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"><Image className="max-h-80 w-full object-contain" src={src} alt={block.alt} width={1200} height={630} /></div> : null;
}

export function SharedQuoteBlock({ block }: { block: Extract<StaticBlock, { type: "quote" }> }) {
  return <blockquote className="my-7 rounded-r-2xl border-l-4 border-amber-500 bg-amber-50/70 px-5 py-4 text-base italic leading-7 text-slate-700 shadow-sm">{block.text}</blockquote>;
}

export function SharedPreviewBlockRenderer({ block, blockIndex, sectionId, sectionHeading, sectionDescription, sectionBlocks, sectionLinks, suppressShortParagraphLabels, relatedGuides = false, marketIntelligence = false }: { block: StaticBlock; blockIndex: number; sectionId: string; sectionHeading: string; sectionDescription?: string; sectionBlocks: StaticBlock[]; sectionLinks: StaticLink[]; suppressShortParagraphLabels: boolean; relatedGuides?: boolean; marketIntelligence?: boolean }): ReactNode {
  const isShortLabel = block.type === "paragraph" && block.text.length < 70 && block.text === block.text.toUpperCase() && /[A-Z]/.test(block.text);
  if (suppressShortParagraphLabels && isShortLabel) return null;
  switch (block.type) {
    case "heading": return <SharedHeadingBlock block={block} key={blockIndex} />;
    case "paragraph": return <SharedParagraphBlock text={block.text} key={blockIndex} />;
    case "list": return <SharedListBlock block={block} key={blockIndex} />;
    case "table": return <PreviewDataTable table={block} key={blockIndex} />;
    case "faq": return <PreviewFaqItem faq={block} key={blockIndex} />;
    case "form": return <SharedFormBlock form={block} key={blockIndex} />;
    case "links": return <SharedLinksBlock links={block.links} compact={relatedGuides || isEditorialLinkSection(sectionId, sectionHeading, sectionBlocks)} key={blockIndex} />;
    case "label": return <PreviewSectionBadge icon="layers" key={blockIndex}>{block.text}</PreviewSectionBadge>;
    case "cards": return <SharedCardsBlock block={block} links={sectionLinks} variant={marketIntelligence ? "metric" : cardVariant(sectionHeading, sectionDescription, sectionBlocks, blockIndex, block)} key={blockIndex} />;
    case "stat": return <SharedStatBlock block={block} key={blockIndex} />;
    case "image": return <SharedImageBlock block={block} key={blockIndex} />;
    case "quote": return <SharedQuoteBlock block={block} key={blockIndex} />;
  }
}

export function isEditorialLinkSection(sectionId: string, sectionHeading = "", blocks: StaticBlock[] = []) {
  const sectionText = [sectionId, sectionHeading, ...blocks.filter((block) => block.type === "paragraph" || block.type === "label" || block.type === "heading").map((block) => block.text)].join(" ");
  return /(?:explore.*(?:cost|information)|related.*(?:cost|guide|link)|(?:cost|guide|link).*related)/i.test(sectionText);
}

export function isMarketIntelligenceSection(sectionId: string, sectionHeading = "", blocks: StaticBlock[] = []) {
  const sectionText = [sectionId, sectionHeading, ...blocks.filter((block) => block.type === "paragraph" || block.type === "label" || block.type === "heading").map((block) => block.text)].join(" ");
  return /market\s+intelligence|market\s+data|quote\s+requests\s+tell\s+us/i.test(sectionText);
}

function cardVariant(sectionHeading: string, sectionDescription: string | undefined, sectionBlocks: StaticBlock[], blockIndex: number, block: CardsBlock): PreviewCardVariant {
  const numberedQuestionCards = block.cards.filter((card) => /^(?:question\s*)?\d+\.?\s*/i.test(card.title || card.text)).length;
  const questionSection = /(?:\b10\s+questions?|questions?\s+to\s+ask)/i.test(sectionHeading) || sectionBlocks.some((candidate) => candidate.type === "heading" && /(?:\b10\s+questions?|questions?\s+to\s+ask)/i.test(candidate.text));
  // Question checklists must win before content-word heuristics. Their
  // explanations often contain “included” or “not included”, which must not
  // turn the whole checklist into an inclusion/exclusion strip.
  if (questionSection || (block.cards.length >= 2 && numberedQuestionCards === block.cards.length)) return "question";
  const cardText = block.cards.map((card) => `${card.title} ${card.highlight} ${card.text}`).join(" ");
  const explicitInclusionVariant = inclusionVariantFromText(cardText);
  if (explicitInclusionVariant) return explicitInclusionVariant;
  const precedingInclusionHeading = [...sectionBlocks.slice(0, blockIndex)].reverse().find((previous): previous is HeadingBlock => previous.type === "heading" && Boolean(inclusionVariantFromText(previous.text)));
  if (precedingInclusionHeading) return inclusionVariantFromText(precedingInclusionHeading.text)!;
  const followingInclusionHeading = sectionBlocks.slice(blockIndex + 1).find((next): next is HeadingBlock => next.type === "heading" && Boolean(inclusionVariantFromText(next.text)));
  if (followingInclusionHeading && inclusionVariantFromText(followingInclusionHeading.text) === "excluded") return "included";
  const sectionInclusionVariant = inclusionVariantFromText(sectionDescription || sectionHeading);
  if (sectionInclusionVariant) return sectionInclusionVariant;
  if (/(?:which\s+(?:one|option).*(?:right|choose)|engine\s+condition)/i.test(sectionHeading)) return "condition";
  if (/(?:quote\s+requests\s+tell\s+us|market\s+intelligence|market\s+data)/i.test(sectionHeading)) return "metric";
  if (/(?:cost\s+against\s+vehicle\s+value|quote\s+to\s+driving)/i.test(sectionHeading)) return "value";
  if (block.cards.length >= 4) return "compact";
  return "standard";
}
