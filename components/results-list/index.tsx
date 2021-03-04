import React from 'react';
import { ISearchResult } from '../../models/search';
import { capitalize } from '../../utils/helpers/formatting';
import { Tag } from '../tag';

interface IProps {
  results: ISearchResult[];
}

const ResultsList: React.FC<IProps> = ({ results }) => (
  <div className="results-list">
    {results.map((result) => (
      <a
        href={`/entreprise/${result.chemin}`}
        key={result.siret}
        className="dont-apply-link-style"
      >
        <div className="title">
          {capitalize(result.nomComplet)}
          {!result.estActive && <Tag className="closed">fermée</Tag>}
        </div>
        <div>{result.libelleActivitePrincipale}</div>
        <div className="adress">
          {result.adresse || 'Adresse inconnue'}{' '}
          <Tag>
            {`${result.nombreEtablissements} établissement${
              result.nombreEtablissements > 1 ? 's' : ''
            }`}
          </Tag>
        </div>
      </a>
    ))}
    <style jsx>{`
      .results-list > a {
        text-decoration: none;
        border: none;
        box-shadow: none;
        color: #333;
        margin: 20px 0;
        display: block;
        font-size: 0.9rem;
      }
      .results-list > a .title {
        color: #000091;
        text-decoration: none;
        font-size: 1.1rem;
        margin-bottom: 5px 0;
      }

      .results-list > a:hover .title {
        text-decoration: underline;
      }

      .results-list > a .adress {
        font-size: 0.9rem;
        color: rgb(112, 117, 122);
      }
    `}</style>
  </div>
);

export default ResultsList;
