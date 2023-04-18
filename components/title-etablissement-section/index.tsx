import React from 'react';
import Warning from '#components-ui/alerts/warning';
import IsActiveTag from '#components-ui/is-active-tag';
import { Tag } from '#components-ui/tag';
import { IEtablissement, IUniteLegale } from '#models/index';
import { estNonDiffusible, getNomComplet } from '#models/statut-diffusion';
import { formatSiret } from '#utils/helpers';
import { ISession } from '#utils/session';
import { INSEE } from '../administrations';

const TitleEtablissement: React.FC<{
  uniteLegale: IUniteLegale;
  nomEtablissement: string | null;
  session: ISession | null;
}> = ({ uniteLegale, nomEtablissement, session }) => (
  <h2>
    Information sur{' '}
    {nomEtablissement ? (
      `l’etablissement ${nomEtablissement}`
    ) : (
      <>
        un établissement de{' '}
        <a href={`/entreprise/${uniteLegale.chemin}`}>
          {getNomComplet(uniteLegale, session)}
        </a>
      </>
    )}
  </h2>
);

const MapTitleEtablissement: React.FC<{
  title?: string;
  etablissement: IEtablissement;
}> = ({ title, etablissement }) => (
  <div className="sub-title">
    <h2>{title || 'Information sur l’Etablissement'}</h2>
    <span>établissement ‣ {formatSiret(etablissement.siret)}</span>
    {etablissement.estSiege && <Tag color="info">siège social</Tag>}
    <IsActiveTag
      etatAdministratif={etablissement.etatAdministratif}
      statutDiffusion={etablissement.statutDiffusion}
      since={etablissement.dateFermeture}
    />
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
  session: ISession | null;
}> = ({ uniteLegale, etablissement, session }) => (
  <div className="etablissement-title">
    {etablissement.oldSiret && etablissement.oldSiret !== etablissement.siret && (
      <Warning full>
        Cet établissement est inscrit en double à l’
        <INSEE /> : {formatSiret(etablissement.oldSiret)} et{' '}
        {formatSiret(etablissement.siret)}. Pour voir les informations
        complètes, consultez la page{' '}
        <a href={`/etablissement/${etablissement.siret}`}>
          {formatSiret(etablissement.siret)}
        </a>
        .
      </Warning>
    )}
    <TitleEtablissement
      uniteLegale={uniteLegale}
      nomEtablissement={etablissement.enseigne || etablissement.denomination}
      session={session}
    />
    <div className="etablissement-sub-title">
      <span>établissement ‣ {formatSiret(etablissement.siret)}</span>
      {etablissement.estSiege && <Tag color="info">siège social</Tag>}
      {uniteLegale.allSiegesSiret.indexOf(etablissement.siret) > -1 &&
        !etablissement.estSiege && <Tag>ancien siège social</Tag>}
      {estNonDiffusible(etablissement) && <Tag color="new">non-diffusible</Tag>}
      <IsActiveTag
        etatAdministratif={etablissement.etatAdministratif}
        statutDiffusion={etablissement.statutDiffusion}
        since={etablissement.dateFermeture}
      />
    </div>

    <style jsx>{`
      .etablissement-sub-title {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 5px;
      }
      .etablissement-sub-title > span:first-of-type {
        font-variant: small-caps;
        font-size: 1.1rem;
        color: #666;
      }
    `}</style>
  </div>
);

export { TitleEtablissementWithDenomination, MapTitleEtablissement };
