"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  FiArrowRight,
  FiBarChart2,
  FiClock,
  FiChevronDown,
  FiInfo,
  FiShield,
  FiTool,
} from "react-icons/fi";
import type { EngineCostGuideSectionData } from "@/types/engine-page";
import styles from "./NewDocEngine.module.css";
import SectionHeading from "./SectionHeading";
type Props = {
  data: EngineCostGuideSectionData;
  engineCode: string;
  image?: string;
};

function ctaLabel(value: string) {
  return value
    .replace(/^\[/, "")
    .replace(/\]\(#\)$/, "")
    .trim();
}

function ExpandableLabourLine({ text }: { text: string }) {
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
    <div className={styles.labourExpandable}>
      <p ref={copyRef} className={!isExpanded ? styles.clampFour : undefined}>
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
          aria-label={isExpanded ? "Show less labour information" : "Show more labour information"}
        >
          <FiChevronDown aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

export default function EngineCostGuide({
  data,
  engineCode,
  image = "/prices/img/hero3.png",
}: Props) {
  const estimateNotice = (data.paragraphs[0] ?? "Prices are estimates and may vary by supplier.")
    .replace(/^\(All figures\s*\.\s*/, "All figures are estimates — ")
    .replace(/\s*Fitted\s*=.*$/i, "")
    .trim();
  const labourLine = data.labourLine?.replace(/\s*\[PATTERN DATA.*$/, "") ?? "";
  return (
    <section
      className={styles.costSection}
      style={{ "--cost-bg": `url("${image}")` } as React.CSSProperties}
      aria-labelledby={`${engineCode.toLowerCase()}-prices-title`}
    >
      <div className={styles.sectionContainer}>
        <p className={styles.eyebrow}>{data.tag}</p>
        <h2 id={`${engineCode.toLowerCase()}-prices-title`}>
          <SectionHeading
            title={data.title}
            accentFrom="Replacement Cost (UK)"
          />
        </h2>
        <p className={styles.sectionIntro}>
          Compare typical prices for used, reconditioned and rebuilt{" "}
          {engineCode} engines, with or without fitting by an independent
          specialist.
        </p>
        <div className={styles.costGrid}>
          <div
            className={styles.costTable}
            role="table"
            aria-label={`${engineCode} replacement prices`}
          >
            <div className={styles.costHeader} role="row">
              <span>
                <FiTool />
                Condition
              </span>
              <span>
                <FiBarChart2 />
                Supply only
              </span>
              <span>
                <FiTool />
                Fitted
              </span>
              <span>
                <FiShield />
                Typical warranty
              </span>
            </div>
            {data.rows.map((row) => (
              <div className={styles.costRow} role="row" key={row.condition}>
                <strong>{row.condition}</strong>
                <strong className={styles.greenPrice}>{row.supplyOnly}</strong>
                <span>{row.fitted}</span>
                <span>{row.warranty}</span>
              </div>
            ))}
          </div>
          <aside className={styles.labourCard}>
            <div className={styles.labourCopy}>
              <h3>
                <FiClock /> Labour time &amp; rates
              </h3>
              <ExpandableLabourLine text={labourLine} />
              <div className={styles.labourMetric}>
                <FiClock />
                <strong>7–10 hours</strong>
                <small>Typical fitting time</small>
              </div>
              <div className={styles.labourMetric}>
                <FiBarChart2 />
                <strong>£65–£85/hr</strong>
                <small>Independent rate</small>
              </div>
            </div>
            <div className={styles.labourImage}>
              <Image src={image} alt="Engine detail" fill sizes="220px" />
            </div>
          </aside>
        </div>
        <div className={styles.priceCallout}>
          <FiBarChart2 aria-hidden="true" />
          <div>
            <h3>What affects the price?</h3>
            <p>{data.paragraphs[1] ?? data.paragraphs[0] ?? estimateNotice}</p>
          </div>
          <a href="#quote-form">
            {ctaLabel(data.cta)} <FiArrowRight />
          </a>
        </div>
        <div className={styles.priceNotice}>
          <FiInfo />
          <span>
            {estimateNotice} Fitted prices include the supply price and
            indicative labour band above.
          </span>
          <strong>
            <FiShield /> Compare with confidence
          </strong>
        </div>
      </div>
    </section>
  );
}
