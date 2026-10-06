"use client";

import Link from "next/link";
import { useState } from "react";
import { FiArrowRight, FiChevronDown, FiSearch } from "react-icons/fi";
import type { EngineFaqSectionData } from "@/types/engine-page";
import styles from "./NewDocEngine.module.css";
import SectionHeading from "./SectionHeading";

type Props = { data: EngineFaqSectionData; engineCode: string };

export default function EngineFaq({ data, engineCode }: Props) {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section
      className={styles.faqSection}
      aria-labelledby={`${engineCode.toLowerCase()}-faq-title`}
    >
      <div className={styles.sectionContainer}>
        <div className={styles.faqHeading}>
          <div>
            <p className={styles.eyebrow}>{data.tag}</p>
            <h2 id={`${engineCode.toLowerCase()}-faq-title`}>
              <SectionHeading
                title={data.title}
                accentFrom="Frequently Asked Questions"
              />
            </h2>
          </div>
          <div className={styles.faqContact}>
            <FiSearch />
            <span>
              Still have a question?<small>Get in touch with our team.</small>
            </span>
            <Link href="#quote-form">
              Contact us <FiArrowRight />
            </Link>
          </div>
        </div>

        <div className={styles.faqGrid}>
          {data.items.map((item, index) => {
            const isOpen = !!openItems[index];
            const answerId = `${engineCode.toLowerCase()}-faq-answer-${index + 1}`;

            return (
              <article
                className={`${styles.faqCard} ${isOpen ? styles.faqCardOpen : ""}`}
                key={`faq-${index}-${item.question.slice(0, 15)}`}
              >
                <span className={styles.questionNumber}>Q{index + 1}</span>
                <div>
                  <button
                    type="button"
                    className={styles.faqQuestion}
                    onClick={() => toggleItem(index)}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <h3>{item.question.replace(/-$/, "?")}</h3>
                    <FiChevronDown aria-hidden="true" />
                  </button>

                  <div
                    id={answerId}
                    className={styles.faqAnswer}
                    hidden={!isOpen}
                  >
                    <p>{item.answer}</p>
                    {item.bullets && item.bullets.length > 0 ? (
                      <ul>
                        {item.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    ) : null}
                    {item.cta ? (
                      <Link href="#quote-form">
                        {item.cta} <FiArrowRight />
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
