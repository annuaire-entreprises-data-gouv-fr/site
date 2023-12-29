import React from 'react';
import NonDiffusibleAlert from '#components-ui/alerts/non-diffusible';
import ProtectedData from '#components-ui/alerts/protected-data';
import Warning from '#components-ui/alerts/warning';
import { Icon } from '#components-ui/icon/wrapper';
import IsActiveTag from '#components-ui/is-active-tag';
import { PrintNever } from '#components-ui/print-visibility';
import SocialMedia from '#components-ui/social-media';
import { Tag } from '#components-ui/tag';
import { EtablissementDescription } from '#components/etablissement-description';
import { IEtablissement, IUniteLegale } from '#models/index';
import {
  estDiffusible,
  estNonDiffusible,
  getEtablissementName,
  getNomComplet,
} from '#models/statut-diffusion';
import {
  formatIntFr,
  formatSiret,
  getCompanyLabel,
  getCompanyPronoun,
} from '#utils/helpers';
import { ISession, isAgent } from '#utils/session';
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

    {isAgent(session) && (
      <PrintNever>
        <ProtectedData full>
          Vous êtes connecté avec un compte <b>agent public</b>. Ce compte vous
          donne accès à certaines données exclusivement réservées à
          l’administration, identifiables par la mention “
          <Icon size={12} slug="lockFill">
            Réservé aux agents publics
          </Icon>
          ” .
          <br />
          <br />
          Ce service est en <Tag color="new">beta test</Tag>. Il est possible
          que vous recontriez des bugs ou des erreurs. Si cela arrive,{' '}
          <a href="mailto:charlotte.choplin@beta.gouv.fr">
            n’hésitez pas à nous contacter
          </a>
          .
        </ProtectedData>
      </PrintNever>
    )}
    {!estDiffusible(etablissement) && (
      <>
        {isAgent(session) ? (
          <ProtectedData full>
            Cette structure est non-diffusible mais vous pouvez voir ses
            informations grâce à votre compte <b>agent-public</b>.
          </ProtectedData>
        ) : (
          <NonDiffusibleAlert />
        )}
      </>
    )}

    <h1>
      Établissement {getEtablissementName(etablissement, uniteLegale, session)}{' '}
      à <a href={`/carte/${etablissement.siret}`}>{etablissement.commune}</a>
    </h1>

    <div className="etablissement-sub-title">
      <span className="siret-or-siren">{formatSiret(etablissement.siret)}</span>
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
          le{' '}
          <Tag color="info" size="small">
            siège social
          </Tag>
        </>
      ) : uniteLegale.allSiegesSiret.indexOf(etablissement.siret) > -1 &&
        !etablissement.estSiege ? (
        <>
          un<Tag size="small">ancien siège social</Tag>
        </>
      ) : (
        <Tag size="small">un établissement secondaire</Tag>
      )}
      <span>
        {' '}
        de {getCompanyPronoun(uniteLegale).toLowerCase()}
        {getCompanyLabel(uniteLegale)}{' '}
        <a href={`/entreprise/${uniteLegale.siren}`}>
          {getNomComplet(uniteLegale, session)}&nbsp;‣&nbsp;
          <span className="siret-or-siren">
            {formatIntFr(uniteLegale.siren)}
          </span>
        </a>
        <IsActiveTag
          etatAdministratif={uniteLegale.etatAdministratif}
          statutDiffusion={uniteLegale.statutDiffusion}
          size="small"
        />
      </span>
    </div>
    <br />

    <SocialMedia
      path={`https://annuaire-entreprises.data.gouv.fr/etablissement/${etablissement.siret}`}
      label={getEtablissementName(etablissement, uniteLegale, session)}
    />

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
      .siret-or-siren {
        font-variant: small-caps;
        font-size: 1.1rem;
        color: #666;
      }

      h1 {
        line-height: 1.5rem;
        font-size: 1.4rem;
      }

      .etablissement-sub-title {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
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

export { MapTitleEtablissement, TitleEtablissementWithDenomination };
