import type React from "react";
import { Link } from "#/components/link";
import UniteLegaleBadge from "#/components/unite-legale-badge";
import { Icon } from "#/components-ui/icon/wrapper";
import IsActiveTag, { EtatTag } from "#/components-ui/tag/is-active-tag";
import { estDiffusible } from "#/models/core/diffusion";
import { estActif, IETATADMINSTRATIF } from "#/models/core/etat-administratif";
import { isCollectiviteTerritoriale } from "#/models/core/types";
import type { IDirigeants } from "#/models/rne/types";
import type { ISearchResult } from "#/models/search";
import { isPersonneMorale } from "#/utils/helpers/is-personne-morale";
import styles from "./style.module.css";

interface IProps {
  results: ISearchResult[];
  searchTerm?: string;
  shouldColorZipCode?: boolean;
}

const DirigeantsOrElusList: React.FC<{
  dirigeantsOrElus: IDirigeants;
  isDiffusible: boolean;
}> = ({ dirigeantsOrElus, isDiffusible }) => {
  const displayMax = 5;
  const firstFive = dirigeantsOrElus.slice(0, displayMax);
  const moreCount = Math.max(dirigeantsOrElus.length - displayMax, 0);

  if (dirigeantsOrElus.length === 0 || !isDiffusible) {
    return null;
  }

  return (
    <div className={styles["dirigeants-or-elus"]}>
      <Icon slug="user">
        {firstFive
          .map((dirigeantOrElu) =>
            isPersonneMorale(dirigeantOrElu)
              ? `${dirigeantOrElu.denomination}`
              : `${dirigeantOrElu.prenom} ${dirigeantOrElu.nom}`
          )
          .join(", ")}
        {moreCount > 0 &&
          `, et ${moreCount} autre${moreCount === 1 ? "" : "s"}`}
      </Icon>
    </div>
  );
};

const AddressWithColouredZip = ({ adress = "", zip = "" }) => {
  try {
    if (!zip) {
      return <>{adress}</>;
    }

    const [beginning, commune] = adress.split(zip);

    return (
      <>
        {beginning} <mark>{zip}</mark> {commune}
      </>
    );
  } catch {
    return <>{adress}</>;
  }
};

const ResultItem: React.FC<{
  result: ISearchResult;
  shouldColorZipCode: boolean;
}> = ({ result, shouldColorZipCode }) => {
  const shouldColorSiege =
    shouldColorZipCode && result.matchingEtablissements.find((e) => e.estSiege);

  return (
    <li className={styles["result-item"]}>
      <div className={styles.title}>
        <h2 className="fr-h6">
          <Link
            aria-label={`Voir la page de ${result.nomComplet}`}
            className="result-link"
            data-siren={result.siren}
            key={result.siren}
            params={{ slug: result.chemin }}
            to="/entreprise/$slug"
          >
            <span>{`${result.nomComplet}`}</span>
          </Link>
        </h2>
        <UniteLegaleBadge defaultBadgeShouldBeHid small uniteLegale={result} />
        {!estActif(result) && (
          <IsActiveTag
            etatAdministratif={result.etatAdministratif}
            statutDiffusion={result.statutDiffusion}
          />
        )}
      </div>
      <div>
        {result.libelleActivitePrincipale}{" "}
        {result.activitePrincipale ? `(${result.activitePrincipale})` : null}
      </div>
      <DirigeantsOrElusList
        dirigeantsOrElus={
          isCollectiviteTerritoriale(result)
            ? result.colter.elus
            : result.dirigeants
        }
        isDiffusible={estDiffusible(result)}
      />
      <div>
        <Icon slug="mapPin">
          <span className={styles.adress}>
            <AddressWithColouredZip
              adress={result.siege.adressePostale}
              zip={(shouldColorSiege && result.siege.codePostal) || ""}
            />
          </span>
        </Icon>
      </div>
      <ul className={styles["matching-etablissement"]}>
        {(result.matchingEtablissements || [])
          .filter((e) => !e.estSiege)
          .map((etablissement) => (
            <li key={etablissement.siret}>
              <a
                aria-label={`Voir l’établissement ${etablissement.siret} — ${etablissement.adressePostale}`}
                className={styles.adress}
                href={`/etablissement/${etablissement.siret}`}
                style={{ textDecoration: "underline" }}
              >
                <AddressWithColouredZip
                  adress={etablissement.adressePostale}
                  zip={(shouldColorZipCode && etablissement.codePostal) || ""}
                />
                {etablissement.etatAdministratif ===
                  IETATADMINSTRATIF.FERME && (
                  <EtatTag
                    size="small"
                    state={etablissement.etatAdministratif}
                  />
                )}
                <span className={styles.down} />
              </a>
            </li>
          ))}
        <li>
          <a
            className="fr-link"
            href={`/entreprise/${result.chemin}#etablissements`}
          >
            {result.nombreEtablissementsOuverts === 0
              ? "aucun établissement en activité"
              : `${result.nombreEtablissementsOuverts} établissement${
                  result.nombreEtablissementsOuverts > 1 ? "s" : ""
                } en activité`}
          </a>
        </li>
      </ul>
    </li>
  );
};

const ResultsList: React.FC<IProps> = ({
  results,
  shouldColorZipCode = false,
}) => (
  <>
    <ul className="results-list" style={{ listStyle: "none", padding: 0 }}>
      {results.map((result) => (
        <ResultItem
          key={result.siren}
          result={result}
          shouldColorZipCode={shouldColorZipCode}
        />
      ))}
    </ul>
  </>
);

export default ResultsList;
