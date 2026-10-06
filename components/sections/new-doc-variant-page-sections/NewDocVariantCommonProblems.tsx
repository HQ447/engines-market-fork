"use client";

import { useEffect, useRef, useState } from "react";
import {
  FiActivity,
  FiArrowLeft,
  FiArrowRight,
  FiAward,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiInfo,
  FiTruck,
} from "react-icons/fi";

import type { NewDocVariantData } from "@/types/new-doc-variant";
import shared from "./VariantShared.module.css";
import styles from "./NewDocVariantCommonProblems.module.css";

type Props = {
  data: NewDocVariantData["commonProblems"];
  backgroundImage: string;
};

type ExpandableTextProps = {
  label: string;
  text: string;
  expanded: boolean;
  onToggle: () => void;
};

function ExpandableText({
  label,
  text,
  expanded,
  onToggle,
}: ExpandableTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const measure = () => {
      // Only recalculate when clamped so expanding doesn't reset hasOverflow to false
      if (!expanded) {
        setHasOverflow(element.scrollHeight > element.clientHeight + 1);
      }
    };

    measure();

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [text, expanded]);

  return (
    <div className={styles.expandableCopy}>
      <strong>{label}</strong>
      <div
        className={`${styles.textContainer} ${hasOverflow ? styles.clickableText : ""}`}
        onClick={hasOverflow ? onToggle : undefined}
        role={hasOverflow ? "button" : undefined}
        tabIndex={hasOverflow ? 0 : undefined}
        onKeyDown={
          hasOverflow
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onToggle();
                }
              }
            : undefined
        }
        aria-expanded={hasOverflow ? expanded : undefined}
      >
        <span
          ref={textRef}
          style={
            !expanded
              ? {
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }
              : undefined
          }
        >
          {text}
          {expanded && hasOverflow && (
            <span className={styles.inlineToggle} aria-hidden="true">
              <FiChevronUp />
            </span>
          )}
        </span>

        {!expanded && hasOverflow && (
          <span className={styles.cornerToggle} aria-hidden="true">
            <FiChevronDown />
          </span>
        )}
      </div>
    </div>
  );
}

export default function NewDocVariantCommonProblems({
  data,
  backgroundImage,
}: Props) {
  const [visibleCount, setVisibleCount] = useState(3);
  const [offset, setOffset] = useState(0);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const update = () =>
      setVisibleCount(
        window.innerWidth < 661 ? 1 : window.innerWidth < 981 ? 2 : 3,
      );
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxOffset = Math.max(0, data.cards.length - visibleCount);
  const currentOffset = Math.min(offset, maxOffset);
  const toggleExpanded = (key: string) =>
    setExpanded((value) => ({ ...value, [key]: !value[key] }));

  return (
    <section
      className={styles.section}
      aria-labelledby="variant-problems-title"
    >
      <div
        className={styles.header}
        style={
          { "--problem-bg": `url("${backgroundImage}")` } as React.CSSProperties
        }
      >
        <div className={`${shared.container} ${styles.headerInner}`}>
          <div>
            <p className={`${shared.eyebrow} ${styles.eyebrow}`}>
              {data.eyebrow}
            </p>
            <h2
              id="variant-problems-title"
              className={`${shared.sectionTitle} ${styles.headerTitle}`}
            >
              {data.titleLead}{" "}
              <span className={shared.headingAccent}>{data.titleAccent}</span>
            </h2>
            <p
              className={`${shared.sectionSubtitle} ${styles.headerDescription}`}
            >
              {data.description}
            </p>
          </div>
          <div className={styles.vehicleVisual} aria-hidden="true" />
        </div>
      </div>

      <div className={shared.container}>
        <aside className={styles.valueCheck}>
          <FiActivity />
          <div>
            <strong>Vehicle value check</strong>
            <p>{data.vehicleValue}</p>
          </div>
        </aside>

        <div className={styles.controls}>
          <p>Common failure points and repair options</p>
          <div>
            <button
              type="button"
              onClick={() =>
                setOffset((value) =>
                  Math.max(0, Math.min(maxOffset, value - 1)),
                )
              }
              disabled={currentOffset === 0}
              aria-label="Previous problems"
            >
              <FiArrowLeft />
            </button>
            <button
              type="button"
              onClick={() =>
                setOffset((value) => Math.min(maxOffset, value + 1))
              }
              disabled={currentOffset >= maxOffset}
              aria-label="Next problems"
            >
              <FiArrowRight />
            </button>
          </div>
        </div>

        <div className={styles.viewport}>
          <div
            className={styles.track}
            style={{
              transform: `translateX(calc(-${offset} * (100% + 14px) / ${visibleCount}))`,
            }}
          >
            {data.cards.map((card, index) => {
              const problemEmoji = ["🌡️", "⏱️", "⚙️"][index] ?? "🔧";
              return (
                <article className={styles.failureCard} key={card.title}>
                  <div className={styles.cardHeading}>
                    <span className={styles.problemIcon} aria-hidden="true">
                      {problemEmoji}
                    </span>
                    <h3>{card.title}</h3>
                  </div>
                  <dl className={styles.facts}>
                    <div>
                      <dt>
                        <FiTruck />
                        Affected
                      </dt>
                      <dd>{card.affected}</dd>
                    </div>
                    <div>
                      <dt>
                        <FiClock />
                        Typical failure mileage
                      </dt>
                      <dd>{card.mileage}</dd>
                    </div>
                  </dl>
                  <div className={styles.rootCause}>
                    <FiInfo />
                    <ExpandableText
                      label="Root cause"
                      text={card.rootCause}
                      expanded={Boolean(expanded[`${card.title}-root`])}
                      onToggle={() => toggleExpanded(`${card.title}-root`)}
                    />
                  </div>
                  <div className={styles.repairTable}>
                    <p>Repair options</p>
                    <table>
                      <thead>
                        <tr>
                          <th>Repair tier</th>
                          <th>Dealer price</th>
                          <th>Specialist price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {card.repairOptions.map((option) => (
                          <tr key={option.tier}>
                            <td>{option.tier}</td>
                            <td>{option.dealer}</td>
                            <td>{option.specialist}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className={styles.recommendation}>
                    <FiAward />
                    <ExpandableText
                      label="Our recommendation"
                      text={card.recommendation}
                      expanded={Boolean(
                        expanded[`${card.title}-recommendation`],
                      )}
                      onToggle={() =>
                        toggleExpanded(`${card.title}-recommendation`)
                      }
                    />
                  </div>
                  <a
                    href="#quote-form"
                    data-quote-trigger="true"
                    data-quote-context={card.cta}
                    data-quote-source="new-variant-common-problems"
                  >
                    {card.cta}
                    <FiArrowRight />
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className={styles.closingCta}
        style={
          { "--problem-bg": `url("${backgroundImage}")` } as React.CSSProperties
        }
      >
        <div className={`${shared.container} ${styles.closingCtaInner}`}>
          <div>
            <h3>{data.closingCta.title}</h3>
            <p>{data.closingCta.description}</p>
          </div>
          <a
            href="#quote-form"
            data-quote-trigger="true"
            data-quote-context={data.closingCta.cta}
            data-quote-source="new-variant-common-problems-closing"
          >
            {data.closingCta.cta}
            <FiArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
