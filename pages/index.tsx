import React from 'react';
import Logo from '../components-ui/logo';
import HiddenH1 from '../components/a11y-components/hidden-h1';
import SearchBar from '../components/search-bar';
import StructuredDataSearchAction from '../components/structured-data/search';
import Page from '../layouts';

const Index: React.FC = () => (
  <Page title="L’Annuaire des Entreprises">
    <StructuredDataSearchAction />
    <div className="layout-center">
      <div className="centered-search">
        <Logo />
        <HiddenH1 title="L’Annuaire des Entreprises" />
        <h2>
          Retrouvez toutes les informations publiques sur une personne morale
          (entreprise, association ou administration)
        </h2>
        <div className="layout-center search">
          <SearchBar autoFocus={true} />
        </div>
      </div>
    </div>
    <style jsx>{`
      h2 {
        text-align: center;
        margin-top: 30px;
      }

      .search {
        margin-top: 30px;
      }

      .centered-search {
        margin-bottom: 32vh;
        margin-top: 10vh;
        max-width: 900px;
      }
    `}</style>
  </Page>
);

export default Index;
