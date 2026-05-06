"use client";

import { useState } from "react";
import { CopyPaste } from "#components/table/copy-paste";
import { formatIntFr } from "#utils/helpers";
import styles from "./style.module.css";

const MAX_VISIBLE_TVA = 5;

const formatTVA = (tva: string) => {
  const normalizedTVA = tva.replace(/\s/g, "");

  if (normalizedTVA.startsWith("FR")) {
    return formatIntFr(normalizedTVA);
  }

  return `FR${formatIntFr(normalizedTVA)}`;
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
            className={
              tvaNumbers.length === 1 ? styles.tvaOnlyItem : styles.tvaListItem
            }
            key={tva}
          >
            <CopyPaste label="TVA" shouldRemoveSpace={true}>
              {formatTVA(tva)}
            </CopyPaste>
          </li>
        ))}
      </ul>
      {shouldDisplayShowMore && (
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
      )}
    </div>
  );
};

export default TVAList;
