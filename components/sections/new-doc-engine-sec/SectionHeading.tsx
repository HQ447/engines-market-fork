import styles from "./NewDocEngine.module.css";

type Props = { title: string; accentFrom?: string };

export default function SectionHeading({ title, accentFrom }: Props) {
  if (accentFrom) {
    const start = title.toLocaleLowerCase().indexOf(accentFrom.toLocaleLowerCase());
    if (start >= 0) {
      return <>{title.slice(0, start)}<span className={styles.headingAccent}>{title.slice(start)}</span></>;
    }
  }
  const parts = title.split(/\s+[—-]\s+/);
  if (parts.length < 2) return title;
  return <>{parts[0]} <span className={styles.headingAccent}>{parts.slice(1).join(" — ")}</span></>;
}
