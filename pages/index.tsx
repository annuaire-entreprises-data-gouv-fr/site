import React from 'react';
import Logo from '../components-ui/logo';
import HiddenH1 from '../components/a11y-components/hidden-h1';
import AdvancedSearchFilters from '../components/search-bar/advanced-search-filters';
import SearchField from '../components/search-bar/search-field';
import StructuredDataSearchAction from '../components/structured-data/search';
import Page from '../layouts';

const Index: React.FC = () => (
  <Page title="L’Annuaire des Entreprises">
    <StructuredDataSearchAction />
    <div className="layout-center">
      <form
        className="centered-search"
        id="search-bar-form"
        action={'/rechercher'}
        method="get"
      >
        <Logo />
        <HiddenH1 title="L’Annuaire des Entreprises" />
        <h2>
          Retrouvez toutes les informations publiques sur une personne morale
          (entreprise, association ou administration)
        </h2>
        <div className="search-bar">
          <SearchField
            placeholder="Nom, adresse, n° SIRET/SIREN..."
            defaultValue=""
            autoFocus={true}
          />
        </div>
        <br />
        <div className="layout-center search-filters-container">
          <input type="checkbox" id="show-advanced-search-filter" />
          <label className="more" htmlFor="show-advanced-search-filter">
            Afficher les filtres de recherche
          </label>
          <div className="advanced-filter-container">
            <AdvancedSearchFilters />
          </div>
          <label className="less" htmlFor="show-advanced-search-filter">
            Cacher les filtres de recherche
          </label>
        </div>
      </form>
    </div>
    <style jsx>{`
      h2 {
        text-align: center;
        margin-top: 30px;
      }

      .layout-center {
        flex-direction: column;
      }

      .centered-search {
        margin-bottom: 32vh;
        margin-top: 10vh;
        max-width: 900px;
      }

      .search-bar {
        margin: auto;
        margin-top: 30px;
        flex-direction: column;
        width: 100%;
        max-width: 450px;
      }

      div.advanced-filter-container {
        display: none;
        flex-wrap: wrap;
      }

      label {
        text-decoration: underline;
        cursor: pointer;
      }
      label.less {
        display: none;
      }
      input[type='checkbox'] {
        display: none;
      }
      input[type='checkbox']:checked ~ div.advanced-filter-container {
        display: flex;
      }

      input[type='checkbox']:checked ~ label.more {
        display: none;
      }
      input[type='checkbox']:checked ~ label.less {
        display: block;
      }

      @media only screen and (min-width: 1px) and (max-width: 991px) {
        .search-bar {
          max-width: 100%;
        }
      }
    `}</style>
  </Page>
);

export default Index;
