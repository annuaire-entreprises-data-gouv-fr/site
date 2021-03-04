import React from 'react';

import { capitalize, formatNumbersFr } from '../../utils/helpers/formatting';
import { Tag } from '../tag';
import ButtonLink from '../button';
import { formatSiret } from '../../utils/helpers/siren-and-siret';
import IsActiveTag from '../is-active-tag';

export enum FICHE {
  UNITELEGALE = 'entité',
  ETABLISSEMENT = 'établissement',
  JUSTIFICATIFS = 'documents & justificatifs',
}
interface IProps {
  siren: string;
  siret: string;
  name: string;
  isActive: boolean | null;
  isDiffusible?: boolean;
  isSiege?: boolean;
  ficheType?: FICHE;
}

const CtaForTitle: React.FC<{ siren: string }> = ({ siren }) => (
  <div className="wrapper">
    <div className="cta">
      <ButtonLink href={`/justificatif/${siren}`} nofollow>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        &nbsp;Justificatif d'immatriculation,
        <br /> conventions collectives et annonces légales
      </ButtonLink>
    </div>
    <div className="separator" />
    <style jsx>{`
      .separator {
        height: 5px;
      }

      .cta {
        flex-direction: row;
        justify-content: flex-end;
        display: flex;
      }

      @media only screen and (min-width: 1px) and (max-width: 900px) {
        .wrapper {
          margin: 15px auto;
        }
        .cta {
          justify-content: center;
        }
        div.label {
          text-align: center;
        }
      }
    `}</style>
  </div>
);

const Title: React.FC<IProps> = ({
  siren,
  siret,
  name,
  isActive,
  isDiffusible = true,
  isSiege = false,
  ficheType = FICHE.UNITELEGALE,
}) => (
  <div className="header-section">
    <div className="title">
      <h1>
        <a href={`/entreprise/${siren}`}>{capitalize(name)}</a>
      </h1>
      <div>
        <span>fiche {ficheType}&nbsp;</span>
        {ficheType === FICHE.ETABLISSEMENT ? (
          <span>‣ {formatSiret(siret)}</span>
        ) : (
          <span>‣ {formatNumbersFr(siren)}</span>
        )}
        <span>
          {!isDiffusible && <Tag>non diffusible</Tag>}
          <IsActiveTag isActive={isActive} />
          {isSiege && <Tag>siège social</Tag>}
        </span>
      </div>
    </div>

    {ficheType !== FICHE.JUSTIFICATIFS && <CtaForTitle siren={siren} />}

    <style jsx>{`
      .header-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        margin-bottom: 20px;
      }

      .title {
        margin: 20px 0 10px;
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
