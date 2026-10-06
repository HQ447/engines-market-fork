"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  FiArrowRight,
  FiTruck,
  FiTool,
  FiShield,
  FiChevronDown,
} from "react-icons/fi";
import type { EngineBuyingGuideSectionData } from "@/types/engine-page";
import styles from "./NewDocEngine.module.css";
import SectionHeading from "./SectionHeading";

type Props = {
  data: EngineBuyingGuideSectionData;
  engineCode: string;
  engineImage?: string;
  backgroundImage?: string;
};

const ctaWordLimit = 4;

function getShortCtaLabel(label: string) {
  const words = label.trim().split(/\s+/);

  return words.length > ctaWordLimit
    ? `${words.slice(0, ctaWordLimit).join(" ")}…`
    : label;
}

function ExpandableValueNote({ note }: { note: string }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const noteRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth <= 620);

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    const noteElement = noteRef.current;
    if (!noteElement || !isMobile) {
      setHasOverflow(false);
      return;
    }

    const checkOverflow = () => {
      const computed = window.getComputedStyle(noteElement);
      const lineHeight = parseFloat(computed.lineHeight);
      const fontSize = parseFloat(computed.fontSize);
      const effectiveLineHeight = Number.isNaN(lineHeight)
        ? fontSize * 1.35
        : lineHeight;

      noteElement.classList.remove(styles.clampValueNote);
      const fullHeight = noteElement.scrollHeight;
      noteElement.classList.toggle(styles.clampValueNote, !isExpanded);

      setHasOverflow(fullHeight > effectiveLineHeight * 6 + 2);
    };

    checkOverflow();

    window.addEventListener("resize", checkOverflow);
    if (document.fonts) {
      document.fonts.ready.then(checkOverflow);
    }

    return () => window.removeEventListener("resize", checkOverflow);
  }, [isExpanded, isMobile, note]);

  return (
    <div className={styles.valueNoteCopy}>
      <p
        ref={noteRef}
        className={isMobile && !isExpanded ? styles.clampValueNote : undefined}
      >
        <strong>Vehicle value considerations</strong>
        {note}
      </p>
      {isMobile && hasOverflow ? (
        <button
          type="button"
          className={`${styles.expandInlineButton} ${
            styles.valueNoteExpandButton
          } ${
            isExpanded ? styles.expandCopyButtonOpen : ""
          }`}
          onClick={() => setIsExpanded((expanded) => !expanded)}
          aria-expanded={isExpanded}
          aria-label={
            isExpanded
              ? "Show less vehicle value information"
              : "Show more vehicle value information"
          }
        >
          <FiChevronDown aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

export default function EngineBuyingGuide({
  data,
  engineCode,
  engineImage,
  backgroundImage,
}: Props) {
  const [visibleCount, setVisibleCount] = useState(3);
  const [offset, setOffset] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [overflowCards, setOverflowCards] = useState<Record<number, boolean>>(
    {},
  );
  const pRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const update = () =>
      setVisibleCount(
        window.innerWidth < 621 ? 1 : window.innerWidth < 921 ? 2 : 3,
      );
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxOffset = Math.max(0, data.options.length - visibleCount);
  const currentOffset = Math.min(offset, maxOffset);

  // Reliably detect if text exceeds 6 lines
  useEffect(() => {
    const checkOverflow = () => {
      const map: Record<number, boolean> = {};
      pRefs.current.forEach((el, index) => {
        if (el) {
          map[index] = el.scrollHeight > el.clientHeight + 1;
        }
      });
      setOverflowCards(map);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [data.options]);

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      className={styles.buyingSection}
      style={
        backgroundImage
          ? ({ "--buying-bg": `url("${backgroundImage}")` } as React.CSSProperties)
          : undefined
      }
      aria-labelledby={`${engineCode.toLowerCase()}-buying-title`}
    >
      <div className={styles.sectionContainer}>
        <p className={styles.eyebrow}>{data.tag}</p>
        <h2 id={`${engineCode.toLowerCase()}-buying-title`}>
          <SectionHeading title={data.title} accentFrom="What to Choose" />
        </h2>

        <div className={styles.sliderControls}>
          <button
            type="button"
            onClick={() => setOffset(Math.max(0, currentOffset - 1))}
            disabled={currentOffset === 0}
            aria-label="Previous buying option"
          >
            <FiArrowRight className={styles.previousArrow} />
          </button>
          <button
            type="button"
            onClick={() => setOffset(Math.min(maxOffset, currentOffset + 1))}
            disabled={currentOffset >= maxOffset}
            aria-label="Next buying option"
          >
            <FiArrowRight />
          </button>
        </div>

        <div className={styles.buyingViewport}>
          <div
            className={styles.buyingTrack}
            style={{
              transform: `translateX(calc(-${currentOffset} * (100% + 14px) / ${visibleCount}))`,
            }}
          >
            {data.options.map((option, index) => {
              const isExpanded = expandedIndex === index;
              const hasMore = overflowCards[index] || isExpanded;

              return (
                <article
                  className={`${styles.buyingCard} ${
                    index === 1 ? styles.recommended : ""
                  } ${index === 2 ? styles.blueButtonCard : ""}`}
                  key={option.label}
                >
                  {index === 1 ? (
                    <span className={styles.recommendedBadge}>Recommended</span>
                  ) : null}

                  <div className={styles.buyingCardContent}>
                    <h3>{option.label}</h3>
                    <div className={styles.expandableCopy}>
                      <p
                        ref={(el) => {
                          pRefs.current[index] = el;
                        }}
                        className={!isExpanded ? styles.clampSix : undefined}
                      >
                        {option.body}
                      </p>
                      {hasMore && (
                        <button
                          type="button"
                          className={`${styles.expandInlineButton} ${
                            isExpanded ? styles.expandCopyButtonOpen : ""
                          }`}
                          onClick={() => toggleExpand(index)}
                          aria-label={`Toggle description for ${option.label}`}
                        >
                          <FiChevronDown aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>

                  <a className={styles.buyingCardCta} href={option.href}>
                    View {option.label} engines <FiArrowRight />
                  </a>
                </article>
              );
            })}
          </div>
        </div>

        <div className={styles.supplyStrip}>
          <FiTool />
          <p>
            <strong>Supply &amp; fit available</strong>
            {data.supplyFitLine}
          </p>
          <span>
            <FiTruck />
            Nationwide delivery
          </span>
          <span>
            <FiShield />
            12-month warranty
          </span>
        </div>

        <div className={styles.valueStrip}>
          <FiTool />
          <ExpandableValueNote note={data.vehicleValueNote} />
          <a
            className={styles.valueCta}
            href="#quote-form"
            aria-label={data.cta}
            title={data.cta}
          >
            {getShortCtaLabel(data.cta)} <FiArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
