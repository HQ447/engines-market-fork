"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  FiActivity,
  FiArrowRight,
  FiCheckCircle,
  FiChevronDown,
  FiSettings,
  FiTool,
} from "react-icons/fi";
import type { EngineFailuresSectionData } from "@/types/engine-page";
import styles from "./NewDocEngine.module.css";
import SectionHeading from "./SectionHeading";

type Props = {
  data: EngineFailuresSectionData;
  engineCode: string;
  backgroundImage?: string;
};

const fallbackImages = [
  "/case-studies/assets/borescope-valves-pistons.png",
  "/case-studies/assets/injector-carbon.png",
  "/case-studies/assets/twin-turbo-debris.png",
];

function ctaLabel(value: string) {
  return value
    .replace(/^\[/, "")
    .replace(/\]\(#\)$/, "")
    .trim();
}

type FailureItem = EngineFailuresSectionData["items"][number];

function ExpandableGoodToKnow({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const copyRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const element = copyRef.current;
    if (!element) return;

    const checkOverflow = () => {
      const wasClamped = element.classList.contains(styles.clampFour);
      if (wasClamped) element.classList.remove(styles.clampFour);

      const lineHeight = parseFloat(window.getComputedStyle(element).lineHeight);
      setHasOverflow(element.scrollHeight > lineHeight * 4 + 1);

      if (wasClamped) element.classList.add(styles.clampFour);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [text]);

  return (
    <div className={styles.goodToKnowCopy}>
      <p ref={copyRef} className={!isExpanded ? styles.clampFour : undefined}>
        <strong>Good to know</strong>
        {text}
      </p>
      {hasOverflow ? (
        <button
          type="button"
          className={`${styles.expandInlineButton} ${
            isExpanded ? styles.expandCopyButtonOpen : ""
          }`}
          onClick={() => setIsExpanded((expanded) => !expanded)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Show less information" : "Show more information"}
        >
          <FiChevronDown aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

function FailureCardItem({
  item,
  index,
}: {
  item: FailureItem;
  index: number;
}) {
  const image = item.image ?? fallbackImages[index % fallbackImages.length];
  const titleParts = item.title.split(" - ");

  // Independent state for "What happens"
  const [expandWhat, setExpandWhat] = useState(false);
  const [overflowWhat, setOverflowWhat] = useState(false);
  const whatRef = useRef<HTMLParagraphElement | null>(null);

  // Independent state for "Repair vs replace"
  const [expandRepair, setExpandRepair] = useState(false);
  const [overflowRepair, setOverflowRepair] = useState(false);
  const repairRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const checkOverflow = () => {
      // 4 lines at 15px with 1.42 line-height is ~85px
      if (whatRef.current) {
        const wasClamped = whatRef.current.classList.contains(styles.clampFour);
        if (wasClamped) whatRef.current.classList.remove(styles.clampFour);
        setOverflowWhat(whatRef.current.scrollHeight > 88);
        if (wasClamped) whatRef.current.classList.add(styles.clampFour);
      }

      if (repairRef.current) {
        const wasClamped = repairRef.current.classList.contains(
          styles.clampFour,
        );
        if (wasClamped) repairRef.current.classList.remove(styles.clampFour);
        setOverflowRepair(repairRef.current.scrollHeight > 88);
        if (wasClamped) repairRef.current.classList.add(styles.clampFour);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [item.whatHappens, item.repairVsReplace]);

  return (
    <article className={styles.failureCard}>
      <div className={styles.failureImage}>
        <Image src={image} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" />
        <span>{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className={styles.failureBody}>
        <h3>{titleParts[0]}</h3>

        <div className={styles.failureOnset}>
          <FiActivity />
          <span>
            <strong>Typical onset</strong>
            {item.onset.replace(/\s*\[PATTERN DATA.*$/, "")}
          </span>
        </div>

        {/* What happens block */}
        <div className={styles.failureDetail}>
          <FiSettings />
          <div className={styles.expandableCopy}>
            <p
              ref={whatRef}
              className={!expandWhat ? styles.clampFour : undefined}
            >
              <strong>What happens</strong>
              {item.whatHappens}
            </p>
            {overflowWhat && (
              <button
                type="button"
                className={`${styles.expandInlineButton} ${
                  expandWhat ? styles.expandCopyButtonOpen : ""
                }`}
                onClick={() => setExpandWhat((prev) => !prev)}
                aria-label="Toggle full details for What happens"
              >
                <FiChevronDown aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Repair vs replace block */}
        <div className={styles.failureDetail}>
          <FiTool />
          <div className={styles.expandableCopy}>
            <p
              ref={repairRef}
              className={!expandRepair ? styles.clampFour : undefined}
            >
              <strong>Repair vs replace</strong>
              {item.repairVsReplace}
            </p>
            {overflowRepair && (
              <button
                type="button"
                className={`${styles.expandInlineButton} ${
                  expandRepair ? styles.expandCopyButtonOpen : ""
                }`}
                onClick={() => setExpandRepair((prev) => !prev)}
                aria-label="Toggle full details for Repair vs replace"
              >
                <FiChevronDown aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function EngineFailures({
  data,
  engineCode,
  backgroundImage,
}: Props) {
  const [visibleCount, setVisibleCount] = useState(3);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const update = () =>
      setVisibleCount(
        window.innerWidth < 621 ? 1 : window.innerWidth < 921 ? 2 : 3,
      );
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxOffset = Math.max(0, data.items.length - visibleCount);
  const currentOffset = Math.min(offset, maxOffset);

  return (
    <section
      className={styles.failuresSection}
      style={
        backgroundImage
          ? ({ "--failures-bg": `url("${backgroundImage}")` } as React.CSSProperties)
          : undefined
      }
      aria-labelledby={`${engineCode.toLowerCase()}-failures-title`}
    >
      <div className={styles.sectionContainer}>
        <p className={styles.eyebrowLight}>{data.tag}</p>
        <h2 id={`${engineCode.toLowerCase()}-failures-title`}>
          <SectionHeading title={data.title} accentFrom="What Actually Fails" />
        </h2>
        <p className={styles.failureHandwriting} aria-hidden="true">
          Know the issues.
          <br />
          Drive with confidence.
        </p>

        <div className={styles.sliderControls}>
          <button
            type="button"
            onClick={() => setOffset(Math.max(0, currentOffset - 1))}
            disabled={currentOffset === 0}
            aria-label="Previous engine problem"
          >
            <FiArrowRight className={styles.previousArrow} />
          </button>
          <button
            type="button"
            onClick={() => setOffset(Math.min(maxOffset, currentOffset + 1))}
            disabled={currentOffset >= maxOffset}
            aria-label="Next engine problem"
          >
            <FiArrowRight />
          </button>
        </div>

        <div className={styles.failureViewport}>
          <div
            className={styles.failureTrack}
            style={{
              transform: `translateX(calc(-${currentOffset} * (100% + 14px) / ${visibleCount}))`,
            }}
          >
            {data.items.map((item, index) => (
              <FailureCardItem
                key={`${item.title}-${index}`}
                item={item}
                index={index}
              />
            ))}
          </div>
        </div>

        <div className={styles.failureFooter}>
          <div>
            <FiCheckCircle />
            <ExpandableGoodToKnow text={data.goodYearsLine} />
          </div>
          <a href="#quote-form">
            {ctaLabel(data.cta)} <FiArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
