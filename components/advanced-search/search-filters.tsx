"use client";

import type React from "react";
import { FilterMenu } from "#components-ui/filter-menu";
import { SimpleSeparator } from "#components-ui/horizontal-separator";
import { Select } from "#components-ui/select";
import { MultiSelect } from "#components-ui/select/multi-select";
import SearchFilterParams, {
  type IParams,
} from "#models/search/search-filter-params";
import { categoriesEntreprisesOptions } from "#utils/helpers/formatting/categories-entreprise";
import { codesEffectifsOptions } from "#utils/helpers/formatting/codes-effectifs";
import { categoriesJuridiquesNiveau3 } from "#utils/helpers/formatting/metadata/categories-juridiques";
import { codesNAFRev2 } from "#utils/helpers/formatting/metadata/codes-NAF-rev-2";
import { codesSectionNAF } from "#utils/helpers/formatting/metadata/codes-section-NAF";
import { FilterFinances } from "./filter-finances";
import { FilterGeo } from "./filter-geo";
import { FilterStructure } from "./filter-structure";

const SearchFilters: React.FC<{
  searchParams?: IParams;
  searchTerm?: string;
}> = ({ searchParams = {}, searchTerm = "" }) => {
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
    Object.keys(categoriesJuridiquesNiveau3)
      .filter((k) => k.length === 4)
      .map((categorie) => ({
        value: categorie,
        label: categoriesJuridiquesNiveau3[categorie],
      }));

  return (
    <>
      <FilterMenu
        activeFilter={localisationFilter}
        addSaveClearButton
        label="Zone géographique"
        searchParams={searchParams}
        searchTerm={searchTerm}
      >
        <label htmlFor="geo-search-input">Ville, département ou région :</label>
        <FilterGeo
          cp_dep={cp_dep}
          cp_dep_label={cp_dep_label}
          cp_dep_type={cp_dep_type}
        />
      </FilterMenu>
      <FilterMenu
        activeFilter={dirigeantFilter}
        addSaveClearButton
        label="Dirigeant"
        searchParams={searchParams}
        searchTerm={searchTerm}
      >
        <fieldset>
          <legend>
            Rechercher toutes les structures liées à une personne (dirigeant(e),
            ou élu(e))&nbsp;:
          </legend>
          <div
            style={{
              display: "flex",
              gap: "5px",
            }}
          >
            <div className="fr-input-group">
              <label className="fr-label fr-sr-only" htmlFor="firstname-input">
                Prénom
              </label>
              <input
                autoComplete="off"
                className="fr-input"
                defaultValue={fn}
                id="firstname-input"
                name="fn"
                placeholder="Prénom"
              />
            </div>
            <div className="fr-input-group">
              <label className="fr-label fr-sr-only" htmlFor="lastname-input">
                Nom
              </label>
              <input
                autoComplete="off"
                className="fr-input"
                defaultValue={n}
                id="lastname-input"
                name="n"
                placeholder="Nom"
              />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>Né(e) entre :</legend>
          <div
            style={{
              display: "flex",
              gap: "5px",
            }}
          >
            <div className="fr-input-group">
              <label className="fr-label fr-sr-only" htmlFor="date-min-input">
                Date minimum
              </label>
              <input
                className="fr-input"
                defaultValue={dmin}
                id="date-min-input"
                name="dmin"
                type="date"
              />
            </div>
            &nbsp;et&nbsp;
            <div className="fr-input-group">
              <label className="fr-label fr-sr-only" htmlFor="date-max-input">
                Date maximum
              </label>
              <input
                className="fr-input"
                defaultValue={dmax}
                id="date-max-input"
                name="dmax"
                type="date"
              />
            </div>
          </div>
        </fieldset>
      </FilterMenu>
      <FilterMenu
        activeFilter={structureFilter}
        addSaveClearButton
        label="Structure"
        searchParams={searchParams}
        searchTerm={searchTerm}
      >
        <FilterStructure label={label} type={type} />
      </FilterMenu>
      <FilterMenu
        activeFilter={financeFilter}
        addSaveClearButton
        label="Financier"
        searchParams={searchParams}
        searchTerm={searchTerm}
      >
        <FilterFinances
          ca_max={ca_max}
          ca_min={ca_min}
          res_max={res_max}
          res_min={res_min}
        />
      </FilterMenu>
      <FilterMenu
        activeFilter={administrativeFilter}
        addSaveClearButton
        label="Situation administrative"
        searchParams={searchParams}
        searchTerm={searchTerm}
      >
        <Select
          defaultValue={etat}
          label="Etat administratif :"
          name="etat"
          options={[
            { value: "A", label: "En activité" },
            { value: "C", label: "Cessée" },
          ]}
          placeholder="Choisir un état administratif"
        />
        <SimpleSeparator />
        <div className="select">
          <label htmlFor="sap-multi-select">Domaine d‘activité :</label>
          <MultiSelect
            defaultValue={sap}
            id="sap-multi-select"
            instanceId="sap-multi-select"
            menuPosition="fixed"
            name="sap"
            options={Object.keys(codesSectionNAF).map((k) => ({
              value: k,
              label: codesSectionNAF[k as keyof typeof codesSectionNAF],
            }))}
            placeholder="Choisir un domaine d'activité"
          />
          <label htmlFor="naf-multi-select">Code NAF/APE :</label>
          <MultiSelect
            defaultValue={naf}
            id="naf-multi-select"
            instanceId="naf-multi-select"
            menuPosition="fixed"
            name="naf"
            options={Object.keys(codesNAFRev2).map((code) => ({
              value: code,
              label: `${code} - ${codesNAFRev2[code]}`,
            }))}
            placeholder="Choisir un code NAF/APE"
          />
        </div>
        <SimpleSeparator />
        <div>
          <label htmlFor="nature-juridique-multi-select">
            Forme juridique :
          </label>
          <MultiSelect
            defaultValue={nature_juridique}
            id="nature-juridique-multi-select"
            instanceId="nature-juridique-multi-select"
            menuPosition="fixed"
            name="nature_juridique"
            options={getNaturesJuridiques()}
            placeholder="Choisir une forme juridique"
          />
        </div>
        <SimpleSeparator />
        <div>
          <label htmlFor="effectif-salarie-multi-select">
            Effectif salarié
          </label>
          <MultiSelect
            defaultValue={tranche_effectif_salarie}
            id="effectif-salarie-multi-select"
            instanceId="effectif-salarie-multi-select"
            menuPosition="fixed"
            name="tranche_effectif_salarie"
            options={codesEffectifsOptions}
            placeholder="Choisir une tranche d'effectif"
          />
        </div>
        <div>
          <label htmlFor="categorie-entreprise-multi-select">
            Taille d’entreprise
          </label>
          <MultiSelect
            defaultValue={categorie_entreprise}
            id="categorie-entreprise-multi-select"
            instanceId="categorie-entreprise-multi-select"
            menuPosition="fixed"
            name="categorie_entreprise"
            options={categoriesEntreprisesOptions}
            placeholder="Choisir une catégorie d'entreprise"
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
