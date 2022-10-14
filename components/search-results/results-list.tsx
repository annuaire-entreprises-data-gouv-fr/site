import React from 'react';
import { ISearchResult } from '../../models/search';
import { SearchFeedback } from '../search-feedback';
import { Tag } from '../../components-ui/tag';
import IsActiveTag from '../../components-ui/is-active-tag';
import { IETATADMINSTRATIF } from '../../models/etat-administratif';
import { hasDirigeantFilter, IParams } from '../../models/search-filter-params';
import { humanPin } from '../../components-ui/icon';
import { isPersonneMorale } from '../dirigeants-section/rncs-dirigeants';

interface IProps {
  results: ISearchResult[];
  withFeedback?: boolean;
  searchTerm?: string;
  searchFilterParams: IParams;
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
  searchFilterParams,
}) => (
  <>
    {withFeedback && <SearchFeedback searchTerm={searchTerm} />}
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
          {hasDirigeantFilter(searchFilterParams) ? (
            <div className="dirigeants">
              {humanPin}&nbsp;
              {result.dirigeants
                .map((dirigeant) =>
                  isPersonneMorale(dirigeant)
                    ? `${dirigeant.denomination}`
                    : `${dirigeant.prenom} ${dirigeant.nom}`
                )
                .join(', ')}
            </div>
          ) : null}
          <div className="adress">
            <span>{result.adresse || 'Adresse inconnue'} </span>
            <EtablissmentTagLabel result={result} />
          </div>
        </a>
      ))}
    </div>
    <style jsx>{`
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

      .results-list .dirigeants {
        font-variant: all-small-caps;
        font-size: 0.9rem;
        color: #666;
        margin: 6px auto 2px;
      }
    `}</style>
  </>
);

export default ResultsList;
