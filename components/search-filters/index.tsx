import axios from 'axios';
import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
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
  } = searchParams || {};

  const [labelDep, setLabelDep] = useState(cp_dep_label);

  const loadOptions = async (
    inputText: string
  ): Promise<[{ label: string; value: string }]> =>
    inputText
      ? axios.get(`/api/geo/${inputText}`).then((response) => response.data)
      : [];

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
        <AsyncSelect
          cacheOptions
          defaultOptions
          name="cp_dep"
          noOptionsMessage={() =>
            'Saisissez une ville ou un département pour rechercher son code.'
          }
          menuPosition="fixed"
          placeholder="ex: 35000"
          id="long-value-select"
          instanceId="long-value-select"
          defaultValue={{ value: cp_dep || '', label: cp_dep_label || '' }}
          onChange={(data) => {
            if (data?.label) {
              setLabelDep(data.label);
            }
          }}
          loadOptions={loadOptions}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 10 }),
            dropdownIndicator: (base) => ({
              ...base,
              color: 'black',
              '&:hover': {
                color: 'black',
              },
            }),
            control: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: '#eeeeee',
              border: 'none',
              borderRadius: '0.25rem 0.25rem 0 0',
              borderBottom: '2px solid black',
              '&:hover': {
                borderBottom: '2px solid black',
              },
            }),
          }}
        />
        <input
          style={{ display: 'none' }}
          name="cp_dep_label"
          onChange={() => undefined}
          value={labelDep}
        />
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
