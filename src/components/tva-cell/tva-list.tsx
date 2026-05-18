import clsx from "clsx";
import { useState } from "react";
import { CopyPaste } from "#/components/table/copy-paste";
import { formatTVA as formatTVAHelper } from "#/utils/helpers";
import styles from "./style.module.css";

const MAX_VISIBLE_TVA = 3;

const formatTVA = (tva: string) => {
  const normalizedTVA = tva.replace(/\s/g, "").replace(/^FR/, "");

  return `FR${formatTVAHelper(normalizedTVA)}`;
};

const TVAList: React.FC<{
  tvaNumbers: string[];
}> = ({ tvaNumbers }) => {
  const [showAllTVA, setShowAllTVA] = useState(false);
  const shouldDisplayShowMore = tvaNumbers.length > MAX_VISIBLE_TVA;
  const displayedTVANumbers = showAllTVA
    ? tvaNumbers
    : tvaNumbers.slice(0, MAX_VISIBLE_TVA);

  return (
    <div className={styles.tvaListContainer}>
      <ul className={styles.tvaList}>
        {displayedTVANumbers.map((tva) => (
          <li
            className={clsx(
              styles.tvaListItem,
              tvaNumbers.length > 1 && "fr-badge"
            )}
            key={tva}
          >
            <CopyPaste label="TVA" noWrap shouldRemoveSpace>
              {formatTVA(tva)}
            </CopyPaste>
          </li>
        ))}
        {shouldDisplayShowMore && (
          <li>
            <button
              aria-label={
                showAllTVA
                  ? "Afficher moins de numéros de TVA"
                  : `Afficher les ${
                      tvaNumbers.length - MAX_VISIBLE_TVA
                    } autres numéros de TVA`
              }
              className={styles.tvaShowMoreButton}
              onClick={() => setShowAllTVA(!showAllTVA)}
              type="button"
            >
              {showAllTVA ? "Voir moins" : "Voir plus"}
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default TVAList;
