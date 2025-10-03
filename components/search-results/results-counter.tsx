import MapOrListSwitch from "#components/advanced-search/map-or-list";
import { buildSearchQuery, type IParams } from "#models/search/search-filter-params";
import type React from "react";
import styles from "./style.module.css";

const ResultsCounter: React.FC<{
  resultCount?: number;
  currentPage?: number;
  searchParams: IParams;
  currentSearchTerm: string;
  isMap: boolean;
}> = ({
  resultCount = 0,
  currentPage = 1,
  searchParams = {},
  currentSearchTerm = "",
  isMap = false,
}) => {
  const plural = resultCount > 1 ? "s" : "";
  return (
    <>
      {resultCount ? (
        <div className={styles["results-counter-container"]}>
          <div className={styles["results-counter"]}>
            <span>
              {currentPage > 1 && `Page ${currentPage} de `}
              {resultCount === 10000 && "Plus de "}
              {resultCount} résultat{plural} trouvé{plural}.
            </span>
          </div>
          <div className={styles["map-switch"]}>
            <MapOrListSwitch
              isMap={isMap}
              query={buildSearchQuery(currentSearchTerm, searchParams)}
            />
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
              si vous connaissez votre n° siren ou siret, tapez uniquement
              celui-ci dans la barre de recherche
            </li>
            <li>essayez de réduire le nombre de mots-clefs</li>
            <li>
              essayez d’utiliser un filtre avancé, plus précis que la recherche
              générale (géographique ou par nom et prénom)
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default ResultsCounter;
