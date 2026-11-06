import type { ReactNode } from "react";
import { PreviewSectionBadge, PreviewSectionHeading } from "./PreviewContentPrimitives";
import { capitalizeHeading } from "./text";
import styles from "./SharedPreviewContent.module.css";

type BadgeIcon = "layers" | "faq" | "settings" | "data";

export default function SharedPreviewSection({ id, badge, badgeIcon = "layers", heading, description, children, className = "", accentWords = 2 }: { id: string; badge?: string; badgeIcon?: BadgeIcon; heading?: string; description?: string; children: ReactNode; className?: string; accentWords?: number }) {
  return <section className={`${styles.section} ${className}`} id={id}>
    {badge ? <PreviewSectionBadge icon={badgeIcon}>{badge}</PreviewSectionBadge> : null}
    {heading ? <PreviewSectionHeading title={capitalizeHeading(heading)} accentWords={accentWords} /> : null}
    {description ? <p className={styles.sectionDescription}>{description}</p> : null}
    <div className={styles.sectionBlocks}>{children}</div>
  </section>;
}
