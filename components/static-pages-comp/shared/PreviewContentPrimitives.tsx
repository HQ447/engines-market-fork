import type { StaticFaq, StaticTable } from "@/lib/staticPagePreview";
import { FiLayers, FiSettings, FiShield, FiTool, FiTruck } from "react-icons/fi";
import styles from "./PreviewContentPrimitives.module.css";

export type PreviewCard = {
  title: string;
  text: string;
  highlight: string;
  meta: string;
  icon?: string;
  href?: string;
  items?: string[];
};

export type PreviewCardVariant = "standard" | "condition" | "compact" | "metric";

function BadgeIcon({ type = "layers" }: { type?: "layers" | "faq" | "settings" | "data" }) {
  if (type === "faq") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-7l-4.5 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /><path d="M8 9h8M8 12h5" /></svg>;
  if (type === "settings") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a8 8 0 0 0-1.8-1L14.4 3h-4.8l-.4 3.1a8 8 0 0 0-1.8 1l-2.4-1-2 3.4L5.1 11a7 7 0 0 0 0 2L3 14.5l2 3.4 2.4-1a8 8 0 0 0 1.8 1l.4 3.1h4.8l.4-3.1a8 8 0 0 0 1.8-1l2.4 1 2-3.4L18.9 13a7 7 0 0 0 .1-1Z" /></svg>;
  if (type === "data") return <svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></svg>;
}

export function PreviewSectionBadge({ children }: { children: string; icon?: "layers" | "faq" | "settings" | "data" }) {
  return <p className={styles.sectionBadge}>{children}</p>;
}

export function PreviewSectionHeading({ title, accentWords = 2 }: { title: string; accentWords?: number }) {
  const words = title.trim().split(/\s+/);
  const count = Math.min(accentWords, words.length);
  const prefix = words.slice(0, -count).join(" ");
  const accent = words.slice(-count).join(" ");
  return <h2 className={styles.sectionHeading}>{prefix ? `${prefix} ` : null}<span>{accent}</span></h2>;
}

function EngineGlyph() {
  return (
    <svg className={styles.engineGlyph} viewBox="0 0 180 105" aria-hidden="true">
      <path d="M32 36 55 15h64l20 17 18 2v47l-17 8H51L27 74V44l5-8Z" />
      <path d="M50 35h75v39H50zM64 35V20m19 15V20m19 15V20m19 15V24M36 48h14M36 63h14M125 44h20v23h-20" />
      <circle cx="63" cy="76" r="14" /><circle cx="63" cy="76" r="6" /><circle cx="111" cy="76" r="14" /><circle cx="111" cy="76" r="6" />
      <path d="M48 27h79M71 47h42M71 57h42" />
    </svg>
  );
}

export function PreviewCardGrid({ cards, variant = "standard" }: { cards: PreviewCard[]; variant?: PreviewCardVariant }) {
  const conditionIcons = [FiTruck, FiSettings, FiTool, FiLayers, FiShield];
  return (
    <div className={`${styles.cardGrid} ${styles[`cards_${variant}`]}`}>
      {cards.map((card, index) => {
        const text = card.text.replace(card.title, "").replace(card.highlight, "").trim();
        const ConditionIcon = conditionIcons[index % conditionIcons.length];
        const displayIcon = variant === "condition" ? null : variant === "compact" ? null : card.icon;
        const cardContent = (
        <article className={styles.card} key={`${card.title}-${index}`}>
          {variant === "condition" ? <div className={styles.cardVisual}><EngineGlyph /></div> : null}
          <div className={styles.cardBody}>
            <div className={styles.cardTitleRow}>{variant === "condition" ? <span className={styles.cardIcon} aria-hidden="true"><ConditionIcon /></span> : displayIcon ? <span className={styles.cardIcon} aria-hidden="true">{displayIcon}</span> : null}{card.title ? <h3>{card.title}</h3> : null}</div>
            {card.highlight ? <p className={styles.cardHighlight}>{card.highlight}</p> : null}
            {card.items?.length ? <ul>{card.items.map((item) => <li key={item}>{item}</li>)}</ul> : text ? <p className={styles.cardText}>{text}</p> : null}
            {card.meta ? <p className={styles.cardMeta}>{card.meta}</p> : null}
          </div>
        </article>
      );
        return card.href ? <a className={styles.cardLink} href={card.href} key={`${card.title}-${index}`}>{cardContent}</a> : cardContent;
      })}
    </div>
  );
}

export function PreviewDataTable({ table }: { table: StaticTable }) {
  return (
    <div className={styles.tableScroller} tabIndex={0} role="region" aria-label="Scrollable comparison table">
      <table className={styles.table}>
        {table.headers.length ? <thead><tr>{table.headers.map((header) => <th scope="col" key={header}>{header}</th>)}</tr></thead> : null}
        <tbody>{table.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cellIndex === 0 ? <span className={styles.rowLabel}>{cell}</span> : /£[\d,]/.test(cell) ? <strong className={styles.valuePill}>{cell}</strong> : cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function cleanQuestion(question: string) {
  return question.replace(/\s*\+\s*$/, "").trim();
}

export function PreviewFaqGrid({ title, faqs }: { title: string; faqs: StaticFaq[] }) {
  const midpoint = Math.ceil(faqs.length / 2);
  const columns = [faqs.slice(0, midpoint), faqs.slice(midpoint)];
  return (
    <section className={styles.faqPanel} aria-labelledby="price-preview-faq-title">
      <PreviewSectionBadge icon="faq">Frequently asked questions</PreviewSectionBadge>
      <PreviewSectionHeading title={title} accentWords={3} />
      <div className={styles.faqGrid}>
        {columns.map((column, columnIndex) => <div className={styles.faqColumn} key={columnIndex}>{column.map((faq, index) => <details className={styles.faqItem} open={columnIndex === 0 && index === 0} key={faq.question}><summary><span>{cleanQuestion(faq.question)}</span><span className={styles.faqToggle} aria-hidden="true" /></summary><div className={styles.faqAnswer}><p>{faq.answer}</p></div></details>)}</div>)}
      </div>
    </section>
  );
}

export type MethodologyItem = { label: string; description: string };

export function PreviewMethodology({ summary, items, review }: { summary: string; items: MethodologyItem[]; review: string }) {
  if (!summary && !items.length) return null;
  return (
    <section className={styles.methodology} aria-label="About this data and methodology">
      <PreviewSectionBadge icon="data">About this data · our methodology</PreviewSectionBadge>
      {summary ? <p className={styles.methodologySummary}>{summary}</p> : null}
      <div className={styles.methodologyGrid}>{items.map((item, index) => <article className={styles.methodologyCard} key={item.label}><div className={`${styles.methodologyTag} ${index % 2 === 0 ? styles.methodologyTagGreen : ""}`}><span><BadgeIcon type={index % 2 === 0 ? "layers" : "data"} /></span>{item.label}</div><p>{item.description}</p></article>)}</div>
      {review ? <p className={styles.reviewBar}>{review}</p> : null}
    </section>
  );
}
