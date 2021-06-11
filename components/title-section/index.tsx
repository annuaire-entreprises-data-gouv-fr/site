import React from 'react';

import { capitalize, formatNumbersFr } from '../../utils/helpers/formatting';
import { Tag } from '../tag';
import IsActiveTag from '../is-active-tag';
import { UnitLegaleDescription } from '../unite-legale-description';
import { IUniteLegale } from '../../models';
import SocialMedia from '../social-media';

export enum FICHE {
  INFORMATION = 'informations générales',
  JUSTIFICATIFS = 'justificatifs',
  ANNONCES = 'annonces & conventions collectives',
}
interface IProps {
  ficheType?: FICHE;
  uniteLegale: IUniteLegale;
}

const Tabs: React.FC<{ ficheType: FICHE; siren: string }> = ({
  ficheType,
  siren,
}) => (
  <>
    <div className="title-tabs">
      <a
        className={`${ficheType === FICHE.INFORMATION && 'active'}`}
        href={`/entreprise/${siren}`}
      >
        Informations générales
      </a>
      <a
        className={`${ficheType === FICHE.JUSTIFICATIFS && 'active'}`}
        href={`/justificatif/${siren}`}
      >
        Justificatifs
      </a>
      <a
        className={`${ficheType === FICHE.ANNONCES && 'active'}`}
        href={`/annonces/${siren}`}
      >
        Annonces & conventions collectives
      </a>
    </div>

    <style jsx>{`
      .title-tabs {
        display: flex;
        flex-grow: 1;
        font-size: 0.9rem;
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
    `}</style>
  </>
);

const Title: React.FC<IProps> = ({
  ficheType = FICHE.INFORMATION,
  uniteLegale,
}) => (
  <div className="header-section">
    <div className="title">
      <h1>
        <a href={`/entreprise/${uniteLegale.siren}`}>
          {capitalize(uniteLegale.nomComplet)}
        </a>
      </h1>
      <div>
        <span>unité légale ‣ {formatNumbersFr(uniteLegale.siren)}</span>
        <span>
          {!uniteLegale.estDiffusible && <Tag>non diffusible</Tag>}
          <IsActiveTag isActive={uniteLegale.estActive} isUniteLegale={true} />
        </span>
      </div>
    </div>
    <SocialMedia siren={uniteLegale.siren} />
    <UnitLegaleDescription uniteLegale={uniteLegale} />
    <Tabs siren={uniteLegale.siren} ficheType={ficheType} />

    <style jsx>{`
      .header-section {
        display: block;
        margin-bottom: 40px;
        border-bottom: 2px solid #dfdff1;
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
