import Image from "next/image";
import { FiArrowRight, FiInfo, FiSettings } from "react-icons/fi";
import type { NewDocVariantData } from "@/types/new-doc-variant";
import shared from "./VariantShared.module.css";
import styles from "./NewDocVariantEngineCode.module.css";

type Props = { data: NewDocVariantData["engineGuide"]; engineImage: string };

export default function NewDocVariantEngineCode({ data, engineImage }: Props) {
  return (
    <section className={styles.section} aria-labelledby="variant-engine-code-title">
      <div className={shared.container}>
        <div className={styles.introGrid}>
          <div>
            <p className={shared.eyebrow}>{data.eyebrow}</p>
            <h2 id="variant-engine-code-title" className={shared.sectionTitle}>
              {data.titleLead} <span className={shared.headingAccent}>{data.titleAccent}</span>
            </h2>
            <p className={shared.sectionSubtitle}>{data.description}</p>
          </div>

          <div className={styles.engineVisual}>
            <Image src={engineImage} alt={`${data.engineName} engine`} width={620} height={520} />
          </div>
        </div>

        <div className={styles.mainGrid}>
          <article className={styles.specCard}>
            <h3><FiSettings />{data.engineName}</h3>
            <dl>
              {data.specs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
          </article>

          <aside className={styles.costCard}>
            <h3>UK replacement cost guide</h3>
            <div className={styles.priceRows}>
              {data.prices.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
            </div>
            <p><FiInfo />{data.commonFailure}</p>
          </aside>
        </div>

        <div className={styles.actionRow}>
          <p><FiInfo /><span><strong>Can’t find your exact engine code?</strong>{data.closing}</span></p>
          <a
            className={shared.button}
            href="#quote-form"
            data-quote-trigger="true"
            data-quote-context={data.cta}
            data-quote-source="new-variant-engine-code"
          >
            {data.cta}<FiArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
