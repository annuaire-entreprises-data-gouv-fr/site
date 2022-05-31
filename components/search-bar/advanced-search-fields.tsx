import React from 'react';
import ButtonLink from '../../components-ui/button';
import SelectCodeSectionNaf from '../../components-ui/select/select-section-naf';
import { ISearchParams } from '../../models/search';

const AdvancedSearchFields: React.FC<{
  searchParams: ISearchParams | null;
}> = ({ searchParams = null }) => (
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
          defaultValue={searchParams?.code_postal}
        />
      </div>
      <div className="select">
        <SelectCodeSectionNaf
          name="section_activite_principale"
          label={`Filtrer par domaine d’activité`}
          defaultValue={searchParams?.section_activite_principale}
        />
      </div>
    </div>
    <br />
    <div className="layout-center">
      <ButtonLink type="submit">
        <span>Rechercher</span>
      </ButtonLink>
    </div>
    <br />
    <style jsx>{`
      .input-group {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
      }
      .input-group > div {
        flex-grow: 1;
        min-width: 250px;
      }

      div.select {
        flex-grow: 0;
        max-width: 600px;
      }
    `}</style>
  </>
);

export default AdvancedSearchFields;
