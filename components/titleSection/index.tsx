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
        <span>fiche {isEntreprise ? 'entreprise' : 'etablissement'}</span>
        {!isEntreprise ? (
          <span> ‣ {formatSiret(siret)}</span>
        ) : (
          <span> ‣ {formatNumbersFr(siren)}</span>
        )}
        <span>
          {isNonDiffusible ? (
            <Tag>non diffusable</Tag>
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

    <div className="cta">
      <ButtonLink
        target="_blank"
        href={`/api/immatriculation?siren=${siren}?format=pdf`}
      >
        {download}
        <span style={{ width: '5px' }} />
        Justificatif d'immatriculation
      </ButtonLink>
      <span style={{ width: '5px' }} />
      <ButtonLink
        target="_blank"
        href={`/api/immatriculation?siren=${siren}`}
        alt
      >
        Fiche d'immatriculation
      </ButtonLink>
    </div>

    <style jsx>{`
      .header-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
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

      .cta {
        flex-direction: row;
        display: flex;
      }

      @media only screen and (min-width: 1px) and (max-width: 900px) {
        .header-section {
          justify-content: start;
          align-items: flex-start;
          flex-direction: column;
        }
        .cta {
          width: 100%;
          margin: 5px auto 20px;
        }
      }
    `}</style>
  </div>
);

export default Title;
