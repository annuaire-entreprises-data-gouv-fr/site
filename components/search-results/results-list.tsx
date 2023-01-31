import React from 'react';
import { humanPin, mapPin } from '#components-ui/icon';
import IsActiveTag from '#components-ui/is-active-tag';
import { isPersonneMorale } from '#components/dirigeants-section/rncs-dirigeants';
import UniteLegaleBadge from '#components/unite-legale-badge';
import { estActif, IETATADMINSTRATIF } from '#models/etat-administratif';
import { IDirigeant } from '#models/immatriculation/rncs';
import { isCollectiviteTerritoriale } from '#models/index';
import { ISearchResult } from '#models/search';

interface IProps {
  results: ISearchResult[];
  searchTerm?: string;
}

const DirigeantsOrElusList: React.FC<{ dirigeantsOrElus: IDirigeant[] }> = ({
  dirigeantsOrElus,
}) => {
  const displayMax = 5;
  const firstFive = dirigeantsOrElus.slice(0, displayMax);
  const moreCount = Math.max(dirigeantsOrElus.length - displayMax, 0);

  if (dirigeantsOrElus.length === 0) {
    return null;
  }

  return (
    <div className="dirigeants-or-elus">
      {humanPin}{' '}
      {firstFive
        .map((dirigeantOrElu) =>
          isPersonneMorale(dirigeantOrElu)
            ? `${dirigeantOrElu.denomination}`
            : `${dirigeantOrElu.prenom} ${dirigeantOrElu.nom}`
        )
        .join(', ')}
      {moreCount > 0 && `, et ${moreCount} autre${moreCount === 1 ? '' : 's'}`}
      <style jsx>{`
        .dirigeants-or-elus {
          font-size: 0.9rem;
          color: #555;
          margin: 8px auto;
        }
      `}</style>
    </div>
  );
};

const ResultItem: React.FC<{ result: ISearchResult }> = ({ result }) => (
  <div className="result-item">
    <a
      href={`/entreprise/${result.chemin}`}
      key={result.siren}
      className="result-link no-style-link"
      data-siren={result.siren}
    >
      <div className="title">
        <span>{`${result.nomComplet}`}</span>
        <UniteLegaleBadge uniteLegale={result} small hiddenByDefault />
        {!estActif(result) && (
          <IsActiveTag
            etatAdministratif={IETATADMINSTRATIF.CESSEE}
            statutDiffusion={result.statutDiffusion}
          />
        )}
      </div>
      <div>{result.libelleActivitePrincipale}</div>
      <DirigeantsOrElusList
        dirigeantsOrElus={
          isCollectiviteTerritoriale(result)
            ? result.colter.elus
            : result.dirigeants
        }
      />
      <div>
        {mapPin}{' '}
        <span className="adress">
          {result.siege.adressePostale || 'Adresse inconnue'}{' '}
        </span>
      </div>
    </a>
    <ul className="matching-etablissement">
      {(result.matchingEtablissements || []).map((etablissement) => (
        <li key={etablissement.siret}>
          <a className="adress" href={`/etablissement/${etablissement.siret}`}>
            {etablissement.adressePostale}
            <span className="down" />
          </a>
          {!estActif(etablissement) && (
            <IsActiveTag
              etatAdministratif={etablissement.etatAdministratif}
              statutDiffusion={etablissement.statutDiffusion}
            />
          )}
        </li>
      ))}
      <li>
        <a
          className="fr-link"
          href={`/entreprise/${result.siren}#etablissements`}
        >
          {result.nombreEtablissementsOuverts === 0
            ? `aucun établissement en activité`
            : `${result.nombreEtablissementsOuverts} établissement${
                result.nombreEtablissementsOuverts > 1 ? 's' : ''
              } en activité`}
        </a>
      </li>
    </ul>

    <style jsx>{`
      .result-item {
        margin: 30px 0;
      }

      .result-item a {
        background-image: none;
      }
      .result-item a:not(.no-style-link):hover,
      .result-item > a:hover .title > span:first-of-type {
        text-decoration: underline;
      }

      .result-item > a {
        text-decoration: none;
        border: none;
        color: #333;
        display: block;
        font-size: 1rem;
      }
      .result-item > a .title {
        color: #000091;
        text-decoration: none;
        font-size: 1.1rem;
        margin-bottom: 3px;

        display: flex;
        align-items: center;
        flex-wrap: wrap;
      }

      .result-item > a .title > span:first-of-type {
        margin-right: 10px;
      }

      .result-item ul.matching-etablissement {
        margin-left: 10px;
      }

      .result-item ul.matching-etablissement li {
        list-style-type: none;
        padding-left: 15px;
        position: relative;
      }
      .result-item ul.matching-etablissement li:before,
      .result-item ul.matching-etablissement .down {
        content: '';
        width: 10px;
        height: 15px;
        border: 1px solid #bbb;
        border-top: none;
        border-right: none;
        position: absolute;
        left: 0;
        top: 0;
      }
      .result-item ul.matching-etablissement .down {
        border-bottom: none;
        height: 100%;
      }

      .result-item .adress {
        color: #707070;
        font-size: 0.9rem;
      }
    `}</style>
  </div>
);

const ResultsList: React.FC<IProps> = ({ results }) => (
  <>
    <div className="results-list">
      {results.map((result) => (
        <ResultItem key={result.siren} result={result} />
      ))}
    </div>
  </>
);

export default ResultsList;
