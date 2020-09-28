import React from 'react';
import { Etablissement } from '../../model';
import { Tag } from '../tag';

interface IProps {
  resultList: Etablissement[];
  compact: boolean;
}

const ResultList: React.FC<IProps> = ({ resultList, compact = false }) => (
  <div className="results-list">
    {resultList.map((etablissement) => (
      <a
        href={`/entreprise/${etablissement.siret}`}
        key={etablissement.siret}
        className="dont-apply-link-style"
      >
        <div className="title">{etablissement.l1_normalisee.toLowerCase()}</div>
        <div>{etablissement.libelle_activite_principale}</div>
        <div className="adress">
          {etablissement.geo_adresse}{' '}
          <Tag>
            {etablissement.is_siege !== '1'
              ? 'établissement secondaire'
              : 'siège social'}
          </Tag>
        </div>
      </a>
    ))}
    <style jsx>{`
      .results-list > a {
        text-decoration: none;
        color: #333;
        margin: ${compact ? '15px' : '25px'} 0;
        display: block;
      }
      .results-list > a .title {
        color: #000091;
        text-decoration: none;
        font-size: ${compact ? '1.1rem' : '1.4rem'};
        margin-bottom: ${compact ? '0' : '5px'} 0;
      }

      .results-list > a:hover .title {
        text-decoration: underline;
      }

      .results-list > a .adress {
        font-size: ${compact ? '0.8rem' : '0.9rem'};
        color: rgb(112, 117, 122);
      }
    `}</style>
  </div>
);

export default ResultList;
