import React from 'react';
import { IEtablissement, IUniteLegale } from '../../models';
import { formatSiret } from '../../utils/helpers/siren-and-siret';
import Warning from '../alerts/warning';
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
    {etablissement.oldSiret && etablissement.oldSiret !== etablissement.siret && (
      <Warning full>
        Cet établissement est inscrit en double à l’INSEE :{' '}
        {formatSiret(etablissement.oldSiret)} et{' '}
        {formatSiret(etablissement.siret)}. Pour voir les informations
        complètes, consultez la page{' '}
        <a href={`/etablissement/${etablissement.siret}`}>
          {formatSiret(etablissement.siret)}
        </a>
        .
      </Warning>
    )}
    <h2>
      Information sur un établissement de{' '}
      <a href={`/entreprise/${uniteLegale.siren}`}>{uniteLegale.nomComplet}</a>
    </h2>
    <span>établissement ‣ {formatSiret(etablissement.siret)}</span>
    {etablissement.estSiege && <Tag>siège social</Tag>}
    {etablissement.estDiffusible ? (
      <IsActiveTag isActive={etablissement.estActif} />
    ) : (
      <>
        <Tag>Non-diffusible</Tag>
        <IsActiveTag isActive={null} />
      </>
    )}
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
