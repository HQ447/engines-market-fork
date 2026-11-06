import { PreviewSectionBadge, PreviewSectionHeading } from "./PreviewContentPrimitives";
import styles from "./SharedQuoteCtaSection.module.css";

export default function SharedQuoteCtaSection({ id, title, description, paragraphs, badge }: { id: string; title: string; description?: string; paragraphs: string[]; badge?: string }) {
  const evidence = paragraphs[0];
  const action = paragraphs[1] ?? "Get your personalised price";
  const supporting = paragraphs.slice(2);
  const trustBadges = supporting.flatMap((text) => /\s·\s/.test(text) ? text.split(/\s*·\s*/).filter(Boolean) : []);
  const instructions = supporting.filter((text) => !/\s·\s/.test(text));

  return <section className={styles.section} id={id}>
    {badge ? <PreviewSectionBadge icon="layers">{badge}</PreviewSectionBadge> : null}
    <PreviewSectionHeading title={title} accentWords={3} className={styles.heading} />
    {description ? <p className={styles.description}>{description}</p> : null}
    {evidence ? <p className={styles.evidence}>{evidence}</p> : null}
    <a className={styles.button} href="#quote-form" data-quote-trigger="true">{action}</a>
    {instructions.map((instruction) => <p className={styles.instruction} key={instruction}>{instruction}</p>)}
    {trustBadges.length ? <div className={styles.badges}>{trustBadges.map((item) => <span key={item}>{item}</span>)}</div> : null}
  </section>;
}
