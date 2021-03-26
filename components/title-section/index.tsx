import React from 'react';

import { capitalize, formatNumbersFr } from '../../utils/helpers/formatting';
import { Tag } from '../tag';
import IsActiveTag from '../is-active-tag';

export enum FICHE {
  INFORMATION = 'informations générales',
  JUSTIFICATIFS = 'justificatifs',
  ANNONCES = 'annonces & conventions collectives',
}
interface IProps {
  siren: string;
  name: string;
  isActive: boolean | null;
  isDiffusible?: boolean;
  ficheType?: FICHE;
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
        max-width: 50%;
        font-size: 0.9rem;
      }
      .title-tabs > a {
        margin-right: 8px;
        padding: 10px 5px;
        border: 2px solid #dfdff1;
        background-color: #f7f7fd;
        margin-bottom: -2px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        box-shadow: none;
      }

      .title-tabs > a.active {
        background-color: #fff;
        border-bottom: 0;
      }
    `}</style>
  </>
);

const Title: React.FC<IProps> = ({
  siren,
  name,
  isActive,
  isDiffusible = true,
  ficheType = FICHE.INFORMATION,
}) => (
  <div className="header-section">
    <div className="title">
      <h1>
        <a href={`/entreprise/${siren}`}>{capitalize(name)}</a>
      </h1>
      <div>
        <span>unité légale ‣ {formatNumbersFr(siren)}</span>
        <span>
          {!isDiffusible && <Tag>non diffusible</Tag>}
          <IsActiveTag isActive={isActive} />
        </span>
      </div>
    </div>
    <Tabs siren={siren} ficheType={ficheType} />

    <style jsx>{`
      .header-section {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        flex-direction: row;
        margin-bottom: 30px;
        border-bottom: 2px solid #dfdff1;
      }

      .title {
        margin: 20px 0 30px;
        display: flex;
        align-items: start;
        flex-direction: column;
        justify-content: center;
      }
      .title h1 {
        margin: 0;
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
