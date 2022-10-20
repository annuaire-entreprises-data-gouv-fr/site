import React from 'react';
import ButtonLink from '../../components-ui/button';
import SelectCodeSectionNaf from '../../components-ui/select/select-section-naf';
import { extractFilters, IParams } from '../../models/search-filter-params';
import FieldGroup from './advanced-search-group';

const AdvancedSearchFields: React.FC<{
  searchParams: IParams;
  searchTerm: string;
}> = ({ searchParams, searchTerm }) => {
  const { cp, sap, fn, n, dmin, dmax } = searchParams || {};

  console.log(searchParams);
  const { localisationFilter, dirigeantFilter, administrativeFilter } =
    extractFilters(searchParams || {});

  return (
    <>
      <FieldGroup
        label="Zone géographique"
        activeFilter={localisationFilter}
        searchParams={searchParams}
        searchTerm={searchTerm}
      >
        <label>Localisation :</label>
        <input
          className="fr-input refresh-on-change"
          id="search-code-postal"
          name="cp"
          autoComplete="off"
          placeholder="Saisissez une ville ou un département"
          defaultValue={cp}
        />
      </FieldGroup>
      <FieldGroup
        label="Situation administrative"
        activeFilter={administrativeFilter}
        searchParams={searchParams}
        searchTerm={searchTerm}
      >
        <label>Domaine d’activité :</label>
        <div className="select">
          <SelectCodeSectionNaf
            name="sap"
            className="refresh-on-change"
            defaultValue={sap}
            placeholder="Choisir un domaine d’activité"
          />
        </div>
      </FieldGroup>
      <FieldGroup
        label="Dirigeant"
        activeFilter={dirigeantFilter}
        searchParams={searchParams}
        searchTerm={searchTerm}
      >
        <label>Prénom et nom :</label>
        <div className="field-in-line">
          <input
            className="fr-input refresh-on-change"
            name="fn"
            autoComplete="off"
            placeholder="Prénom"
            defaultValue={fn}
          />
          <input
            className="fr-input refresh-on-change"
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
            className="fr-input refresh-on-change"
            type="date"
            id="start"
            name="dmin"
            defaultValue={dmin}
          />
          &nbsp;et&nbsp;
          <input
            className="fr-input refresh-on-change"
            type="date"
            id="end"
            name="dmax"
            defaultValue={dmax}
          />
        </div>
        <br />
        <div className="layout-right">
          <ButtonLink type="submit" alt small>
            Appliquer les filtres
          </ButtonLink>
        </div>
      </FieldGroup>

      <style jsx>{`
        .field-in-line {
          display: flex;
          gap: 5px;
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
