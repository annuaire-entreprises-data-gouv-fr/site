import React from 'react';
import { ISearchResult, ISearchResults } from '../../models/search';
import { SearchFeedback } from '../search-feedback';
import { Tag } from '../../components-ui/tag';
import IsActiveTag from '../../components-ui/is-active-tag';
import { IETATADMINSTRATIF } from '../../models/etat-administratif';

interface IProps {
  results: ISearchResult[];
  searchTerm?: string;
  withFeedback?: boolean;
}

const EtablissmentTagLabel: React.FC<{ result: ISearchResult }> = ({
  result,
}) => {
  const openCount = result.nombreEtablissementsOuverts || 'aucun';
  const plural = openCount > 1 ? 's' : '';

  return (
    <Tag>
      {openCount} établissement{plural} en activité
    </Tag>
  );
};

const ResultsList: React.FC<IProps> = ({
  results,
  withFeedback = false,
  searchTerm = '',
}) => (
  <div className="results-wrapper">
    <div className="results-list">
      {results.map((result) => (
        <a
          href={`/entreprise/${result.chemin}`}
          key={result.siret}
          className="result-link no-style-link"
          data-siren={result.siren}
        >
          <div className="title">
            <span>{`${result.nomComplet}`}</span>
            {!result.estActive && (
              <IsActiveTag state={IETATADMINSTRATIF.CESSEE} />
            )}
          </div>
          <div>{result.libelleActivitePrincipale}</div>
          <div className="adress">
            <span>{result.adresse || 'Adresse inconnue'} </span>
            <EtablissmentTagLabel result={result} />
          </div>
        </a>
      ))}
    </div>
    {withFeedback && <SearchFeedback searchTerm={searchTerm} />}
    <style jsx>{`
      .results-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
      }
      .results-list > a {
        text-decoration: none;
        border: none;
        color: #333;
        margin: 20px 0;
        display: block;
        font-size: 1rem;
      }
      .results-list > a .title {
        color: #000091;
        text-decoration: none;
        font-size: 1.1rem;
        margin-bottom: 5px 0;
      }
      .results-list > a .title > span:first-of-type {
        font-variant: all-small-caps;
      }

      .results-list > a:hover .title {
        text-decoration: underline;
      }

      .results-list > a .adress > span {
        color: #707070;
        font-variant: all-small-caps;
      }

      @media only screen and (min-width: 1px) and (max-width: 900px) {
        .results-wrapper {
          flex-direction: column-reverse;
        }
      }
    `}</style>
  </div>
);

export default ResultsList;
