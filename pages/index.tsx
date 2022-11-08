import React from 'react';
import Logo from '../components-ui/logo';
import HiddenH1 from '../components/a11y-components/hidden-h1';
import HomePageSearchFilters from '../components/search-bar/home-page-search-filters';
import SearchBar from '../components/search-bar/search-bar';
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
        <div className="search-bar-wrapper">
          <SearchBar
            placeholder="Nom, adresse, n° SIRET/SIREN..."
            defaultValue=""
            autoFocus={true}
          />
        </div>
        <br />
        <HomePageSearchFilters />
      </form>
    </div>
    <style jsx>{`
      h2 {
        text-align: center;
        margin-top: 30px;
      }

      .centered-search {
        margin-bottom: 32vh;
        margin-top: 10vh;
        max-width: 900px;
      }

      .search-bar-wrapper {
        margin: auto;
        margin-top: 30px;
        flex-direction: column;
        width: 100%;
        max-width: 450px;
      }
    `}</style>
  </Page>
);

export default Index;
