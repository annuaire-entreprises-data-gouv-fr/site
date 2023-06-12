import React from 'react';
import Warning from '#components-ui/alerts/warning';
import IsActiveTag from '#components-ui/is-active-tag';
import SocialMedia from '#components-ui/social-media';
import { Tag } from '#components-ui/tag';
import { EtablissementDescription } from '#components/etablissement-description';
import { IEtablissement, IUniteLegale } from '#models/index';
import {
  estNonDiffusible,
  getDenominationEtablissement,
  getEnseigneEtablissement,
  getNomComplet,
} from '#models/statut-diffusion';
import { formatSiret } from '#utils/helpers';
import {
  getCompanyLabel,
  getCompanyPronoun,
} from '#utils/helpers/get-company-page-title';
import { ISession } from '#utils/session';
import { INSEE } from '../administrations';
import { FICHE, Tabs } from './tabs';

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
    {etablissement.oldSiret &&
      etablissement.oldSiret !== etablissement.siret && (
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

    <h2>
      {getEnseigneEtablissement(etablissement, session) ||
        getDenominationEtablissement(etablissement, session) ||
        getNomComplet(uniteLegale, session)}{' '}
      à <a href={`/carte/${etablissement.siret}`}>{etablissement.commune}</a>
    </h2>

    <div className="etablissement-sub-title">
      <span>{formatSiret(etablissement.siret)}</span>
      {estNonDiffusible(etablissement) && <Tag color="new">non-diffusible</Tag>}
      <IsActiveTag
        etatAdministratif={etablissement.etatAdministratif}
        statutDiffusion={etablissement.statutDiffusion}
        since={etablissement.dateFermeture}
      />
    </div>
    <div className="etablissement-sub-sub-title">
      <span>Cet établissement est </span>
      {etablissement.estSiege ? (
        <>
          le <Tag color="info">siège social</Tag>
        </>
      ) : uniteLegale.allSiegesSiret.indexOf(etablissement.siret) > -1 &&
        !etablissement.estSiege ? (
        <>
          un<Tag>ancien siège social</Tag>
        </>
      ) : (
        <Tag>un établissement secondaire</Tag>
      )}
      <span>
        {' '}
        de {getCompanyPronoun(uniteLegale).toLowerCase()}{' '}
        {getCompanyLabel(uniteLegale)}{' '}
        <a href={`/entreprise/${uniteLegale.siren}`}>
          {getNomComplet(uniteLegale, session)}
        </a>
        <a></a>
      </span>
    </div>

    <SocialMedia uniteLegale={uniteLegale} session={session} />

    {estNonDiffusible(etablissement) ? (
      <p>Les informations concernant cette entreprise ne sont pas publiques.</p>
    ) : (
      <EtablissementDescription
        etablissement={etablissement}
        uniteLegale={uniteLegale}
        session={session}
      />
    )}

    <Tabs
      uniteLegale={uniteLegale}
      currentFicheType={FICHE.ETABLISSEMENT}
      session={session}
    />

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

      .etablissement-sub-sub-title:before {
        content: '';
        width: 20px;
        height: 20px;
        margin-right: 10px;
        margin-left: 15px;
        margin-bottom: 4px;
        border: 1px solid #bbb;
        border-top: none;
        border-right: none;
        position: relative;
        display: inline-block;
      }
    `}</style>
  </div>
);

export { TitleEtablissementWithDenomination, MapTitleEtablissement };
