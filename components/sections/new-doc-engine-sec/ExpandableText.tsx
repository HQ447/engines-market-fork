"use client";

import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import styles from "./NewDocEngine.module.css";

type Props = {
  children: string;
  lines: 6 | 7;
  className?: string;
  label: string;
};

/** A measured clamp so the expand control only appears when there is hidden copy. */
export default function ExpandableText({
  children,
  lines,
  className = "",
  label,
}: Props) {
  const copyRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  useEffect(() => {
    const measure = () => {
      const element = copyRef.current;
      if (!element || expanded) return;
      setCanExpand(element.scrollHeight > element.clientHeight + 1);
    };

    const frame = requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    if (copyRef.current) observer.observe(copyRef.current);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [children, expanded]);

  const clampClass = lines === 6 ? styles.clampSix : styles.clampSeven;

  return (
    <div className={`${styles.expandableCopy} ${className}`}>
      <p ref={copyRef} className={expanded ? styles.expandedCopy : clampClass}>
        {children}
      </p>
      {canExpand ? (
        <button
          type="button"
          className={`${styles.expandCopyButton} ${expanded ? styles.expandCopyButtonOpen : ""}`}
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
          aria-label={`${expanded ? "Collapse" : "Expand"} ${label}`}
        >
          <FiChevronDown aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
