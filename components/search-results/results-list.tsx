import React from 'react';
import { Icon } from '#components-ui/icon/wrapper';
import IsActiveTag from '#components-ui/is-active-tag';
import { isPersonneMorale } from '#components/dirigeants-section/is-personne-morale';
import UniteLegaleBadge from '#components/unite-legale-badge';
import { estActif } from '#models/core/etat-administratif';
import {
  getAdresseEtablissement,
  getAdresseUniteLegale,
} from '#models/core/statut-diffusion';
import { isCollectiviteTerritoriale } from '#models/core/types';
import { IDirigeant } from '#models/immatriculation';
import { ISearchResult } from '#models/search';
import styles from './style.module.css';

type IProps = {
  results: ISearchResult[];
  searchTerm?: string;
  shouldColorZipCode?: boolean;
};

const DirigeantsOrElusList: React.FC<{
  dirigeantsOrElus: IDirigeant[];
}> = ({ dirigeantsOrElus }) => {
  const displayMax = 5;
  const firstFive = dirigeantsOrElus.slice(0, displayMax);
  const moreCount = Math.max(dirigeantsOrElus.length - displayMax, 0);

  if (dirigeantsOrElus.length === 0) {
    return null;
  }

  return (
    <div className={styles['dirigeants-or-elus']}>
      <Icon slug="humanPin">
        {firstFive
          .map((dirigeantOrElu) =>
            isPersonneMorale(dirigeantOrElu)
              ? `${dirigeantOrElu.denomination}`
              : `${dirigeantOrElu.prenom} ${dirigeantOrElu.nom}`
          )
          .join(', ')}
        {moreCount > 0 &&
          `, et ${moreCount} autre${moreCount === 1 ? '' : 's'}`}
      </Icon>
    </div>
  );
};

const AddressWithColouredZip = ({ adress = '', zip = '' }) => {
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
    <div className={styles['result-item']}>
      <a
        href={`/entreprise/${result.chemin}`}
        key={result.siren}
        className="result-link no-style-link"
        data-siren={result.siren}
      >
        <div className={styles['title']}>
          <span>{`${result.nomComplet}`}</span>
          <UniteLegaleBadge
            uniteLegale={result}
            small
            defaultBadgeShouldBeHid
          />
          {!estActif(result) && (
            <IsActiveTag
              etatAdministratif={result.etatAdministratif}
              statutDiffusion={result.statutDiffusion}
            />
          )}
        </div>
        <div>
          {result.libelleActivitePrincipale}{' '}
          {result.activitePrincipale ? `(${result.activitePrincipale})` : null}
        </div>
        <DirigeantsOrElusList
          dirigeantsOrElus={
            isCollectiviteTerritoriale(result)
              ? result.colter.elus
              : result.dirigeants
          }
        />
        <div>
          <Icon slug="mapPin">
            <span className={styles['adress']}>
              <AddressWithColouredZip
                adress={getAdresseUniteLegale(result, null, true)}
                zip={(shouldColorSiege && result.siege.codePostal) || ''}
              />
            </span>
          </Icon>
        </div>
      </a>
      <ul className={styles['matching-etablissement']}>
        {(result.matchingEtablissements || [])
          .filter((e) => !e.estSiege)
          .map((etablissement) => (
            <li key={etablissement.siret}>
              <a
                className={styles['adress']}
                href={`/etablissement/${etablissement.siret}`}
              >
                <AddressWithColouredZip
                  adress={getAdresseEtablissement(etablissement, null, true)}
                  zip={(shouldColorZipCode && etablissement.codePostal) || ''}
                />
                <span className={styles['down']} />
              </a>
            </li>
          ))}
        <li>
          <a
            className="fr-link"
            href={`/entreprise/${result.chemin}#etablissements`}
          >
            {result.nombreEtablissementsOuverts === 0
              ? `aucun établissement en activité`
              : `${result.nombreEtablissementsOuverts} établissement${
                  result.nombreEtablissementsOuverts > 1 ? 's' : ''
                } en activité`}
          </a>
        </li>
      </ul>
    </div>
  );
};

const ResultsList: React.FC<IProps> = ({
  results,
  shouldColorZipCode = false,
}) => (
  <>
    <div className="results-list">
      {results.map((result) => (
        <ResultItem
          key={result.siren}
          result={result}
          shouldColorZipCode={shouldColorZipCode}
        />
      ))}
    </div>
  </>
);

export default ResultsList;
