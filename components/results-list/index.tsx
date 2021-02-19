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
        href={`/entreprise/${result.path}`}
        key={result.siret}
        className="dont-apply-link-style"
      >
        <div className="title">
          {capitalize(result.fullName)}
          {result.isActive && <Tag className="closed">fermée</Tag>}
        </div>
        <div>{result.mainActivityLabel}</div>
        <div className="adress">
          {result.adress || 'Adresse inconnue'}{' '}
          <Tag>
            {`${result.etablissementCount} établissement${
              result.etablissementCount > 1 ? 's' : ''
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
