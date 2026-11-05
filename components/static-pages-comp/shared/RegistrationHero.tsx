import Image from "next/image";
import type { ReactNode } from "react";
import type { StaticPageRecord } from "@/lib/staticPagePreview";
import { getNormalizedPreviewContent } from "@/lib/staticPagePreview";
import styles from "./RegistrationHero.module.css";
import { capitalizeHeading } from "./text";

type RegistrationHeroProps = {
  page: StaticPageRecord;
  quotePanel: ReactNode;
  platformImage?: { src: string; alt: string };
};

function splitHeroTitle(title: string) {
  const match = title.match(/^(.*?)\s+(Real Prices(?:\s+from)?\s+.+)$/i);
  const mainTitle = match?.[1] ?? title;
  const words = mainTitle.trim().split(/\s+/);
  const accentCount = Math.min(3, words.length);
  return {
    titlePrefix: words.slice(0, -accentCount).join(" "),
    titleAccent: words.slice(-accentCount).join(" "),
    realPrices: match?.[2] ?? "",
  };
}

function splitPriceLine(line: string) {
  const separator = line.indexOf(":");
  return separator >= 0
    ? { label: line.slice(0, separator + 1), value: line.slice(separator + 1).trim() }
    : { label: "", value: line };
}

function splitHeroDescription(description: string) {
  const labels = "Used engine|Reconditioned(?: Engine)?|Rebuilt(?: Engine)?|New(?: Engine)?";
  const priceLines = [...description.matchAll(new RegExp(`(${labels}):\\s*([\\s\\S]*?)(?=\\s*(?:${labels}):|\\s*Fitting adds|$)`, "gi"))]
    .map((match) => `${match[1]}: ${match[2].replace(/^[·\\s]+|[·\\s]+$/g, "").trim()}`)
    .filter(Boolean);
  const summary = description.match(/Fitting adds[\s\S]*$/i)?.[0]?.trim() ?? "";
  if (priceLines.length) return { priceLines, summary };
  const lines = description.split(/\s*·\s*/).map((line) => line.trim()).filter(Boolean);
  return { priceLines: lines.slice(0, -1), summary: lines.at(-1) ?? "" };
}

export default function RegistrationHero({ page, quotePanel, platformImage = { src: "/preview-assets/holographic-platform-source-matched.png", alt: "Holographic engine platform" } }: RegistrationHeroProps) {
  const { hero } = getNormalizedPreviewContent(page);
  const heading = splitHeroTitle(capitalizeHeading(hero.title || page.seo.title));
  const { priceLines, summary: priceSummary } = splitHeroDescription(hero.description ?? "");

  return (
    <section className={styles.hero} aria-labelledby="preview-hero-heading">
      <div className={styles.heroInner}>
        <div className={styles.content}>
          <h1 className={styles.title} id="preview-hero-heading">{heading.titlePrefix ? `${heading.titlePrefix} ` : null}<span className={styles.titleAccentWord}>{heading.titleAccent}</span></h1>
          {heading.realPrices ? <p className={styles.titleAccent}>{heading.realPrices}</p> : null}
          {priceLines.length ? (
            <div className={styles.description}>
              {priceLines.map((line) => {
                const priceLine = splitPriceLine(line);
                return <p className={styles.priceLine} key={line}>{priceLine.label ? <strong>{priceLine.label}</strong> : null} {priceLine.value}</p>;
              })}
              {priceSummary ? <p className={styles.priceSummary}>{priceSummary}</p> : null}
            </div>
          ) : hero.description ? <p className={styles.description}>{hero.description}</p> : null}

          {hero.options.length ? (
            <div className={styles.options} aria-label="Price guide highlights">
              {hero.options.map((option, index) => (
                <article className={styles.option} key={`${option.label}-${index}`}>
                  <p className={styles.optionLabel}>{option.label.replace(/\s+i$/i, "")}</p>
                  <strong className={styles.optionAmount}>{option.amount}</strong>
                  <span className={styles.optionDetail}>{option.detail}</span>
                </article>
              ))}
            </div>
          ) : null}
        </div>

        <div className={styles.visualColumn}>
          <div className={styles.platformStage} aria-hidden="true">
            <Image className={styles.platformImage} src={platformImage.src} alt={platformImage.alt} width={1760} height={1408} priority />
            <Image className={styles.engineImage} src="/preview-assets/engine-cutout-source-matched.png" alt="" width={1760} height={1408} priority />
          </div>
          <div className={styles.quotePanel}>{quotePanel}</div>
        </div>
      </div>
    </section>
  );
}
