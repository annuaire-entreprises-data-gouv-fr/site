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

export enum FICHE {
  INFORMATION = 'résumé',
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
        className={`${ficheType === FICHE.INFORMATION && 'active'}`}
        href={`/entreprise/${siren}`}
      >
        Résumé
      </a>
      <a
        className={`${ficheType === FICHE.JUSTIFICATIFS && 'active'}`}
        href={`/justificatif/${siren}`}
        rel="nofollow"
      >
        Justificatif d’immatriculation
      </a>
      <a
        className={`${ficheType === FICHE.DIRIGEANTS && 'active'}`}
        href={`/dirigeants/${siren}`}
        rel="nofollow"
      >
        Dirigeants
      </a>
      <a
        className={`${ficheType === FICHE.ANNONCES && 'active'}`}
        href={`/annonces/${siren}`}
        rel="nofollow"
      >
        Annonces
      </a>
      <a
        className={`${ficheType === FICHE.DIVERS && 'active'}`}
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
        background-color: #fff;
        border-bottom: 0;
        box-shadow: none;
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
          box-shadow: none;
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
      <AssociationAdressAlert uniteLegale={uniteLegale} />
      <h1>
        <a href={`/entreprise/${uniteLegale.siren}`}>
          {uniteLegale.nomComplet}
        </a>
      </h1>
      <div>
        <span>unité légale ‣ {formatIntFr(uniteLegale.siren)}</span>
        <span>
          {!uniteLegale.estDiffusible && (
            <Tag className="unknown">Non-diffusible</Tag>
          )}
          <IsActiveTag state={uniteLegale.etatAdministratif} />
        </span>
      </div>
    </div>
    <SocialMedia siren={uniteLegale.siren} />
    {!uniteLegale.estDiffusible ? (
      <p>Les informations concernant cette entité ne sont pas publiques.</p>
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
      .title > div > span {
        color: #666;
      }
      .title > div > span:first-of-type {
        font-variant: small-caps;
        font-size: 1.1rem;
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
        .title > div > span:first-of-type {
          display: block;
        }
      }
    `}</style>
  </div>
);

export default Title;
