import React from 'react';
import { ResultUniteLegale } from '../../model';
import { capitalize } from '../../utils/formatting';
import { Tag } from '../tag';

interface IProps {
  resultList: ResultUniteLegale[];
}

const ResultList: React.FC<IProps> = ({ resultList }) => (
  <div className="results-list">
    {resultList.map((unite_legale) => (
      <a
        href={`/entreprise/${unite_legale.page_path}`}
        key={unite_legale.siret}
        className="dont-apply-link-style"
      >
        <div className="title">
          {capitalize(unite_legale.nom_complet)}
          {unite_legale.etat_administratif_etablissement !== 'A' && (
            <Tag className="closed">fermée</Tag>
          )}
        </div>
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
        border: none;
        box-shadow: none;
        color: #333;
        margin: 15px 0;
        display: block;
        font-size: 0.9rem;
      }
      .results-list > a .title {
        color: #000091;
        text-decoration: none;
        font-size: 1rem;
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

export default ResultList;
