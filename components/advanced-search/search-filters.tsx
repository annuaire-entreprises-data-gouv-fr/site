import React from 'react';
import { FilterMenu } from '#components-ui/filter-menu';
import { SimpleSeparator } from '#components-ui/horizontal-separator';
import { MultiSelect, Select } from '#components-ui/select';
import SearchFilterParams, { IParams } from '#models/search-filter-params';
import { categoriesEntreprisesOptions } from '#utils/helpers/formatting/categories-entreprise';
import { codesEffectifsOptions } from '#utils/helpers/formatting/codes-effectifs';
import { categoriesJuridiques } from '#utils/helpers/formatting/metadata/categories-juridiques';
import { codesNAFRev2 } from '#utils/helpers/formatting/metadata/codes-NAF-rev-2';
import { codesSectionNAF } from '#utils/helpers/formatting/metadata/codes-section-NAF';
import { FilterGeo } from './filter-geo';
import { FilterStructure } from './filter-structure';
import { FilterFinances } from './filter-finances';

const SearchFilters: React.FC<{
  searchParams?: IParams;
  searchTerm?: string;
}> = ({ searchParams = {}, searchTerm = '' }) => {
  const {
    cp_dep_label,
    cp_dep_type,
    cp_dep,
    dmax,
    dmin,
    etat,
    fn,
    label,
    n,
    naf,
    nature_juridique,
    tranche_effectif_salarie,
    categorie_entreprise,
    sap,
    type,
  } = searchParams || {};

  const filters = new SearchFilterParams(searchParams || {});

  const {
    localisationFilter,
    dirigeantFilter,
    administrativeFilter,
    structureFilter,
    financeFilter,
  } = filters.extractFilters();

  /**
   * For the search api `nature_juridique` must be a string
   * of 4 characters.
   */
  const getNaturesJuridiques = () =>
    Object.keys(categoriesJuridiques)
      .filter((k) => k.length === 4)
      .map((categorie) => ({
        value: categorie,
        label:
          categoriesJuridiques[categorie as keyof typeof categoriesJuridiques],
      }));

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
        <FilterStructure label={label} type={type} />
      </FilterMenu>
      <FilterMenu
        label="Finances"
        activeFilter={financeFilter}
        searchParams={searchParams}
        searchTerm={searchTerm}
        addSaveClearButton
      >
        <FilterFinances />
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
        <SimpleSeparator />
        <div>
          <label>Nature juridique :</label>
          <MultiSelect
            name="nature_juridique"
            defaultValue={nature_juridique}
            placeholder="Choisir une nature juridique"
            id="nature-juridique-multi-select"
            instanceId="nature-juridique-multi-select"
            options={getNaturesJuridiques()}
          />
        </div>
        <SimpleSeparator />
        <div>
          <label>Effectif salarié</label>
          <MultiSelect
            name="tranche_effectif_salarie"
            defaultValue={tranche_effectif_salarie}
            placeholder="Choisir une tranche d'effectif"
            id="effectif-salarie-multi-select"
            instanceId="effectif-salarie-multi-select"
            options={codesEffectifsOptions}
          />
        </div>
        <div>
          <label>Taille d’entreprise</label>
          <MultiSelect
            name="categorie_entreprise"
            defaultValue={categorie_entreprise}
            placeholder="Choisir une catégorie d'entreprise"
            id="categorie-entreprise-multi-select"
            instanceId="categorie-entreprise-multi-select"
            options={categoriesEntreprisesOptions}
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
        @media only screen and (min-width: 1px) and (max-width: 992px) {
          div.select {
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default SearchFilters;
