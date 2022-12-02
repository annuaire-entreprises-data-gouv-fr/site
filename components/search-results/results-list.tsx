import React from 'react';
import { ISearchResult } from '../../models/search';
import { SearchFeedback } from '../search-feedback';
import IsActiveTag from '../../components-ui/is-active-tag';
import { IETATADMINSTRATIF } from '../../models/etat-administratif';
import { isPersonneMorale } from '../dirigeants-section/rncs-dirigeants';
import { IDirigeant } from '../../models/immatriculation/rncs';
import UniteLegaleBadge from '../unite-legale-badge';

interface IProps {
  results: ISearchResult[];
  withFeedback?: boolean;
  searchTerm?: string;
}

const DirigeantsList: React.FC<{ dirigeants: IDirigeant[] }> = ({
  dirigeants,
}) => {
  const displayMax = 5;
  const firstFive = dirigeants.slice(0, displayMax);
  const moreCount = Math.max(dirigeants.length - displayMax, 0);

  return (
    <div className="dirigeants">
      {firstFive
        .map((dirigeant) =>
          isPersonneMorale(dirigeant)
            ? `${dirigeant.denomination}`
            : `${dirigeant.prenom} ${dirigeant.nom}`
        )
        .join(', ')}
      {moreCount > 0 && `, et ${moreCount} autre${moreCount === 1 ? '' : 's'}`}
      <style jsx>{`
        .dirigeants {
          font-size: 0.9rem;
          color: #555;
          margin: 8px auto 0;
        }
      `}</style>
    </div>
  );
};

const ResultsList: React.FC<IProps> = ({
  results,
  withFeedback = false,
  searchTerm = '',
}) => (
  <>
    {withFeedback && <SearchFeedback searchTerm={searchTerm} />}
    <div className="results-list">
      {results.map((result) => (
        <a
          href={`/entreprise/${result.chemin}`}
          key={result.siren}
          className="result-link no-style-link"
          data-siren={result.siren}
        >
          <div className="title">
            <span>{`${result.nomComplet}`}</span>
            <UniteLegaleBadge uniteLegale={result} small hiddenByDefault />
            {!result.estActive && (
              <IsActiveTag state={IETATADMINSTRATIF.CESSEE} />
            )}
          </div>
          <div>{result.libelleActivitePrincipale}</div>
          {result.dirigeants.length > 0 && (
            <DirigeantsList dirigeants={result.dirigeants} />
          )}
          <div className="adress">
            <span>{result.siege.adresse || 'Adresse inconnue'} </span>
            {result.nombreEtablissementsOuverts !== 1 ? (
              <b>
                ・{result.nombreEtablissementsOuverts || 'aucun'} établissement
                {result.nombreEtablissementsOuverts > 1 ? 's' : ''} en activité
              </b>
            ) : null}
          </div>
        </a>
      ))}
    </div>
    <style jsx>{`
      .results-list > a {
        text-decoration: none;
        border: none;
        color: #333;
        margin: 30px 0;
        display: block;
        font-size: 1rem;
      }
      .results-list > a .title {
        color: #000091;
        text-decoration: none;
        font-size: 1.1rem;
        margin-bottom: 3px;

        display: flex;
        align-items: center;
        flex-wrap: wrap;
      }

      .results-list > a .title > span:first-of-type {
        margin-right: 10px;
      }
      .results-list > a:hover .title > span:first-of-type {
        text-decoration: underline;
      }

      .results-list > a .adress > span {
        color: #707070;
        font-variant: all-small-caps;
      }
      .results-list > a .adress > b {
        color: #666;
      }
    `}</style>
  </>
);

export default ResultsList;
