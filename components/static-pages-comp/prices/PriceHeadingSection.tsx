import type { StaticBlock } from "@/lib/staticPagePreview";
import styles from "./PricePageContent.module.css";
import { capitalizeHeading } from "../shared/text";
type HeadingBlock = Extract<StaticBlock, { type: "heading" }>;
export default function PriceHeadingSection({ block, variant }: { block: HeadingBlock; variant?: "included" }) {
  const text = capitalizeHeading(block.text.replace(/^[\s\u{1F300}-\u{1FAFF}\u2600-\u27BF\uFE0F]+/u, "").trim());
  if (block.level === "h3" && variant === "included") {
    const isExcluded = /not included/i.test(text);
    return <h3 id={block.id || undefined} className={`${styles.inclusionHeading} ${isExcluded ? styles.inclusionHeadingExcluded : ""}`}>{text}</h3>;
  }
  return block.level === "h3" ? <h3 id={block.id || undefined} className="mt-5 text-[clamp(1.2rem,2.4vw,2rem)] font-black leading-[1.03] tracking-[-0.04em] text-[#071936]">{text}</h3> : <h4 id={block.id || undefined} className="mt-4 text-[clamp(1rem,1.8vw,1.35rem)] font-extrabold leading-tight text-[#0a2952]">{text}</h4>;
}

