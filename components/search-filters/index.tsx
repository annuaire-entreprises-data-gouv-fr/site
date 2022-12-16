import React from 'react';
import { Checkbox } from '#components-ui/checkbox';
import { SimpleSeparator } from '#components-ui/horizontal-separator';
import Select from '#components-ui/select';
import SelectCodeNaf from '#components-ui/select/select-code-naf';
import SelectCodeSectionNaf from '#components-ui/select/select-section-naf';
import { extractFilters, IParams } from '#models/search-filter-params';
import Filter from './filter';

const SearchFilters: React.FC<{
  searchParams?: IParams;
  searchTerm?: string;
}> = ({ searchParams = {}, searchTerm = '' }) => {
  const { etat, type, label, cp_dep, sap, naf, fn, n, dmin, dmax } =
    searchParams || {};

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
          Rechercher toutes les structures liées à une personne (dirigeant(e),
          ou élu(e))&nbsp;:
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
        <label>Etat administratif :</label>
        <Select
          options={[
            { value: 'A', label: 'En activité' },
            { value: 'C', label: 'Cessée' },
          ]}
          name="etat"
          defaultValue={etat}
          placeholder="Choisir un état administratif"
        />
        <SimpleSeparator />
        <span>Type de structure :</span>
        <Select
          options={[
            {
              value: 'ei',
              label: 'Entreprise individuelle',
            },
            { value: 'ct', label: 'Collectivité territoriale' },
            { value: 'asso', label: 'Association' },
          ]}
          name="type"
          defaultValue={type}
          placeholder="Choisir un type de structure"
        />
        <span>Labels & certificats :</span>
        <Select
          options={[
            { value: 'rge', label: 'RGE - Reconnu Garant de l’Environnement' },
            { value: 'ess', label: 'ESS - Economie Sociale et Solidaire' },
            { value: 'esv', label: 'Entreprise du Spectacle Vivant' },
          ]}
          name="label"
          defaultValue={label}
          placeholder="Choisir un label ou un certificat"
        />
        <SimpleSeparator />
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
