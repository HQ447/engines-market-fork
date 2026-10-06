"use client";

import Image from "next/image";
import { useState } from "react";
import {
  FiArrowRight,
  FiBarChart2,
  FiCheck,
  FiClock,
  FiCpu,
  FiDatabase,
  FiFileText,
  FiMinus,
  FiPlus,
  FiSettings,
} from "react-icons/fi";
import type { NewDocVariantData } from "@/types/new-doc-variant";
import shared from "./VariantShared.module.css";
import styles from "./NewDocVariantFaq.module.css";

type Props = {
  data: NewDocVariantData["faq"];
  vehicleImage: string;
};

const icons = {
  price: FiDatabase,
  problems: FiSettings,
  value: FiBarChart2,
  life: FiClock,
  compare: FiCpu,
  code: FiFileText,
};

export default function NewDocVariantFaq({ data, vehicleImage }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className={styles.section} aria-labelledby="variant-faq-title">
      <div className={shared.container}>
        <div className={styles.intro}>
          <div className={styles.introCopy}>
            <p className={shared.eyebrow}>{data.eyebrow}</p>
            <h2 id="variant-faq-title" className={shared.sectionTitle}>
              <span>{data.titleLead}</span>
              <span className={shared.headingAccent}>{data.titleAccent}</span>
            </h2>
            <p className={styles.description}>{data.description}</p>
          </div>
          <div className={styles.introVisual} aria-hidden="true">
            <Image src={vehicleImage} alt="" width={640} height={360} />
          </div>
        </div>

        <div className={styles.grid}>
          {data.items.map((item, index) => {
            const Icon = icons[item.icon];
            const isOpen = openIndex === index;
            const answerId = `variant-faq-answer-${index + 1}`;

            return (
              <article
                className={`${styles.card} ${isOpen ? styles.open : ""}`}
                key={item.question}
              >
                <button
                  className={styles.question}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className={styles.number}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item.question}</span>
                  <span className={styles.toggle} aria-hidden="true">
                    {isOpen ? <FiMinus /> : <FiPlus />}
                  </span>
                </button>

                <div
                  className={styles.answerWrap}
                  id={answerId}
                  aria-hidden={!isOpen}
                >
                  <div className={styles.answerOverflow}>
                    <div className={styles.answer}>
                      <p className={styles.answerText}>{item.answer}</p>

                      {item.highlights?.length ? (
                        <div
                          className={`${styles.detailStrip} ${item.highlights.length === 2 ? styles.twoColumns : ""}`}
                        >
                          {item.highlights.map((highlight) => (
                            <div key={highlight.label}>
                              <strong>{highlight.label}</strong>
                              <b>{highlight.value}</b>
                              {highlight.detail ? (
                                <span>{highlight.detail}</span>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {item.bullets?.length ? (
                        <ul className={styles.bullets}>
                          {item.bullets.map((bullet) => (
                            <li key={bullet}>
                              <FiCheck />
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      <a
                        className={styles.cardCta}
                        href="#quote-form"
                        data-quote-trigger="true"
                        data-quote-context={item.cta}
                        data-quote-source="new-variant-faq"
                      >
                        {item.cta}
                        <FiArrowRight />
                      </a>
                    </div>
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
