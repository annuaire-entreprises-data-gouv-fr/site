import React from 'react';
import SelectCodeSectionNaf from '../../components-ui/select/select-section-naf';
import { extractFilters, IParams } from '../../models/search-filter-params';
import Filter from './advanced-filter';

const AdvancedSearchFilters: React.FC<{
  searchParams?: IParams;
  searchTerm?: string;
}> = ({ searchParams = {}, searchTerm = '' }) => {
  const { cp_dep, sap, fn, n, dmin, dmax } = searchParams || {};

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
        <label>Ville, code postal ou département :</label>
        <input
          className="fr-input"
          id="search-localisation"
          name="cp_dep"
          autoComplete="off"
          placeholder="ex: 35000"
          defaultValue={cp_dep}
        />
        <div id="search-localisation-responses" />
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
        </div>
      </Filter>
      <Filter
        label="Personne"
        activeFilter={dirigeantFilter}
        searchParams={searchParams}
        searchTerm={searchTerm}
        addSaveClearButton
      >
        <label>Rechercher les entreprises liées à une personne&nbsp;:</label>
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

export default AdvancedSearchFilters;
