import React from 'react';
import IsActiveTag from '#components-ui/is-active-tag';
import SocialMedia from '#components-ui/social-media';
import { Tag } from '#components-ui/tag';
import UniteLegaleBadge from '#components/unite-legale-badge';
import { UniteLegaleDescription } from '#components/unite-legale-description';
import { UniteLegaleEtablissementCountDescription } from '#components/unite-legale-description/etablissement-count-description';
import {
  estDiffusible,
  estNonDiffusible,
  getNomComplet,
} from '#models/core/statut-diffusion';
import { IUniteLegale } from '#models/core/types';
import { formatIntFr } from '#utils/helpers';
import { ISession } from '#utils/session';
import TitleAlerts from './alerts';
import { FICHE, Tabs } from './tabs';

type IProps = {
  ficheType?: FICHE;
  uniteLegale: IUniteLegale;
  session: ISession | null;
};

const Title: React.FC<IProps> = ({
  ficheType = FICHE.INFORMATION,
  uniteLegale,
  session,
}) => (
  <div className="header-section">
    <div className="title">
      <TitleAlerts
        uniteLegale={uniteLegale}
        session={session}
        statutDiffusion={uniteLegale.statutDiffusion}
      />
      <h1>
        <a href={`/entreprise/${uniteLegale.chemin}`}>
          {getNomComplet(uniteLegale, session)}
        </a>
      </h1>
      <div className="unite-legale-sub-title">
        <UniteLegaleBadge uniteLegale={uniteLegale} />
        <span className="siren">
          &nbsp;‣&nbsp;{formatIntFr(uniteLegale.siren)}
        </span>
        <span>
          {!estDiffusible(uniteLegale) && <Tag color="new">non-diffusible</Tag>}
          <IsActiveTag
            etatAdministratif={uniteLegale.etatAdministratif}
            statutDiffusion={uniteLegale.statutDiffusion}
          />
        </span>
      </div>
      {uniteLegale.etablissements.all && (
        <div className="unite-legale-sub-sub-title">
          <UniteLegaleEtablissementCountDescription uniteLegale={uniteLegale} />
        </div>
      )}
    </div>
    <SocialMedia
      path={`https://annuaire-entreprises.data.gouv.fr/entreprise/${uniteLegale.chemin}`}
      label={getNomComplet(uniteLegale, session)}
      siren={uniteLegale.siren}
    />
    {estNonDiffusible(uniteLegale) ? (
      <p>Les informations concernant cette entreprise ne sont pas publiques.</p>
    ) : (
      <UniteLegaleDescription uniteLegale={uniteLegale} session={session} />
    )}

    <Tabs
      uniteLegale={uniteLegale}
      currentFicheType={ficheType}
      session={session}
    />
    <style jsx>{`
      .header-section {
        display: block;
        margin-bottom: 40px;
      }

      .title {
        margin: 40px 0 0;
        display: flex;
        align-items: start;
        flex-direction: column;
        justify-content: center;
      }
      .title h1 {
        margin: 0;
        margin-bottom: 7px;
        line-height: 2.5rem;
      }
      .title h1 > a {
        margin: 0;
        padding: 0;
        font-variant: all-small-caps;
      }

      .unite-legale-sub-title {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 5px;
      }
      .unite-legale-sub-title > span.siren {
        font-variant: small-caps;
        font-size: 1.1rem;
        color: #666;
      }

      .unite-legale-sub-sub-title:before {
        content: '';
        width: 20px;
        height: 20px;
        margin-right: 10px;
        margin-left: 15px;
        margin-bottom: 5px;
        border: 1px solid #bbb;
        border-top: none;
        border-right: none;
        position: relative;
        display: inline-block;
      }

      @media only screen and (min-width: 1px) and (max-width: 992px) {
        .title {
          margin-top: 10px;
        }
        .header-section {
          justify-content: start;
          align-items: flex-start;
          flex-direction: column;
        }
      }
    `}</style>
  </div>
);

export default Title;
