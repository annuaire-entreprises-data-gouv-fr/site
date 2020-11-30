import React from 'react';
import { Etablissement, ResultUniteLegale } from '../../model';
import { Tag } from '../tag';

interface IProps {
  resultList: ResultUniteLegale[];
  compact?: boolean;
}

const ResultList: React.FC<IProps> = ({ resultList, compact = false }) => (
  <div className="results-list">
    {resultList.map((unite_legale) => (
      <a
        href={`/entreprise/${unite_legale.siren}`}
        key={unite_legale.siret}
        className="dont-apply-link-style"
      >
        <div className="title">{unite_legale.l1_normalisee.toLowerCase()}</div>
        <div>{unite_legale.libelle_activite_principale}</div>
        <div className="adress">
          {unite_legale.geo_adresse || 'Adresse inconnue'}{' '}
          <Tag>
            {`${unite_legale.nombre_etablissements} établissement${
              unite_legale.nombre_etablissements > 1 ? 's' : ''
            }`}
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
        font-size: ${compact ? '1.1rem' : '1.2rem'};
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
