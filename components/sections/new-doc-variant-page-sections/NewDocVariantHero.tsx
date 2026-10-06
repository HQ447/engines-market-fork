"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FiArrowRight,
  FiCheckCircle,
  FiLock,
  FiTool,
  FiTruck,
  FiUsers,
} from "react-icons/fi";
import type { NewDocVariantData } from "@/types/new-doc-variant";
import shared from "./VariantShared.module.css";
import styles from "./NewDocVariantHero.module.css";

type Props = Pick<
  NewDocVariantData,
  "brand" | "model" | "variant" | "engineCode" | "images" | "hero"
>;

const trustIcons = [FiTool, FiCheckCircle, FiTruck, FiUsers];

export default function NewDocVariantHero({
  brand,
  model,
  variant,
  engineCode,
  images,
  hero,
}: Props) {
  const [showFullPrice, setShowFullPrice] = useState(false);
  const isLongPrice = hero.price.range.length > 16;
  const displayedPrice =
    !showFullPrice && isLongPrice
      ? `${hero.price.range.slice(0, 16)}...`
      : hero.price.range;

  const ticker = [
    ...hero.tickerItems,
    ...hero.tickerItems,
    ...hero.tickerItems,
    ...hero.tickerItems,
  ];

  return (
    <section className={styles.hero} aria-labelledby="variant-preview-title">
      <Image
        className={styles.background}
        src={images.heroBackground}
        alt=""
        fill
        priority
        unoptimized
      />
      <div className={styles.overlay} />
      <div className={`${shared.container} ${styles.content}`}>
        <div className={styles.copy}>
          <p className={styles.specialistBadge}>{hero.eyebrow}</p>
          <h1 id="variant-preview-title" className={styles.title}>
            <span>{hero.titleLead}</span>{" "}
            <span className={styles.titleAccent}>{hero.titleAccent}</span>
          </h1>
          <p className={styles.description}>{hero.description}</p>
          <div className={styles.trustGrid}>
            {hero.trustItems.map((item, index) => {
              const Icon = trustIcons[index] ?? FiCheckCircle;
              return (
                <div key={item} className={styles.trustItem}>
                  <Icon />
                  <span>{item}</span>
                </div>
              );
            })}
          </div>

          <div className={styles.priceAnchor}>
            <div className={styles.priceMain}>
              <span className={styles.enginePill}>{hero.price.engineName}</span>
              <div className={styles.priceBlock}>
                <span className={styles.fromLabel}>from</span>
                <b
                  onClick={() =>
                    isLongPrice && setShowFullPrice((prev) => !prev)
                  }
                  className={`${styles.priceValue} ${isLongPrice ? styles.clickablePrice : ""}`}
                  title={
                    isLongPrice
                      ? showFullPrice
                        ? "Click to collapse"
                        : "Click to view full price"
                      : undefined
                  }
                >
                  {displayedPrice}
                </b>
              </div>
            </div>

            <ul className={styles.detailsList}>
              {hero.price.details.map((detail) => {
                // Splits "Used from £800" or "Common codes: DW12, 224DT" into Title & Subtitle
                let title = detail;
                let subtitle = "";

                if (detail.includes(" from ")) {
                  const [t, s] = detail.split(" from ");
                  title = t.trim();
                  subtitle = `from ${s.trim()}`;
                } else if (detail.includes(":")) {
                  const [t, s] = detail.split(":");
                  title = t.trim();
                  subtitle = s.trim();
                }

                return (
                  <li key={detail} className={styles.detailCard}>
                    <span className={styles.detailTitle}>{title}</span>
                    {subtitle && (
                      <span className={styles.detailSub}>{subtitle}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={styles.optionCardsWrap}>
            <div className={styles.optionCards}>
              {hero.options.map((option) => (
                <a
                  key={option.description}
                  className={styles.optionCard}
                  href={option.href}
                  data-quote-trigger="true"
                  data-quote-context={option.description}
                  data-quote-source="new-variant-engine-option"
                  data-quote-engine-code={engineCode}
                >
                  <span className={styles.optionImageArea}>
                    <Image
                      src={option.image}
                      alt={`${brand} ${model} ${variant} ${option.description}`}
                      width={120}
                      height={82}
                    />
                  </span>
                  <strong>{option.title}</strong>
                  <small>{option.description}</small>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.visuals} aria-hidden="true">
          <Image
            className={styles.brandLogo}
            src={images.brandLogo}
            alt=""
            width={160}
            height={160}
            priority
          />
          <Image
            className={styles.vehicle}
            src={images.vehicle}
            alt=""
            width={650}
            height={365}
            priority
          />
        </div>

        <form className={styles.quoteCard} id="quote-form">
          <h2>
            Get your free {brand} {model} {variant} engine quotes
          </h2>
          <label className="sr-only" htmlFor="variant-registration">
            Vehicle registration
          </label>
          <div className={styles.regInput}>
            <span aria-hidden="true">🇬🇧 GB</span>
            <input
              id="variant-registration"
              name="reg"
              aria-label="Vehicle registration"
              placeholder="Enter your reg — e.g. AB12 CDE"
            />
          </div>
          <button
            type="button"
            data-quote-trigger="true"
            data-quote-context={`Get your free ${brand} ${model} ${variant} engine quotes`}
            data-quote-source="new-variant-hero"
            data-quote-engine-code={engineCode}
          >
            {hero.cta} <FiArrowRight />
          </button>
          <p>
            <FiLock /> Secure enquiry — no spam, no pressure. Genuine quotes
            only from vetted UK specialists.
          </p>
        </form>
      </div>
      <div className={styles.ticker} aria-label="Engine service benefits">
        <div className={styles.tickerTrack}>
          {ticker.map((item, index) => (
            <span key={`${item}-${index}`}>
              <FiCheckCircle />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
