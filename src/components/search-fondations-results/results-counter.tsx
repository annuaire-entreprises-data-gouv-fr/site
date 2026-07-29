import type React from "react";
import type { IParams } from "#/models/search/search-filter-params";
import styles from "../search-results/style.module.css";

const FondationsResultsCounter: React.FC<{
  resultCount?: number;
  currentPage?: number;
  searchParams: IParams;
  currentSearchTerm: string;
  isMap: boolean;
}> = ({ resultCount = 0, currentPage = 1 }) => {
  const plural = resultCount > 1 ? "s" : "";
  return (
    <>
      {resultCount ? (
        <div className={styles["results-counter-container"]}>
          <div className={styles["results-counter"]}>
            <span>
              {currentPage > 1 && `Page ${currentPage} de `}
              {resultCount === 10_000 && "Plus de "}
              {resultCount} résultat{plural} trouvé{plural}.
            </span>
          </div>
        </div>
      ) : (
        <div className="no-results">
          <div className={styles["results-counter"]}>
            <span>
              Aucune structure n’a été trouvée pour vos critères de recherche.
            </span>
          </div>
          <p>Nous vous suggérons de modifier votre recherche :</p>
          <ul>
            <li>vérifiez l’orthographe du nom, ou des mots-clefs utilisés</li>
            <li>
              si vous connaissez votre n° RNF, tapez uniquement celui-ci dans la
              barre de recherche
            </li>
            <li>essayez de réduire le nombre de mots-clefs</li>
          </ul>
        </div>
      )}
    </>
  );
};

export default FondationsResultsCounter;
