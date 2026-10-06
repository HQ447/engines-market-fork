import Image from "next/image";
import Link from "next/link";
import { FiActivity, FiArrowRight, FiUsers } from "react-icons/fi";
import type { EngineCompatibilitySectionData } from "@/types/engine-page";
import styles from "./NewDocEngine.module.css";
import SectionHeading from "./SectionHeading";
type Props = {
  data: EngineCompatibilitySectionData;
  engineCode: string;
  brandName: string;
};

export default function EngineCompatibility({
  data,
  engineCode,
  brandName,
}: Props) {
  return (
    <section
      className={styles.fitmentSection}
      aria-labelledby={`${engineCode.toLowerCase()}-fitment-title`}
    >
      <div className={styles.fitmentContainer}>
        <p className={styles.eyebrow}>{data.tag}</p>
        <h2 id={`${engineCode.toLowerCase()}-fitment-title`}>
          <SectionHeading
            title={data.title}
            accentFrom={`Use the ${engineCode}?`}
          />
        </h2>
        <p className={styles.fitmentIntro}>{data.intro}</p>
        <div className={styles.fitmentGrid}>
          <div className={styles.modelTable}>
            <div className={styles.modelHeader}>
              <span>Model</span>
              <span>Generation / Chassis</span>
              <span>Badge(s)</span>
              <span>Years</span>
              <span>View model</span>
            </div>
            {data.rows.map((model, index) => {
              return (
                <div
                  className={styles.modelRow}
                  key={`${model.model}-${index}`}
                >
                  <div className={styles.modelName}>
                    {model.image ? (
                      <Image
                        src={model.image}
                        alt={model.model}
                        width={88}
                        height={48}
                        sizes="88px"
                      />
                    ) : null}
                    <strong>{model.model}</strong>
                  </div>
                  <span>{model.generation}</span>
                  <span>{model.badges}</span>
                  <span>{model.years}</span>
                  <div>
                    {model.links[0] ? (
                      <Link href={model.links[0].href}>
                        {model.links[0].label}{" "}
                        <FiArrowRight aria-hidden="true" />
                      </Link>
                    ) : (
                      "—"
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <aside className={styles.fitmentNotes}>
            <div className={styles.fitmentNote}>
              <FiActivity aria-hidden="true" />
              <div>
                <strong>Brand-specific engine design</strong>
                <p>
                  The {engineCode} is a {brandName} engine design. Always match
                  the exact engine-code suffix before buying.
                </p>
              </div>
            </div>
            <div className={styles.fitmentNote}>
              <FiUsers aria-hidden="true" />
              <div>
                <strong>Not sure which engine your car has?</strong>
                <p>
                  Enter your registration above — we&apos;ll confirm your exact{" "}
                  {engineCode} fitment before any quotes are sent.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
