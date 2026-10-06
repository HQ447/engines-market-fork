import type { CSSProperties } from "react";
import { FiArrowRight, FiShield, FiTruck, FiUsers } from "react-icons/fi";
import type { NewDocVariantData } from "@/types/new-doc-variant";
import shared from "./VariantShared.module.css";
import styles from "./NewDocVariantWhyChoose.module.css";

type Props = {
  data: NewDocVariantData["whyChoose"];
  backgroundImage: string;
};

const icons = { network: FiUsers, warranty: FiShield, delivery: FiTruck };

export default function NewDocVariantWhyChoose({
  data,
  backgroundImage,
}: Props) {
  return (
    <section
      className={styles.section}
      aria-labelledby="variant-why-choose-title"
      style={
        { "--why-background": `url("${backgroundImage}")` } as CSSProperties
      }
    >
      <div className={`${shared.container} ${styles.layout}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{data.eyebrow}</p>
          <h2 id="variant-why-choose-title">
            <span>{data.titleLead}</span> <span>{data.titleAccent}</span>
          </h2>
          <p className={styles.description}>{data.description}</p>
        </div>

        <div className={styles.benefits}>
          {data.benefits.map((benefit) => {
            const Icon = icons[benefit.icon];
            return (
              <div className={styles.benefit} key={benefit.value}>
                <Icon />
                <div>
                  <strong>{benefit.value}</strong>
                  <span>{benefit.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.action}>
          <a
            href="#quote-form"
            data-quote-trigger="true"
            data-quote-context={data.cta}
            data-quote-source="new-variant-why-choose"
          >
            {data.cta}
            <FiArrowRight />
          </a>
          <p>{data.note}</p>
        </div>
      </div>
    </section>
  );
}
