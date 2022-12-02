import React from 'react';
import SelectCodeNaf from '../../components-ui/select/select-code-naf';
import SelectCodeSectionNaf from '../../components-ui/select/select-section-naf';
import { extractFilters, IParams } from '../../models/search-filter-params';
import Filter from './filter';

const SearchFilters: React.FC<{
  searchParams?: IParams;
  searchTerm?: string;
}> = ({ searchParams = {}, searchTerm = '' }) => {
  const { cp_dep, sap, naf, fn, n, dmin, dmax } = searchParams || {};

  const { localisationFilter, dirigeantFilter, administrativeFilter } =
    extractFilters(searchParams || {});

  return (
    <>
      <Filter
        label="Zone géographique"
        activeFilter={localisationFilter}
        searchParams={searchParams}
        searchTerm={searchTerm}
        addSaveClearButton
      >
        <label>Code postal ou numéro de département :</label>
        <input
          className="fr-input"
          id="search-localisation-input"
          autoComplete="off"
          placeholder="ex: 35000"
          name="cp_dep"
          defaultValue={cp_dep}
        />
        <div id="search-localisation-responses">
          <i>Saisissez une ville ou un département pour rechercher son code.</i>
        </div>
      </Filter>
      <Filter
        label="Dirigeant"
        activeFilter={dirigeantFilter}
        searchParams={searchParams}
        searchTerm={searchTerm}
        addSaveClearButton
      >
        <label>
          Rechercher les structures associées à un(e) dirigeant(e) ou un(e)
          élu(e)&nbsp;:
        </label>
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
        <br />
        <label>Né(e) entre :</label>
        <div className="field-in-line">
          <input
            className="fr-input"
            type="date"
            id="start"
            name="dmin"
            defaultValue={dmin}
          />
          &nbsp;et&nbsp;
          <input
            className="fr-input"
            type="date"
            id="end"
            name="dmax"
            defaultValue={dmax}
          />
        </div>
      </Filter>
      <Filter
        label="Situation administrative"
        activeFilter={administrativeFilter}
        searchParams={searchParams}
        searchTerm={searchTerm}
        addSaveClearButton
      >
        <div className="select">
          <label>Domaine d’activité :</label>
          <SelectCodeSectionNaf
            name="sap"
            defaultValue={sap}
            placeholder="Choisir un domaine d’activité"
          />
          <label>Code NAF/APE :</label>
          <SelectCodeNaf
            name="naf"
            defaultValue={naf}
            placeholder="Choisir un code NAF/APE"
          />
        </div>
      </Filter>

      <style jsx>{`
        .field-in-line {
          display: flex;
          gap: 5px;
        }

        #search-localisation-responses {
          max-height: 270px;
          overflow: auto;
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

export default SearchFilters;
