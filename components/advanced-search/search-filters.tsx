'use client';

import { FilterMenu } from '#components-ui/filter-menu';
import { SimpleSeparator } from '#components-ui/horizontal-separator';
import { Select } from '#components-ui/select';
import { MultiSelect } from '#components-ui/select/multi-select';
import SearchFilterParams, {
  IParams,
} from '#models/search/search-filter-params';
import { categoriesEntreprisesOptions } from '#utils/helpers/formatting/categories-entreprise';
import { codesEffectifsOptions } from '#utils/helpers/formatting/codes-effectifs';
import { categoriesJuridiques } from '#utils/helpers/formatting/metadata/categories-juridiques';
import { codesNAFRev2 } from '#utils/helpers/formatting/metadata/codes-NAF-rev-2';
import { codesSectionNAF } from '#utils/helpers/formatting/metadata/codes-section-NAF';
import React from 'react';
import { FilterFinances } from './filter-finances';
import { FilterGeo } from './filter-geo';
import { FilterStructure } from './filter-structure';

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
    ca_min,
    ca_max,
    res_min,
    res_max,
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
        label: categoriesJuridiques[categorie],
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
        <label htmlFor="geo-search-input">Ville, département ou région :</label>
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
        <fieldset>
          <legend>
            Rechercher toutes les structures liées à une personne (dirigeant(e),
            ou élu(e))&nbsp;:
          </legend>
          <div
            style={{
              display: 'flex',
              gap: '5px',
            }}
          >
            <div className="fr-input-group">
              <label htmlFor="firstname-input" className="fr-label fr-sr-only">
                Prénom
              </label>
              <input
                id="firstname-input"
                className="fr-input"
                name="fn"
                autoComplete="off"
                placeholder="Prénom"
                defaultValue={fn}
              />
            </div>
            <div className="fr-input-group">
              <label htmlFor="lastname-input" className="fr-label fr-sr-only">
                Nom
              </label>
              <input
                id="lastname-input"
                className="fr-input"
                name="n"
                autoComplete="off"
                placeholder="Nom"
                defaultValue={n}
              />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>Né(e) entre :</legend>
          <div
            style={{
              display: 'flex',
              gap: '5px',
            }}
          >
            <div className="fr-input-group">
              <label htmlFor="date-min-input" className="fr-label fr-sr-only">
                Date minimum
              </label>
              <input
                id="date-min-input"
                className="fr-input"
                type="date"
                name="dmin"
                defaultValue={dmin}
              />
            </div>
            &nbsp;et&nbsp;
            <div className="fr-input-group">
              <label htmlFor="date-max-input" className="fr-label fr-sr-only">
                Date maximum
              </label>
              <input
                id="date-max-input"
                className="fr-input"
                type="date"
                name="dmax"
                defaultValue={dmax}
              />
            </div>
          </div>
        </fieldset>
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
        label="Financier"
        activeFilter={financeFilter}
        searchParams={searchParams}
        searchTerm={searchTerm}
        addSaveClearButton
      >
        <FilterFinances
          ca_min={ca_min}
          ca_max={ca_max}
          res_min={res_min}
          res_max={res_max}
        />
      </FilterMenu>
      <FilterMenu
        label="Situation administrative"
        activeFilter={administrativeFilter}
        searchParams={searchParams}
        searchTerm={searchTerm}
        addSaveClearButton
      >
        <Select
          options={[
            { value: 'A', label: 'En activité' },
            { value: 'C', label: 'Cessée' },
          ]}
          name="etat"
          label="Etat administratif :"
          defaultValue={etat}
          placeholder="Choisir un état administratif"
        />
        <SimpleSeparator />
        <div className="select">
          <label htmlFor="sap-multi-select">Domaine d‘activité :</label>
          <MultiSelect
            name="sap"
            defaultValue={sap}
            placeholder="Choisir un domaine d'activité"
            id="sap-multi-select"
            instanceId="sap-multi-select"
            options={Object.keys(codesSectionNAF).map((k) => ({
              value: k,
              label: codesSectionNAF[k as keyof typeof codesSectionNAF],
            }))}
            menuPosition="fixed"
          />
          <label htmlFor="naf-multi-select">Code NAF/APE :</label>
          <MultiSelect
            name="naf"
            defaultValue={naf}
            placeholder="Choisir un code NAF/APE"
            id="naf-multi-select"
            instanceId="naf-multi-select"
            options={Object.keys(codesNAFRev2).map((code) => ({
              value: code,
              label: `${code} - ${codesNAFRev2[code]}`,
            }))}
            menuPosition="fixed"
          />
        </div>
        <SimpleSeparator />
        <div>
          <label htmlFor="nature-juridique-multi-select">
            Forme juridique :
          </label>
          <MultiSelect
            name="nature_juridique"
            defaultValue={nature_juridique}
            placeholder="Choisir une forme juridique"
            id="nature-juridique-multi-select"
            instanceId="nature-juridique-multi-select"
            options={getNaturesJuridiques()}
            menuPosition="fixed"
          />
        </div>
        <SimpleSeparator />
        <div>
          <label htmlFor="effectif-salarie-multi-select">
            Effectif salarié
          </label>
          <MultiSelect
            name="tranche_effectif_salarie"
            defaultValue={tranche_effectif_salarie}
            placeholder="Choisir une tranche d'effectif"
            id="effectif-salarie-multi-select"
            instanceId="effectif-salarie-multi-select"
            options={codesEffectifsOptions}
            menuPosition="fixed"
          />
        </div>
        <div>
          <label htmlFor="categorie-entreprise-multi-select">
            Taille d’entreprise
          </label>
          <MultiSelect
            name="categorie_entreprise"
            defaultValue={categorie_entreprise}
            placeholder="Choisir une catégorie d'entreprise"
            id="categorie-entreprise-multi-select"
            instanceId="categorie-entreprise-multi-select"
            options={categoriesEntreprisesOptions}
            menuPosition="fixed"
          />
        </div>
      </FilterMenu>
      <style jsx>{`
        fieldset {
          border: none;
          padding: 0;
          margin: 0;
        }
        legend {
          padding: 0;
          margin: 0;
          font-weight: 500;
          display: block;
          width: 100%;
        }
      `}</style>
    </>
  );
};

export default SearchFilters;
