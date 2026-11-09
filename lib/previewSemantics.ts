import type { StaticBlock, StaticLink } from "@/lib/staticPagePreview";

export type PreviewSemanticKind =
  | "methodology"
  | "comparison"
  | "cost-data"
  | "inclusion"
  | "market-intelligence"
  | "value-decision"
  | "timeline"
  | "questions"
  | "related-links"
  | "faq"
  | "custom";

export type PreviewSemanticConfidence = "high" | "medium" | "low";

export type PreviewSemantic = {
  kind: PreviewSemanticKind;
  confidence: PreviewSemanticConfidence;
  pill: string;
  badgeIcon: "layers" | "faq" | "settings" | "data";
  cardVariant?: "condition" | "metric" | "included" | "excluded" | "value" | "question" | "compact";
};

type SectionInput = {
  id: string;
  heading: string;
  description?: string | null;
  blocks: StaticBlock[];
  links?: StaticLink[];
  family: "prices" | "services" | "symptoms" | "insights";
};

const textOf = (section: SectionInput) => [
  section.id,
  section.heading,
  section.description ?? "",
  ...section.blocks.flatMap((block) => {
    if (block.type === "cards") return block.cards.flatMap((card) => [card.title, card.text, card.highlight, card.meta]);
    if (block.type === "table") return [...block.headers, ...block.rows.flat()];
    if (block.type === "list") return block.items;
    if (block.type === "links") return block.links.map((link) => link.text);
    if (block.type === "faq") return [block.question, block.answer];
    if ("text" in block) return [block.text];
    return [];
  }),
].join(" ").replace(/\s+/g, " ").trim();

function has(section: SectionInput, pattern: RegExp) {
  return pattern.test(textOf(section));
}

function hasBlocks(section: SectionInput, ...types: StaticBlock["type"][]) {
  return types.some((type) => section.blocks.some((block) => block.type === type));
}

export function classifyPreviewSection(section: SectionInput): PreviewSemantic {
  const links = [...(section.links ?? []), ...section.blocks.flatMap((block) => block.type === "links" ? block.links : [])];
  const sectionHeading = `${section.id} ${section.heading}`;
  const numberedCards = section.blocks.some((block) => block.type === "cards" && block.cards.length >= 2 && block.cards.every((card) => /^(?:question\s*)?\d+\.?\s*/i.test(card.title || card.text)));
  const numberedParagraphs = section.blocks.filter((block) => block.type === "paragraph" && /^(?:question\s*)?\d+\.?\s+/i.test(block.text)).length >= 2;

  if (has(section, /frequently asked|common questions|\bfaqs?\b/i) && hasBlocks(section, "faq")) {
    return { kind: "faq", confidence: "high", pill: "Frequently asked questions", badgeIcon: "faq" };
  }
  if (/common questions?/i.test(sectionHeading) && hasBlocks(section, "cards")) {
    return { kind: "questions", confidence: "high", pill: "Frequently asked questions", badgeIcon: "faq", cardVariant: "question" };
  }
  if (links.length && has(section, /related|explore more|further reading|guides?|resources?/i)) {
    return { kind: "related-links", confidence: "high", pill: section.family === "insights" ? "Related insights & data" : "Related guides & resources", badgeIcon: "layers" };
  }
  if (numberedCards || numberedParagraphs || /\b10 questions?\b|questions? to ask|what to ask .*supplier/i.test(sectionHeading)) {
    return { kind: "questions", confidence: "high", pill: "Before you agree · questions to ask", badgeIcon: "layers", cardVariant: "question" };
  }
  if (/combined service/i.test(sectionHeading)) {
    return { kind: "custom", confidence: "medium", pill: "Combined service", badgeIcon: "layers" };
  }
  if (has(section, /methodology|how (?:the )?data (?:was )?collected|how we benchmark|data confidence|source notes|dataset limitations/i) && hasBlocks(section, "table", "cards", "list", "paragraph")) {
    return { kind: "methodology", confidence: "high", pill: "Data & methodology", badgeIcon: "data", cardVariant: "metric" };
  }
  if (has(section, /included|not included|excludes?|covered|coverage|warranty.*(?:get|cover)|what you(?:'ll)? get/i) && hasBlocks(section, "cards", "list", "table", "paragraph")) {
    const excluded = has(section, /not included|excluded|excludes|does not cover|risks?\s*&\s*caveats/i);
    return { kind: "inclusion", confidence: "medium", pill: excluded ? "What's included and what's not" : "What's included", badgeIcon: "data", cardVariant: excluded ? "excluded" : "included" };
  }
  if (has(section, /market intelligence|market data|quote requests tell us|ranked|ranking|statistics|at a glance|key metrics|data tells us|industry benchmarks/i) && hasBlocks(section, "cards", "table")) {
    return { kind: "market-intelligence", confidence: "high", pill: "Market intelligence", badgeIcon: "data", cardVariant: "metric" };
  }
  if (has(section, /vehicle value|repair vs replace|repair or replace|repair vs scrap|worth replacing|financially|threshold/i) && hasBlocks(section, "cards", "table", "paragraph")) {
    return { kind: "value-decision", confidence: "high", pill: "Repair, replace or walk away?", badgeIcon: "settings", cardVariant: "value" };
  }
  if (has(section, /how long|timeline|turnaround|from .* to .*|labour hours|duration|delivery time/i) && hasBlocks(section, "cards", "table", "list")) {
    return { kind: "timeline", confidence: "high", pill: "Timeline and turnaround", badgeIcon: "layers", cardVariant: "compact" };
  }
  if (has(section, /compare|comparison|condition types?|options? side by side|types? of|which (?:one|option)|manual.*automatic|used.*reconditioned/i) && hasBlocks(section, "table", "cards")) {
    return { kind: "comparison", confidence: "medium", pill: section.family === "symptoms" ? "Likely causes compared" : "Options compared", badgeIcon: "settings", cardVariant: "condition" };
  }
  if (has(section, /cost|price|rate|what you'll pay|what other owners paid|labour/i) && hasBlocks(section, "table")) {
    return { kind: "cost-data", confidence: "high", pill: "Cost data", badgeIcon: "data" };
  }
  if (has(section, /recovery\s+vs\s+driving/i)) {
    return { kind: "custom", confidence: "medium", pill: "Recovery vs driving", badgeIcon: "settings", cardVariant: "value" };
  }
  if (has(section, /flatbed recovery.*right choice|recovery method/i)) {
    return { kind: "custom", confidence: "medium", pill: "Recovery method comparison", badgeIcon: "settings", cardVariant: "compact" };
  }
  if (has(section, /checklist|before the recovery vehicle arrives|before collection/i)) {
    return { kind: "custom", confidence: "medium", pill: "Recovery checklist", badgeIcon: "layers" };
  }
  if (has(section, /how engines market connects|how engines market works|receive quotes|compare options/i)) {
    return { kind: "custom", confidence: "medium", pill: "How it works", badgeIcon: "layers" };
  }
  if (has(section, /what not to ask|don't assume/i)) {
    return { kind: "custom", confidence: "medium", pill: "Important things to know", badgeIcon: "layers" };
  }
  if (/don't risk driving|get (?:a|your) .*quote/i.test(sectionHeading)) {
    return { kind: "custom", confidence: "medium", pill: "Next step: get a recovery quote", badgeIcon: "layers" };
  }

  return { kind: "custom", confidence: "low", pill: "", badgeIcon: "layers" };
}

export function resolvePreviewPill(section: SectionInput, semantic: PreviewSemantic, explicit?: string) {
  const clean = explicit?.replace(/\s+/g, " ").trim();
  const obviouslyMisleading = clean && (
    (/(?:frequently asked|\bfaq\b)/i.test(clean) && !hasBlocks(section, "faq")) ||
    (/(?:frequently asked|\bfaq\b)/i.test(clean) && semantic.kind !== "faq") ||
    (/(?:related|explore more|further reading)/i.test(clean) && semantic.kind !== "related-links") ||
    (/(?:methodology|data confidence|source notes)/i.test(clean) && !["methodology", "market-intelligence", "cost-data"].includes(semantic.kind))
  );
  if (clean && !obviouslyMisleading && !/^(?:section|content|details|information)$/i.test(clean)) return clean;
  return semantic.pill;
}

export type AdaptedQuestion = { title: string; text: string; highlight: string; meta: string };

export function adaptNumberedQuestions(blocks: StaticBlock[]): AdaptedQuestion[] {
  const questions: AdaptedQuestion[] = [];
  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    if (block.type !== "paragraph" || !/^(?:question\s*)?\d+\.?\s+/i.test(block.text)) continue;
    const next = blocks[index + 1];
    questions.push({
      title: block.text,
      text: next?.type === "paragraph" && !/^(?:question\s*)?\d+\.?\s+/i.test(next.text) ? next.text : "",
      highlight: "",
      meta: "",
    });
  }
  return questions.length >= 2 ? questions : [];
}

export type AdaptedSectionCards = {
  cards: AdaptedQuestion[];
  coveredIndexes: number[];
  variant: "standard" | "compact" | "metric" | "value" | "question";
};

function paragraphEntries(blocks: StaticBlock[]): Array<{ block: Extract<StaticBlock, { type: "paragraph" }>; index: number }> {
  return blocks.flatMap((block, index) => block.type === "paragraph" ? [{ block, index }] : []);
}

function card(title: string, text = "", highlight = "", meta = ""): AdaptedQuestion {
  return { title, text, highlight, meta };
}

function stopAtEditorialParagraph(text: string) {
  return /^[-–—]\s|^proprietary data$|^related services$|^how it works$|^supplier checklist$|^real-world validation$|^don't assume$/i.test(text.trim()) || /^['"]/.test(text.trim());
}

export function adaptSemanticParagraphCards(sectionHeading: string, blocks: StaticBlock[]): AdaptedSectionCards | null {
  const normalizedHeading = sectionHeading.toLowerCase();
  const entries = paragraphEntries(blocks);
  if (!entries.length) return null;

  if (/checklist/i.test(normalizedHeading)) {
    const cards: AdaptedQuestion[] = [];
    const coveredIndexes: number[] = [];
    for (let index = 0; index < blocks.length; index += 1) {
      const step = blocks[index];
      if (step.type !== "paragraph" || !/^\d+$/.test(step.text.trim())) continue;
      const title = blocks[index + 1];
      const description = blocks[index + 2];
      if (!title || title.type !== "paragraph" || !description || description.type !== "paragraph") continue;
      cards.push(card(title.text, description.text, "", `Step ${step.text.trim()}`));
      coveredIndexes.push(index, index + 1, index + 2);
    }
    if (cards.length >= 2) return { cards, coveredIndexes, variant: "compact" };
  }

  if (/questions?\s+to\s+ask|ask the .*supplier|before booking|before you agree/i.test(normalizedHeading)) {
    const usable = entries.filter(({ block }) => !stopAtEditorialParagraph(block.text));
    if (usable.length >= 4 && usable.length % 2 === 0) {
      return {
        cards: Array.from({ length: usable.length / 2 }, (_, index) => card(`${index + 1}. ${usable[index * 2].block.text}`, usable[index * 2 + 1].block.text)),
        coveredIndexes: usable.flatMap(({ index }) => index),
        variant: "question",
      };
    }
  }

  if (/recovery\s+vs\s+driving/i.test(normalizedHeading)) {
    const usable = entries.filter(({ block }) => !stopAtEditorialParagraph(block.text));
    const groups = Math.floor(usable.length / 3);
    if (groups >= 2) {
      return {
        cards: Array.from({ length: groups }, (_, index) => card(usable[index * 3].block.text, usable[index * 3 + 1].block.text, "", usable[index * 3 + 2].block.text)),
        coveredIndexes: usable.slice(0, groups * 3).map(({ index }) => index),
        variant: "value",
      };
    }
  }

  if (/situations that require|when you should not drive/i.test(normalizedHeading)) {
    const headingIndex = blocks.findIndex((block) => block.type === "heading");
    const usable = entries.filter(({ index, block }) => index > headingIndex && !stopAtEditorialParagraph(block.text));
    const groups = Math.floor(usable.length / 2);
    if (groups >= 2) {
      return {
        cards: Array.from({ length: groups }, (_, index) => card(usable[index * 2].block.text, usable[index * 2 + 1].block.text)),
        coveredIndexes: usable.slice(0, groups * 2).map(({ index }) => index),
        variant: "value",
      };
    }
  }

  if (/combined service/i.test(normalizedHeading)) {
    const leading = entries.filter(({ index }) => blocks.slice(0, index).every((block) => block.type === "paragraph"));
    const groups = Math.floor(leading.length / 2);
    if (groups >= 2) {
      return {
        cards: Array.from({ length: groups }, (_, index) => card(leading[index * 2].block.text, leading[index * 2 + 1].block.text)),
        coveredIndexes: leading.slice(0, groups * 2).map(({ index }) => index),
        variant: "standard",
      };
    }
  }

  if (/(?:cost\s+data|cost\s+by\s+distance|price\s+data)/i.test(normalizedHeading)) {
    const leading = entries.filter(({ index }) => blocks.slice(0, index).every((block) => block.type === "paragraph"));
    const groups = Math.floor(leading.length / 3);
    if (groups >= 2) {
      return {
        cards: Array.from({ length: groups }, (_, index) => card(leading[index * 3].block.text, leading[index * 3 + 2].block.text, leading[index * 3 + 1].block.text)),
        coveredIndexes: leading.slice(0, groups * 3).map(({ index }) => index),
        variant: "metric",
      };
    }
  }

  if (/flatbed recovery.*right choice|recovery method/i.test(normalizedHeading)) {
    const firstGroups = entries.filter(({ block }) => /flatbed recovery|tow rope|tow bar|dolly towing/i.test(block.text)).map(({ index }) => index).slice(0, 4);
    if (firstGroups.length >= 4) {
      const covered = firstGroups.flatMap((start) => [start, start + 1, start + 2, start + 3]).filter((index) => blocks[index]?.type === "paragraph");
      const cards = firstGroups.map((start) => card(
        (blocks[start] as Extract<StaticBlock, { type: "paragraph" }>).text,
        (blocks[start + 2] as Extract<StaticBlock, { type: "paragraph" }>).text,
        (blocks[start + 1] as Extract<StaticBlock, { type: "paragraph" }>).text,
        (blocks[start + 3] as Extract<StaticBlock, { type: "paragraph" }>).text,
      ));
      return { cards, coveredIndexes: covered, variant: "compact" };
    }
  }

  return null;
}
