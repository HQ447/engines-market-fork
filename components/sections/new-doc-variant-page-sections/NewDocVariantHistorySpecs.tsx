import Image from "next/image";
import { FiActivity, FiCpu } from "react-icons/fi";
import type { NewDocVariantData } from "@/types/new-doc-variant";
import shared from "./VariantShared.module.css";
import styles from "./NewDocVariantHistorySpecs.module.css";

type Props = { history: NewDocVariantData["history"]; vehicleImage: string };

export default function NewDocVariantHistorySpecs({ history, vehicleImage }: Props) {
  return (
    <section className={styles.section} aria-labelledby="variant-history-title">
      <div className={shared.container}>
        <div className={styles.layout}>
          <div className={styles.historyCopy}>
            <p className={shared.eyebrow}>{history.eyebrow}</p>
            <h2 id="variant-history-title" className={shared.sectionTitle}>
              {history.titleLead} <span className={shared.headingAccent}>{history.titleAccent}</span>
            </h2>
            <p className={`${shared.bodyText} ${styles.description}`}>{history.description}</p>
          </div>

          <div className={styles.vehicleStage}>
            <div className={styles.vehicleGlow} />
            <Image src={vehicleImage} alt={history.titleLead} width={640} height={360} />
          </div>

          <aside className={`${shared.glassPanel} ${styles.snapshot}`} aria-label="Key specifications snapshot">
            <div className={styles.snapshotTitle}><FiCpu /><span>Key specs snapshot</span></div>
            <dl>
              {history.specs.map(([label, value]) => (
                <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
              ))}
            </dl>
          </aside>
        </div>

        <ol className={styles.timeline}>
          {history.timeline.map((item, index) => (
            <li key={`${item.year}-${index}`}><span><FiActivity /></span><strong>{item.year}</strong><p>{item.text}</p></li>
          ))}
        </ol>
        <p className={styles.closing}><FiActivity />{history.closing}</p>
      </div>
    </section>
  );
}
