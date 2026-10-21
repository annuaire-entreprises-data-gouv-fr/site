import clsx from "clsx";
import type React from "react";
import { defaultUniteLegaleTheme } from "#/utils/get-unite-legale-theme";
import styles from "./skeleton.module.css";

const Bone: React.FC<{
  className?: string;
  height?: string;
  inline?: boolean;
  width: string;
}> = ({ className, height, inline = false, width }) => (
  <span
    aria-hidden="true"
    className={clsx(styles.bone, inline && styles.inline, className)}
    style={{ width, height }}
  />
);

const TAB_COUNT = 8;

/**
 * Placeholder for the title section (name, badges, description and tabs).
 * Theme colors are inherited from the --unite-legale-theme-* CSS variables.
 */
export const EntrepriseTitleSkeleton: React.FC<{
  withDescription?: boolean;
}> = ({ withDescription = true }) => (
  <div style={{ marginBottom: 40 }}>
    <Bone className={styles.title} width="45%" />
    <div className={styles.row}>
      <Bone height="1.5rem" inline={true} width="100px" />
      <Bone height="1.25rem" inline={true} width="110px" />
      <Bone height="1.5rem" inline={true} width="90px" />
    </div>
    <div className={styles.row} style={{ marginLeft: 45 }}>
      <Bone inline={true} width="260px" />
    </div>
    <div className={styles.socials}>
      {Array.from({ length: 4 }, (_, i) => (
        <Bone height="1.25rem" inline={true} key={i} width="1.25rem" />
      ))}
    </div>
    {withDescription && (
      <>
        <div className={styles.paragraph}>
          <Bone width="100%" />
          <Bone width="95%" />
          <Bone width="60%" />
        </div>
        <div className={styles.paragraph}>
          <Bone width="90%" />
          <Bone width="40%" />
        </div>
      </>
    )}
    <div aria-hidden="true" className={styles.tabs}>
      {Array.from({ length: TAB_COUNT }, (_, i) => (
        <span className={styles.tab} key={i} />
      ))}
    </div>
  </div>
);

const SectionSkeleton: React.FC<{ fields: number }> = ({ fields }) => (
  <div aria-hidden="true" className={styles.section}>
    <div className={styles.sectionTitle} />
    {Array.from({ length: fields }, (_, i) => (
      <div className={styles.field} key={i}>
        <div className={styles.fieldLabel}>
          <Bone width={`${60 + ((i * 17) % 35)}%`} />
        </div>
        <div className={styles.fieldValue}>
          <Bone width={`${30 + ((i * 23) % 50)}%`} />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Placeholder for the content of an entreprise tab while its loader is pending
 */
export const EntrepriseSectionsSkeleton = () => (
  <div aria-busy="true">
    <p className="fr-sr-only" role="status">
      Chargement des informations de l’entreprise…
    </p>
    <SectionSkeleton fields={6} />
    <SectionSkeleton fields={4} />
  </div>
);

/**
 * Placeholder for the whole entreprise page (title, tabs and sections)
 * shown while the unité légale is being fetched
 */
export const EntreprisePageSkeleton = () => (
  <div style={defaultUniteLegaleTheme}>
    <EntrepriseTitleSkeleton />
    <EntrepriseSectionsSkeleton />
  </div>
);
