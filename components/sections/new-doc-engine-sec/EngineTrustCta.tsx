import { FiArrowRight, FiShield, FiTruck, FiUsers } from "react-icons/fi";
import type { EngineTrustCtaSectionData } from "@/types/engine-page";
import styles from "./NewDocEngine.module.css";
import SectionHeading from "./SectionHeading";
type Props = {
  data: EngineTrustCtaSectionData;
  engineCode: string;
  backgroundImage?: string;
};
const icons = [FiUsers, FiShield, FiTruck];

export default function EngineTrustCta({
  data,
  engineCode,
  backgroundImage,
}: Props) {
  return (
    <section
      className={styles.trustCtaSection}
      style={
        backgroundImage
          ? ({ "--cta-bg": `url("${backgroundImage}")` } as React.CSSProperties)
          : undefined
      }
      aria-labelledby={`${engineCode.toLowerCase()}-cta-title`}
    >
      <div className={styles.sectionContainer}>
        <p className={styles.eyebrowLight}>{data.tag}</p>
        <h2 id={`${engineCode.toLowerCase()}-cta-title`}>
          <SectionHeading title={data.title} accentFrom="Engine Prices Today" />
        </h2>
        <p className={styles.ctaParagraph}>{data.paragraph}</p>
        <div className={styles.ctaLayout}>
          <div className={styles.ctaBullets}>
            {data.bullets.map((bullet, index) => {
              const Icon = icons[index] ?? FiShield;
              return (
                <div key={bullet}>
                  <Icon />
                  <span>{bullet}</span>
                </div>
              );
            })}
          </div>
          <div className={styles.ctaAction}>
            <a href="#quote-form">
              {data.buttonText}
              <FiArrowRight />
            </a>
            <small>♙ {data.note}</small>
          </div>
        </div>
      </div>
    </section>
  );
}
