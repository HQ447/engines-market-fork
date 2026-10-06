import Image from "next/image";
import { FaGears, FaGaugeHigh, FaMoneyBillTrendUp } from "react-icons/fa6";
import {
  FiActivity,
  FiAward,
  FiCalendar,
  FiDroplet,
  FiSettings,
  FiTool,
  FiUsers,
} from "react-icons/fi";
import type {
  EngineCompatibilitySectionData,
  EnginePageHeroData,
  EngineSpecsSectionData,
} from "@/types/engine-page";
import styles from "./NewDocEngine.module.css";
import SectionHeading from "./SectionHeading";
type Props = {
  data: EngineSpecsSectionData;
  engineCode: string;
  brandName: string;
  engineImage: EnginePageHeroData["engineImage"];
  compatibility: EngineCompatibilitySectionData;
};

export default function EngineSpecs({
  data,
  engineCode,
  brandName,
  engineImage,
  compatibility,
}: Props) {
  const compatibleModels = Array.from(
    new Set(
      compatibility.rows.map((row) =>
        row.model.replace(new RegExp(`^${brandName}\\s*`, "i"), "").trim(),
      ),
    ),
  )
    .slice(0, 3)
    .join(", ");

  return (
    <section
      className={styles.specsSection}
      aria-labelledby={`${engineCode.toLowerCase()}-specs-title`}
    >
      <div className={styles.specsContainer}>
        <p className={styles.eyebrow}>{data.tag}</p>
        <h2 id={`${engineCode.toLowerCase()}-specs-title`}>
          <SectionHeading title={data.title} />
        </h2>
        <p className={styles.specsIntro}>
          Key technical details for the {brandName} {engineCode} engine,
          including performance, fitment and replacement information.
        </p>
        <div className={styles.specsGrid}>
          <dl className={styles.specTable}>
            {data.specs.map((spec, index) => {
              const Icon =
                [
                  FiSettings,
                  FiDroplet,
                  FiTool,
                  FiActivity,
                  FiCalendar,
                  FiUsers,
                ][index] ?? FiAward;
              return (
                <div className={styles.specRow} key={spec.label}>
                  <dt>
                    <Icon aria-hidden="true" />
                    {spec.label}
                  </dt>
                  <dd>{spec.value || "Available on request"}</dd>
                </div>
              );
            })}
          </dl>
          <aside className={styles.specAside}>
            <div className={styles.specFeatureCard}>
              <div className={styles.specImage}>
                <Image
                  src={engineImage.src}
                  alt={`${brandName} ${engineCode} engine close-up`}
                  fill
                  sizes="(max-width: 760px) 100vw, 33vw"
                />
              </div>
              <div className={styles.specHighlights}>
                <div>
                  <FaGears aria-hidden="true" />
                  <strong>Turbocharged platform</strong>
                  <span>Modern &amp; efficient</span>
                </div>
                <div>
                  <FaMoneyBillTrendUp aria-hidden="true" />
                  <strong>Improved economy</strong>
                  <span>Lower running costs</span>
                </div>
                <div>
                  <FaGaugeHigh aria-hidden="true" />
                  <strong>Proven platform</strong>
                  <span>Used in {compatibleModels}</span>
                </div>
              </div>
            </div>
            <blockquote>
              <span aria-hidden="true">“</span>
              <div>
                <p>
                  A modern, efficient turbocharged engine designed for everyday
                  performance and reliability.
                </p>
                <cite>— Engines Market</cite>
              </div>
            </blockquote>
          </aside>
        </div>
      </div>
    </section>
  );
}
