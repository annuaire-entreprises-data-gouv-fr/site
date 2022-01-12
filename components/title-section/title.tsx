import React from 'react';

import { FICHE } from '.';
import { IUniteLegale } from '../../models';
import { formatIntFr } from '../../utils/helpers/formatting';
import AssociationAdressAlert from '../alerts/association-adress';
import MultipleSirenAlert from '../alerts/multiple-siren';
import IsActiveTag from '../is-active-tag';
import { Tag } from '../tag';

interface IProps {
  ficheType?: FICHE;
  uniteLegale: IUniteLegale;
}

const Title: React.FC<IProps> = ({ uniteLegale }) => (
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
          {!uniteLegale.estDiffusible ? (
            <>
              <Tag>Non-diffusible</Tag>
              <IsActiveTag isActive={null} isUniteLegale={true} />
            </>
          ) : (
            <IsActiveTag
              isActive={uniteLegale.estActive}
              isUniteLegale={true}
            />
          )}
        </span>
      </div>
    </div>

    <style jsx>{`
      .header-section {
        display: block;
      }

      .title {
        margin: 0;
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
