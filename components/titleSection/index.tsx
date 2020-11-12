import React from 'react';

import { formatNumbersFr, formatSiret } from '../../utils/formatting';
import { Tag } from '../../components/tag';
import { download } from '../../static/icon';
import ButtonLink from '../button';

interface IProps {
  siren: string;
  siret: string;
  name: string;
  isSiege?: boolean;
  isEntreprise?: boolean; // true if entreprise, false if etablissement
  isNonDiffusible?: boolean;
}

const CtaForTitle: React.FC<{ siren: string }> = ({  siren  }) => (
  <div className="wrapper">
    <div className="label">
        ⇣ <i>Justificatif d'immatriculation au RCS ou au RM</i> ⇣
    </div>
    <div className="cta">
      {/* <ButtonLink
        target="_blank"
        href={`/api/immatriculation?siren=${siren}&format=pdf`}
      >
        {download}
        <span className="separator" />
        Télécharger le justificatif
      </ButtonLink> */}
      <span className="separator" />
      <ButtonLink
        target="_blank"
        href={`/api/immatriculation?siren=${siren}`}
        alt
      >
        Voir le justificatif
      </ButtonLink>
    </div>
    <style jsx>{`
      div.label {
        font-size: 0.9rem;
        color: #444;
        text-align: right;
      }

      .cta {
        flex-direction: row;
        justify-content: flex-end;
        display: flex;
      }
      .cta .separator {
        width: 5px;
        flex-shrink: 0;
      }

      @media only screen and (min-width: 1px) and (max-width: 900px) {
        .wrapper {
          margin:  15px auto;
        }
        div.label  {
          text-align:  center;
        }
      }
    `}</style>
  </div>
);

const Title: React.FC<IProps> = ({
  siren,
  siret,
  name,
  isSiege,
  isEntreprise,
  isNonDiffusible = false,
}) => (
  <div className="header-section">
    <div className="title">
      <h1>
        <a href={`/entreprise/${siren}`}>{name}</a>
      </h1>
      <div>
        <span>fiche {isEntreprise ? 'entreprise ' : 'etablissement '}</span>
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
              {isSiege ? (
                <Tag className="open">en activité</Tag>
              ) : (
                <Tag className="closed">fermé</Tag>
              )}
            </>
          )}
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
        margin-bottom:    20px;
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
        line-height: 2rem;
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
