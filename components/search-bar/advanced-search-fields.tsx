import React from 'react';
import ButtonLink from '../../components-ui/button';
import { searchLine } from '../../components-ui/icon';
import SelectDepartement from '../../components-ui/select/select-departement';
import SelectCodeSectionNaf from '../../components-ui/select/select-section-naf';
import { IParams } from '../../models/search-filter-params';

const AdvancedSearchFields: React.FC<{
  searchFilterParams?: IParams;
}> = ({ searchFilterParams }) => {
  const { code_postal, section_activite_principale, departement } =
    searchFilterParams || {};

  return (
    <>
      <div className="input-group">
        <div>
          <label className="fr-label" htmlFor="search-code-postal">
            Filtrer par code postal
          </label>
          <input
            className="fr-input"
            id="search-code-postal"
            name="code_postal"
            pattern="((0[1-9])|([1-8][0-9])|(9[0-8])|(2A)|(2B))[0-9]{3}"
            autoComplete="off"
            placeholder="Code postal"
            defaultValue={code_postal}
          />
        </div>
        <div className="select">
          <SelectDepartement
            name="departement"
            label={`Filtrer par département`}
            defaultValue={departement}
          />
        </div>
        <div className="select">
          <SelectCodeSectionNaf
            name="section_activite_principale"
            label={`Filtrer par domaine d’activité`}
            defaultValue={section_activite_principale}
          />
        </div>
        <ButtonLink type="submit">
          {searchLine}
          <span>&nbsp;Rechercher</span>
        </ButtonLink>
      </div>
      <br />
      <style jsx>{`
        .input-group {
          display: flex;
          flex-wrap: wrap;
          align-items: end;
          gap: 20px;
        }
        .input-group > div {
          flex-grow: 1;
          min-width: 250px;
        }

        div.select {
          flex-grow: 0;
          max-width: 400px;
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
