import React from 'react';
import { FilterMenu } from '#components-ui/filter-menu';
import { SimpleSeparator } from '#components-ui/horizontal-separator';
import { MultiSelect, Select } from '#components-ui/select';
import { extractFilters, IParams } from '#models/search-filter-params';
import { codesNAFRev2 } from '#utils/labels/codes-NAF-rev-2';
import { codesSectionNAF } from '#utils/labels/codes-section-NAF';
import { FilterGeo } from './filter-geo';

const SearchFilters: React.FC<{
  searchParams?: IParams;
  searchTerm?: string;
}> = ({ searchParams = {}, searchTerm = '' }) => {
  const {
    etat,
    type,
    label,
    cp_dep,
    cp_dep_label,
    sap,
    naf,
    fn,
    n,
    dmin,
    dmax,
    cp_dep_type,
  } = searchParams || {};

  const {
    localisationFilter,
    dirigeantFilter,
    administrativeFilter,
    structureFilter,
  } = extractFilters(searchParams || {});

  return (
    <>
      <FilterMenu
        label="Zone géographique"
        activeFilter={localisationFilter}
        searchParams={searchParams}
        searchTerm={searchTerm}
        addSaveClearButton
      >
        <label>Ville ou département :</label>
        <FilterGeo
          cp_dep={cp_dep}
          cp_dep_label={cp_dep_label}
          cp_dep_type={cp_dep_type}
        />
      </FilterMenu>
      <FilterMenu
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
      </FilterMenu>
      <FilterMenu
        label="Structure"
        activeFilter={structureFilter}
        searchParams={searchParams}
        searchTerm={searchTerm}
        addSaveClearButton
      >
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
        <span>Labels et certificats :</span>
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
      </FilterMenu>
      <FilterMenu
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
        <div className="select">
          <label>Domaine d’activité :</label>
          <MultiSelect
            name="sap"
            defaultValue={sap}
            placeholder="Choisir un domaine d’activité"
            id="sap-multi-select"
            instanceId="sap-multi-select"
            options={Object.keys(codesSectionNAF).map((k) => ({
              value: k,
              label: codesSectionNAF[k as keyof typeof codesSectionNAF],
            }))}
          />
          <label>Code NAF/APE :</label>
          <MultiSelect
            name="naf"
            defaultValue={naf}
            placeholder="Choisir un code NAF/APE"
            id="naf-multi-select"
            instanceId="naf-multi-select"
            options={Object.keys(codesNAFRev2).map((code) => ({
              value: code,
              label: `${code} - ${
                codesNAFRev2[code as keyof typeof codesNAFRev2]
              }`,
            }))}
          />
        </div>
      </FilterMenu>
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
