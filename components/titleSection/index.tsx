import React from 'react';

import {
  capitalize,
  formatNumbersFr,
  formatSiret,
} from '../../utils/formatting';
import { Tag } from '../../components/tag';
import ButtonLink from '../button';

interface IProps {
  siren: string;
  siret: string;
  name: string;
  isOpen?: boolean;
  isEntreprise?: boolean; // true if entreprise, false if etablissement
  isNonDiffusible?: boolean;
  isSiege?: boolean;
}

const CtaForTitle: React.FC<{ siren: string }> = ({ siren }) => (
  <div className="wrapper">
    <div className="cta">
      <ButtonLink href={`/justificatif/${siren}`} nofollow>
        ⇢ Voir le justificatif d'immatriculation au RCS ou au RM
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
  isOpen,
  isEntreprise,
  isNonDiffusible = false,
  isSiege = false,
}) => (
  <div className="header-section">
    <div className="title">
      <h1>
        <a href={`/entreprise/${siren}`}>{capitalize(name)}</a>
      </h1>
      <div>
        <span>fiche {isEntreprise ? 'entité ' : 'etablissement '}</span>
        {!isEntreprise ? (
          <span>‣ {formatSiret(siret)}</span>
        ) : (
          <span>‣ {formatNumbersFr(siren)}</span>
        )}
        <span>
          {isNonDiffusible ? (
            <Tag>non diffusible</Tag>
          ) : (
            <>
              {isOpen ? (
                <Tag className="open">en activité</Tag>
              ) : (
                <Tag className="closed">fermé</Tag>
              )}
            </>
          )}
          {isSiege && <Tag>siège social</Tag>}
        </span>
      </div>
    </div>

    <CtaForTitle siren={siren} />

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

export const TitleImmatriculation: React.FC<{
  siren: string;
  name: string;
}> = ({ siren, name }) => (
  <div className="header-section">
    <div className="title">
      <h1>
        <a href={`/entreprise/${siren}`}>{capitalize(name)}</a>
      </h1>
      <div>
        <span>justificatif d’immatriculation </span>
        <span>‣ {formatNumbersFr(siren)}</span>
      </div>
    </div>

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
