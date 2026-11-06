import type { StaticFaq, StaticTable } from "@/lib/staticPagePreview";
import Image from "next/image";
import type { IconType } from "react-icons";
import { FiAlertTriangle, FiBarChart2, FiBox, FiCalendar, FiClock, FiCpu, FiDisc, FiDollarSign, FiDroplet, FiFileText, FiGrid, FiInfo, FiLayers, FiMapPin, FiNavigation, FiPackage, FiSearch, FiSettings, FiShield, FiSliders, FiTag, FiTarget, FiTool, FiTrendingUp, FiTruck, FiWind } from "react-icons/fi";
import styles from "./PreviewContentPrimitives.module.css";
import { capitalizeHeading } from "./text";

export type PreviewCard = {
  title: string;
  text: string;
  highlight: string;
  meta: string;
  icon?: string;
  href?: string;
  items?: string[];
};

export type PreviewCardVariant = "standard" | "condition" | "compact" | "metric" | "included" | "excluded" | "value" | "question";

function metricDetails(card: PreviewCard) {
  const source = `${card.highlight} ${card.meta}`.trim();
  const verified = source.match(/\[?(?:EM-VERIFIED|THIRD-PARTY)[^\]]*\]?[^\n]*/i)?.[0] ?? "";
  const value = card.highlight.replace(/\s*\[?(?:EM-VERIFIED|THIRD-PARTY)[^\]]*\]?[^\n]*/i, "").trim() || card.meta.replace(/\s*\[?(?:EM-VERIFIED|THIRD-PARTY)[^\]]*\]?[^\n]*/i, "").trim();
  const title = card.title || "Market insight";
  const label = /(?:time|day|delivery|timeline)/i.test(title) ? "Delivery speed" : /(?:rate|cost|price|value)/i.test(title) ? "Market data" : "Engine type";
  return { label, title, value, verified };
}

function BadgeIcon({ type = "layers" }: { type?: "layers" | "faq" | "settings" | "data" | "shield" | "link" | "chart" }) {
  if (type === "faq") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-7l-4.5 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /><path d="M8 9h8M8 12h5" /></svg>;
  if (type === "settings") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a8 8 0 0 0-1.8-1L14.4 3h-4.8l-.4 3.1a8 8 0 0 0-1.8 1l-2.4-1-2 3.4L5.1 11a7 7 0 0 0 0 2L3 14.5l2 3.4 2.4-1a8 8 0 0 0 1.8 1l.4 3.1h4.8l.4-3.1a8 8 0 0 0 1.8-1l2.4 1 2-3.4L18.9 13a7 7 0 0 0 .1-1Z" /></svg>;
  if (type === "data") return <svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" /></svg>;
  if (type === "shield") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 20 6v5.5c0 4.8-3.1 7.8-8 9.5-4.9-1.7-8-4.7-8-9.5V6l8-3Z" /><path d="m8.5 12 2.1 2.1L15.7 9" /></svg>;
  if (type === "link") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 13.9 4-3.8M8 17l-1.6 1.5a4 4 0 0 1-5.6-5.7L5 8.7A4 4 0 0 1 10.6 8M16 7l1.6-1.5a4 4 0 0 1 5.6 5.7L19 15.3a4 4 0 0 1-5.6.7" /></svg>;
  if (type === "chart") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></svg>;
}

export function PreviewSectionBadge({ children, icon = "layers" }: { children: string; icon?: "layers" | "faq" | "settings" | "data" }) {
  const isLong = children.length > 48 || children.trim().split(/\s+/).length > 7;
  return <p className={isLong ? styles.sectionKicker : styles.sectionBadge} title={children}><span aria-hidden="true"><BadgeIcon type={icon} /></span>{children}</p>;
}

export function PreviewSectionHeading({ title, accentWords = 2, className = "" }: { title: string; accentWords?: number; className?: string }) {
  const words = capitalizeHeading(title).trim().split(/\s+/);
  const count = Math.min(accentWords, words.length);
  const prefix = words.slice(0, -count).join(" ");
  const accent = words.slice(-count).join(" ");
  return <h2 className={`${styles.sectionHeading} ${className}`}>{prefix ? `${prefix} ` : null}<span>{accent}</span></h2>;
}

export function PreviewCardGrid({ cards, variant = "standard" }: { cards: PreviewCard[]; variant?: PreviewCardVariant }) {
  const conditionIcons = [FiTruck, FiSettings, FiTool, FiLayers, FiShield];
  const includedIcons = [FiBox, FiTool, FiPackage, FiDroplet, FiShield, FiSettings];
  const excludedIcons = [FiDisc, FiDroplet, FiWind, FiTool, FiSettings, FiSearch, FiTruck, FiNavigation];
  return (
    <div className={`${styles.cardGrid} ${styles[`cards_${variant}`]}`}>
      {cards.map((card, index) => {
        const text = card.text.replace(card.title, "").replace(card.highlight, "").trim();
        const ConditionIcon = conditionIcons[index % conditionIcons.length];
        const displayIcon = variant === "condition" || variant === "compact" || variant === "value" || variant === "question" || variant === "included" || variant === "excluded" ? null : card.icon;
        const IncludedIcon = includedIcons[index % includedIcons.length];
        const ExcludedIcon = excludedIcons[index % excludedIcons.length];
        const questionMatch = card.title.match(/^(?:question\s*)?(\d+)\.?\s*(.*)$/i);
        const metric = variant === "metric" ? metricDetails(card) : null;
        const cardContent = (
        <article className={styles.card} key={`${card.title}-${index}`}>
          {variant === "condition" ? <div className={styles.cardVisual}><Image className={styles.engineVisualImage} src="/images/engines/skeleton-transparent.png" alt="" width={1168} height={776} /></div> : null}
          <div className={styles.cardBody}>
            {metric ? <>
              <p className={styles.metricLabel}>{metric.label}</p>
              <h3 className={styles.metricTitle}>{metric.title}</h3>
              {metric.value ? <p className={styles.metricValue}>{metric.value}</p> : null}
              {metric.verified ? <p className={styles.metricVerified}>{metric.verified}</p> : null}
              <span className={styles.metricTrend} aria-hidden="true" />
            </> : <>
            <div className={styles.cardTitleRow}>
              {variant === "condition" ? <span className={styles.cardIcon} aria-hidden="true"><ConditionIcon /></span> : null}
              {variant === "included" ? <span className={styles.inclusionIcon} aria-hidden="true"><IncludedIcon /></span> : null}
              {variant === "excluded" ? <span className={styles.inclusionIcon} aria-hidden="true"><ExcludedIcon /></span> : null}
              {variant === "question" && questionMatch ? <span className={styles.questionNumber} aria-hidden="true">{questionMatch[1].padStart(2, "0")}</span> : null}
              {displayIcon ? <span className={styles.cardIcon} aria-hidden="true">{displayIcon}</span> : null}
              {card.title ? <h3>{variant === "question" && questionMatch ? questionMatch[2] || card.title : card.title}</h3> : null}
            </div>
            {card.highlight ? <p className={styles.cardHighlight}>{card.highlight}</p> : null}
            </>}
            {!metric && (card.items?.length ? <ul>{card.items.map((item) => <li key={item}>{item}</li>)}</ul> : text ? <p className={styles.cardText}>{text}</p> : null)}
            {!metric && card.meta ? <p className={styles.cardMeta}>{card.meta}</p> : null}
          </div>
        </article>
      );
        return card.href ? <a className={styles.cardLink} href={card.href} key={`${card.title}-${index}`}>{cardContent}</a> : cardContent;
      })}
    </div>
  );
}

export function PreviewDataTable({ table }: { table: StaticTable }) {
  const priceColumnIndexes = table.headers.reduce<number[]>((indexes, header, index) => {
    return /(?:price|cost|amount|value|quote\s*range|£)/i.test(header) ? [...indexes, index] : indexes;
  }, []);

  function getHeaderIcon(header: string): IconType | null {
    const normalized = header.toLowerCase();
    if (/region|location|area/.test(normalized)) return FiMapPin;
    if (/year|date/.test(normalized)) return FiCalendar;
    if (/warranty|guarantee/.test(normalized)) return FiShield;
    if (/best for|suitability|recommended/.test(normalized)) return FiTarget;
    if (/market share|trend|average|percentage|%/.test(normalized)) return FiBarChart2;
    if (/labou?r hours|duration|timeline|time/.test(normalized)) return FiClock;
    if (/impact|change|difference/.test(normalized)) return FiTrendingUp;
    if (/price|cost|amount|value|quote range|£/.test(normalized)) return FiDollarSign;
    if (/fuel|petrol|diesel|hybrid|electric/.test(normalized)) return FiDroplet;
    if (/vehicle type|vehicle|car/.test(normalized)) return FiTruck;
    if (/example models|model/.test(normalized)) return FiGrid;
    if (/engine code|code/.test(normalized)) return FiCpu;
    if (/engine size|size|spec/.test(normalized)) return FiSliders;
    if (/repair|service|work|garage|dealer|specialist|tier|involves/.test(normalized)) return FiTool;
    if (/issue|problem|failure|symptom|warning/.test(normalized)) return FiAlertTriangle;
    if (/condition|option|type/.test(normalized)) return FiLayers;
    if (/supplier|source|brand|manufacturer/.test(normalized)) return FiTag;
    if (/notes|detail|information/.test(normalized)) return FiFileText;
    if (/search|find/.test(normalized)) return FiSearch;
    if (/settings|configuration/.test(normalized)) return FiSettings;
    if (/info|description/.test(normalized)) return FiInfo;
    return null;
  }

  return (
    <div className={styles.tableScroller} tabIndex={0} role="region" aria-label="Scrollable comparison table">
      <table className={styles.table}>
        {table.headers.length ? <thead><tr>{table.headers.map((header) => { const HeaderIcon = getHeaderIcon(header); return <th scope="col" key={header}><span className={styles.tableHeaderContent}>{HeaderIcon ? <HeaderIcon className={styles.tableHeaderIcon} aria-hidden="true" /> : null}<span>{capitalizeHeading(header)}</span></span></th>; })}</tr></thead> : null}
        <tbody>{table.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => {
          const isPrice = cellIndex > 0 && /£[\d,]/.test(cell);
          const headerPriceOrdinal = priceColumnIndexes.indexOf(cellIndex);
          const fallbackPriceOrdinal = row.slice(1, cellIndex).filter((value) => /£[\d,]/.test(value)).length;
          // Use the price column, rather than only values in the current row. A
          // blank first price prevents the second price from accidentally green.
          const mutedPrice = priceColumnIndexes.length > 1 ? headerPriceOrdinal % 2 === 1 : fallbackPriceOrdinal % 2 === 1;
          return <td key={cellIndex}>{cellIndex === 0 ? <span className={styles.rowLabel}>{cell}</span> : isPrice ? <strong className={`${styles.valuePill} ${mutedPrice ? styles.valuePillMuted : ""}`}>{cell}</strong> : cell}</td>;
        })}</tr>)}</tbody>
      </table>
    </div>
  );
}

function cleanQuestion(question: string) {
  return question.replace(/\s*\+\s*$/, "").trim();
}

export function PreviewFaqItem({ faq, open = false }: { faq: StaticFaq; open?: boolean }) {
  return <details className={styles.faqItem} open={open}>
    <summary><span>{cleanQuestion(faq.question)}</span><span className={styles.faqToggle} aria-hidden="true" /></summary>
    <div className={styles.faqAnswer}><p>{faq.answer}</p></div>
  </details>;
}

export function PreviewFaqGrid({ title, faqs }: { title: string; faqs: StaticFaq[] }) {
  const midpoint = Math.ceil(faqs.length / 2);
  const columns = [faqs.slice(0, midpoint), faqs.slice(midpoint)];
  return (
    <section className={styles.faqPanel} aria-labelledby="price-preview-faq-title">
      <PreviewSectionBadge icon="faq">Frequently asked questions</PreviewSectionBadge>
      <PreviewSectionHeading title={title} accentWords={3} />
      <div className={styles.faqGrid}>
        {columns.map((column, columnIndex) => <div className={styles.faqColumn} key={columnIndex}>{column.map((faq, index) => <PreviewFaqItem faq={faq} open={columnIndex === 0 && index === 0} key={faq.question} />)}</div>)}
      </div>
    </section>
  );
}

export type MethodologyItem = { label: string; description: string };

export function PreviewMethodology({ summary, items, review }: { summary: string; items: MethodologyItem[]; review: string }) {
  if (!summary && !items.length) return null;
  const methodologyIcons = ["shield", "data", "link", "chart"] as const;
  return (
    <section className={styles.methodology} aria-label="About this data and methodology">
      <PreviewSectionBadge icon="data">About this data · our methodology</PreviewSectionBadge>
      {summary ? <p className={styles.methodologySummary}>{summary}</p> : null}
      <div className={styles.methodologyGrid}>{items.map((item, index) => <article className={styles.methodologyCard} key={item.label}><div className={`${styles.methodologyTag} ${index % 2 === 0 ? styles.methodologyTagGreen : ""}`}><span><BadgeIcon type={methodologyIcons[index % methodologyIcons.length]} /></span>{item.label}</div><p>{item.description}</p></article>)}</div>
      {review ? <p className={styles.reviewBar}>{review}</p> : null}
    </section>
  );
}
