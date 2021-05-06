import React from 'react';
import { IEtablissement, IUniteLegale } from '../../models';
import { capitalize } from '../../utils/helpers/formatting';
import { formatSiret } from '../../utils/helpers/siren-and-siret';
import IsActiveTag from '../is-active-tag';
import { Tag } from '../tag';

const TitleEtablissement: React.FC<{
  title?: string;
  etablissement: IEtablissement;
}> = ({ title, etablissement }) => (
  <div className="sub-title">
    <h2>{title || 'Information sur l’Etablissement'}</h2>
    <span>établissement ‣ {formatSiret(etablissement.siret)}</span>
    {etablissement.estSiege && <Tag>siège social</Tag>}
    <IsActiveTag isActive={etablissement.estActif} />
    <style jsx>{`
      .sub-title > span {
        color: #666;
        font-variant: small-caps;
        font-size: 1.1rem;
      }
    `}</style>
  </div>
);

const TitleEtablissementWithDenomination: React.FC<{
  uniteLegale: IUniteLegale;
  etablissement: IEtablissement;
}> = ({ uniteLegale, etablissement }) => (
  <div className="sub-title">
    <h2>
      Information sur un établissement de{' '}
      <a href={`/entreprise/${uniteLegale.siren}`}>
        {capitalize(uniteLegale.nomComplet)}
      </a>
    </h2>
    <span>établissement ‣ {formatSiret(etablissement.siret)}</span>
    {etablissement.estSiege && <Tag>siège social</Tag>}
    <IsActiveTag isActive={etablissement.estActif} />
    <style jsx>{`
      .sub-title > span {
        color: #666;
        font-variant: small-caps;
        font-size: 1.1rem;
      }
    `}</style>
  </div>
);
export { TitleEtablissementWithDenomination, TitleEtablissement };
