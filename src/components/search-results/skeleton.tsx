import { Bone } from "#/components-ui/skeleton";
import styles from "./skeleton.module.css";

const RESULTS_COUNT = 10;

/**
 * Placeholder for search results while the search is running
 */
export const SearchResultsSkeleton = () => (
  <div aria-busy="true">
    <p className="fr-sr-only" role="status">
      Recherche en cours…
    </p>
    <div aria-hidden="true" className={styles.counter}>
      <Bone width="220px" />
      <Bone width="120px" />
    </div>
    {Array.from({ length: RESULTS_COUNT }, (_, i) => (
      <div aria-hidden="true" className={styles.item} key={i}>
        <div className={styles.itemTitle}>
          <Bone
            height="1.3rem"
            inline={true}
            width={`${35 + ((i * 13) % 30)}%`}
          />
          <Bone height="1.2rem" inline={true} width="90px" />
        </div>
        <Bone width={`${45 + ((i * 17) % 25)}%`} />
        <Bone width={`${20 + ((i * 11) % 20)}%`} />
        <Bone width={`${40 + ((i * 7) % 30)}%`} />
        <Bone className={styles.etablissement} width="160px" />
      </div>
    ))}
  </div>
);
