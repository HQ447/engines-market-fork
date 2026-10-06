"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiArrowRight, FiInfo, FiChevronDown } from "react-icons/fi";
import type { EngineRelatedSectionData } from "@/types/engine-page";
import styles from "./NewDocEngine.module.css";
import SectionHeading from "./SectionHeading";

type Props = {
  data: EngineRelatedSectionData;
  engineCode: string;
  engineImage?: string;
  backgroundImage?: string;
};

type RelatedItem = EngineRelatedSectionData["items"][number];

const buttonLabelWordLimit = 3;
const titleWordLimit = 3;

function getWordClampedLabel(label: string, wordLimit: number) {
  const words = label.trim().split(/\s+/);

  return words.length > wordLimit
    ? `${words.slice(0, wordLimit).join(" ")}…`
    : label;
}

function RelatedCardItem({
  item,
  engineImage,
}: {
  item: RelatedItem;
  engineImage?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isTitleExpanded, setIsTitleExpanded] = useState(false);
  const pRef = useRef<HTMLParagraphElement | null>(null);
  const titleWords = item.code.trim().split(/\s+/);
  const hasLongTitle = item.code !== "none" && titleWords.length > titleWordLimit;

  useEffect(() => {
    const el = pRef.current;
    if (!el) return;

    const check = () => {
      const wasClamped = el.classList.contains(styles.clampFive);
      if (wasClamped) el.classList.remove(styles.clampFive);

      const fullHeight = el.scrollHeight;

      if (wasClamped) el.classList.add(styles.clampFive);

      const lineHeight = parseFloat(window.getComputedStyle(el).lineHeight);
      setHasOverflow(fullHeight > lineHeight * 5 + 1);
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [item.description]);

  return (
    <article className={styles.relatedCard}>
      <span className={styles.relation}>{item.relation}</span>

      {engineImage && item.code !== "none" ? (
        <Image src={engineImage} alt="" width={108} height={84} />
      ) : null}

      <h3
        title={item.code === "none" ? "None" : item.code}
        className={hasLongTitle ? styles.relatedTitleExpandable : undefined}
        role={hasLongTitle ? "button" : undefined}
        tabIndex={hasLongTitle ? 0 : undefined}
        aria-expanded={hasLongTitle ? isTitleExpanded : undefined}
        onClick={
          hasLongTitle
            ? () => setIsTitleExpanded((expanded) => !expanded)
            : undefined
        }
        onKeyDown={
          hasLongTitle
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setIsTitleExpanded((expanded) => !expanded);
                }
              }
            : undefined
        }
      >
        {item.code === "none"
          ? "None"
          : isTitleExpanded
            ? item.code
            : titleWords.slice(0, titleWordLimit).join(" ")}
        {hasLongTitle ? <span>{isTitleExpanded ? " Show less" : "…"}</span> : null}
      </h3>
      <strong>
        {item.code === "none"
          ? "First in UK range"
          : item.relation === "Successor"
            ? "Direct replacement"
            : "Related engine"}
      </strong>

      <div className={styles.expandableCopy}>
        <p ref={pRef} className={!isExpanded ? styles.clampFive : undefined}>
          {item.description}
        </p>

        {hasOverflow && (
          <button
            type="button"
            className={`${styles.expandInlineButton} ${
              isExpanded ? styles.expandCopyButtonOpen : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              setIsExpanded((prev) => !prev);
            }}
            aria-label={`Toggle description for ${item.code}`}
          >
            <span>{isExpanded ? "Show less" : "…"}</span>
          </button>
        )}
      </div>

      {item.code !== "none" ? (
        <Link
          href={item.href}
          aria-label={`View ${item.code}`}
          title={`View ${item.code}`}
        >
          View {getWordClampedLabel(item.code, buttonLabelWordLimit)}{" "}
          <FiArrowRight />
        </Link>
      ) : (
        <button type="button" className={styles.relatedButtonDisabled} disabled>
          No direct variant <FiArrowRight />
        </button>
      )}
    </article>
  );
}

export default function EngineRelated({
  data,
  engineCode,
  engineImage,
  backgroundImage,
}: Props) {
  const [visibleCount, setVisibleCount] = useState(4);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const update = () =>
      setVisibleCount(
        window.innerWidth < 621 ? 1 : window.innerWidth < 921 ? 2 : 4,
      );
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxOffset = Math.max(0, data.items.length - visibleCount);
  const currentOffset = Math.min(offset, maxOffset);

  return (
    <section
      className={styles.relatedSection}
      style={
        backgroundImage
          ? ({ "--related-bg": `url("${backgroundImage}")` } as React.CSSProperties)
          : undefined
      }
      aria-labelledby={`${engineCode.toLowerCase()}-related-title`}
    >
      <div className={styles.sectionContainer}>
        <p className={styles.eyebrow}>{data.tag}</p>
        <h2 id={`${engineCode.toLowerCase()}-related-title`}>
          <SectionHeading title={data.title} accentFrom={engineCode} />
        </h2>
        <p className={styles.sectionIntro}>
          Review related engine codes and confirm the exact fitment before
          ordering a replacement.
        </p>
        <div className={styles.sliderControls}>
          <button
            type="button"
            onClick={() => setOffset(Math.max(0, currentOffset - 1))}
            disabled={currentOffset === 0}
            aria-label="Previous related engine"
          >
            <FiArrowRight className={styles.previousArrow} />
          </button>
          <button
            type="button"
            onClick={() => setOffset(Math.min(maxOffset, currentOffset + 1))}
            disabled={currentOffset >= maxOffset}
            aria-label="Next related engine"
          >
            <FiArrowRight />
          </button>
        </div>
        <div className={styles.relatedViewport}>
          <div
            className={styles.relatedTrack}
            style={{
              transform: `translateX(calc(-${currentOffset} * (100% + 14px) / ${visibleCount}))`,
            }}
          >
            {data.items.map((item, index) => (
              <RelatedCardItem
                key={`${item.code}-${item.relation}-${index}`}
                item={item}
                engineImage={engineImage}
              />
            ))}
          </div>
        </div>
        <div className={styles.relatedNote}>
          <FiInfo />
          <p>
            <strong>Important note:</strong> Always match the full {engineCode}
            engine code with your vehicle before ordering.
          </p>
        </div>
      </div>
    </section>
  );
}
