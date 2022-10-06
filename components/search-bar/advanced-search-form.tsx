import React from 'react';
import ButtonLink from '../../components-ui/button';
import {
  building,
  france,
  humanPin,
  searchLine,
} from '../../components-ui/icon';
import SelectDepartement from '../../components-ui/select/select-departement';
import SelectCodeSectionNaf from '../../components-ui/select/select-section-naf';
import { IParams } from '../../models/search-filter-params';
import FieldGroup from './advanced-search-group';

const AdvancedSearchFields: React.FC<{
  searchFilterParams?: IParams;
}> = ({ searchFilterParams }) => {
  const { cp, sap, dep, fn, n } = searchFilterParams || {};

  return (
    <>
      <div className="input-group">
        <b>Affiner vos résultats :</b>
        <FieldGroup
          icon={france}
          label="Zone géographique"
          defaultValue={!!cp || !!dep}
        >
          <input
            className="fr-input"
            id="search-code-postal"
            name="cp"
            pattern="((0[1-9])|([1-8][0-9])|(9[0-8])|(2A)|(2B))[0-9]{3}"
            autoComplete="off"
            placeholder="Code postal"
            defaultValue={cp}
          />
          <div className="select">
            <SelectDepartement
              name="dep"
              defaultValue={dep}
              placeholder="Choisir un département"
            />
          </div>
        </FieldGroup>
        <FieldGroup
          icon={building}
          label="Situation administrative"
          defaultValue={!!sap}
        >
          <div className="select">
            <SelectCodeSectionNaf
              name="sap"
              defaultValue={sap}
              placeholder="Choisir un domaine d’activité"
            />
          </div>
        </FieldGroup>
        <FieldGroup icon={humanPin} label="Dirigeant" defaultValue={false}>
          <div className="field-in-line">
            <input
              className="fr-input"
              name="fn"
              autoComplete="off"
              placeholder="Prénom"
              defaultValue={fn}
            />
            <input
              className="fr-input"
              name="n"
              autoComplete="off"
              placeholder="Nom"
              defaultValue={n}
            />
          </div>
        </FieldGroup>
        <div className="layout-left">
          <ButtonLink type="submit" small>
            {searchLine}&nbsp;Rechercher
          </ButtonLink>
        </div>
      </div>
      <br />
      <style jsx>{`
        .input-group {
          position: relative;
          top: 0;
          background: #fff;
          border: 1px solid #000091;
          border-top: none;
          padding: 10px;
          width: 100%;
        }

        div.select {
          margin-top: 5px;
          font-size: 0.9rem;
        }

        .fr-input {
          font-size: 0.9rem;
        }
        .field-in-line {
          display: flex;
          gap: 5px;
        }
        div.layout-left {
          margin-top: 15px;
        }

        @media only screen and (min-width: 1px) and (max-width: 991px) {
          div.select {
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default AdvancedSearchFields;
