import React from 'react';

import { formatIntFr } from '../../utils/helpers/formatting';
import { Tag } from '../../components-ui/tag';
import IsActiveTag from '../../components-ui/is-active-tag';
import { UnitLegaleDescription } from '../unite-legale-description';
import { IUniteLegale } from '../../models';
import SocialMedia from '../../components-ui/social-media';
import { PrintNever } from '../../components-ui/print-visibility';
import MultipleSirenAlert from '../../components-ui/alerts/multiple-siren';
import AssociationAdressAlert from '../../components-ui/alerts/association-adress';
import { isAssociation } from '../../models';
import UniteLegaleBadge from '../unite-legale-badge';

export enum FICHE {
  INFORMATION = 'informations générales',
  JUSTIFICATIFS = 'justificatifs',
  ANNONCES = 'annonces',
  DIRIGEANTS = 'dirigeants',
  COMPTES = 'bilans & comptes',
  ACTES = 'actes & statuts',
  DIVERS = 'conventions collectives',
}
interface IProps {
  ficheType?: FICHE;
  uniteLegale: IUniteLegale;
}

const Tabs: React.FC<{ ficheType: FICHE; siren: string }> = ({
  ficheType,
  siren,
}) => (
  <PrintNever>
    <div className="title-tabs">
      <a
        className={`${
          ficheType === FICHE.INFORMATION && 'active'
        } no-style-link`}
        href={`/entreprise/${siren}`}
      >
        Informations générales
      </a>
      <a
        className={`${
          ficheType === FICHE.JUSTIFICATIFS && 'active'
        } no-style-link`}
        href={`/justificatif/${siren}`}
        rel="nofollow"
      >
        Justificatif d’immatriculation
      </a>
      <a
        className={`${
          ficheType === FICHE.DIRIGEANTS && 'active'
        } no-style-link`}
        href={`/dirigeants/${siren}`}
        rel="nofollow"
      >
        Dirigeants
      </a>
      <a
        className={`${ficheType === FICHE.ANNONCES && 'active'} no-style-link`}
        href={`/annonces/${siren}`}
        rel="nofollow"
      >
        Annonces
      </a>
      <a
        className={`${ficheType === FICHE.DIVERS && 'active'} no-style-link`}
        href={`/divers/${siren}`}
        rel="nofollow"
      >
        Conventions collectives
      </a>
    </div>

    <style jsx>{`
      .title-tabs {
        display: flex;
        flex-grow: 1;
        font-size: 0.9rem;
        border-bottom: 2px solid #dfdff1;
      }
      .title-tabs > a {
        color: #000091;
        font-weight: bold;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        margin: 0 4px;
        padding: 10px 5px;
        border: 2px solid #dfdff1;
        background-color: #efeffb;
        margin-bottom: -2px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        box-shadow: 0 -8px 5px -5px #dfdff1 inset;
      }

      .title-tabs > a:hover {
        background-color: #dfdff1;
      }

      .title-tabs > a.active {
        box-shadow: none;
        background-color: #fff;
        border-bottom: 0;
      }

      @media only screen and (min-width: 1px) and (max-width: 650px) {
        .title-tabs {
          flex-direction: column;
          border-bottom: 0;
        }
        .title-tabs > a {
          margin: 3px;
        }
        .title-tabs > a.active {
          background-color: #fff;
          border-bottom: 2px solid #dfdff1;
        }
      }
    `}</style>
  </PrintNever>
);

const Title: React.FC<IProps> = ({
  ficheType = FICHE.INFORMATION,
  uniteLegale,
}) => (
  <div className="header-section">
    <div className="title">
      <MultipleSirenAlert uniteLegale={uniteLegale} />
      {isAssociation(uniteLegale) && (
        <AssociationAdressAlert uniteLegale={uniteLegale} />
      )}
      <h1>
        <a href={`/entreprise/${uniteLegale.siren}`}>
          {uniteLegale.nomComplet}
        </a>
      </h1>
      <div className="unite-legale-sub-title">
        <UniteLegaleBadge uniteLegale={uniteLegale} />
        <span className="siren">
          &nbsp;‣&nbsp;{formatIntFr(uniteLegale.siren)}
        </span>
        <span>
          {!uniteLegale.estDiffusible && (
            <Tag className="unknown">Non-diffusible</Tag>
          )}
          <IsActiveTag state={uniteLegale.etatAdministratif} />
        </span>
      </div>
    </div>
    <SocialMedia uniteLegale={uniteLegale} />
    {!uniteLegale.estDiffusible ? (
      <p>Les informations concernant cette entreprise ne sont pas publiques.</p>
    ) : (
      <UnitLegaleDescription uniteLegale={uniteLegale} />
    )}
    <Tabs siren={uniteLegale.siren} ficheType={ficheType} />

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

      @media only screen and (min-width: 1px) and (max-width: 900px) {
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
