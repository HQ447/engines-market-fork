import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiChevronDown,
  FiChevronRight,
  FiLock,
  FiSettings,
  FiShield,
  FiTool,
  FiTruck,
  FiUsers,
} from "react-icons/fi";
import type { EnginePageHeroData } from "@/types/engine-page";
import styles from "./NewDocEngine.module.css";
import SectionHeading from "./SectionHeading";

type Props = {
  data: EnginePageHeroData;
  engineCode: string;
};

const benefitIcons = [FiTool, FiShield, FiTruck, FiUsers];
const benefitLabels = [
  ["Supply & Fit", "Available"],
  ["12-Month", "Warranty"],
  ["Nationwide", "Delivery"],
  ["100+", "Suppliers"],
];

function UkFlag() {
  return (
    <svg viewBox="0 0 28 18" className={styles.flag} aria-hidden="true">
      <rect width="28" height="18" fill="#012169" />
      <path d="M0 0 28 18M28 0 0 18" stroke="#fff" strokeWidth="4" />
      <path d="M0 0 28 18M28 0 0 18" stroke="#c8102e" strokeWidth="2" />
      <path d="M14 0v18M0 9h28" stroke="#fff" strokeWidth="6" />
      <path d="M14 0v18M0 9h28" stroke="#c8102e" strokeWidth="3" />
    </svg>
  );
}

export default function EngineHero({ data, engineCode }: Props) {
  const engineCutout =
    data.engineCutout?.src ??
    data.engineImage.src ??
    "/images/shared/hero-engines/temporary-petrol-engine-cutout.png";
  const backgroundImage = data.backgroundImage?.src ?? data.engineImage.src;
  const tagline = data.visualTagline ?? "Same engineering.\nMore journeys.";
  const summaryPills = data.pills.slice(1);
  const titleId = `${engineCode.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-title`;

  return (
    <section className={styles.hero} aria-labelledby={titleId}>
      {/* <div className={styles.background} aria-hidden="true">
        <Image
          src={backgroundImage}
          alt={data.backgroundImage?.alt ?? ""}
          fill
          priority
          sizes="100vw"
        />
      </div> */}
      <div className={styles.container}>
        <div className={styles.topGrid}>
          <div className={styles.copy}>
            <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
              {data.breadcrumbs.map((item) => (
                <span key={item.label} className={styles.breadcrumbItem}>
                  {item.href ? (
                    <Link href={item.href}>{item.label}</Link>
                  ) : (
                    item.label
                  )}
                  <FiChevronRight aria-hidden="true" />
                </span>
              ))}
              <span>{engineCode}</span>
            </nav>

            <div className={styles.pills} aria-label="Engine summary">
              {summaryPills.map((pill) => (
                <span key={pill}>{pill}</span>
              ))}
            </div>

            <h1 id={titleId}>
              <SectionHeading
                title={data.title}
                accentFrom="Problems & Compatibility"
              />
            </h1>
            <p className={styles.description}>{data.description}</p>

            <div className={styles.benefits}>
              {data.trustBadges.map((benefit, index) => {
                const Icon = benefitIcons[index] ?? FiSettings;
                const lines = benefitLabels[index] ?? [benefit];
                return (
                  <div className={styles.benefit} key={benefit}>
                    <Icon aria-hidden="true" />
                    <span>
                      {lines.map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </span>
                  </div>
                );
              })}
            </div>

            <div
              className={styles.pricePanel}
              aria-label="Starting engine prices"
            >
              {data.prices.map((price) => (
                <div className={styles.price} key={price.label}>
                  <span>{price.label}</span>
                  <strong>{price.price}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.visual}>
            <div className={styles.visualGlow} />
            <Image
              className={styles.engine}
              src={engineCutout}
              alt={data.engineImage.alt}
              fill
              priority
              sizes="(max-width: 820px) 92vw, 48vw"
            />
            <p className={styles.visualTagline}>
              {tagline.split("\n").map((line, index) => (
                <span key={`${line}-${index}`}>
                  {index > 0 ? <br /> : null}
                  {line}
                </span>
              ))}
            </p>
          </div>
        </div>

        <div className={styles.quotePanel} id="quote-form">
          <div className={styles.registration}>
            <div className={styles.country}>
              <UkFlag />
              <span>{data.quoteCard.countryCode}</span>
              <FiChevronDown aria-hidden="true" />
            </div>
            <label className="sr-only" htmlFor="engine-registration">
              Vehicle registration
            </label>
            <input
              id="engine-registration"
              name="registration"
              placeholder={data.quoteCard.placeholder}
            />
          </div>
          <a className={styles.quoteButton} href="#quote-form">
            {data.quoteCard.buttonText}
            <FiArrowRight aria-hidden="true" />
          </a>
          <p className={styles.quoteNote}>
            <FiLock aria-hidden="true" />
            <span>{data.quoteCard.note}</span>
          </p>
        </div>

        <div className={styles.proofRow}>
          <div className={styles.proofItem}>
            <FiSettings aria-hidden="true" />
            <span>
              <strong>Genuine &amp; quality checked</strong>
              <small>Engines</small>
            </span>
          </div>
          <div className={styles.proofItem}>
            <FiShield aria-hidden="true" />
            <span>
              <strong>Competitive</strong>
              <small>UK pricing</small>
            </span>
          </div>
          <div className={styles.proofItem}>
            <FiUsers aria-hidden="true" />
            <span>
              <strong>Expert support</strong>
              <small>We help you find the right engine</small>
            </span>
          </div>
          <div className={`${styles.proofItem} ${styles.trustpilotItem}`}>
            <span className={styles.starIcon} aria-hidden="true">
              ★
            </span>
            <span>
              <strong>Trusted by</strong>
              <small>UK drivers</small>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
